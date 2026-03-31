-- PointsForecast Historical Bonus Seed Data
-- Sources: The Points Guy, Frequent Miler, Miles to Memories, Travel on Points
-- Scope: V1 issuers (Chase, Amex, Capital One) — Airline partners only
-- Date: 2026-03-30
--
-- Issuer IDs:
--   Chase:       18ff3431-a496-446d-8c9f-426a57d1394b
--   Amex:        471cfb8b-8021-49cd-9383-9f9c3f56e014
--   Capital One: d1cd54cd-90db-4b7d-b793-bfef30e60cba
--
-- Partner IDs (airlines only):
--   aer-lingus:      633c3b22-9179-4d6d-89ed-d04e837040b6
--   aeromexico:      c1ca9298-7962-4849-b81f-fbc7b0309163
--   aeroplan:        c4428ebe-6e5e-4c9f-9c0d-6421810adff9
--   british-airways: 91e86a3d-cdd4-4ed1-84df-08d6ac13204e
--   cathay-pacific:  a3c69059-ed06-477b-bc0a-2d3a509199c9
--   emirates:        100c11e0-2fdd-4952-a945-52ff05d4f68d
--   etihad:          23b9f84f-d5ec-45ad-a223-a8256a4a9fc6
--   flying-blue:     bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3
--   hawaiian:        d5605633-ae81-4720-b985-b87bc996fdc9
--   iberia:          de1a87ac-98eb-40dd-8c76-c5926bae1e66
--   jetblue:         d0b70734-5f71-4577-9317-71f02ae7aa6e
--   lifemiles:       e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b
--   qantas:          a3032b22-2095-40ab-a750-94297a249ef1
--   singapore:       b2e9c433-84fb-411e-b2b1-e0d5845c3b22
--   turkish:         3a9c04a4-5907-41d6-9f74-5ab0e78ac9b4
--   virgin-atlantic: e3cd986c-4f19-4fbb-9d4d-f459535aa2a4

-- Clear existing bonus data (fresh seed)
DELETE FROM bonuses;

-- ============================================================
-- AMERICAN EXPRESS MEMBERSHIP REWARDS — Airline Transfer Bonuses
-- ============================================================

-- Amex → Aer Lingus
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '633c3b22-9179-4d6d-89ed-d04e837040b6', 30, '2023-07-01', '2023-08-31', false, 'TPG', 'Avios program bonus'),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '633c3b22-9179-4d6d-89ed-d04e837040b6', 25, '2022-09-01', '2022-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '633c3b22-9179-4d6d-89ed-d04e837040b6', 40, '2021-09-01', '2021-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '633c3b22-9179-4d6d-89ed-d04e837040b6', 40, '2019-10-01', '2019-10-31', false, 'TPG', NULL);

-- Amex → Aeromexico
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'c1ca9298-7962-4849-b81f-fbc7b0309163', 20, '2022-09-01', '2022-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'c1ca9298-7962-4849-b81f-fbc7b0309163', 25, '2021-09-01', '2021-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'c1ca9298-7962-4849-b81f-fbc7b0309163', 25, '2019-02-01', '2019-02-28', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'c1ca9298-7962-4849-b81f-fbc7b0309163', 25, '2018-11-01', '2018-11-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'c1ca9298-7962-4849-b81f-fbc7b0309163', 20, '2015-03-01', '2015-03-31', false, 'TPG', NULL);

-- Amex → Air Canada Aeroplan
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'c4428ebe-6e5e-4c9f-9c0d-6421810adff9', 15, '2022-09-01', '2022-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'c4428ebe-6e5e-4c9f-9c0d-6421810adff9', 20, '2021-09-01', '2021-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'c4428ebe-6e5e-4c9f-9c0d-6421810adff9', 15, '2019-12-01', '2019-12-31', false, 'TPG', '10% to 20% tiered'),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'c4428ebe-6e5e-4c9f-9c0d-6421810adff9', 15, '2019-05-01', '2019-05-31', false, 'TPG', '10% to 20% tiered'),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'c4428ebe-6e5e-4c9f-9c0d-6421810adff9', 20, '2018-11-01', '2018-11-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'c4428ebe-6e5e-4c9f-9c0d-6421810adff9', 15, '2017-12-01', '2017-12-31', false, 'TPG', '10% to 20% tiered');

