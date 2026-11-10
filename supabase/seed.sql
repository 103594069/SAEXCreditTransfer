-- Demo data for local development and moderated test sessions. Every demo account's
-- password is "demo-password". No real student data.

insert into public.home_institutions (id, name) values
  ('10000000-0000-0000-0000-000000000001', 'RMIT (demo)');

-- Demo sign-ins. GoTrue needs the token columns to be empty strings, not null.
with demo (id, email) as (
  values
    ('20000000-0000-0000-0000-000000000001'::uuid, 'student@rmit-demo.test'),
    ('20000000-0000-0000-0000-000000000002'::uuid, 'staff@rmit-demo.test'),
    ('20000000-0000-0000-0000-000000000003'::uuid, 'assessor@rmit-demo.test'),
    ('20000000-0000-0000-0000-000000000004'::uuid, 'admin@rmit-demo.test'),
    ('20000000-0000-0000-0000-000000000005'::uuid, 'operator@saex-demo.test'),
    ('20000000-0000-0000-0000-000000000006'::uuid, 'staff.admin@rmit-demo.test')
)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new
)
select
  '00000000-0000-0000-0000-000000000000', id, 'authenticated', 'authenticated', email,
  extensions.crypt('demo-password', extensions.gen_salt('bf')), now(),
  '{"provider": "email", "providers": ["email"]}', '{}', now(), now(),
  '', '', '', ''
from demo;

insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), u.id, u.id::text, 'email',
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  now(), now(), now()
from auth.users u
where u.email like '%-demo.test';

insert into public.user_accounts (id, email, display_name, home_institution_id, active_role) values
  ('20000000-0000-0000-0000-000000000001', 'student@rmit-demo.test', 'Priya Sharma', '10000000-0000-0000-0000-000000000001', 'Student'),
  ('20000000-0000-0000-0000-000000000002', 'staff@rmit-demo.test', 'Tom Walker', '10000000-0000-0000-0000-000000000001', 'Staff'),
  ('20000000-0000-0000-0000-000000000003', 'assessor@rmit-demo.test', 'Dr Helen Park', '10000000-0000-0000-0000-000000000001', 'Assessor'),
  ('20000000-0000-0000-0000-000000000004', 'admin@rmit-demo.test', 'Grace Liu', '10000000-0000-0000-0000-000000000001', 'Institution Admin'),
  ('20000000-0000-0000-0000-000000000005', 'operator@saex-demo.test', 'Sam Operator', null, 'Operator'),
  ('20000000-0000-0000-0000-000000000006', 'staff.admin@rmit-demo.test', 'Jordan Ellis', '10000000-0000-0000-0000-000000000001', 'Staff');

insert into public.user_roles (user_id, role) values
  ('20000000-0000-0000-0000-000000000001', 'Student'),
  ('20000000-0000-0000-0000-000000000002', 'Staff'),
  ('20000000-0000-0000-0000-000000000003', 'Assessor'),
  ('20000000-0000-0000-0000-000000000004', 'Institution Admin'),
  ('20000000-0000-0000-0000-000000000005', 'Operator'),
  ('20000000-0000-0000-0000-000000000006', 'Staff'),
  ('20000000-0000-0000-0000-000000000006', 'Institution Admin');
