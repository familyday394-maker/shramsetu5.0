import { WorkRecord, AnomalyAlert, MinimumWageBenchmark } from '../types';
import { calculateRecordBreakdown, INDORE_SKILLED_CONSTRUCTION_BENCHMARK } from './wageCalculator';

/**
 * Configuration options for explainable anomaly detection policies.
 * These thresholds are detection policies, NOT statutory legal mandates.
 */
export interface AnomalyDetectionConfig {
  maxContinuousShiftHoursPolicy: number; // Configurable policy, default 12h
  overdueSettlementDaysPolicy: number; // Configurable policy, default 7 days
  referenceDate: Date; // Evaluation reference date, default Oct 16 2026
}

export const DEFAULT_ANOMALY_CONFIG: AnomalyDetectionConfig = {
  maxContinuousShiftHoursPolicy: 12,
  overdueSettlementDaysPolicy: 7,
  referenceDate: new Date('2026-10-16'),
};

/**
 * Deterministic, rule-based anomaly detector for Shram Setu 2.0.
 * 
 * Core Design Principles:
 * 1. 0% Artificial Intelligence / 100% Deterministic rule comparisons.
 * 2. Distinguishes multi-day aggregate hours (e.g. 4 days × 8h = 32h) from individual continuous shifts.
 * 3. Clearly labels configurable thresholds as inspection policies, NOT statutory laws.
 * 4. Treats unverified statutory wage benchmarks as informational comparisons only.
 * 5. Uses neutral, non-accusatory language suitable for both workers and contractors.
 */