-- Amex → Flying Blue (Air France/KLM)
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 20, '2025-10-01', '2025-10-31', false, 'Miles to Memories', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 25, '2023-09-01', '2023-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 25, '2023-05-01', '2023-05-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 25, '2022-11-01', '2022-11-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 25, '2022-09-01', '2022-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 25, '2021-09-01', '2021-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 30, '2020-12-01', '2020-12-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 25, '2019-04-01', '2019-04-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 25, '2018-06-01', '2018-06-30', false, 'TPG', NULL);

-- Amex → Avianca LifeMiles
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2026-03-01', '2026-03-28', false, 'TPG', 'Active March 2026'),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2025-08-01', '2025-08-31', false, 'Miles to Memories', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2025-02-01', '2025-02-28', false, 'Miles to Memories', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2024-02-01', '2024-03-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2023-11-01', '2023-12-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2023-08-01', '2023-08-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2023-05-01', '2023-05-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2022-11-01', '2022-11-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2022-09-01', '2022-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2021-09-01', '2021-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2019-04-01', '2019-04-30', false, 'TPG', NULL);

-- Amex → British Airways
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 30, '2026-03-15', '2026-04-15', false, 'Frequent Miler', 'Avios bonus launched March 2026'),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 30, '2025-07-01', '2025-07-15', false, 'Miles to Memories', 'Avios program bonus'),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 30, '2025-04-01', '2025-04-30', false, 'Miles to Memories', 'Avios program bonus'),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 25, '2025-03-01', '2025-03-14', false, 'Miles to Memories', 'Avios program bonus'),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 30, '2023-07-01', '2023-08-31', false, 'TPG', 'Avios program bonus'),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 25, '2022-09-01', '2022-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 40, '2021-09-01', '2021-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 40, '2019-10-01', '2019-10-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 40, '2018-11-01', '2018-11-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 40, '2017-09-01', '2017-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 50, '2016-10-01', '2016-10-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 40, '2015-01-01', '2015-01-31', false, 'TPG', NULL);

-- Amex → Cathay Pacific
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'a3c69059-ed06-477b-bc0a-2d3a509199c9', 10, '2024-03-01', '2024-03-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'a3c69059-ed06-477b-bc0a-2d3a509199c9', 25, '2020-12-01', '2020-12-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'a3c69059-ed06-477b-bc0a-2d3a509199c9', 10, '2020-01-01', '2020-01-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'a3c69059-ed06-477b-bc0a-2d3a509199c9', 20, '2019-03-01', '2019-03-31', false, 'TPG', '10% to 30% tiered'),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'a3c69059-ed06-477b-bc0a-2d3a509199c9', 20, '2018-09-01', '2018-09-30', false, 'TPG', '10% to 30% tiered');

-- Amex → Emirates
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '100c11e0-2fdd-4952-a945-52ff05d4f68d', 25, '2018-11-01', '2018-11-30', false, 'TPG', NULL);

-- Amex → Etihad
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '23b9f84f-d5ec-45ad-a223-a8256a4a9fc6', 20, '2024-03-01', '2024-04-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', '23b9f84f-d5ec-45ad-a223-a8256a4a9fc6', 20, '2016-06-01', '2016-06-30', false, 'TPG', NULL);

-- Amex → Hawaiian
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd5605633-ae81-4720-b985-b87bc996fdc9', 20, '2023-01-01', '2023-01-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd5605633-ae81-4720-b985-b87bc996fdc9', 20, '2022-09-01', '2022-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd5605633-ae81-4720-b985-b87bc996fdc9', 25, '2021-09-01', '2021-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd5605633-ae81-4720-b985-b87bc996fdc9', 25, '2021-06-01', '2021-06-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd5605633-ae81-4720-b985-b87bc996fdc9', 25, '2018-06-01', '2018-06-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd5605633-ae81-4720-b985-b87bc996fdc9', 25, '2017-06-01', '2017-06-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd5605633-ae81-4720-b985-b87bc996fdc9', 25, '2016-06-01', '2016-06-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd5605633-ae81-4720-b985-b87bc996fdc9', 25, '2015-12-01', '2015-12-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd5605633-ae81-4720-b985-b87bc996fdc9', 20, '2014-06-01', '2014-06-30', false, 'TPG', NULL);

