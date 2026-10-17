-- ==============================================================================
-- SHRAM SETU 2.0 — SUPABASE POSTGRESQL SCHEMA MIGRATION
-- Migration Version: 20261024000000_shram_setu_initial_schema.sql
-- Scheduled Provisioning: Next Week
-- Current State: Local Demo Mode using client-side IndexedDB
-- ==============================================================================

-- Enable cryptographic extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. WORKERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workers (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    hindi_name TEXT,
    trade TEXT NOT NULL,
    trade_hindi TEXT,
    location TEXT NOT NULL,
    hub_chowk TEXT NOT NULL,
    phone_masked TEXT NOT NULL,
    joined_date TEXT NOT NULL,
    avatar_url TEXT DEFAULT '',
    daily_rate_agreed NUMERIC(10, 2) NOT NULL CHECK (daily_rate_agreed > 0),
    verified_experience_months INTEGER DEFAULT 0,
    completed_sites INTEGER DEFAULT 0,
    attendance_rate NUMERIC(5, 2) DEFAULT 100.00,
    verification_status TEXT CHECK (verification_status IN ('verified', 'pending', 'flagged')) DEFAULT 'verified',
    nfc_tag_id TEXT NOT NULL,
    crypto_checksum TEXT NOT NULL,
    pass_credential_token TEXT NOT NULL UNIQUE,
    is_demo_data BOOLEAN DEFAULT TRUE,
    emergency_contact TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. CONTRACTORS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contractors (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    firm_name TEXT NOT NULL,
    representative TEXT NOT NULL,
    location TEXT NOT NULL,
    reg_number TEXT NOT NULL UNIQUE,
    contact TEXT NOT NULL,
    active_projects JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. WORK RECORDS (AUDITABLE WAGE LEDGER BLOCKS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.work_records (
    id TEXT PRIMARY KEY,
    worker_id TEXT REFERENCES public.workers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    site_name TEXT NOT NULL,
    site_location TEXT NOT NULL,
    contractor_name TEXT NOT NULL,
    contractor_phone TEXT NOT NULL,
    trade_role TEXT NOT NULL,
    shift_start_time TEXT,
    shift_end_time TEXT,
    days_worked NUMERIC(6, 2) DEFAULT 1.0,
    shift_hours NUMERIC(6, 2) NOT NULL CHECK (shift_hours >= 0),
    overtime_hours NUMERIC(6, 2) NOT NULL DEFAULT 0.0,
    agreed_daily_rate NUMERIC(10, 2) NOT NULL CHECK (agreed_daily_rate >= 0),
    overtime_rate NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    additional_allowances JSONB NOT NULL DEFAULT '[]'::jsonb,
    itemized_deductions JSONB NOT NULL DEFAULT '[]'::jsonb,
    earned_wage NUMERIC(10, 2) NOT NULL,
    paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    balance_due NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    status TEXT CHECK (status IN ('verified', 'pending_approval', 'disputed', 'modified')) DEFAULT 'verified',
    detailed_payment_status TEXT CHECK (detailed_payment_status IN ('unpaid', 'partially_paid', 'recorded_as_paid', 'acknowledged_as_received', 'disputed')),
    worker_acknowledgment_status TEXT CHECK (worker_acknowledgment_status IN ('pending', 'acknowledged', 'disputed')) DEFAULT 'pending',
    payments JSONB NOT NULL DEFAULT '[]'::jsonb,
    correction_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    minimum_wage_benchmark JSONB,
    modification_reason TEXT,
    modified_at TIMESTAMPTZ,
    original_daily_rate NUMERIC(10, 2),
    hash TEXT NOT NULL,
    previous_hash TEXT NOT NULL,
    notes TEXT,
    is_tampered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ledger indexes for rapid queries
CREATE INDEX IF NOT EXISTS idx_work_records_worker_id ON public.work_records(worker_id);
CREATE INDEX IF NOT EXISTS idx_work_records_date ON public.work_records(date DESC);
CREATE INDEX IF NOT EXISTS idx_work_records_hash ON public.work_records(hash);

-- ------------------------------------------------------------------------------
-- 4. WAGE DISPUTES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.disputes (
    id TEXT PRIMARY KEY,
    work_record_id TEXT REFERENCES public.work_records(id) ON DELETE SET NULL,
    date_lodged DATE NOT NULL,
    site_name TEXT NOT NULL,
    contractor_name TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    claimed_amount NUMERIC(10, 2) NOT NULL,
    paid_amount NUMERIC(10, 2) NOT NULL,
    discrepancy_amount NUMERIC(10, 2) NOT NULL,
    disputed_field TEXT,
    issue_type TEXT CHECK (issue_type IN ('unpaid_wages', 'unrecorded_overtime', 'rate_cut', 'wrong_hours')) NOT NULL,
    description TEXT NOT NULL,
    contractor_response JSONB,
    unresolved_facts JSONB NOT NULL DEFAULT '[]'::jsonb,
    supporting_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT CHECK (status IN ('open', 'awaiting_response', 'under_review', 'resolved', 'in_mediation')) DEFAULT 'open',
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disputes_work_record_id ON public.disputes(work_record_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);

-- ------------------------------------------------------------------------------
-- 5. SKILLS & CREDENTIALS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id TEXT PRIMARY KEY,
    skill_name TEXT NOT NULL,
    skill_hindi TEXT NOT NULL,
    category TEXT NOT NULL,
    verified_hours NUMERIC(10, 2) NOT NULL DEFAULT 0,
    endorsed_by_contractor TEXT NOT NULL,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
    certification_title TEXT,
    issuer TEXT,
    verification_method TEXT CHECK (verification_method IN ('contractor_muster', 'peer_corroborated', 'assessment')) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. APPROVAL REQUESTS TABLE (Simulated in Local Demo Mode, Real in Supabase)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.approval_requests (
    id TEXT PRIMARY KEY,
    type TEXT CHECK (type IN ('work_record_confirmation', 'wage_payment_disbursement', 'rate_correction', 'dispute_resolution')) NOT NULL,
    work_record_id TEXT REFERENCES public.work_records(id) ON DELETE SET NULL,
    dispute_id TEXT REFERENCES public.disputes(id) ON DELETE SET NULL,
    requester_role TEXT CHECK (requester_role IN ('contractor', 'worker')) NOT NULL,
    requester_name TEXT NOT NULL,
    target_worker_id TEXT REFERENCES public.workers(id) ON DELETE CASCADE,
    target_worker_name TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    amount NUMERIC(10, 2),
    status TEXT CHECK (status IN ('simulated_pending', 'simulated_approved', 'simulated_rejected', 'pending', 'approved', 'rejected')) NOT NULL DEFAULT 'pending',
    responded_at TEXT,
    response_note TEXT,
    simulation_disclaimer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approval_requests_worker ON public.approval_requests(target_worker_id);

-- ------------------------------------------------------------------------------
-- 7. AUTOMATED UPDATED_AT TIMESTAMP TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_workers_updated_at ON public.workers;
CREATE TRIGGER trigger_workers_updated_at BEFORE UPDATE ON public.workers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_contractors_updated_at ON public.contractors;
CREATE TRIGGER trigger_contractors_updated_at BEFORE UPDATE ON public.contractors FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_work_records_updated_at ON public.work_records;
CREATE TRIGGER trigger_work_records_updated_at BEFORE UPDATE ON public.work_records FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_disputes_updated_at ON public.disputes;
CREATE TRIGGER trigger_disputes_updated_at BEFORE UPDATE ON public.disputes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_approval_requests_updated_at ON public.approval_requests;
CREATE TRIGGER trigger_approval_requests_updated_at BEFORE UPDATE ON public.approval_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;

-- Anonymous read policy for demonstration & public digital pass verification
CREATE POLICY "Public pass credential verification" ON public.workers
    FOR SELECT USING (true);

CREATE POLICY "Public skills catalog view" ON public.skills
    FOR SELECT USING (true);

CREATE POLICY "Public contractor view" ON public.contractors
    FOR SELECT USING (true);

-- Authenticated Worker policies
CREATE POLICY "Workers can read their own work records" ON public.work_records
    FOR SELECT USING (
        auth.uid() IS NULL OR
        worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid())
    );

CREATE POLICY "Workers can insert and read their disputes" ON public.disputes
    FOR ALL USING (
        auth.uid() IS NULL OR
        worker_name IN (SELECT name FROM public.workers WHERE user_id = auth.uid())
    );

CREATE POLICY "Workers can manage approvals addressed to them" ON public.approval_requests
    FOR ALL USING (
        auth.uid() IS NULL OR
        target_worker_id IN (SELECT id FROM public.workers WHERE user_id = auth.uid())
    );
