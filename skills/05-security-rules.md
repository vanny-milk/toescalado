# Security Rules

This document outlines the strict security practices that must be followed during the development of ToEscalado.

## 1. Database Security (Supabase)
- **Row Level Security (RLS):** RLS MUST be enabled on every table created in the database.
- **Policies:** Explicit policies (Select, Insert, Update, Delete) must be defined to restrict data access to authenticated users or specific roles. Never create tables with open public access unless strictly intended by the business logic.

## 2. Environment Variables & Secrets
- **No Hardcoded Secrets:** Never hardcode sensitive keys, JWT secrets, database passwords, or service role keys in the source code.
- **Frontend Variables:** Only use variables prefixed with `VITE_` (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) for public keys that the frontend needs.
- **Backend Variables:** Any `service_role` keys or private API keys must be kept exclusively in server environments (e.g., Supabase Edge Functions or a Node.js backend) and accessed securely.

## 3. Data Validation & Injection Prevention
- **Inputs:** Always validate user inputs on both the frontend (for UX) and backend (for security).
- **No SQL Injection:** Since we use Supabase JS, always use the built-in query builder methods (`.select()`, `.insert()`, etc.) which automatically parameterize queries. Do not construct raw SQL strings concatenating user input.
- **XSS Prevention:** React automatically escapes string variables in the DOM. Do not use `dangerouslySetInnerHTML` unless explicitly required and the input is fully sanitized using a library like DOMPurify.

## 4. Query Policies (Absolute Rules)
- **NO queries in loops:** Never run a `.select()` inside a `.forEach()` or loop.
- **NO queries in render:** Never run queries directly inside component rendering bodies.
- **NO select *:** Always fetch only the necessary fields (e.g., `.select('id, full_name')`).
- **Access Control:** Never access Supabase directly from UI components. Always use a dedicated service layer or server action.