-- Amex → Iberia
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'de1a87ac-98eb-40dd-8c76-c5926bae1e66', 30, '2023-07-01', '2023-08-31', false, 'TPG', 'Avios program bonus'),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'de1a87ac-98eb-40dd-8c76-c5926bae1e66', 40, '2021-09-01', '2021-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'de1a87ac-98eb-40dd-8c76-c5926bae1e66', 40, '2019-10-01', '2019-10-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'de1a87ac-98eb-40dd-8c76-c5926bae1e66', 40, '2018-11-01', '2018-11-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'de1a87ac-98eb-40dd-8c76-c5926bae1e66', 50, '2016-12-01', '2016-12-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'de1a87ac-98eb-40dd-8c76-c5926bae1e66', 25, '2015-12-01', '2015-12-31', false, 'TPG', NULL);

-- Amex → JetBlue
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd0b70734-5f71-4577-9317-71f02ae7aa6e', 25, '2023-10-01', '2023-11-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd0b70734-5f71-4577-9317-71f02ae7aa6e', 25, '2019-12-01', '2019-12-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd0b70734-5f71-4577-9317-71f02ae7aa6e', 40, '2019-06-01', '2019-06-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd0b70734-5f71-4577-9317-71f02ae7aa6e', 25, '2018-10-01', '2018-10-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd0b70734-5f71-4577-9317-71f02ae7aa6e', 20, '2018-03-01', '2018-03-31', false, 'TPG', '10% to 30% tiered'),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd0b70734-5f71-4577-9317-71f02ae7aa6e', 25, '2017-11-01', '2017-11-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd0b70734-5f71-4577-9317-71f02ae7aa6e', 25, '2017-05-01', '2017-05-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'd0b70734-5f71-4577-9317-71f02ae7aa6e', 25, '2014-09-01', '2014-09-30', false, 'TPG', NULL);

-- Amex → Qantas
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'a3032b22-2095-40ab-a750-94297a249ef1', 20, '2022-09-01', '2022-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'a3032b22-2095-40ab-a750-94297a249ef1', 20, '2021-09-01', '2021-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'a3032b22-2095-40ab-a750-94297a249ef1', 20, '2020-02-01', '2020-02-29', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'a3032b22-2095-40ab-a750-94297a249ef1', 20, '2019-06-01', '2019-06-30', false, 'TPG', NULL);

-- Amex → Singapore
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'b2e9c433-84fb-411e-b2b1-e0d5845c3b22', 20, '2023-12-01', '2023-12-31', true, 'TPG', 'Targeted offer');

-- Amex → Virgin Atlantic
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2023-12-01', '2023-12-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2023-06-01', '2023-06-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2022-09-01', '2022-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2021-09-01', '2021-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2019-12-01', '2019-12-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2019-07-01', '2019-07-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2018-12-01', '2018-12-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 20, '2018-11-01', '2018-11-30', false, 'TPG', '10% to 30% tiered'),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2018-09-01', '2018-09-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2017-11-01', '2017-11-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2017-05-01', '2017-05-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2016-05-01', '2016-05-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 25, '2015-04-01', '2015-04-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 35, '2014-11-01', '2014-11-30', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2014-05-01', '2014-05-31', false, 'TPG', NULL),
('471cfb8b-8021-49cd-9383-9f9c3f56e014', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2013-11-01', '2013-11-30', false, 'TPG', NULL);

-- ============================================================
-- CHASE ULTIMATE REWARDS — Airline Transfer Bonuses
-- ============================================================

-- Chase → Aer Lingus
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('18ff3431-a496-446d-8c9f-426a57d1394b', '633c3b22-9179-4d6d-89ed-d04e837040b6', 20, '2026-03-01', '2026-03-31', false, 'TPG', 'Active March 2026 - Avios'),
('18ff3431-a496-446d-8c9f-426a57d1394b', '633c3b22-9179-4d6d-89ed-d04e837040b6', 30, '2025-10-01', '2025-10-31', false, 'Miles to Memories', 'Avios'),
('18ff3431-a496-446d-8c9f-426a57d1394b', '633c3b22-9179-4d6d-89ed-d04e837040b6', 30, '2024-10-01', '2024-10-31', false, 'LoyaltyLobby', 'Avios'),
('18ff3431-a496-446d-8c9f-426a57d1394b', '633c3b22-9179-4d6d-89ed-d04e837040b6', 30, '2023-09-01', '2023-09-22', false, 'TPG', 'Avios'),
('18ff3431-a496-446d-8c9f-426a57d1394b', '633c3b22-9179-4d6d-89ed-d04e837040b6', 30, '2021-09-01', '2021-09-30', false, 'TPG', 'Avios');

-- Chase → Air Canada Aeroplan
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('18ff3431-a496-446d-8c9f-426a57d1394b', 'c4428ebe-6e5e-4c9f-9c0d-6421810adff9', 25, '2025-12-01', '2026-01-05', false, 'Miles to Memories', 'Up to 25% tiered'),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'c4428ebe-6e5e-4c9f-9c0d-6421810adff9', 20, '2023-12-01', '2024-01-31', false, 'TPG', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'c4428ebe-6e5e-4c9f-9c0d-6421810adff9', 20, '2023-07-01', '2023-07-31', false, 'TPG', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'c4428ebe-6e5e-4c9f-9c0d-6421810adff9', 30, '2022-11-01', '2022-11-30', false, 'TPG', NULL);

