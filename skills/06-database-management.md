# Database Management Skill

This document acts as an AI skill and rule-set for managing the Supabase database.

## 1. Database Structure Tracking
- The AI must always maintain an updated mental model or documentation of the current database schema (tables, types, columns, and relationships).
- If the schema changes, update the local documentation (e.g., `SCHEMA_ATUALIZADO.md` or equivalent) to reflect the new state.

## 1.5 Source of Truth (`auth.users`)
- **Crucial:** `auth.users` is the absolute source of truth for authentication data.
- NEVER duplicate fields from `auth.users` (like `email`, `id`) into custom tables like `profiles` unnecessarily.
- Custom user data must be kept in tables like `public.profiles`, which MUST reference `auth.users(id)` and ideally be populated via automatic Triggers on `auth.users` insertions.

## 2. Organized Migrations
- **Supabase Local Development:** When applying structural changes to the database, always generate migrations correctly using the Supabase CLI (`supabase migration new <name>`) or equivalent documented SQL files.
- **Naming Convention:** Migration files must be named clearly, indicating the purpose of the change (e.g., `20231110_create_users_table.sql`).
- **Idempotency:** Write SQL scripts that are idempotent when possible (e.g., `CREATE TABLE IF NOT EXISTS`, `OR REPLACE`).
- **Documentation:** Every migration must be documented in a comment block at the top of the SQL file explaining the changes made.

## 3. Security First Data Execution
- Before running any DDL operation (Create, Alter, Drop), verify how it affects existing data and RLS policies.
- Ensure that any new table receives its corresponding RLS policies in the same or subsequent migration before being exposed to the frontend.

## 4. Execution Workflow
1. List existing tables (`list_tables` tool if available, or query the schema).
2. Propose the schema change and generate the migration SQL.
3. Apply the migration using the appropriate tool (`apply_migration` or CLI).
4. Update the project's documentation to list the newly added tables, columns, and custom ENUM types.
