import {
  WorkRecord,
  PaymentEntry,
  WageCalculationBreakdown,
  DetailedPaymentStatus,
  MinimumWageBenchmark,
} from '../types';

/**
 * Decimal-safe rounding to 2 decimal places to avoid IEEE 754 floating point inaccuracies.
 */
export function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Validates and safely converts any input to a non-negative number.
 */
export function safeNumber(val: unknown, fallback: number = 0): number {
  if (typeof val === 'number') {
    return isNaN(val) || !isFinite(val) || val < 0 ? fallback : val;
  }
  if (typeof val === 'string') {
    const parsed = parseFloat(val);
    return isNaN(parsed) || !isFinite(parsed) || parsed < 0 ? fallback : parsed;
  }
  return fallback;
}

/**
 * Configured minimum-wage benchmark for skilled construction in Indore (M.P.).
 * MARKED UNVERIFIED / DISABLED FOR DEFINITIVE STATUTORY COMPARISON:
 * Official Variable Dearness Allowance (VDA) orders for Madhya Pradesh vary by
 * scheduled employment classification and half-yearly revisions. In strict adherence
 * to prototype honesty rules, this rate is NOT asserted as confirmed law.
 */
export const INDORE_SKILLED_CONSTRUCTION_BENCHMARK: MinimumWageBenchmark = {
  rate: 505.00,
  unit: 'day',
  tradeCategory: 'Skilled Construction Labor (Masons, Bricklayers, Carpenters)',
  benchmarkName: 'M.P. Minimum Wage Schedule (Illustrative Demonstration Reference)',
  effectiveDate: '01 April 2024 (Uncertified)',
  source: 'Unverified Prototype Reference — Pending Gazette VDA Verification',
  notes: 'MARKED UNVERIFIED: Disabled for definitive statutory comparison. Contractually agreed chowk wages (e.g. ₹650/day) remain binding between parties. This benchmark is not presented as a confirmed legal minimum.',
  isVerified: false,
  status: 'UNVERIFIED_PENDING_GAZETTE',
  verificationNote: 'Disabled for definitive statutory claims until officially certified with the active Indore Division labour commissioner notification.',
};

/**
 * Configured minimum-wage benchmark for unskilled construction in Indore (M.P.).
 * Applicable to helpers, beldars, earthwork artisans.
 */
export const INDORE_UNSKILLED_CONSTRUCTION_BENCHMARK: MinimumWageBenchmark = {
  rate: 412.00,
  unit: 'day',
  tradeCategory: 'Unskilled Construction Labor (Helpers, Beldars, Earthwork)',
  benchmarkName: 'M.P. Minimum Wage Schedule (Illustrative Demonstration Reference)',
  effectiveDate: '01 April 2024 (Uncertified)',
  source: 'Unverified Prototype Reference — Pending Gazette VDA Verification',
  notes: 'MARKED UNVERIFIED: Disabled for definitive statutory comparison. Contractually agreed chowk wages (e.g. ₹450/day) remain binding between parties.',
  isVerified: false,
  status: 'UNVERIFIED_PENDING_GAZETTE',
  verificationNote: 'Disabled for definitive statutory claims until officially certified with the active Indore Division labour commissioner notification.',
};

/**
 * Single source of truth calculation function for wage totals, deductions,
 * recorded payments, and outstanding balances.
 * Handles inputs safely, validates against duplicate payments, and preserves decimal fidelity.
 */
export function calculateRecordBreakdown(record: Partial<WorkRecord>): WageCalculationBreakdown {
  const agreedDailyRate = round2(safeNumber(record.agreedDailyRate, 650));
  const daysWorked = safeNumber(record.daysWorked, 0);
  const shiftHours = safeNumber(record.shiftHours, 8);

  // If daysWorked is specified (e.g. 4 days), use days. Otherwise default to 1 standard day or hourly ratio.
  const effectiveDays = daysWorked > 0 ? daysWorked : (shiftHours >= 8 ? 1 : round2(shiftHours / 8));
  const baseWage = round2(effectiveDays * agreedDailyRate);

  // Overtime calculation
  const overtimeHours = safeNumber(record.overtimeHours, 0);
  const overtimeRate = safeNumber(record.overtimeRate, 100);
  const overtimeWage = round2(overtimeHours * overtimeRate);

  // Additional allowances (travel, tool allowances, etc.)
  const additionalAllowancesTotal = round2(
    (record.additionalAllowances || []).reduce((sum, item) => sum + safeNumber(item.amount, 0), 0)
  );

  // Gross Wages Due
  const grossWagesDue = round2(baseWage + overtimeWage + additionalAllowancesTotal);

  // Itemized Deductions (mess advance, safety gear deposit, etc.)
  const itemizedDeductionsTotal = round2(
    (record.itemizedDeductions || []).reduce((sum, item) => sum + safeNumber(item.amount, 0), 0)
  );

  // Net Wages Due
  const netWagesDue = round2(Math.max(0, grossWagesDue - itemizedDeductionsTotal));

  // Deduplicate payments by unique ID to prevent double-counting
  const uniquePaymentsMap = new Map<string, PaymentEntry>();
  (record.payments || []).forEach(p => {
    if (p && p.id && !uniquePaymentsMap.has(p.id)) {
      uniquePaymentsMap.set(p.id, p);
    }
  });
  const dedupedPayments = Array.from(uniquePaymentsMap.values());

  // Payments recorded by contractor
  const totalPaymentsRecorded = round2(
    dedupedPayments.reduce((sum, p) => sum + safeNumber(p.amount, 0), 0)
  );

  // Payments explicitly confirmed/acknowledged by worker
  const totalPaymentsConfirmed = round2(
    dedupedPayments
      .filter(p => p.acknowledgmentStatus === 'acknowledged_by_worker')
      .reduce((sum, p) => sum + safeNumber(p.amount, 0), 0)
  );

  // Payments recorded by contractor but unconfirmed by worker
  const unconfirmedPaymentsAmount = round2(Math.max(0, totalPaymentsRecorded - totalPaymentsConfirmed));

  // Outstanding balance (based on recorded payments)
  const outstandingBalance = round2(Math.max(0, netWagesDue - totalPaymentsRecorded));

  // Distinct payment status resolution
  let paymentStatus: DetailedPaymentStatus = 'unpaid';

  if (record.status === 'disputed') {
    paymentStatus = 'disputed';
  } else if (totalPaymentsRecorded === 0) {
    paymentStatus = 'unpaid';
  } else if (totalPaymentsRecorded < netWagesDue) {
    paymentStatus = 'partially_paid';
  } else if (totalPaymentsRecorded >= netWagesDue && totalPaymentsConfirmed < netWagesDue) {
    // Contractor marked paid, but worker acknowledgment is still pending
    paymentStatus = 'recorded_as_paid';
  } else if (totalPaymentsConfirmed >= netWagesDue) {
    paymentStatus = 'acknowledged_as_received';
  }

  return {
    daysWorked: effectiveDays,
    hoursWorked: daysWorked > 0 ? daysWorked * 8 : shiftHours,
    agreedDailyRate,
    baseWage,
    overtimeHours,
    overtimeRate,
    overtimeWage,
    additionalAllowancesTotal,
    grossWagesDue,
    itemizedDeductionsTotal,
    netWagesDue,
    totalPaymentsRecorded,
    totalPaymentsConfirmed,
    unconfirmedPaymentsAmount,
    outstandingBalance,
    paymentStatus,
  };
}
