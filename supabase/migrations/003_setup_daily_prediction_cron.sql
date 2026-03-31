-- Schedule daily prediction recompute at 6:00 AM UTC
-- Uses pg_cron to trigger the Edge Function via pg_net
SELECT cron.schedule(
  'compute-predictions-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://kfcgzddikvkcorvtdmmt.supabase.co/functions/v1/compute-predictions',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
