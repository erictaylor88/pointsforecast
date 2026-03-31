-- Enable pg_net for HTTP calls from SQL (invoke Edge Functions)
create extension if not exists pg_net with schema extensions;

-- Enable pg_cron for scheduled tasks
create extension if not exists pg_cron with schema pg_catalog;

-- Grant usage to postgres role
grant usage on schema net to postgres;
