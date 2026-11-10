-- Accounts, roles and Home Institutions: the foundation every later table builds on.
-- Access rules are row-level security; the domain code never relies on them alone,
-- and the Credit Approval service checks the active role on every command too.

create type public.app_role as enum ('Student', 'Staff', 'Assessor', 'Institution Admin', 'Operator');

create table public.home_institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- One row per person who can sign in. Roles other than Operator are held at
-- home_institution_id; an Operator-only account has none.
create table public.user_accounts (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text not null,
  home_institution_id uuid references public.home_institutions (id),
  active_role public.app_role not null
);

create table public.user_roles (
  user_id uuid not null references public.user_accounts (id) on delete cascade,
  role public.app_role not null,
  primary key (user_id, role)
);

-- Demo Outbox: the demo Notifier stores emails here instead of delivering them.
create table public.demo_outbox (
  id bigint generated always as identity primary key,
  to_address text not null,
  subject text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.home_institutions enable row level security;
alter table public.user_accounts enable row level security;
alter table public.user_roles enable row level security;
alter table public.demo_outbox enable row level security;

-- Signed-in users may change only their own active role, and only to a role they hold.
revoke all on public.home_institutions, public.user_accounts, public.user_roles, public.demo_outbox from anon, authenticated;
grant select on public.home_institutions, public.user_accounts, public.user_roles to authenticated;
grant update (active_role) on public.user_accounts to authenticated;
grant insert (to_address, subject, body) on public.demo_outbox to authenticated;

create policy "read own account" on public.user_accounts
  for select to authenticated using (id = (select auth.uid()));

create policy "switch own active role to a held role" on public.user_accounts
  for update to authenticated
  using (id = (select auth.uid()))
  with check (
    id = (select auth.uid())
    and exists (
      select 1 from public.user_roles r
      where r.user_id = (select auth.uid()) and r.role = user_accounts.active_role
    )
  );

create policy "read own roles" on public.user_roles
  for select to authenticated using (user_id = (select auth.uid()));

-- A user sees their own Home Institution; the Operator sees every Home Institution's name.
create policy "read own or, as Operator, every Home Institution" on public.home_institutions
  for select to authenticated using (
    id = (select a.home_institution_id from public.user_accounts a where a.id = (select auth.uid()))
    or exists (
      select 1 from public.user_roles r
      where r.user_id = (select auth.uid()) and r.role = 'Operator'
    )
  );

create policy "queue demo emails" on public.demo_outbox
  for insert to authenticated with check (true);