export function detectLedgerAnomalies(
  records: WorkRecord[],
  config: Partial<AnomalyDetectionConfig> = {}
): AnomalyAlert[] {
  const activeConfig: AnomalyDetectionConfig = {
    ...DEFAULT_ANOMALY_CONFIG,
    ...config,
  };

  const alerts: AnomalyAlert[] = [];
  const currentDate = activeConfig.referenceDate;

  // 1. RULE-01: Duplicate Work Entry Check (Same worker on same calendar date)
  const dateMap = new Map<string, WorkRecord[]>();
  records.forEach(r => {
    const list = dateMap.get(r.date) || [];
    list.push(r);
    dateMap.set(r.date, list);
  });

  dateMap.forEach((sameDayRecords, dateStr) => {
    if (sameDayRecords.length > 1) {
      alerts.push({
        id: `ANOM-DUP-${dateStr}`,
        ruleId: 'RULE-01',
        ruleName: 'Duplicate Calendar Date Work Entries',
        recordId: sameDayRecords[0].id,
        severity: 'warning',
        triggerReason: `Multiple shift records (${sameDayRecords.length}) are logged on the same calendar date (${dateStr}) for this worker.`,
        neutralNotice:
          'Potential duplicate entry or split shift logged on the same date. Review whether morning and evening shifts were separately scheduled by agreement.',
        valuesExamined: [
          { label: 'Date Examined', value: dateStr },
          { label: 'Shift Records Found', value: sameDayRecords.length },
          { label: 'Record References', value: sameDayRecords.map(r => r.id).join(', ') },
          { label: 'Detection Policy', value: 'RULE-01 (Single-day muster deduplication)' },
        ],
      });
    }
  });

  // Check individual record rules
  records.forEach(rec => {
    const calc = calculateRecordBreakdown(rec);
    const daysWorked = Math.max(1, rec.daysWorked || 1);
    const totalShiftHours = rec.shiftHours || 8;
    const totalOvertimeHours = rec.overtimeHours || 0;

    // Distinguish multi-day records from single-day continuous shifts
    const averageDailyShiftHours = totalShiftHours / daysWorked;
    const averageDailyOvertimeHours = totalOvertimeHours / daysWorked;
    const effectiveDailyWorkDuration = averageDailyShiftHours + averageDailyOvertimeHours;

    // 2. RULE-02: Overlong Continuous Individual Shift Duration
    // Evaluates the individual daily shift duration rather than erroneously summing multi-day totals
    if (effectiveDailyWorkDuration > activeConfig.maxContinuousShiftHoursPolicy) {
      const hasDetailedTimes = Boolean(rec.shiftStartTime && rec.shiftEndTime);
      alerts.push({
        id: `ANOM-HRS-${rec.id}`,
        ruleId: 'RULE-02',
        ruleName: 'Excessive Continuous Shift Duration Policy',
        recordId: rec.id,
        severity: 'warning',
        triggerReason: `Single-day work duration (${effectiveDailyWorkDuration.toFixed(1)} hrs/day) exceeds the configurable inspection policy threshold of ${activeConfig.maxContinuousShiftHoursPolicy} hours.`,
        neutralNotice: hasDetailedTimes
          ? 'Potential discrepancy detected. Verify whether documented rest intervals or meal breaks were included during this extended shift.'
          : 'Warning: Shift start/end times and break intervals are unavailable in this record; daily duration was estimated from total recorded hours divided by days worked.',
        valuesExamined: [
          { label: 'Configured Policy Threshold', value: `${activeConfig.maxContinuousShiftHoursPolicy} hrs/day (Configurable policy)` },
          { label: 'Days Covered', value: `${daysWorked} day(s)` },
          { label: 'Total Recorded Hours', value: `${totalShiftHours}h regular + ${totalOvertimeHours}h overtime` },
          { label: 'Effective Daily Duration', value: `${effectiveDailyWorkDuration.toFixed(1)} hrs/day` },
          { label: 'Time Interval Data', value: hasDetailedTimes ? `${rec.shiftStartTime} - ${rec.shiftEndTime}` : 'Not recorded (Estimated)' },
        ],
      });
    }

    // 3. RULE-03: Unexplained Wage Change or Retroactive Rate Modification
    if (rec.status === 'modified' || rec.isTampered) {
      alerts.push({
        id: `ANOM-MOD-${rec.id}`,
        ruleId: 'RULE-03',
        ruleName: 'Retroactive Record Modification Flag',
        recordId: rec.id,
        severity: 'warning',
        triggerReason: rec.isTampered
          ? 'Cryptographic checksum mismatch: stored block hash contradicts the modified wage rate in the ledger.'
          : 'Record modified retroactively after initial registration.',
        neutralNotice:
          'Notice: Prior value preserved in audit trail. Review stated justification, contractor notes, and worker acknowledgment state.',
        valuesExamined: [
          { label: 'Original Rate', value: `₹${rec.originalDailyRate || 650}/day` },
          { label: 'Current Rate', value: `₹${rec.agreedDailyRate}/day` },
          { label: 'Stated Justification', value: rec.modificationReason || 'No justification recorded' },
          { label: 'Integrity Checksum State', value: rec.isTampered ? 'Mismatch Flagged' : 'Hash Valid' },
        ],
      });
    }

    // 4. RULE-04: Payment Reconciliation Discrepancy
    const calculatedSum = calc.totalPaymentsRecorded + calc.outstandingBalance;
    if (Math.abs(calculatedSum - calc.netWagesDue) > 0.05) {
      alerts.push({
        id: `ANOM-RECON-${rec.id}`,
        ruleId: 'RULE-04',
        ruleName: 'Payment Reconciliation Discrepancy',
        recordId: rec.id,
        severity: 'warning',
        triggerReason: `Recorded payments (₹${calc.totalPaymentsRecorded}) + outstanding balance (₹${calc.outstandingBalance}) do not equal computed net wages due (₹${calc.netWagesDue}).`,
        neutralNotice:
          'Mathematical reconciliation mismatch detected. Inspect payment voucher receipts and itemized deduction entries for data-entry discrepancies.',
        valuesExamined: [
          { label: 'Net Wages Due', value: `₹${calc.netWagesDue}` },
          { label: 'Total Recorded Payments', value: `₹${calc.totalPaymentsRecorded}` },
          { label: 'Outstanding Balance', value: `₹${calc.outstandingBalance}` },
          { label: 'Sum of Payments + Balance', value: `₹${calculatedSum}` },
        ],
      });
    }

    // 5. RULE-05: Deductions Without Stated Justification
    const unreasonedDeductions = (rec.itemizedDeductions || []).filter(
      d => !d.reason || !d.reason.trim()
    );
    if (unreasonedDeductions.length > 0) {
      alerts.push({
        id: `ANOM-DED-${rec.id}`,
        ruleId: 'RULE-05',
        ruleName: 'Itemized Deduction Without Stated Justification',
        recordId: rec.id,
        severity: 'warning',
        triggerReason: `${unreasonedDeductions.length} deduction entry has no recorded reason or justification.`,
        neutralNotice:
          'Transparency guideline notice: All itemized wage deductions must carry an explicit reason so both parties understand the basis of the withholding.',
        valuesExamined: [
          { label: 'Unreasoned Deductions', value: unreasonedDeductions.length },
          { label: 'Total Deduction Amount', value: `₹${calc.itemizedDeductionsTotal}` },
          { label: 'Item Titles', value: unreasonedDeductions.map(d => d.title).join(', ') },
        ],
      });
    }

    // 6. RULE-06: Unsettled Balance Past Configurable Muster Policy Window
    if (calc.outstandingBalance > 0 && rec.date) {
      const recordDate = new Date(rec.date);
      const diffDays = Math.floor(
        (currentDate.getTime() - recordDate.getTime()) / (1000 * 3600 * 24)
      );
      if (diffDays > activeConfig.overdueSettlementDaysPolicy) {
        alerts.push({
          id: `ANOM-DUE-${rec.id}`,
          ruleId: 'RULE-06',
          ruleName: 'Overdue Unsettled Wage Balance Policy',
          recordId: rec.id,
          severity: 'info',
          triggerReason: `Wage balance of ₹${calc.outstandingBalance} has remained unsettled for ${diffDays} days past shift date (${rec.date}), exceeding the configured ${activeConfig.overdueSettlementDaysPolicy}-day review policy.`,
          neutralNotice:
            'Informational notice: Shift has exceeded the standard weekly muster reconciliation policy window. Note that this is a configurable administrative threshold, not a statutory finding of default.',
          valuesExamined: [
            { label: 'Configured Settlement Policy', value: `${activeConfig.overdueSettlementDaysPolicy} calendar days (Configurable policy)` },
            { label: 'Work Date', value: rec.date },
            { label: 'Days Elapsed', value: `${diffDays} days` },
            { label: 'Unsettled Balance', value: `₹${calc.outstandingBalance}` },
          ],
        });
      }
    }

    // 7. RULE-07: Minimum Wage Benchmark Comparison (Strictly Distinguishing Contractual vs Statutory)
    const benchmark: MinimumWageBenchmark = rec.minimumWageBenchmark || INDORE_SKILLED_CONSTRUCTION_BENCHMARK;
    if (benchmark && rec.agreedDailyRate < benchmark.rate) {
      const isBenchmarkVerified = benchmark.isVerified === true;
      alerts.push({
        id: `ANOM-MIN-${rec.id}`,
        ruleId: 'RULE-07',
        ruleName: 'Wage Comparison Against Configured Benchmark',
        recordId: rec.id,
        severity: isBenchmarkVerified ? 'warning' : 'info',
        triggerReason: isBenchmarkVerified
          ? `Agreed contractual rate (₹${rec.agreedDailyRate}/day) is ₹${benchmark.rate - rec.agreedDailyRate} below the verified statutory floor (₹${benchmark.rate}/day).`
          : `Agreed contractual rate (₹${rec.agreedDailyRate}/day) is ₹${benchmark.rate - rec.agreedDailyRate} below the illustrative demonstration floor (₹${benchmark.rate}/day). [BENCHMARK MARKED UNVERIFIED]`,
        neutralNotice: isBenchmarkVerified
          ? 'Review notice: Rate is below the certified M.P. Labour Department skilled construction floor. Review trade category classification.'
          : 'Informational comparison only: Configured benchmark is UNVERIFIED pending official M.P. Gazette orders. In accordance with honesty guidelines, this prototype benchmark must NOT be used to assert illegal underpayment.',
        valuesExamined: [
          { label: 'Agreed Daily Rate', value: `₹${rec.agreedDailyRate}/day (Contractual Agreement)` },
          { label: 'Configured Benchmark Rate', value: `₹${benchmark.rate}/day` },
          { label: 'Benchmark Status', value: benchmark.status || 'UNVERIFIED_PENDING_GAZETTE' },
          { label: 'Trade Category', value: benchmark.tradeCategory },
          { label: 'Statutory Source', value: benchmark.source },
        ],
      });
    }
  });

  return alerts;
}
