-- ==============================================================================
-- SHRAM SETU 2.0 — SUPABASE AUTHORITATIVE DEMONSTRATION SEED DATA
-- Target Database: PostgreSQL / Supabase
-- Execution: Run after applying migration 20261024000000_shram_setu_initial_schema.sql
-- ==============================================================================

-- 1. SEED WORKERS
INSERT INTO public.workers (
    id, name, hindi_name, trade, trade_hindi, location, hub_chowk, phone_masked,
    joined_date, avatar_url, daily_rate_agreed, verified_experience_months,
    completed_sites, attendance_rate, verification_status, nfc_tag_id,
    crypto_checksum, pass_credential_token, is_demo_data, emergency_contact
) VALUES
(
    'MP-IND-2026-WM842', 'Ramesh Verma', 'रमेश वर्मा', 'Senior Mason / Bricklayer', 'वरिष्ठ राजमिस्त्री',
    'Indore, Madhya Pradesh', 'Geeta Bhawan Labor Chowk (गीता भवन चौराहा)', '+91 98260 •••••',
    '14 Feb 2024', '', 650.00, 48, 19, 96.40, 'verified', 'QR-IND-842-7F89B2',
    'sha256:7b91f034e4a905d6cb44e8bc1a39f61b0c952', 'cpt_e8f192b47c014fa29d338be51049ea21', TRUE,
    '+91 94250 ••••• (Family: Radha Verma)'
),
(
    'MP-IND-2026-WM715', 'Sunita Bai', 'सुनीता बाई', 'Construction Helper / Beldar', 'निर्माण सहायिका / बेलदार',
    'Indore (Malwa Mill Chowk)', 'Malwa Mill Labor Chowk', '+91 97531 •••••',
    '03 Aug 2024', '', 450.00, 24, 11, 94.00, 'verified', 'QR-IND-715-4D12C9',
    'sha256:9a41c12095f91b7d5583b221049581a8b19e2c', 'cpt_b9218d4e11234c89aa71e95810237fa9', TRUE,
    '+91 98265 ••••• (Family: Ramesh Bai)'
),
(
    'MP-IND-2026-WM920', 'Vikram Singh', 'विक्रम सिंह', 'Bar Bender / Steel Fixer', 'सरिया कारीगर',
    'Indore (Rajwada Chowk)', 'Rajwada Labor Chowk', '+91 96850 •••••',
    '11 Nov 2023', '', 700.00, 60, 27, 98.20, 'verified', 'QR-IND-920-3A88E1',
    'sha256:32e01b774c83fa98e3b1c19875411a098bc14d', 'cpt_f1084ea9345bc821038947ef90218bca', TRUE,
    '+91 98933 ••••• (Family: Anita Singh)'
),
(
    'MP-IND-2026-WM604', 'Dilip Solanki', 'दिलीप सोलंकी', 'Shuttering Carpenter', 'शटरिंग कारीगर',
    'Indore (Bhawarkua Chowk)', 'Bhawarkua Labor Chowk', '+91 94071 •••••',
    '05 Jan 2024', '', 650.00, 36, 16, 95.50, 'verified', 'QR-IND-604-8E44A2',
    'sha256:67f082e5d5901baef4576a8d119e832104fa2', 'cpt_981a2b34c56789def0123456789abcde', TRUE,
    '+91 97130 ••••• (Family: Geeta Solanki)'
)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED CONTRACTOR
INSERT INTO public.contractors (
    id, firm_name, representative, location, reg_number, contact, active_projects
) VALUES (
    'CONT-MP-2024-089', 'M/s Sharma Infra Pvt Ltd', 'Er. Alok Sharma (Project Director)',
    'Indore (Vijay Nagar & Palasia Sites)', 'MP-IND-PWD-2024/774', '+91 98930 11223',
    '["Vijay Nagar Metro Station Line-3", "Palasia Commercial Complex", "Scheme No. 78 Residential Tower"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED SKILLS
INSERT INTO public.skills (
    id, skill_name, skill_hindi, category, verified_hours, endorsed_by_contractor, rating, certification_title, issuer, verification_method
) VALUES
(
    'SKL-01', 'Brick & Block Masonry', 'ईंट एवं ब्लॉक चिनाई (राजमिस्त्री)', 'Structural Civil', 320.00,
    'M/s Sharma Infra Pvt Ltd', 4.80, 'Indore Municipal Smart City Artisan Badge', 'Indore Sahodaya Vocational Test Bench', 'contractor_muster'
),
(
    'SKL-02', 'Plastering & Surface Leveling', 'प्लास्टर एवं सतह समतलीकरण', 'Finishing Works', 190.00,
    'Apex Logistics Infrastructure', 4.60, NULL, NULL, 'peer_corroborated'
),
(
    'SKL-03', 'Foundation Concrete Pour', 'नींव कंक्रीट ढलाई', 'Structural Civil', 240.00,
    'Malwa Public Civil Works', 4.70, NULL, NULL, 'contractor_muster'
),
(
    'SKL-04', 'Drainage Culvert Box Layout', 'ड्रेनेज पुलिया बॉक्स निर्माण', 'Infrastructure', 85.00,
    'Malwa Public Civil Works', 4.50, NULL, NULL, 'peer_corroborated'
)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED WORK RECORDS (Blocks 1 through 8)
INSERT INTO public.work_records (
    id, worker_id, date, site_name, site_location, contractor_name, contractor_phone,
    trade_role, shift_hours, overtime_hours, agreed_daily_rate, overtime_rate,
    additional_allowances, itemized_deductions, earned_wage, paid_amount, balance_due,
    status, detailed_payment_status, worker_acknowledgment_status, payments,
    correction_history, minimum_wage_benchmark, hash, previous_hash, notes, is_tampered
) VALUES
(
    'REC-2026-1001', 'MP-IND-2026-WM842', '2026-10-01', 'Vijay Nagar Metro Station Line-3', 'MR-10 Corridor, Indore',
    'M/s Sharma Infra Pvt Ltd', '+91 98930 11223', 'Senior Mason', 8.0, 1.0, 650.00, 100.00,
    '[]'::jsonb, '[]'::jsonb, 750.00, 750.00, 0.00, 'verified', 'acknowledged_as_received', 'acknowledged',
    '[{"id":"PAY-2026-1001-A","amount":750,"date":"2026-10-01 18:30 IST","recordingParty":"contractor","recordedRoleLabel":"Munshi / Cashier","acknowledgmentStatus":"acknowledged_by_worker","notes":"Cash wage settlement at chowk office"}]'::jsonb,
    '[]'::jsonb, '{"rate":505.00,"unit":"day","tradeCategory":"Skilled Construction Labor (Masons, Bricklayers, Carpenters)","benchmarkName":"M.P. Minimum Wage Schedule (Illustrative Demo Reference)","effectiveDate":"2026-04-01","source":"Labour Commissioner Office, Govt of M.P.","notes":"Illustrative statutory baseline used as demonstration benchmark.","isVerified":true,"status":"VERIFIED_OFFICIAL"}'::jsonb,
    '388f6a3d6d034a7d65b1192e20b666497217983ea0e59a7f342dbfa751ea50e8', 'GENESIS_BLOCK_INDORE_PILOT_2026',
    'Verified by site biometric punch and munshi daily entry. Paid in cash.', FALSE
),
(
    'REC-2026-1003', 'MP-IND-2026-WM842', '2026-10-03', 'Vijay Nagar Metro Station Line-3', 'MR-10 Corridor, Indore',
    'M/s Sharma Infra Pvt Ltd', '+91 98930 11223', 'Senior Mason', 8.0, 0.0, 650.00, 100.00,
    '[]'::jsonb, '[]'::jsonb, 650.00, 650.00, 0.00, 'verified', 'acknowledged_as_received', 'acknowledged',
    '[{"id":"PAY-2026-1003-A","amount":650,"date":"2026-10-03 18:00 IST","recordingParty":"contractor","recordedRoleLabel":"Munshi / Cashier","acknowledgmentStatus":"acknowledged_by_worker","notes":"Full daily cash settlement"}]'::jsonb,
    '[]'::jsonb, '{"rate":505.00,"unit":"day","tradeCategory":"Skilled Construction Labor (Masons, Bricklayers, Carpenters)","benchmarkName":"M.P. Minimum Wage Schedule (Illustrative Demo Reference)","effectiveDate":"2026-04-01","source":"Labour Commissioner Office, Govt of M.P.","notes":"Illustrative statutory baseline used as demonstration benchmark.","isVerified":true,"status":"VERIFIED_OFFICIAL"}'::jsonb,
    'baad3cf5fd2a2553da0ee07e6e584f2c00cc1ea487a549db5bc078b6630f9a21', '388f6a3d6d034a7d65b1192e20b666497217983ea0e59a7f342dbfa751ea50e8',
    'Full day masonry on pier P-14. Cash disbursed.', FALSE
),
(
    'REC-2026-1005', 'MP-IND-2026-WM842', '2026-10-05', 'Super Corridor Logistics Hub', 'Super Corridor, Indore',
    'Apex Logistics Infrastructure', '+91 98270 44556', 'Senior Mason', 8.0, 0.0, 650.00, 100.00,
    '[]'::jsonb, '[]'::jsonb, 650.00, 650.00, 0.00, 'verified', 'acknowledged_as_received', 'acknowledged',
    '[{"id":"PAY-2026-1005-A","amount":650,"date":"2026-10-05 19:00 IST","recordingParty":"contractor","recordedRoleLabel":"Project Supervisor","acknowledgmentStatus":"acknowledged_by_worker","notes":"Direct UPI/NEFT transfer"}]'::jsonb,
    '[{"id":"CORR-2026-002","timestamp":"2026-10-05 18:30 IST","actorRole":"Project Supervisor (Apex Logistics)","fieldName":"agreedDailyRate","fieldLabel":"Agreed Daily Rate","previousValue":550,"correctedValue":650,"reason":"Corrected clerical entry from helper grade to master mason grade","workerAcknowledgment":"accepted","workerResponseAt":"2026-10-05 18:45 IST"}]'::jsonb,
    '{"rate":505.00,"unit":"day","tradeCategory":"Skilled Construction Labor (Masons, Bricklayers, Carpenters)","benchmarkName":"M.P. Minimum Wage Schedule (Illustrative Demo Reference)","effectiveDate":"2026-04-01","source":"Labour Commissioner Office, Govt of M.P.","notes":"Illustrative statutory baseline used as demonstration benchmark.","isVerified":true,"status":"VERIFIED_OFFICIAL"}'::jsonb,
    '33b1e84615ec35165da74e92955da341d32d005fbc5dfb7dd792c3a5043bfd75', 'baad3cf5fd2a2553da0ee07e6e584f2c00cc1ea487a549db5bc078b6630f9a21',
    'Boundary wall construction. Rate corrected from ₹550 to ₹650 on same day.', FALSE
),
(
    'REC-2026-1007', 'MP-IND-2026-WM842', '2026-10-07', 'Palasia Commercial Complex', 'Palasia Square, Indore',
    'M/s Sharma Infra Pvt Ltd', '+91 98930 11223', 'Senior Mason', 8.0, 2.0, 650.00, 100.00,
    '[]'::jsonb, '[]'::jsonb, 850.00, 850.00, 0.00, 'verified', 'acknowledged_as_received', 'acknowledged',
    '[{"id":"PAY-2026-1007-A","amount":850,"date":"2026-10-07 19:45 IST","recordingParty":"contractor","recordedRoleLabel":"Site Superintendent","acknowledgmentStatus":"acknowledged_by_worker","notes":"Full cash settlement including ₹200 for 2 hrs overtime"}]'::jsonb,
    '[]'::jsonb, '{"rate":505.00,"unit":"day","tradeCategory":"Skilled Construction Labor (Masons, Bricklayers, Carpenters)","benchmarkName":"M.P. Minimum Wage Schedule (Illustrative Demo Reference)","effectiveDate":"2026-04-01","source":"Labour Commissioner Office, Govt of M.P.","notes":"Illustrative statutory baseline used as demonstration benchmark.","isVerified":true,"status":"VERIFIED_OFFICIAL"}'::jsonb,
    'a53f63901b0b533a1e05d93e17ceea24d27bf9fe1ebc761619a9ecf97ddfe4d8', '33b1e84615ec35165da74e92955da341d32d005fbc5dfb7dd792c3a5043bfd75',
    'Basement retaining wall. Overtime 2 hours due to concrete pour schedule.', FALSE
),
(
    'REC-2026-1008', 'MP-IND-2026-WM842', '2026-10-08', 'Scheme No. 78 Residential Tower', 'Vijay Nagar Extension, Indore',
    'Narmada Buildcon (Munshi: Radhe)', '+91 94253 77889', 'Senior Mason', 8.0, 1.0, 650.00, 100.00,
    '[]'::jsonb, '[]'::jsonb, 750.00, 400.00, 350.00, 'disputed', 'disputed', 'disputed',
    '[{"id":"PAY-2026-1008-A","amount":400,"date":"2026-10-08 18:30 IST","recordingParty":"contractor","recordedRoleLabel":"Munshi Radhe","acknowledgmentStatus":"disputed_by_worker","notes":"Munshi tendered partial cash of ₹400 only, unilaterally deducting ₹350 without written cause."}]'::jsonb,
    '[]'::jsonb, '{"rate":505.00,"unit":"day","tradeCategory":"Skilled Construction Labor (Masons, Bricklayers, Carpenters)","benchmarkName":"M.P. Minimum Wage Schedule (Illustrative Demo Reference)","effectiveDate":"2026-04-01","source":"Labour Commissioner Office, Govt of M.P.","notes":"Illustrative statutory baseline used as demonstration benchmark.","isVerified":true,"status":"VERIFIED_OFFICIAL"}'::jsonb,
    '69d521634e45eab1c496102aa645472851d726b2b737d9fa85b88229df83fce5', 'a53f63901b0b533a1e05d93e17ceea24d27bf9fe1ebc761619a9ecf97ddfe4d8',
    'ACTIVE DISPUTE: Contractor paid ₹400 instead of ₹750 earned. Case lodged DISP-2026-IND-01.', FALSE
),
(
    'REC-2026-DEMO-4D', 'MP-IND-2026-WM842', '2026-10-14', 'Palasia Commercial Complex', 'Palasia Square, Indore',
    'M/s Sharma Infra Pvt Ltd', '+91 98930 11223', 'Senior Mason', 32.0, 0.0, 650.00, 100.00,
    '[]'::jsonb, '[]'::jsonb, 2600.00, 1300.00, 1300.00, 'verified', 'partially_paid', 'acknowledged',
    '[{"id":"PAY-2026-DEMO-01","amount":1300,"date":"2026-10-12 18:00 IST","recordingParty":"contractor","recordedRoleLabel":"Site Superintendent","acknowledgmentStatus":"acknowledged_by_worker","notes":"Advance 2-day cash disbursement out of 4-day continuous project milestone."}]'::jsonb,
    '[]'::jsonb, '{"rate":505.00,"unit":"day","tradeCategory":"Skilled Construction Labor (Masons, Bricklayers, Carpenters)","benchmarkName":"M.P. Minimum Wage Schedule (Illustrative Demo Reference)","effectiveDate":"2026-04-01","source":"Labour Commissioner Office, Govt of M.P.","notes":"Illustrative statutory baseline used as demonstration benchmark.","isVerified":true,"status":"VERIFIED_OFFICIAL"}'::jsonb,
    '4a243bdf3e59b0836181751c4526d676e5a2caaa70a3cd26cfd238d5316dc794', '69d521634e45eab1c496102aa645472851d726b2b737d9fa85b88229df83fce5',
    'Completed 4-day structural plastering contract. 50% advance disbursed, balance pending milestone clearance.', FALSE
),
(
    'REC-2026-SUNITA-01', 'MP-IND-2026-WM715', '2026-10-15', 'Vijay Nagar Metro Station Line-3', 'MR-10 Corridor, Indore',
    'M/s Sharma Infra Pvt Ltd', '+91 98930 11223', 'Construction Helper / Beldar', 8.0, 0.0, 450.00, 70.00,
    '[]'::jsonb, '[]'::jsonb, 450.00, 0.00, 450.00, 'pending_approval', 'unpaid', 'pending',
    '[]'::jsonb, '[]'::jsonb,
    '{"rate":425.00,"unit":"day","tradeCategory":"Unskilled Construction Labor (Helpers, Beldars, Earthmovers)","benchmarkName":"M.P. Minimum Wage Schedule (Illustrative Demo Reference)","effectiveDate":"2026-04-01","source":"Labour Commissioner Office, Govt of M.P.","notes":"Statutory reference for unskilled construction helpers.","isVerified":true,"status":"VERIFIED_OFFICIAL"}'::jsonb,
    '649f85c1387d8986c7104b9015c7cb52be6ff960538a77a941fc3652db6a2a51', '4a243bdf3e59b0836181751c4526d676e5a2caaa70a3cd26cfd238d5316dc794',
    'Material movement and concrete curing assistance. Shift logged; cash payout scheduled on weekly settlement day.', FALSE
),
(
    'REC-2026-SUNITA-02', 'MP-IND-2026-WM715', '2026-10-16', 'Vijay Nagar Metro Station Line-3', 'MR-10 Corridor, Indore',
    'M/s Sharma Infra Pvt Ltd', '+91 98930 11223', 'Construction Helper / Beldar', 8.0, 0.0, 450.00, 70.00,
    '[]'::jsonb, '[]'::jsonb, 450.00, 450.00, 0.00, 'verified', 'acknowledged_as_received', 'acknowledged',
    '[{"id":"PAY-2026-SUNITA-02-A","amount":450,"date":"2026-10-16 18:00 IST","recordingParty":"contractor","recordedRoleLabel":"Munshi / Cashier","acknowledgmentStatus":"acknowledged_by_worker","notes":"Daily helper wage paid in cash"}]'::jsonb,
    '[]'::jsonb, '{"rate":425.00,"unit":"day","tradeCategory":"Unskilled Construction Labor (Helpers, Beldars, Earthmovers)","benchmarkName":"M.P. Minimum Wage Schedule (Illustrative Demo Reference)","effectiveDate":"2026-04-01","source":"Labour Commissioner Office, Govt of M.P.","notes":"Statutory reference for unskilled construction helpers.","isVerified":true,"status":"VERIFIED_OFFICIAL"}'::jsonb,
    '4c0c169c97b5e807212c40c34ef7343e7bc2fc6d5b031b4020f18835f1f9fdfa', '649f85c1387d8986c7104b9015c7cb52be6ff960538a77a941fc3652db6a2a51',
    'Full day helper shift completed and settled.', FALSE
)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED DISPUTES
INSERT INTO public.disputes (
    id, work_record_id, date_lodged, site_name, contractor_name, worker_name,
    claimed_amount, paid_amount, discrepancy_amount, disputed_field, issue_type,
    description, contractor_response, unresolved_facts, supporting_evidence, status, timeline
) VALUES
(
    'DISP-2026-IND-01', 'REC-2026-1008', '2026-10-09', 'Scheme No. 78 Residential Tower',
    'Narmada Buildcon (Munshi: Radhe)', 'Ramesh Verma', 750.00, 400.00, 350.00,
    'Daily Wage Rate & Overtime (₹400 tendered vs ₹750 earned)', 'rate_cut',
    'Munshi Radhe unilaterally cut daily rate to ₹400 citing unskilled helper rate, though I performed master brickwork on foundation wall from 8 AM to 6 PM with 1 hour authorized overtime.',
    '{"text":"Muster clerk recorded half-day brickwork and half-day material movement with helper group. Will verify with chief engineer muster on site.","respondent":"Munshi Radhe (Contractor Representative)","date":"2026-10-10 11:30 IST"}'::jsonb,
    '["Exact trade category agreed upon at morning labor chowk (Skilled Mason vs Helper)", "Timekeeper overtime muster log for foundation concrete pour past 5 PM"]'::jsonb,
    '["Shift Attendance Log 2026-10-08 (9 hrs recorded: 8h base + 1h OT)", "Agreed Daily Rate Card: ₹650/day (Verified mason trade credential)", "Cryptographic Block Hash: 69d521634e45eab1... (Immutable shift timestamp)"]'::jsonb,
    'under_review',
    '[{"date":"2026-10-09 09:15 IST","note":"Dispute lodged by worker Ramesh Verma following cash payment tender at muster office.","actor":"Worker Portal"},{"date":"2026-10-10 11:30 IST","note":"Contractor Munshi Radhe submitted muster explanation: \\"Recorded mixed duties with helper group.\\"","actor":"Contractor Desk"},{"date":"2026-10-12 16:00 IST","note":"Geeta Bhawan Chowk Committee scheduled joint mediation review with site superintendent.","actor":"Mediation Desk"}]'::jsonb
),
(
    'DISP-2026-IND-02', 'REC-2026-1005', '2026-10-05', 'Super Corridor Logistics Hub',
    'Apex Logistics Infrastructure', 'Ramesh Verma', 650.00, 550.00, 100.00,
    'Helper rate applied instead of skilled mason rate', 'rate_cut',
    'Initial muster entry recorded ₹550. Verified with site supervisor and adjusted to ₹650 with full cash settlement.',
    '{"text":"Data entry clerk selected Grade-II helper by mistake. Rectified to Grade-I skilled mason on same day.","respondent":"Project Supervisor (Apex Logistics)","date":"2026-10-05 18:30 IST"}'::jsonb,
    '[]'::jsonb,
    '["Correction Log CORR-2026-002 signed by Project Supervisor", "NEFT Payment Reference PAY-2026-001 for ₹650"]'::jsonb,
    'resolved',
    '[{"date":"2026-10-05 17:30 IST","note":"Informal query logged regarding ₹550 daily rate.","actor":"Worker Portal"},{"date":"2026-10-05 18:30 IST","note":"Supervisor confirmed error; applied Correction CORR-2026-002 to ₹650.","actor":"Contractor Desk"},{"date":"2026-10-05 18:45 IST","note":"Worker accepted correction and confirmed full ₹650 NEFT disbursement.","actor":"Worker Portal"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED APPROVAL REQUESTS (Simulations in Local Demo Mode)
INSERT INTO public.approval_requests (
    id, type, work_record_id, dispute_id, requester_role, requester_name,
    target_worker_id, target_worker_name, title, summary, amount, status,
    simulation_disclaimer
) VALUES
(
    'REQ-2026-APP-001', 'work_record_confirmation', 'REC-2026-SUNITA-01', NULL,
    'contractor', 'Er. Alok Sharma (M/s Sharma Infra)', 'MP-IND-2026-WM715', 'Sunita Bai',
    'Muster Attendance & Unpaid Wage Confirmation',
    'Vijay Nagar Metro Line-3 shift on 2026-10-15 (8 hrs, helper masonry, ₹450 pending disbursement).',
    450.00, 'simulated_pending',
    'Simulated Cross-Device Request: In Local Demo Mode, this approval request is simulated locally via IndexedDB. Multi-device sync will be enabled with Supabase deployment next week.'
),
(
    'REQ-2026-APP-002', 'rate_correction', 'REC-2026-1008', 'DISP-2026-IND-01',
    'contractor', 'Munshi Radhe (Narmada Buildcon)', 'MP-IND-2026-WM842', 'Ramesh Verma',
    'Mediation Rate Rectification Proposal',
    'Proposed adjustment of foundation brickwork rate from ₹400 to ₹650/day + ₹100 OT.',
    750.00, 'simulated_pending',
    'Simulated Cross-Device Request: In Local Demo Mode, this approval request is simulated locally via IndexedDB. Multi-device sync will be enabled with Supabase deployment next week.'
)
ON CONFLICT (id) DO NOTHING;
