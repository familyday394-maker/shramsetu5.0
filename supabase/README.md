# Supabase Configuration & Migrations

This folder contains the PostgreSQL migrations and seed scripts for Shram Setu 2.0.

- `migrations/20261024000000_shram_setu_initial_schema.sql`: Full schema with RLS policies, indexes, and constraints.
- `seed.sql`: Authoritative demonstration dataset.

### Current Status: Local Demo Mode (IndexedDB)
Supabase backend provisioning is scheduled for next week. Until then, Shram Setu 2.0 runs locally using IndexedDB with the identical data models and repository contracts.

For complete setup instructions, refer to `docs/SUPABASE_SETUP.md`.