-- Chase → Flying Blue (Air France/KLM)
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('18ff3431-a496-446d-8c9f-426a57d1394b', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 20, '2025-09-01', '2025-09-30', false, 'Miles to Memories', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 20, '2025-07-01', '2025-07-19', false, 'Miles to Memories', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 25, '2024-03-01', '2024-04-30', false, 'TPG', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 25, '2023-10-01', '2023-11-30', false, 'TPG', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 25, '2023-05-01', '2023-05-31', false, 'TPG', NULL);

-- Chase → British Airways
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('18ff3431-a496-446d-8c9f-426a57d1394b', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 20, '2026-03-01', '2026-03-31', false, 'TPG', 'Active March 2026 - Avios'),
('18ff3431-a496-446d-8c9f-426a57d1394b', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 30, '2025-10-01', '2025-10-31', false, 'Miles to Memories', 'Avios'),
('18ff3431-a496-446d-8c9f-426a57d1394b', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 30, '2024-10-01', '2024-10-31', false, 'LoyaltyLobby', 'Avios'),
('18ff3431-a496-446d-8c9f-426a57d1394b', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 30, '2023-09-01', '2023-09-22', false, 'TPG', 'Avios'),
('18ff3431-a496-446d-8c9f-426a57d1394b', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 30, '2021-09-01', '2021-09-30', false, 'TPG', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 30, '2020-12-01', '2020-12-31', false, 'TPG', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 30, '2019-06-01', '2019-06-30', false, 'TPG', NULL);

-- Chase → Iberia
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('18ff3431-a496-446d-8c9f-426a57d1394b', 'de1a87ac-98eb-40dd-8c76-c5926bae1e66', 20, '2026-03-05', '2026-03-31', false, 'Roame', 'Active March 2026 - Avios'),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'de1a87ac-98eb-40dd-8c76-c5926bae1e66', 30, '2025-10-01', '2025-10-31', false, 'Miles to Memories', 'Avios'),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'de1a87ac-98eb-40dd-8c76-c5926bae1e66', 30, '2023-09-01', '2023-09-22', false, 'TPG', 'Avios'),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'de1a87ac-98eb-40dd-8c76-c5926bae1e66', 30, '2021-09-01', '2021-09-30', false, 'TPG', NULL);

-- Chase → JetBlue
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('18ff3431-a496-446d-8c9f-426a57d1394b', 'd0b70734-5f71-4577-9317-71f02ae7aa6e', 25, '2023-11-01', '2024-01-31', false, 'TPG', NULL);

