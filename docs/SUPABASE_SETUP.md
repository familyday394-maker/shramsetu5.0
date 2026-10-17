# Shram Setu 2.0 — Supabase Migration & Backend Setup Guide

> **IMPORTANT ARCHITECTURAL STATUS & TIMING NOTICE**  
> **Supabase Cloud Backend Provisioning is scheduled for next week.**  
> Currently, Shram Setu 2.0 runs in **Local Demo Mode** powered by browser **IndexedDB** (`shram_setu_v2_db`).  
> All records, worker profiles, dispute resolutions, and approval requests persist cleanly in the local browser database.  
> Cross-device approvals are currently operated as **clearly labelled simulations**.  
> The repository layer (`src/services/repository/`) is fully abstracted via `IDataRepository` so switching to Supabase next week requires only updating environment keys.

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                     Shram Setu 2.0 UI                    │
│   (Worker Pass, Muster Roll, Disputes, Ledger Audit)    │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│               IDataRepository Interface                  │
│       (src/services/repository/types.ts)                 │
└──────────────┬────────────────────────────┬──────────────┘
               │ (ACTIVE NOW)               │ (PREPARED FOR NEXT WEEK)
               ▼                            ▼
┌───────────────────────────────┐ ┌─────────────────────────┐
│     IndexedDBRepository       │ │     SupabaseAdapter     │
│  - Browser IndexedDB Storage  │ │  - PostgREST Client     │
│  - Local Demo Mode            │ │  - Cloud RLS Policies   │
│  - Offline & Instant Startup  │ │  - Real-Time Multi-Sync │
│  - Zero Mock DB Duplication   │ │  - Auth Integration     │
└───────────────────────────────┘ └─────────────────────────┘
```

---

## 2. Directory Structure

- `supabase/migrations/20261024000000_shram_setu_initial_schema.sql`: Full PostgreSQL DDL including tables, foreign keys, check constraints, indexes, triggers, and Row Level Security (RLS) policies.
- `supabase/seed.sql`: Authoritative demonstration dataset (Ramesh Verma, Sunita Bai, Vikram Singh, Dilip Solanki, 8 ledger blocks, 2 disputes, skills, and simulated approval requests).
- `src/services/repository/types.ts`: Decoupled repository interfaces.
- `src/services/repository/indexedDBRepo.ts`: Browser IndexedDB repository implementation.
- `src/services/repository/supabaseAdapter.ts`: Typed Supabase adapter with column mappers and fallback.
- `src/services/repository/index.ts`: Factory providing the active repository.

---

## 3. Deployment Procedure (Scheduled for Next Week)

### Step 1: Create Supabase Project
1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project (e.g. `shram-setu-indore-production`).
3. Note your project URL and anon public API key from **Project Settings > API**.

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` and populate your credentials:

```bash
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

*(Note: Do not check `.env` into source control).*

### Step 3: Run Database Migrations
Using the Supabase CLI:

```bash
# Link your local repo to your remote project
npx supabase link --project-ref <your-project-ref>

# Push the schema migration
npx supabase db push

# Alternatively, apply directly using psql:
# psql -h db.<your-project-ref>.supabase.co -U postgres -d postgres -f supabase/migrations/20261024000000_shram_setu_initial_schema.sql
```

Alternatively, copy the contents of `supabase/migrations/20261024000000_shram_setu_initial_schema.sql` into the **Supabase Dashboard > SQL Editor** and click **Run**.

### Step 4: Seed Authoritative Demonstration Data
```bash
# Execute seed file
psql -h db.<your-project-ref>.supabase.co -U postgres -d postgres -f supabase/seed.sql
```
Or paste the contents of `supabase/seed.sql` into the SQL Editor.

### Step 5: Switch Active Repository
In `src/services/repository/index.ts`, change the default active repository:

```typescript
import { supabaseAdapter } from './supabaseAdapter';
let activeRepository: IDataRepository = supabaseAdapter;
```

---

## 4. Tables and Row Level Security (RLS)

| Table | Purpose | Security Policy |
| :--- | :--- | :--- |
| `workers` | Artisan identity, skills, token credentials | Public read for QR pass verification; self-edit |
| `contractors` | Firm details, registration, active sites | Public read for verified contractors |
| `work_records` | Immutable shift & wage blocks with cryptographic hashes | Workers read own records; contractors manage site records |
| `disputes` | Structured wage claims & contractor responses | Visible to involved worker and contractor |
| `skills` | Verified artisan competency catalog | Public read; accredited contractors can endorse |
| `approval_requests` | Cross-device sign-offs for shifts, wages, and corrections | Addressed to specific worker or contractor |

---

## 5. Local Demo Mode Guarantees
While awaiting Supabase next week:
- **No Mock Database Duplication:** The app strictly utilizes a single authoritative dataset.
- **Persistent Storage:** Browser IndexedDB ensures changes survive page reloads and browser restarts.
- **Explicit Disclaimers:** All cross-device approval requests and network synchronization events display transparent disclaimers that they are currently client-side simulations.