-- Chase → Virgin Atlantic
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('18ff3431-a496-446d-8c9f-426a57d1394b', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 40, '2026-02-01', '2026-02-28', false, 'TPG', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2025-12-01', '2025-12-05', false, 'Miles to Memories', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 40, '2025-11-01', '2025-11-20', false, 'Miles to Memories', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2025-10-01', '2025-10-18', false, 'Miles to Memories', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2023-10-01', '2023-11-30', false, 'TPG', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2023-05-01', '2023-06-30', false, 'TPG', NULL),
('18ff3431-a496-446d-8c9f-426a57d1394b', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2022-10-01', '2022-10-31', false, 'TPG', NULL);

-- Chase → Southwest
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('18ff3431-a496-446d-8c9f-426a57d1394b', 'a02d6e1a-f902-4dc9-af76-df2ee13dae62', 25, '2025-10-15', '2025-11-06', false, 'Miles to Memories', NULL);

-- Chase → Qantas
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('18ff3431-a496-446d-8c9f-426a57d1394b', 'a3032b22-2095-40ab-a750-94297a249ef1', 20, '2025-10-15', '2025-11-08', false, 'Miles to Memories', NULL);

-- Chase → Turkish
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('18ff3431-a496-446d-8c9f-426a57d1394b', '3a9c04a4-5907-41d6-9f74-5ab0e78ac9b4', 50, '2025-10-01', '2025-10-18', false, 'Miles to Memories', NULL);

-- Chase → LifeMiles (Avianca)
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('18ff3431-a496-446d-8c9f-426a57d1394b', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 25, '2025-10-01', '2025-10-18', false, 'Miles to Memories', NULL);

-- ============================================================
-- CAPITAL ONE — Airline Transfer Bonuses
-- ============================================================

-- Capital One → Aeromexico
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'c1ca9298-7962-4849-b81f-fbc7b0309163', 20, '2025-04-01', '2025-04-30', false, 'Miles to Memories', NULL),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'c1ca9298-7962-4849-b81f-fbc7b0309163', 25, '2021-08-01', '2021-08-31', false, 'TPG', NULL);

-- Capital One → Flying Blue
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 20, '2023-07-01', '2023-07-31', false, 'TPG', NULL),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 20, '2022-08-01', '2022-08-31', false, 'TPG', NULL),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 30, '2021-09-01', '2021-09-30', false, 'TPG', NULL),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'bc7a3f30-a20d-43fc-9e6e-3d644fab7bf3', 20, '2019-06-01', '2019-06-30', false, 'TPG', NULL);

-- Capital One → Avianca LifeMiles
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2025-08-01', '2025-08-31', false, 'Miles to Memories', NULL),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2023-09-01', '2023-09-30', false, 'TPG', NULL),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 25, '2021-07-01', '2021-07-31', false, 'TPG', NULL),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2020-12-01', '2020-12-31', false, 'TPG', NULL),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 25, '2019-07-01', '2019-07-31', false, 'TPG', NULL),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'e9d9fdfb-99f5-4e71-8e5f-1b88f80f111b', 15, '2019-06-01', '2019-06-30', false, 'TPG', NULL);

-- Capital One → British Airways
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 20, '2025-11-01', '2025-11-21', false, 'Miles to Memories', NULL),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 20, '2022-11-01', '2022-11-30', false, 'TPG', NULL),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 20, '2022-08-01', '2022-08-31', false, 'TPG', NULL),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', '91e86a3d-cdd4-4ed1-84df-08d6ac13204e', 33, '2021-08-01', '2021-08-31', false, 'TPG', NULL);

-- Capital One → Emirates
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', '100c11e0-2fdd-4952-a945-52ff05d4f68d', 100, '2019-03-01', '2019-03-31', false, 'TPG', 'Highest ever transfer bonus from any issuer');

-- Capital One → JetBlue
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'd0b70734-5f71-4577-9317-71f02ae7aa6e', 50, '2019-05-01', '2019-05-31', false, 'TPG', NULL);

-- Capital One → Virgin Atlantic (Virgin Red)
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2025-10-01', '2025-10-01', false, 'Miles to Memories', 'Virgin Red program'),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2023-03-01', '2023-03-31', false, 'TPG', 'Virgin Red program'),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'e3cd986c-4f19-4fbb-9d4d-f459535aa2a4', 30, '2022-10-01', '2022-10-31', false, 'TPG', 'Virgin Red program');

-- Capital One → Etihad
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', '23b9f84f-d5ec-45ad-a223-a8256a4a9fc6', 20, '2025-04-01', '2025-04-30', false, 'Miles to Memories', NULL),
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', '23b9f84f-d5ec-45ad-a223-a8256a4a9fc6', 40, '2025-03-01', '2025-03-31', false, 'Miles to Memories', 'Up to 40%');

-- Capital One → Qantas
INSERT INTO bonuses (issuer_id, partner_id, bonus_percentage, start_date, end_date, is_targeted, source, notes) VALUES
('d1cd54cd-90db-4b7d-b793-bfef30e60cba', 'a3032b22-2095-40ab-a750-94297a249ef1', 20, '2025-05-01', '2025-05-31', false, 'Miles to Memories', NULL);
