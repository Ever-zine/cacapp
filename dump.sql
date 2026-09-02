SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict n8U9ecZyEeBcorYydXtAadeXHmtF7lMA4LtpNCL5iSQjqhtQMyrpqpKRHwKZqpE

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('17d2b88c-ce43-4460-aab8-f4a76ef918e7', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '86bcce6a-5eb3-4254-a5c4-af5fc06ece9c', 's256', 'gQJoiCXOecyq1BoqY8TF8lvvsMbyV4qOF4bqdWFinu8', 'email', '', '', '2026-01-01 15:13:29.567669+00', '2026-01-01 15:14:03.624644+00', 'email/signup', '2026-01-01 15:14:03.624596+00'),
	('bf10aea3-2b05-4a65-bc90-9a3caf392048', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '04cf84ed-6957-405b-92e3-8ef597080932', 's256', 'YdMRHDbueRGCGQhb2oJXoFE4pV36tR6pQxY80L1JK6c', 'email', '', '', '2026-01-01 15:46:04.506845+00', '2026-01-01 15:46:23.856613+00', 'email/signup', '2026-01-01 15:46:23.856575+00'),
	('32971eee-00f2-4b21-bd94-4ec5f5a63cdd', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'c032034d-a32f-4623-bdb5-5dbd7bf25958', 's256', 'stuPETYXxVNj-BYRP6zEc_EcHQ1bqqtmOOm_bxitHfI', 'email', '', '', '2026-01-01 15:50:03.139077+00', '2026-01-01 15:50:50.339751+00', 'email/signup', '2026-01-01 15:50:50.339714+00'),
	('251de5bc-e6a5-45f1-8475-dbf2f178793f', 'c29e4c4a-a262-40fe-b04b-f3dde775c335', '3aaf1b12-e631-4ad4-993a-8e45a349da78', 's256', 'vZJ83I8z4y1WEU23zk9X6Bl5TsDVxM4M-vp6GlwSTFQ', 'email', '', '', '2026-01-31 20:00:42.325908+00', '2026-01-31 20:05:17.69456+00', 'email/signup', '2026-01-31 20:05:17.694518+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'authenticated', 'authenticated', 'tevtv@proton.me', '$2a$10$61tiRX9dS99ESAn7/bSvPOmQhMDdu9B4y99a77froFJcpY75k/qju', '2026-01-01 15:14:03.562737+00', NULL, '', '2026-01-01 15:13:29.574426+00', '', NULL, '', '', NULL, '2026-01-25 21:18:36.684829+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "dd7deade-0e16-4a0e-b0d7-716b306a0120", "email": "tevtv@proton.me", "email_verified": true, "phone_verified": false}', NULL, '2026-01-01 15:13:29.514084+00', '2026-01-31 19:55:58.569643+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'authenticated', 'authenticated', 'louis.jacquin73@gmail.com', '$2a$10$BKZX1ehIM5RaS8z2sr8TjutRww6sy8/U7QQdc.O.uoyF0JTP7AMJq', '2026-01-01 15:50:50.334745+00', NULL, '', '2026-01-01 15:50:03.140634+00', '', NULL, '', '', NULL, '2026-01-01 15:51:56.94224+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "d59fc3f7-d2e7-4cd4-9c99-532c237a4979", "email": "louis.jacquin73@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-01-01 15:50:03.132243+00', '2026-01-31 19:56:53.639223+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', 'authenticated', 'authenticated', 'garolucie@gmail.com', '$2a$10$1JbSAGiTMt15g9TeVwaw4uZHGKIV40/cfKIhnF6xyYJHHrDT7lUk2', '2026-01-01 15:46:23.85121+00', NULL, '', '2026-01-01 15:46:04.516522+00', '', NULL, '', '', NULL, '2026-01-01 15:46:58.629605+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "1ec3a70b-9568-4447-9113-00d5f54f6d8f", "email": "garolucie@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-01-01 15:46:04.475851+00', '2026-01-31 19:58:22.977924+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c29e4c4a-a262-40fe-b04b-f3dde775c335', 'authenticated', 'authenticated', 'ava.david1302@gmail.com', '$2a$10$8UBVYSoPCdqXpiWez84MvO4rDqs7ivI3jm7kR4kZexulwjPnCjV3.', '2026-01-31 20:05:17.68608+00', NULL, '', '2026-01-31 20:00:42.344469+00', '', NULL, '', '', NULL, '2026-01-31 20:05:23.065741+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "c29e4c4a-a262-40fe-b04b-f3dde775c335", "email": "ava.david1302@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-01-31 20:00:42.28907+00', '2026-01-31 21:52:57.212118+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('dd7deade-0e16-4a0e-b0d7-716b306a0120', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '{"sub": "dd7deade-0e16-4a0e-b0d7-716b306a0120", "email": "tevtv@proton.me", "email_verified": true, "phone_verified": false}', 'email', '2026-01-01 15:13:29.551424+00', '2026-01-01 15:13:29.551479+00', '2026-01-01 15:13:29.551479+00', 'ba680d4f-c7f4-47f7-ac27-2983aaccb469'),
	('1ec3a70b-9568-4447-9113-00d5f54f6d8f', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '{"sub": "1ec3a70b-9568-4447-9113-00d5f54f6d8f", "email": "garolucie@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-01-01 15:46:04.501947+00', '2026-01-01 15:46:04.502002+00', '2026-01-01 15:46:04.502002+00', 'b34c5ac3-4782-488b-89cd-42bc3b9d32f4'),
	('d59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '{"sub": "d59fc3f7-d2e7-4cd4-9c99-532c237a4979", "email": "louis.jacquin73@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-01-01 15:50:03.136293+00', '2026-01-01 15:50:03.136342+00', '2026-01-01 15:50:03.136342+00', '8881cc49-4ad3-4bca-a87b-f33f67e44046'),
	('c29e4c4a-a262-40fe-b04b-f3dde775c335', 'c29e4c4a-a262-40fe-b04b-f3dde775c335', '{"sub": "c29e4c4a-a262-40fe-b04b-f3dde775c335", "email": "ava.david1302@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-01-31 20:00:42.318591+00', '2026-01-31 20:00:42.318648+00', '2026-01-31 20:00:42.318648+00', '13eb1b38-583c-4ff6-951a-32bc87d3c84f');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('daaeb5e8-9335-47f0-b3ee-7a78aea5a9d9', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-01 15:40:40.965157+00', '2026-01-01 15:40:40.965157+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0', '92.143.55.115', NULL, NULL, NULL, NULL, NULL),
	('1e5f6439-8c0c-4bcd-b3d8-b3e9fabe9aa0', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-01 15:14:18.778108+00', '2026-01-01 16:17:43.306324+00', NULL, 'aal1', NULL, '2026-01-01 16:17:43.306215', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0', '92.143.55.115', NULL, NULL, NULL, NULL, NULL),
	('365e5818-ca73-401a-9aed-f414aa35c028', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-01 15:43:19.261729+00', '2026-01-01 16:44:42.700488+00', NULL, 'aal1', NULL, '2026-01-01 16:44:42.697559', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', '66.234.146.41', NULL, NULL, NULL, NULL, NULL),
	('eaba6db4-0cfe-44ce-9e01-fdd12d99e66c', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-20 22:13:05.867948+00', '2026-01-20 22:13:05.867948+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '159.26.112.43', NULL, NULL, NULL, NULL, NULL),
	('d6b76a10-178c-4dd0-b073-be472c11efd6', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-20 08:52:28.813121+00', '2026-01-31 19:55:58.572995+00', NULL, 'aal1', NULL, '2026-01-31 19:55:58.572301', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '159.26.112.25', NULL, NULL, NULL, NULL, NULL),
	('4981347f-b924-45af-aebf-b93d1ee107fc', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-01 15:51:56.947361+00', '2026-01-31 19:56:53.640425+00', NULL, 'aal1', NULL, '2026-01-31 19:56:53.64032', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '77.204.106.147', NULL, NULL, NULL, NULL, NULL),
	('b198bd5f-2aa3-4c7b-b49f-46a56202a1e0', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-01 15:46:58.629732+00', '2026-01-31 19:58:22.979453+00', NULL, 'aal1', NULL, '2026-01-31 19:58:22.979354', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '78.242.89.57', NULL, NULL, NULL, NULL, NULL),
	('db15aaa2-76a3-4fda-9b3c-bbcca236616f', 'c29e4c4a-a262-40fe-b04b-f3dde775c335', '2026-01-31 20:05:23.065842+00', '2026-01-31 21:52:57.215155+00', NULL, 'aal1', NULL, '2026-01-31 21:52:57.215047', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Mobile Safari/537.36', '92.184.112.59', NULL, NULL, NULL, NULL, NULL),
	('4fae4686-a8cb-4719-ba7b-d465f7c1c4b6', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-25 21:18:36.684941+00', '2026-01-25 21:18:36.684941+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0', '92.143.55.115', NULL, NULL, NULL, NULL, NULL),
	('f847f57b-ebfe-4063-b37b-5aa29d2291c3', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-01 16:44:42.67218+00', '2026-01-19 21:05:02.83092+00', NULL, 'aal1', NULL, '2026-01-19 21:05:02.8308', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '159.26.112.48', NULL, NULL, NULL, NULL, NULL),
	('2036b385-ae7b-4129-898e-d3ca1906e916', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-19 21:06:50.290997+00', '2026-01-20 08:52:28.742962+00', NULL, 'aal1', NULL, '2026-01-20 08:52:28.741765', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1', '159.26.112.43', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('1e5f6439-8c0c-4bcd-b3d8-b3e9fabe9aa0', '2026-01-01 15:14:18.840363+00', '2026-01-01 15:14:18.840363+00', 'password', '6dd264f9-a594-416e-8d64-8ad5b38a6f63'),
	('daaeb5e8-9335-47f0-b3ee-7a78aea5a9d9', '2026-01-01 15:40:41.012739+00', '2026-01-01 15:40:41.012739+00', 'password', 'c9dcab4c-ba0a-45ae-bc5f-c8cf9739fc96'),
	('365e5818-ca73-401a-9aed-f414aa35c028', '2026-01-01 15:43:19.267049+00', '2026-01-01 15:43:19.267049+00', 'password', '8a5b3fb2-b596-4376-93d6-dedce35f877e'),
	('b198bd5f-2aa3-4c7b-b49f-46a56202a1e0', '2026-01-01 15:46:58.634501+00', '2026-01-01 15:46:58.634501+00', 'password', '411718d1-53c6-464c-be1a-31baca9a696f'),
	('4981347f-b924-45af-aebf-b93d1ee107fc', '2026-01-01 15:51:57.010939+00', '2026-01-01 15:51:57.010939+00', 'password', 'b0de023b-6b3c-4196-a420-06df816d7c50'),
	('f847f57b-ebfe-4063-b37b-5aa29d2291c3', '2026-01-01 16:44:42.705816+00', '2026-01-01 16:44:42.705816+00', 'password', '8f34fa64-4d51-40c4-81d1-bad62e989e8c'),
	('2036b385-ae7b-4129-898e-d3ca1906e916', '2026-01-19 21:06:50.302496+00', '2026-01-19 21:06:50.302496+00', 'password', 'eed4430a-9e78-4c9c-a1af-e5cf2fd77873'),
	('d6b76a10-178c-4dd0-b073-be472c11efd6', '2026-01-20 08:52:28.826986+00', '2026-01-20 08:52:28.826986+00', 'password', '94c903eb-b355-4d43-a1ea-4c3f1a46c21f'),
	('eaba6db4-0cfe-44ce-9e01-fdd12d99e66c', '2026-01-20 22:13:05.886733+00', '2026-01-20 22:13:05.886733+00', 'password', '8d9cac77-603d-4051-ac41-9420ae7ecd9e'),
	('4fae4686-a8cb-4719-ba7b-d465f7c1c4b6', '2026-01-25 21:18:36.760911+00', '2026-01-25 21:18:36.760911+00', 'password', '3fc2c16a-67a8-438c-9224-6b12bf08a011'),
	('db15aaa2-76a3-4fda-9b3c-bbcca236616f', '2026-01-31 20:05:23.079828+00', '2026-01-31 20:05:23.079828+00', 'password', 'f727f447-68a4-45ed-9425-48983f8cc5cd');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 2, 'wv25j6b2m55q', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', false, '2026-01-01 15:40:40.995614+00', '2026-01-01 15:40:40.995614+00', NULL, 'daaeb5e8-9335-47f0-b3ee-7a78aea5a9d9'),
	('00000000-0000-0000-0000-000000000000', 1, '5rfzlznajs7n', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-01 15:14:18.811535+00', '2026-01-01 16:17:43.280368+00', NULL, '1e5f6439-8c0c-4bcd-b3d8-b3e9fabe9aa0'),
	('00000000-0000-0000-0000-000000000000', 6, 'jzzuu242lxcs', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', false, '2026-01-01 16:17:43.292853+00', '2026-01-01 16:17:43.292853+00', '5rfzlznajs7n', '1e5f6439-8c0c-4bcd-b3d8-b3e9fabe9aa0'),
	('00000000-0000-0000-0000-000000000000', 3, 'mmx4zs4xwvsq', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-01 15:43:19.264211+00', '2026-01-01 16:44:42.642416+00', NULL, '365e5818-ca73-401a-9aed-f414aa35c028'),
	('00000000-0000-0000-0000-000000000000', 7, 'saub5oxcqcwm', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', false, '2026-01-01 16:44:42.657513+00', '2026-01-01 16:44:42.657513+00', 'mmx4zs4xwvsq', '365e5818-ca73-401a-9aed-f414aa35c028'),
	('00000000-0000-0000-0000-000000000000', 5, 'icxmpjrsrzpq', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-01 15:51:56.986223+00', '2026-01-01 17:10:48.560141+00', NULL, '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 8, 'xdhg33zmebbg', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-01 16:44:42.687413+00', '2026-01-01 19:23:03.209737+00', NULL, 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 9, '7tbp7ejqxgrz', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-01 17:10:48.578181+00', '2026-01-01 21:20:16.010301+00', 'icxmpjrsrzpq', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 10, 'iezvy3djaf4v', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-01 19:23:03.234354+00', '2026-01-01 21:40:18.97338+00', 'xdhg33zmebbg', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 12, '7wiqdtcqeacx', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-01 21:40:18.987665+00', '2026-01-02 09:53:08.414516+00', 'iezvy3djaf4v', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 13, 'znoy5wdycoqn', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-02 09:53:08.435207+00', '2026-01-02 11:14:31.006648+00', '7wiqdtcqeacx', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 14, 'xpfkpsdkavqd', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-02 11:14:31.028394+00', '2026-01-02 12:47:35.958908+00', 'znoy5wdycoqn', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 4, 'kk7wiztwnluf', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-01 15:46:58.631982+00', '2026-01-02 17:38:25.65832+00', NULL, 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 15, '7vgbhsalrhwt', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-02 12:47:35.976236+00', '2026-01-02 19:14:40.656469+00', 'xpfkpsdkavqd', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 17, 'biclgfzrp4s7', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-02 19:14:40.670514+00', '2026-01-03 08:30:44.566939+00', '7vgbhsalrhwt', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 11, 'xadzszx2tttc', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-01 21:20:16.027697+00', '2026-01-03 10:47:24.902395+00', '7tbp7ejqxgrz', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 16, 'oc2fynmgo4bd', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-02 17:38:25.685955+00', '2026-01-03 11:59:00.189769+00', 'kk7wiztwnluf', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 18, 'eufwdldqhudh', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-03 08:30:44.59408+00', '2026-01-03 13:49:07.479307+00', 'biclgfzrp4s7', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 21, 'av7koduv2nog', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-03 13:49:07.509439+00', '2026-01-03 15:32:06.041162+00', 'eufwdldqhudh', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 19, 'utliu6ec3o7j', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-03 10:47:24.919704+00', '2026-01-03 17:04:11.663266+00', 'xadzszx2tttc', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 23, 'pitpmurilewu', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-03 17:04:11.687232+00', '2026-01-03 19:15:50.74672+00', 'utliu6ec3o7j', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 20, 'rf4esxq4wurq', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-03 11:59:00.203333+00', '2026-01-04 19:08:56.158591+00', 'oc2fynmgo4bd', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 22, 'sw6vn6isfbx3', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-03 15:32:06.062165+00', '2026-01-05 08:23:22.159469+00', 'av7koduv2nog', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 26, 'q7ovmc32dzr4', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-05 08:23:22.184849+00', '2026-01-05 13:07:29.596976+00', 'sw6vn6isfbx3', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 24, 'symbtnqph5lq', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-03 19:15:50.762551+00', '2026-01-05 13:27:50.233357+00', 'pitpmurilewu', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 25, 'mj5ilvkcgpq7', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-04 19:08:56.18417+00', '2026-01-05 13:53:11.55474+00', 'rf4esxq4wurq', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 28, 'ww5gkj5cwe5s', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-05 13:27:50.240856+00', '2026-01-05 18:27:08.953315+00', 'symbtnqph5lq', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 27, 'mamrll3v7mlm', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-05 13:07:29.615998+00', '2026-01-05 18:48:28.413374+00', 'q7ovmc32dzr4', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 30, 'wb2lp7g25w76', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-05 18:27:08.979188+00', '2026-01-05 21:24:10.119384+00', 'ww5gkj5cwe5s', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 31, 'z7ffg6mzkncf', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-05 18:48:28.420735+00', '2026-01-05 22:40:40.231685+00', 'mamrll3v7mlm', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 33, '544sgnrsqdct', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-05 22:40:40.250995+00', '2026-01-06 08:52:03.902958+00', 'z7ffg6mzkncf', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 34, 'rueer4ytflo3', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-06 08:52:03.930465+00', '2026-01-06 10:15:33.920591+00', '544sgnrsqdct', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 35, 'h5hepvozi2l3', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-06 10:15:33.936076+00', '2026-01-06 13:37:31.014016+00', 'rueer4ytflo3', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 36, 'qkeh6nu3djqs', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-06 13:37:31.036962+00', '2026-01-06 17:31:23.474523+00', 'h5hepvozi2l3', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 29, 'ql7jiwxvwleq', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-05 13:53:11.572531+00', '2026-01-06 22:34:17.909458+00', 'mj5ilvkcgpq7', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 37, 'm2zhx2t3vysr', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-06 17:31:23.505439+00', '2026-01-07 09:08:29.038973+00', 'qkeh6nu3djqs', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 39, '3lb5mulu35ki', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-07 09:08:29.072171+00', '2026-01-07 13:34:52.673716+00', 'm2zhx2t3vysr', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 40, '5jfzt7644nnf', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-07 13:34:52.689901+00', '2026-01-07 17:46:06.371678+00', '3lb5mulu35ki', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 38, 'xyrlme2tigod', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-06 22:34:17.926424+00', '2026-01-07 17:49:19.591396+00', 'ql7jiwxvwleq', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 41, 'oij2moxbzyy4', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-07 17:46:06.389198+00', '2026-01-08 08:51:28.491302+00', '5jfzt7644nnf', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 42, '5wfjczbynagm', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-07 17:49:19.593063+00', '2026-01-08 18:01:19.672334+00', 'xyrlme2tigod', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 43, 't6uju3rrkob3', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-08 08:51:28.522717+00', '2026-01-08 20:12:49.648038+00', 'oij2moxbzyy4', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 45, 'ryqsmaubdv6u', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-08 20:12:49.677788+00', '2026-01-09 09:55:41.119141+00', 't6uju3rrkob3', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 46, '6swn4byvpw5y', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-09 09:55:41.144838+00', '2026-01-09 13:45:11.148035+00', 'ryqsmaubdv6u', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 44, 'jrnthua2l4db', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-08 18:01:19.707664+00', '2026-01-09 22:10:43.783738+00', '5wfjczbynagm', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 48, 'bxb7epkhvtzh', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-09 22:10:43.814722+00', '2026-01-10 10:53:22.073882+00', 'jrnthua2l4db', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 47, '76w6vcxrayyd', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-09 13:45:11.162192+00', '2026-01-10 16:46:24.318544+00', '6swn4byvpw5y', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 49, 'v3uig7hcanzd', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-10 10:53:22.104442+00', '2026-01-11 09:35:49.905382+00', 'bxb7epkhvtzh', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 50, '2mzxieqvkoav', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-10 16:46:24.338416+00', '2026-01-12 09:21:27.387002+00', '76w6vcxrayyd', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 32, '4hsiifzqnxai', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-05 21:24:10.141117+00', '2026-01-12 17:08:59.870295+00', 'wb2lp7g25w76', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 68, 'qib3mu7h264e', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-17 11:19:30.272444+00', '2026-01-17 19:03:17.749959+00', 'vuq74molazm2', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 69, 'qx46js6nwejs', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-17 19:03:17.771637+00', '2026-01-17 23:49:17.941271+00', 'qib3mu7h264e', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 51, '2t5dt3neauov', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-11 09:35:49.940565+00', '2026-01-12 18:27:46.925821+00', 'v3uig7hcanzd', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 70, '6ltv2fzaobdm', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-17 23:49:17.961974+00', '2026-01-18 12:55:57.349643+00', 'qx46js6nwejs', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 52, '5lktwusdgvci', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-12 09:21:27.416149+00', '2026-01-12 22:59:23.832874+00', '2mzxieqvkoav', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 55, 'rx37vqmfoqjc', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-12 22:59:23.86588+00', '2026-01-13 09:26:17.272477+00', '5lktwusdgvci', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 71, '5dh5yhx7hmhw', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-18 12:55:57.380453+00', '2026-01-18 15:18:45.604149+00', '6ltv2fzaobdm', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 54, 'mohqkvpnzp5u', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-12 18:27:46.94416+00', '2026-01-13 17:42:12.109256+00', '2t5dt3neauov', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 56, 'ios4j2flgu5k', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-13 09:26:17.305654+00', '2026-01-14 08:51:54.286311+00', 'rx37vqmfoqjc', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 72, 'qnlgvn7c7nnk', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-18 15:18:45.62537+00', '2026-01-18 16:33:04.768486+00', '5dh5yhx7hmhw', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 58, 'ac2e4vg25ozz', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-14 08:51:54.313319+00', '2026-01-14 14:46:07.693011+00', 'ios4j2flgu5k', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 57, 'i5vpnhjrez6e', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-13 17:42:12.129781+00', '2026-01-14 18:10:19.597423+00', 'mohqkvpnzp5u', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 67, 'mezi7lfo67xv', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-17 09:51:59.702681+00', '2026-01-18 17:10:50.194939+00', 'jol46cxhi7aa', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 59, '62zwfsugy7n7', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-14 14:46:07.716347+00', '2026-01-15 08:46:09.376546+00', 'ac2e4vg25ozz', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 61, 'ye4cexx62nvz', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-15 08:46:09.40849+00', '2026-01-15 17:45:18.99056+00', '62zwfsugy7n7', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 64, 'k3pn22snh4po', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-16 17:17:27.318706+00', '2026-01-18 19:34:02.747457+00', 'agufo7hw42ib', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 62, '5lqd52u6rv4n', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-15 17:45:19.011562+00', '2026-01-16 08:48:26.977308+00', 'ye4cexx62nvz', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 60, 'agufo7hw42ib', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-14 18:10:19.614685+00', '2026-01-16 17:17:27.299247+00', 'i5vpnhjrez6e', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 63, '6konwg52qtbl', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-16 08:48:27.010913+00', '2026-01-17 01:04:07.924726+00', '5lqd52u6rv4n', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 74, 'njyj3fjihsjq', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-18 17:10:50.213033+00', '2026-01-18 20:05:16.831629+00', 'mezi7lfo67xv', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 53, 'qezdbcfgny23', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-12 17:08:59.898637+00', '2026-01-17 09:09:49.847863+00', '4hsiifzqnxai', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 65, 'jol46cxhi7aa', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-17 01:04:07.940614+00', '2026-01-17 09:51:59.683333+00', '6konwg52qtbl', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 66, 'vuq74molazm2', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-17 09:09:49.880509+00', '2026-01-17 11:19:30.252593+00', 'qezdbcfgny23', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 76, 'yxb4vwrkb67o', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-18 20:05:16.84635+00', '2026-01-19 08:41:12.03628+00', 'njyj3fjihsjq', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 75, '3rrmofcobxqr', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-18 19:34:02.760561+00', '2026-01-19 17:34:05.837784+00', 'k3pn22snh4po', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 78, 'w255a3sfp56m', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-19 17:34:05.855111+00', '2026-01-19 20:36:51.470517+00', '3rrmofcobxqr', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 77, 'jxl5u73uwkrf', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-19 08:41:12.065136+00', '2026-01-19 21:05:02.797446+00', 'yxb4vwrkb67o', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 80, '4lnkuhaej2b7', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-19 21:05:02.807643+00', '2026-01-19 21:06:50.184217+00', 'jxl5u73uwkrf', 'f847f57b-ebfe-4063-b37b-5aa29d2291c3'),
	('00000000-0000-0000-0000-000000000000', 81, 'uuygpq37qbm3', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-19 21:06:50.30054+00', '2026-01-20 08:52:28.695801+00', NULL, '2036b385-ae7b-4129-898e-d3ca1906e916'),
	('00000000-0000-0000-0000-000000000000', 82, 'ikilxf7ifzfy', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', false, '2026-01-20 08:52:28.707216+00', '2026-01-20 08:52:28.707216+00', 'uuygpq37qbm3', '2036b385-ae7b-4129-898e-d3ca1906e916'),
	('00000000-0000-0000-0000-000000000000', 73, 'f7yfgofkut6z', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-18 16:33:04.785874+00', '2026-01-20 10:01:35.779215+00', 'qnlgvn7c7nnk', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 83, 'mvzespvgh7y6', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-20 08:52:28.82373+00', '2026-01-20 11:24:22.24835+00', NULL, 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 79, 'h7e6asf2pmv5', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-19 20:36:51.487538+00', '2026-01-20 13:22:54.265748+00', 'w255a3sfp56m', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 86, 'hkdtoxfn7oiw', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-20 13:22:54.29103+00', '2026-01-20 17:43:48.511732+00', 'h7e6asf2pmv5', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 85, 'xu6s2lcp3yqu', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-20 11:24:22.270839+00', '2026-01-20 22:13:05.82542+00', 'mvzespvgh7y6', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 89, 'beh5isib4fkx', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', false, '2026-01-20 22:13:05.882296+00', '2026-01-20 22:13:05.882296+00', NULL, 'eaba6db4-0cfe-44ce-9e01-fdd12d99e66c'),
	('00000000-0000-0000-0000-000000000000', 84, 'jkbkpxcpphse', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-20 10:01:35.809643+00', '2026-01-21 03:32:32.294428+00', 'f7yfgofkut6z', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 88, 'groicys7eebj', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-20 22:13:05.847042+00', '2026-01-21 10:13:34.390838+00', 'xu6s2lcp3yqu', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 87, 'maj2prmgi7t4', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-20 17:43:48.526316+00', '2026-01-21 17:41:36.387316+00', 'hkdtoxfn7oiw', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 91, 'otchcf6h6can', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-21 10:13:34.418699+00', '2026-01-21 20:08:16.615545+00', 'groicys7eebj', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 93, 'vnzjka5v5dxx', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-21 20:08:16.637441+00', '2026-01-21 22:38:09.264358+00', 'otchcf6h6can', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 94, 'egco5jdmj3cp', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-21 22:38:09.278091+00', '2026-01-22 10:12:57.45962+00', 'vnzjka5v5dxx', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 92, 'y7c7lhznnfkf', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-21 17:41:36.408601+00', '2026-01-22 17:44:41.210718+00', 'maj2prmgi7t4', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 95, 'kfzlejl5eyfl', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-22 10:12:57.490781+00', '2026-01-23 09:23:24.030955+00', 'egco5jdmj3cp', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 90, '66kd7765yr3e', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-21 03:32:32.321259+00', '2026-01-23 09:33:59.169658+00', 'jkbkpxcpphse', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 96, 'nvjojplaa2nm', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-22 17:44:41.246152+00', '2026-01-23 17:12:07.898254+00', 'y7c7lhznnfkf', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 99, 'jrohz3bma7wa', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-23 17:12:07.932217+00', '2026-01-23 21:23:46.351621+00', 'nvjojplaa2nm', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 97, 'mwlpjtstfz5w', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-23 09:23:24.060696+00', '2026-01-25 00:14:31.044905+00', 'kfzlejl5eyfl', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 100, 'y24xaub37uaf', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-23 21:23:46.375649+00', '2026-01-25 14:35:26.555492+00', 'jrohz3bma7wa', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 98, 'l6eeiv4gkmoe', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-23 09:33:59.180744+00', '2026-01-26 15:44:20.624078+00', '66kd7765yr3e', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 103, 'uxmxyezbczy4', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', false, '2026-01-25 21:18:36.728439+00', '2026-01-25 21:18:36.728439+00', NULL, '4fae4686-a8cb-4719-ba7b-d465f7c1c4b6'),
	('00000000-0000-0000-0000-000000000000', 101, 'bnucznwvpmtr', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-25 00:14:31.081236+00', '2026-01-25 21:35:49.678972+00', 'mwlpjtstfz5w', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 104, 'dzlzduqvltaf', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-25 21:35:49.684451+00', '2026-01-26 08:16:47.177085+00', 'bnucznwvpmtr', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 105, 'psqwhmpava6c', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-26 08:16:47.210657+00', '2026-01-26 12:00:15.839482+00', 'dzlzduqvltaf', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 106, 'lyxgdxrcyyhr', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-26 12:00:15.863758+00', '2026-01-26 15:03:29.380394+00', 'psqwhmpava6c', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 107, 'ntri6dpvwvze', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-26 15:03:29.409365+00', '2026-01-26 18:13:32.999098+00', 'lyxgdxrcyyhr', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 102, 'u7jh2h66xpvr', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-25 14:35:26.587002+00', '2026-01-26 19:04:48.28373+00', 'y24xaub37uaf', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 109, 'ap5ilqzerh26', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-26 18:13:33.01788+00', '2026-01-26 22:04:46.190035+00', 'ntri6dpvwvze', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 111, 'q3qw4furimsf', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-26 22:04:46.207524+00', '2026-01-27 07:23:54.030578+00', 'ap5ilqzerh26', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 112, 'm5loohiqcgmp', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-27 07:23:54.065034+00', '2026-01-27 08:25:35.642132+00', 'q3qw4furimsf', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 113, 'atkahw76y27k', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-27 08:25:35.661287+00', '2026-01-27 14:18:58.31815+00', 'm5loohiqcgmp', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 108, 'xs65csi56lxl', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-26 15:44:20.64067+00', '2026-01-27 14:30:02.759628+00', 'l6eeiv4gkmoe', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 110, 'ua7sevqmljjm', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-26 19:04:48.295368+00', '2026-01-27 18:10:05.931526+00', 'u7jh2h66xpvr', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 115, 'm3atrr3d4xgx', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-27 14:30:02.766998+00', '2026-01-28 08:34:54.05615+00', 'xs65csi56lxl', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 114, '65gibh2ano4b', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-27 14:18:58.341343+00', '2026-01-28 08:47:09.005949+00', 'atkahw76y27k', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 116, 'nzol3jhw4ntc', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-27 18:10:05.962233+00', '2026-01-28 18:13:00.340282+00', 'ua7sevqmljjm', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 118, '3ep5y4yjxuzd', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-28 08:47:09.014315+00', '2026-01-29 06:22:28.199127+00', '65gibh2ano4b', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 120, 'tuan6hs4etfq', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-29 06:22:28.228117+00', '2026-01-29 09:48:49.692964+00', '3ep5y4yjxuzd', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 117, '467fcdlbw64d', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-28 08:34:54.076751+00', '2026-01-29 12:01:05.471782+00', 'm3atrr3d4xgx', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 119, 'sbqvwgzucfp5', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-28 18:13:00.357456+00', '2026-01-29 18:09:29.959437+00', 'nzol3jhw4ntc', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 122, 'r6c23agaoeak', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-29 12:01:05.488975+00', '2026-01-29 19:54:05.790694+00', '467fcdlbw64d', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 121, '6tdzlxbeyw5k', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-29 09:48:49.707128+00', '2026-01-30 02:57:28.566435+00', 'tuan6hs4etfq', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 125, 'ykzzxlhnwpcc', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-30 02:57:28.585962+00', '2026-01-30 07:01:36.037206+00', '6tdzlxbeyw5k', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 126, 'we6w4tmu5gge', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-30 07:01:36.069825+00', '2026-01-30 09:20:41.293328+00', 'ykzzxlhnwpcc', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 123, 'xon5ehcgbest', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-29 18:09:29.974961+00', '2026-01-30 17:11:49.787233+00', 'sbqvwgzucfp5', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 128, 'mowufyqrtgbd', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-30 17:11:49.81007+00', '2026-01-30 19:55:47.90111+00', 'xon5ehcgbest', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 127, 'znlt3p4shejy', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-30 09:20:41.307037+00', '2026-01-31 01:56:32.827223+00', 'we6w4tmu5gge', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 129, '7vgvjz7kshly', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-30 19:55:47.911568+00', '2026-01-31 10:16:04.213413+00', 'mowufyqrtgbd', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 124, '2yu6bsajqqp4', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-29 19:54:05.802173+00', '2026-01-31 10:41:21.327491+00', 'r6c23agaoeak', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 130, 'qurcp7noeata', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', true, '2026-01-31 01:56:32.837669+00', '2026-01-31 19:55:58.562524+00', 'znlt3p4shejy', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 133, '5qvwow5s3kv7', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', false, '2026-01-31 19:55:58.564845+00', '2026-01-31 19:55:58.564845+00', 'qurcp7noeata', 'd6b76a10-178c-4dd0-b073-be472c11efd6'),
	('00000000-0000-0000-0000-000000000000', 132, 'o33ocjefwjv3', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', true, '2026-01-31 10:41:21.333813+00', '2026-01-31 19:56:53.636648+00', '2yu6bsajqqp4', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 134, 'rrn4extmvgt4', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', false, '2026-01-31 19:56:53.638237+00', '2026-01-31 19:56:53.638237+00', 'o33ocjefwjv3', '4981347f-b924-45af-aebf-b93d1ee107fc'),
	('00000000-0000-0000-0000-000000000000', 131, 'eynuhs3ohgzr', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', true, '2026-01-31 10:16:04.234071+00', '2026-01-31 19:58:22.975516+00', '7vgvjz7kshly', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 135, 'm5b5jwl35edv', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', false, '2026-01-31 19:58:22.975902+00', '2026-01-31 19:58:22.975902+00', 'eynuhs3ohgzr', 'b198bd5f-2aa3-4c7b-b49f-46a56202a1e0'),
	('00000000-0000-0000-0000-000000000000', 136, 'so47nkvikqak', 'c29e4c4a-a262-40fe-b04b-f3dde775c335', true, '2026-01-31 20:05:23.077315+00', '2026-01-31 21:52:57.207134+00', NULL, 'db15aaa2-76a3-4fda-9b3c-bbcca236616f'),
	('00000000-0000-0000-0000-000000000000', 137, '6rneabojtmkx', 'c29e4c4a-a262-40fe-b04b-f3dde775c335', false, '2026-01-31 21:52:57.209122+00', '2026-01-31 21:52:57.209122+00', 'so47nkvikqak', 'db15aaa2-76a3-4fda-9b3c-bbcca236616f');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: location_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."location_tags" ("id", "user_id", "name", "emoji", "created_at") VALUES
	('6f7e73b2-bc1e-4dbb-a1b7-5b9ccdb136dc', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'Chez moi', '📍', '2026-01-01 15:58:40.45058+00'),
	('f5d81f69-8eeb-4398-b52a-171ee1c6833a', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'Chez TevTev', '🍕', '2026-01-01 16:01:16.117608+00'),
	('26568217-0059-469b-b10e-383657df76f9', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'Chez Ava', '❤️', '2026-01-01 17:48:36.963844+00'),
	('37a8c4ee-b2dd-45bf-81e9-d7166fa9f844', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', 'Chez moi', '📍', '2026-01-02 17:38:56.528664+00'),
	('4f60b3b6-2bf3-43c4-9dfb-50082a25f0fb', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'Travail', '⚒️', '2026-01-03 10:49:24.700059+00'),
	('9f56bdb4-ddf5-41a3-bc90-73893e508675', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'Boulot', '📍', '2026-01-05 08:34:46.382566+00'),
	('3badd93c-cd9c-4676-a573-cd00e4ea5049', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'Chez mes Parents', '🥷', '2026-01-17 09:14:30.925844+00'),
	('b080e20f-4d64-481b-9a1e-593f034e683b', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', 'Chez maman', '📍', '2026-01-18 19:34:22.985259+00'),
	('42c4054d-1ab0-47e3-88af-8c0efa1eb07b', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', 'Boulot', '📍', '2026-01-20 13:23:09.966651+00'),
	('735a09ff-d982-420e-875a-ff3d494a4cb4', 'c29e4c4a-a262-40fe-b04b-f3dde775c335', 'Maison', '📍', '2026-01-31 21:53:30.93378+00');


--
-- Data for Name: poop_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."poop_logs" ("id", "user_id", "date", "time", "location", "poop_type", "comments", "created_at", "address", "latitude", "longitude", "size") VALUES
	('85187a95-94a0-40aa-9576-a013b7732b78', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-01', '13:52:00', 'Chez moi', 'type4', NULL, '2026-01-01 16:20:58.759167+00', '6, Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.73052936590758, 4.828308331290293, 'normal'),
	('d000c87e-6d4d-4675-97cc-3b9cd29193e8', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-01', '04:20:00', 'Chez TevTev', 'type1', '1er caca de l''année !', '2026-01-01 16:40:41.082944+00', '3, Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7306259, 4.8281746, 'small'),
	('9bb719ea-58f4-489a-b7a2-e23d52a2bd0d', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-01', '18:48:00', 'Chez Ava', 'type5', NULL, '2026-01-01 17:49:19.476351+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476323, 4.8434525, 'big'),
	('93f36b75-bafb-4b81-9b28-e14b0fedf408', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-01', '22:40:00', 'Chez moi', 'type1', NULL, '2026-01-01 21:40:30.612866+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.73063177249594, 4.828131184557222, 'small'),
	('ee1ef352-dcf2-4e9d-8636-85b786c4c050', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-02', '11:02:00', 'Chez moi', 'type4', NULL, '2026-01-02 10:02:36.782743+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.73063177249594, 4.828131184557222, 'big'),
	('8e8c5290-3474-4633-b906-a3730137c3e6', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-02', '12:14:00', 'Chez moi', 'type2', NULL, '2026-01-02 11:14:55.230357+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.73063177249594, 4.828131184557222, 'medium'),
	('1cbc1e9d-56cb-4fc4-9a7c-a101471e0bc4', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-02', '18:38:00', 'Chez moi', 'type4', NULL, '2026-01-02 17:39:20.872939+00', '46, Montée des Ménerets, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.85318, 4.5845468, 'monster'),
	('ba6086a3-702f-489e-9b5e-c4ab37e16a4e', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-03', '11:48:00', 'Travail', 'type5', NULL, '2026-01-03 10:49:45.30169+00', 'E.Leclerc Drive, Avenue Édouard Millaud, Craponne, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69290, France', 45.7485061, 4.747625, 'big'),
	('52e8ef48-0986-4b68-8435-3a151be48a96', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-03', '12:59:00', 'Chez moi', 'type5', NULL, '2026-01-03 12:00:11.211688+00', NULL, 45.8534802, 4.5851659, 'big'),
	('f2ff6e84-837d-4c5b-93fc-a4f169c17d85', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-03', '16:32:00', 'Chez moi', 'type4', NULL, '2026-01-03 15:32:32.413541+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.73063177249594, 4.828131184557222, 'normal'),
	('887e0530-751c-4c5a-a1c0-2fa2d632f2e2', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-04', '20:09:00', 'Chez moi', 'type4', NULL, '2026-01-04 19:10:23.483196+00', NULL, 45.8535002, 4.5851762, 'big'),
	('621ccfda-d979-438c-8c2a-fc5165fdeef4', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-05', '09:34:00', 'Boulot', 'type3', NULL, '2026-01-05 08:35:15.525538+00', 'Rue Lannes, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76420934469449, 4.862086344555957, 'big'),
	('9754c6c0-096c-4570-909f-73aa41c3aa8e', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-05', '14:24:00', 'Boulot', 'type3', NULL, '2026-01-05 13:25:10.86744+00', 'Rue Lannes, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76420934469449, 4.862086344555957, 'normal'),
	('c3c616e7-93d4-4332-946b-a4abf3343791', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-05', '19:27:00', 'Chez Ava', 'type1', NULL, '2026-01-05 18:27:35.526025+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476054, 4.8434273, 'small'),
	('824bd4cc-3b3d-4ffd-a4a2-9caeaec8a2cd', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-05', '00:49:00', 'Chez Ava', 'type1', NULL, '2026-01-05 18:28:13.744731+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476102, 4.8434292, 'medium'),
	('5a7a8219-96d0-4143-a686-19c0c8baa75e', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-04', '13:08:00', 'Chez Ava', 'type5', NULL, '2026-01-05 18:28:49.586845+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476081, 4.8434309, 'normal'),
	('d772f10f-1796-40dd-815e-c317022a80a6', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-05', '23:40:00', 'Chez moi', 'type6', NULL, '2026-01-05 22:40:59.125182+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.73063318435021, 4.828131717552648, 'small'),
	('ddb2c769-53f7-4893-aa49-d8babf35b9ce', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-06', '09:52:00', 'Boulot', 'type3', NULL, '2026-01-06 08:52:39.112076+00', 'Rue Lannes, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76420934469449, 4.862086344555957, 'normal'),
	('6d2fb36a-958a-4452-9ddc-b81588d623fb', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-06', '14:37:00', 'Boulot', 'type3', NULL, '2026-01-06 13:38:07.788249+00', 'Rue Lannes, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76420934469449, 4.862086344555957, 'medium'),
	('f36d3546-ea51-4b8a-8e5f-16782835e339', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-06', '23:34:00', 'Chez moi', 'type4', 'Un caca libérant finalement après un jour', '2026-01-06 22:35:38.809894+00', NULL, 45.8534712, 4.5851704, 'normal'),
	('82f4673f-c2a6-4e59-af26-6747f9f63415', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-07', '10:08:00', 'Boulot', 'type3', NULL, '2026-01-07 09:09:07.17945+00', 'Rue Lannes, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.764204245145805, 4.86209680539978, 'big'),
	('2e187c4a-e07c-4d20-ba13-a81402d98125', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-07', '14:34:00', 'Boulot', 'type2', NULL, '2026-01-07 13:35:11.024406+00', 'Rue Lannes, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.764204245145805, 4.86209680539978, 'medium'),
	('821dae07-9026-4276-a2d2-e6c026fbd605', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-07', '18:46:00', 'Chez moi', 'type1', NULL, '2026-01-07 17:46:34.691846+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.730632849441996, 4.828131587022635, 'small'),
	('d2f33c59-5711-4950-a711-93b9ba6d105d', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-07', '18:49:00', 'Chez moi', 'type3', NULL, '2026-01-07 17:50:13.539843+00', NULL, 45.8534738, 4.5851747, 'medium'),
	('f96d342e-f9f6-4899-a757-85df1b6cb01d', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-08', '09:51:00', 'Chez moi', 'type5', NULL, '2026-01-08 08:51:49.780758+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.730632849441996, 4.828131587022635, 'normal'),
	('a6e969a3-f10c-42e4-9f78-569dbbbe1543', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-08', '19:01:00', 'Chez moi', 'type4', NULL, '2026-01-08 18:01:52.152407+00', '74, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8534762, 4.5851856, 'monster'),
	('bd098547-aee8-4a7f-adc3-1055e1fa980c', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-08', '21:12:00', 'Chez moi', 'type5', NULL, '2026-01-08 20:13:19.238271+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.730632849441996, 4.828131587022635, 'normal'),
	('6a97fe9d-e174-41cf-acdc-d75060784bb8', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-09', '10:55:00', 'Boulot', 'type5', NULL, '2026-01-09 09:55:53.379558+00', 'Rue Lannes, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.764204245145805, 4.86209680539978, 'medium'),
	('373da536-58bf-4293-a31b-410a64b1b18f', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-09', '14:45:00', 'Boulot', 'type1', NULL, '2026-01-09 13:45:22.192116+00', '175, Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.764126540653, 4.861966759578874, 'small'),
	('46bfb0c0-a6de-494e-8537-8dfeb083785f', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-10', '11:53:00', 'Chez moi', 'type5', NULL, '2026-01-10 10:54:02.332386+00', '74, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8535921, 4.5851732, 'big'),
	('04bfb60a-29b4-4f21-8390-48b23c60ee5f', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-10', '17:46:00', 'Chez moi', 'type3', NULL, '2026-01-10 16:46:43.294305+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.730632849441996, 4.828131587022635, 'big'),
	('41f432f3-bd57-47fc-97c0-3a5c0434166b', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-11', '10:36:00', 'Chez moi', 'type5', 'Odeur pas ouf', '2026-01-11 09:37:05.989021+00', '74, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8536349, 4.584934, 'big'),
	('1b8f8966-249d-45cc-a2ad-7b2ddbfe18f8', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-12', '10:21:00', 'Boulot', 'type3', NULL, '2026-01-12 09:21:42.941208+00', 'Rue Lannes, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.764198031572725, 4.862072387066293, 'normal'),
	('1f02e7ca-bbe0-44a9-b0de-bcc5e7b48b6b', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-07', '08:34:00', 'Travail', 'type4', NULL, '2026-01-12 10:18:55.050162+00', 'E.Leclerc Drive, Avenue Édouard Millaud, Craponne, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69290, France', NULL, NULL, 'small'),
	('142f9373-10f3-4e42-ae6a-5bb36f5bc4c3', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-08', '12:37:00', 'Travail', 'type2', NULL, '2026-01-12 10:20:35.493511+00', 'E.Leclerc Drive, Avenue Édouard Millaud, Craponne, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69290, France', NULL, NULL, 'big'),
	('746460eb-094a-421e-9681-7c97de6fc3c2', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-10', '07:12:00', 'Travail', 'type2', 'Couleur Verte', '2026-01-12 10:21:14.010501+00', 'E.Leclerc Drive, Avenue Édouard Millaud, Craponne, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69290, France', NULL, NULL, 'destroyer'),
	('c9803924-f1f2-4e75-bc15-1c01f4477811', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-11', '20:23:00', 'Chez Ava', 'type1', NULL, '2026-01-12 10:22:00.586019+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', NULL, NULL, 'normal'),
	('c61cf8f3-ed58-470a-8ba7-2171a6e89db9', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-12', '19:27:00', 'Chez moi', 'type4', NULL, '2026-01-12 18:28:16.770788+00', '74, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8533618, 4.5850268, 'small'),
	('cdb2b2d9-4a20-4163-92d6-f91a126a3fb1', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-12', '23:59:00', 'Chez moi', 'type1', NULL, '2026-01-12 22:59:31.579035+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.730624903816114, 4.8281190244239935, 'small'),
	('d3da26f8-59f5-4b99-b083-311daaf5f9e2', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-13', '10:26:00', 'Boulot', 'type5', NULL, '2026-01-13 09:26:41.419261+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.764185727704344, 4.862058886602752, 'monster'),
	('f1f3c548-fc64-488c-bd26-776e9a55de1c', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-13', '18:42:00', 'Chez moi', 'type4', 'Vraiment petit 😢', '2026-01-13 17:42:46.823522+00', '74, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8535833, 4.585175, 'small'),
	('6754c884-70e6-4445-8540-7be0bd710ac7', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-14', '09:51:00', 'Boulot', 'type4', NULL, '2026-01-14 08:52:16.70805+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.764186308864815, 4.862052513180828, 'normal'),
	('f54ad3d9-ae7c-4bfa-a0ea-e069b2c00b55', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-14', '15:46:00', 'Boulot', 'type1', NULL, '2026-01-14 14:46:34.859197+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.764186308864815, 4.862052513180828, 'medium'),
	('0c699531-73db-46df-be07-923fd096bb3e', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-14', '19:10:00', 'Chez moi', 'type3', NULL, '2026-01-14 18:11:11.283669+00', '74, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.85336, 4.5852033, 'medium'),
	('9067f247-543c-4c96-aff4-c74ce1c6698f', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-15', '09:46:00', 'Boulot', 'type4', NULL, '2026-01-15 08:46:30.255441+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76418386663854, 4.8620546323155445, 'normal'),
	('5311f843-09e5-429c-bbc6-e9ea6563b5e4', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-15', '18:45:00', 'Chez moi', 'type1', NULL, '2026-01-15 17:45:34.208979+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.73062651162703, 4.828118908915196, 'small'),
	('a5e28baa-0b17-458e-b3e7-fd77a3647848', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-16', '09:48:00', 'Boulot', 'type5', NULL, '2026-01-16 08:48:41.147604+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76417705402238, 4.862043401583934, 'normal'),
	('c01ad2c3-2206-4637-9eb8-af87bca84728', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-16', '18:17:00', 'Chez moi', 'type4', 'Jme sens carrément mieux', '2026-01-16 17:18:02.122015+00', '74, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.853592, 4.5851691, 'big'),
	('c4baa4cc-d40f-436b-acdb-a6d8ce39a2fb', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-17', '02:04:00', 'Chez moi', 'type1', NULL, '2026-01-17 01:04:15.471361+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.730625797975016, 4.8281195099004615, 'small'),
	('295ea1ff-56f7-4c9e-8ad4-6a3a17f768cf', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-17', '10:12:00', 'Chez mes Parents', 'type3', NULL, '2026-01-17 09:14:46.677498+00', '100, L''Orée du Bourg, Pigneux, Saint-Genix-sur-Guiers, Saint-Genix-les-Villages, Chambéry, Savoie, Auvergne-Rhône-Alpes, France métropolitaine, 73240, France', 45.6026459, 5.6368724, 'medium'),
	('15ad0d7b-fe5a-48c5-8787-966bb6da25fc', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-17', '10:52:00', 'Chez moi', 'type3', NULL, '2026-01-17 09:52:17.454197+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.730625797975016, 4.8281195099004615, 'normal'),
	('4393531d-b6be-4ebf-8474-97f0b1d20fae', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-17', '20:03:00', 'Chez mes Parents', 'type1', NULL, '2026-01-17 19:03:37.253821+00', '100, L''Orée du Bourg, Pigneux, Saint-Genix-sur-Guiers, Saint-Genix-les-Villages, Chambéry, Savoie, Auvergne-Rhône-Alpes, France métropolitaine, 73240, France', 45.6026692, 5.6368952, 'normal'),
	('7792675b-1a82-49db-8411-6f8d81b806d0', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-18', '13:55:00', 'Chez mes Parents', 'type5', NULL, '2026-01-18 12:56:12.619083+00', '100, L''Orée du Bourg, Pigneux, Saint-Genix-sur-Guiers, Saint-Genix-les-Villages, Chambéry, Savoie, Auvergne-Rhône-Alpes, France métropolitaine, 73240, France', 45.6026332, 5.6368856, 'monster'),
	('d0a69404-9ffc-4433-a279-31bc24d8892d', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-18', '17:33:00', 'Chez Ava', 'type3', 'Odeur nauséabonde', '2026-01-18 16:34:09.134115+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476284, 4.8434421, 'normal'),
	('0d664382-7362-4b6c-94eb-be043d08b396', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-18', '18:10:00', 'Chez moi', 'type2', NULL, '2026-01-18 17:10:59.341742+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.730625797975016, 4.8281195099004615, 'medium'),
	('5c166c05-5ccf-4f6a-9ca3-c8f53698c777', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-18', '20:34:00', 'Chez maman', 'type3', NULL, '2026-01-18 19:34:58.914502+00', '25, Rue Charles de Gaulle, Soucieu-en-Jarrest, Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69510, France', 45.6766446, 4.7018302, 'medium'),
	('2fb9fec3-ea13-48a5-9388-1c92df39f5eb', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-18', '21:05:00', 'Chez moi', 'type4', NULL, '2026-01-18 20:05:35.455117+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.730625797975016, 4.8281195099004615, 'big'),
	('aaf53dfb-5766-4227-83f0-87cc84b24c20', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-19', '09:41:00', 'Boulot', 'type5', NULL, '2026-01-19 08:41:22.645648+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76418386663854, 4.8620546323155445, 'normal'),
	('16756f24-ef8f-480b-abc5-29c04ba5e226', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-19', '18:34:00', 'Chez moi', 'type3', NULL, '2026-01-19 17:34:56.805004+00', '74, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8535737, 4.585176, 'big'),
	('6b11e220-42cc-46b3-b73b-70735f0dc196', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-19', '21:38:00', 'Chez moi', 'type1', NULL, '2026-01-19 20:38:37.868082+00', '74, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8535774, 4.5851597, 'small'),
	('0f53f45c-ab74-4f63-9509-cad0fce49207', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-19', '22:07:00', 'Chez moi', 'type2', NULL, '2026-01-19 21:07:31.073936+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.73063075364225, 4.828117178038735, 'medium'),
	('9a810fac-cb8a-478c-ace6-5caeccd544bd', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-20', '09:52:00', 'Boulot', 'type4', NULL, '2026-01-20 08:52:44.323587+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76417419895482, 4.862041624926479, 'big'),
	('19d9fbc3-3ba2-49c8-ba70-3553c4387827', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-20', '11:01:00', 'Chez Ava', 'type7', NULL, '2026-01-20 10:02:03.316034+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476252, 4.843441, 'big'),
	('70987b8d-5efc-43fb-bd14-a58caf41e679', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-13', '11:37:00', 'Chez Ava', 'type1', NULL, '2026-01-20 10:02:56.346142+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476042, 4.8434718, 'small'),
	('5519da85-a3ef-4931-8abf-6cbc35bce5f7', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-14', '14:52:00', 'Chez Ava', 'type2', NULL, '2026-01-20 10:03:35.885871+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7475981, 4.8434821, 'normal'),
	('1c5f496c-e793-4c75-ad91-dd15519d988b', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-15', '09:46:00', 'Chez Ava', 'type3', NULL, '2026-01-20 10:04:22.469407+00', '73, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476559, 4.8434052, 'big'),
	('c042ac4a-47ea-4edc-b68f-7950450e74ed', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-16', '09:51:00', 'Chez Ava', 'type6', NULL, '2026-01-20 10:04:58.123243+00', '73, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.747671, 4.8433876, 'medium'),
	('5652e1e5-e7d1-4367-b6c6-f85bee0cd678', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-16', '13:06:00', 'Chez Ava', 'type4', NULL, '2026-01-20 10:05:29.79725+00', '74, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476701, 4.8433444, 'big'),
	('8c429770-a76d-43fe-a942-07c090879657', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-20', '14:22:00', 'Boulot', 'type4', NULL, '2026-01-20 13:23:38.346058+00', 'Route Départementale 306, Limonest, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69760, France', 45.8096936, 4.779797, 'monster'),
	('deaa8591-13bb-4581-87a7-655303a06d01', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-20', '18:43:00', 'Chez moi', 'type4', NULL, '2026-01-20 17:44:26.880395+00', '74, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8534037, 4.5849571, 'normal'),
	('c38be406-9718-4f0d-9383-ecfbdd495e82', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-20', '23:13:00', 'Chez moi', 'type1', NULL, '2026-01-20 22:13:18.427615+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.73062937523337, 4.828118941294026, 'small'),
	('ab2e5c74-2f5e-497f-96fb-7d4b1115feb3', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-21', '04:32:00', 'Chez Ava', 'type7', 'Littéralement de l''eau, giga mal de bide, impossible de dormir ', '2026-01-21 03:50:41.34089+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476128, 4.8434796, 'destroyer'),
	('4fa6bac9-99e6-4d4d-980c-c1f44c0cb851', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-21', '11:13:00', 'Boulot', 'type5', NULL, '2026-01-21 10:13:48.572024+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76416790548185, 4.862028105016784, 'normal'),
	('e7c42bd8-1c84-4462-81da-656ca8c9dfed', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-21', '18:41:00', 'Chez moi', 'type2', NULL, '2026-01-21 17:42:07.725765+00', '74, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8534267, 4.5850792, 'big'),
	('2e80b372-8cef-4c19-916a-8c06c275219a', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-21', '21:08:00', 'Chez moi', 'type7', NULL, '2026-01-21 20:08:25.038446+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7306286134675, 4.82811889875622, 'normal'),
	('9755766b-6626-44b6-88b3-e6044a0b38b1', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-22', '11:13:00', 'Boulot', 'type5', NULL, '2026-01-22 10:13:08.661009+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76416790548185, 4.862028105016784, 'normal'),
	('072ab0d0-7448-4e46-bb79-19c36ac28771', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-22', '18:44:00', 'Chez moi', 'type4', NULL, '2026-01-22 17:45:57.698579+00', '74, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8536267, 4.5851667, 'normal'),
	('b2151b13-773a-472d-b474-7c3c7a4bcda4', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-23', '10:23:00', 'Boulot', 'type3', NULL, '2026-01-23 09:23:39.366181+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76416135825386, 4.862017323799083, 'normal'),
	('37842189-dcb9-484a-a6f5-07194b4cb281', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-23', '18:12:00', 'Chez moi', 'type4', 'Des jumeaux', '2026-01-23 17:13:24.189513+00', '74, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8534984, 4.5851533, 'normal'),
	('5d0d8cbd-ffad-463e-8035-45b0fda7d3c1', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-23', '22:23:00', 'Chez moi', 'type4', NULL, '2026-01-23 21:24:09.775955+00', '104, Montée des Ménerets, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8537783, 4.5849417, 'medium'),
	('f492146f-1f83-43dd-b657-e31cc99285d1', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-25', '01:14:00', 'Chez moi', 'type1', NULL, '2026-01-25 00:14:40.58448+00', '3, Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.73063643636986, 4.828139388402363, 'medium'),
	('aa21dce0-d285-4506-91c2-c656d36e10a0', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-25', '15:35:00', 'Chez maman', 'type4', NULL, '2026-01-25 14:35:54.264975+00', '25, Rue Charles de Gaulle, Soucieu-en-Jarrest, Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69510, France', 45.6766407, 4.7017594, 'normal'),
	('dc4c7ec4-e840-4f1c-be1e-b33c7ca22bed', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-26', '09:22:00', 'Boulot', 'type2', NULL, '2026-01-26 08:22:31.050993+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.764154915894316, 4.862009393608731, 'normal'),
	('bc1e58fa-37ef-43db-8ba4-7d6adf399b59', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-26', '16:03:00', 'Boulot', 'type2', NULL, '2026-01-26 15:04:08.057723+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.764154915894316, 4.862009393608731, 'normal'),
	('e94e32d5-1513-4c40-8ed6-3bdea3370c3f', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-22', '14:09:00', 'Chez Ava', 'type3', NULL, '2026-01-26 15:45:07.826133+00', '73, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476936, 4.8433732, 'normal'),
	('d14097ad-707f-4281-ac08-4d89dcb1c20e', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-23', '10:27:00', 'Chez Ava', 'type1', NULL, '2026-01-26 15:45:50.365387+00', '73, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476802, 4.8434097, 'big'),
	('e6b6c6f4-fd20-472b-ab38-25a76651bd0a', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-24', '18:45:00', 'Chez Ava', 'type5', NULL, '2026-01-26 15:46:15.97773+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476004, 4.8434904, 'medium'),
	('3a9034d3-9e37-4a9c-9d64-0108d5117401', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-25', '22:18:00', 'Chez Ava', 'type1', NULL, '2026-01-26 15:46:37.949617+00', '73, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476808, 4.8434397, 'small'),
	('2c391bd9-cf84-46b8-87db-3158ba3eff3c', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-26', '16:46:00', 'Chez Ava', 'type3', NULL, '2026-01-26 15:46:54.688749+00', '73, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476828, 4.8434421, 'big'),
	('815e6c90-51cc-45be-92a4-bd784ab80151', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-26', '20:04:00', 'Chez moi', 'type4', NULL, '2026-01-26 19:05:18.265005+00', '98, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.85353, 4.5853067, 'normal'),
	('afcad61c-62bc-4470-b87b-8d26a583e4a3', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-27', '09:25:00', 'Boulot', 'type5', NULL, '2026-01-27 08:25:52.497803+00', '175, Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.764085588827285, 4.8619887101975365, 'normal'),
	('7382a742-2009-4b8c-a509-4e351917f593', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-27', '15:19:00', 'Boulot', 'type4', NULL, '2026-01-27 14:19:20.739125+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76415009249558, 4.862012588574122, 'medium'),
	('b0791030-81e1-4401-a746-de681a7efdc3', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-27', '11:24:00', 'Chez Ava', 'type3', NULL, '2026-01-27 14:30:21.520079+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476325, 4.8434589, 'big'),
	('bb4e78f5-9dfc-4b74-991f-9ea065c40a0e', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-27', '19:10:00', 'Chez moi', 'type4', NULL, '2026-01-27 18:10:23.560081+00', '98, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.853337, 4.5853967, 'normal'),
	('764d76ae-716e-4976-9a45-cdcd83d027ed', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-28', '09:47:00', 'Boulot', 'type4', NULL, '2026-01-28 08:47:36.439991+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76415009249558, 4.862012588574122, 'big'),
	('0f5ace46-5bb8-431b-81c3-ba72190c71d1', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-28', '19:13:00', 'Chez moi', 'type3', NULL, '2026-01-28 18:13:24.95114+00', '98, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8534054, 4.5853316, 'medium'),
	('2cc062c8-d5ad-4d94-9896-f505eda49696', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-29', '10:48:00', 'Boulot', 'type5', NULL, '2026-01-29 09:49:12.601265+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.76415009249558, 4.862012588574122, 'medium'),
	('cf1866b1-a95b-452a-84c8-37b7b6c04fdb', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-29', '19:09:00', 'Chez moi', 'type4', NULL, '2026-01-29 18:10:01.069061+00', '98, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8533282, 4.5854232, 'normal'),
	('63a3473f-5875-4960-a33a-d4e54a810d88', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-30', '03:57:00', 'Chez moi', 'type4', NULL, '2026-01-30 02:57:41.69871+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.73062847685148, 4.828119865555589, 'normal'),
	('ad380d67-36b1-4874-96bf-973556973bdb', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-30', '08:01:00', 'Chez moi', 'type5', NULL, '2026-01-30 07:01:46.941173+00', 'Rue Jacques Monod, Le Bon Lait, Gerland, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.73062847685148, 4.828119865555589, 'medium'),
	('77cc78d2-6b63-4cf7-8b13-7a800477d03a', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', '2026-01-30', '10:20:00', 'Boulot', 'type4', NULL, '2026-01-30 09:21:05.174214+00', 'Avenue Thiers, Bellecombe, Lyon 6e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69006, France', 45.764149834943545, 4.862025617076364, 'big'),
	('f55115d4-e904-4c34-b6c6-c30cc790e249', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-30', '18:11:00', 'Chez moi', 'type4', NULL, '2026-01-30 17:12:07.475936+00', '98, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8533082, 4.5854387, 'normal'),
	('58c64a19-9509-4a96-943b-8d87d8b2324a', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', '2026-01-31', '11:16:00', 'Chez moi', 'type5', NULL, '2026-01-31 10:16:30.163573+00', '141, Rue du Puits Matagrin, Les Alouettes, Le Cruix, Bully, Villefranche-sur-Saône, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69210, France', 45.8536962, 4.585605, 'normal'),
	('1b24cdce-030d-4c67-a5dd-214deb5c69b7', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-28', '15:08:00', 'Chez Ava', 'type5', NULL, '2026-01-31 10:42:17.147633+00', '73, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476604, 4.8433531, 'normal'),
	('cd4b902c-1692-4086-ae2b-c99dfb84ff1a', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-29', '10:38:00', 'Chez Ava', 'type1', NULL, '2026-01-31 10:42:38.976989+00', '73, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476644, 4.8433685, 'big'),
	('daf91299-fb7d-4bc8-820d-d07b6472cc5b', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-30', '12:25:00', 'Chez Ava', 'type3', NULL, '2026-01-31 10:43:13.468906+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476208, 4.8434264, 'medium'),
	('d4e9f427-c9b0-4d36-882f-7ed4c77fc494', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', '2026-01-31', '11:43:00', 'Chez Ava', 'type3', NULL, '2026-01-31 10:44:00.647464+00', '73, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7476617, 4.8433833, 'normal'),
	('98320752-0849-449b-bb63-afbae1c78308', 'c29e4c4a-a262-40fe-b04b-f3dde775c335', '2026-01-31', '22:53:00', 'Maison', 'type3', NULL, '2026-01-31 21:53:56.139116+00', 'Century 21, Avenue Jean Jaurès, Jean-Macé, Lyon 7e Arrondissement, Lyon, Métropole de Lyon, Rhône, Auvergne-Rhône-Alpes, France métropolitaine, 69007, France', 45.7475953, 4.8434658, 'normal');


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_profiles" ("id", "user_id", "pseudo", "avatar_emoji", "accent_color", "created_at", "updated_at") VALUES
	('b6a78648-9129-4650-b6b7-50a0ac25201c', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'Tevtev', '😎', 'violet', '2026-01-01 16:33:51.348563+00', '2026-01-01 16:34:18.772+00'),
	('6bef2dba-9d20-4be0-842e-286c0d771428', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'Louis', '🦄', 'yellow', '2026-01-01 17:47:12.555505+00', '2026-01-01 17:47:29.609+00'),
	('e238f316-2d2f-4886-8b4b-9223e5dbd745', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', 'Lu6', '🐉', 'red', '2026-01-02 17:38:27.218337+00', '2026-01-03 12:01:57.499+00'),
	('03b454ce-9a9a-48d4-9d6b-6a8cec2d7166', 'c29e4c4a-a262-40fe-b04b-f3dde775c335', 'Cacava', '🦖', 'green', '2026-01-31 20:05:23.97468+00', '2026-01-31 20:05:50.283+00');


--
-- Data for Name: user_trophies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_trophies" ("id", "user_id", "trophy_id", "unlocked_at") VALUES
	('612cc581-372f-4680-9042-0d7ca72fd39c', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'first_poop', '2026-01-25 21:32:47.904243+00'),
	('8af461d9-f831-4cf0-b7d0-5005a16b9a8a', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'ten_poops', '2026-01-25 21:32:47.996773+00'),
	('8cc3538e-895f-4198-b53f-2328eaecb9c6', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'all_types', '2026-01-25 21:32:48.082471+00'),
	('79e09a88-5f42-4c1b-a268-3e6aa8340dfd', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'early_bird', '2026-01-25 21:32:48.182478+00'),
	('2cc26245-0e6a-4eb1-b775-70a13b6fccac', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'night_owl', '2026-01-25 21:32:48.283327+00'),
	('181d37cf-bb7d-4d8f-a9a6-c4fcf569ad08', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'weekend_warrior', '2026-01-25 21:32:48.380771+00'),
	('7b67d7da-69cf-4f14-a294-7fca807cdd30', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'weekday_warrior', '2026-01-25 21:32:48.456666+00'),
	('7411197a-225d-4b2f-b3eb-28ac6012c358', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'monday_hater', '2026-01-25 21:32:48.556989+00'),
	('62322b89-5ff1-4a63-affc-dc7d7c30c5ca', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'new_year', '2026-01-25 21:32:48.632999+00'),
	('587769ac-ea55-4f43-873d-d99ef66aa592', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', 'first_poop', '2026-01-26 19:04:50.17038+00'),
	('e8072da8-efe2-4a7d-ac88-73872f371a3c', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', 'ten_poops', '2026-01-26 19:04:50.30041+00'),
	('68edcf89-41c8-4d13-886d-d885db712209', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', 'perfect_ten', '2026-01-26 19:04:50.413324+00'),
	('4d9ae4e7-5e46-4815-ade3-edf3d2d42c69', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', 'night_owl', '2026-01-26 19:04:50.523719+00'),
	('4c60f02f-74f9-4bfc-97a7-598f099c984a', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', 'weekend_warrior', '2026-01-26 19:04:50.624438+00'),
	('bb6c623d-4bd7-446f-9154-6347a7927e58', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', 'weekday_warrior', '2026-01-26 19:04:50.741603+00'),
	('c1019b78-d91a-4e5e-92ac-97654499b28f', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'streak_3', '2026-01-27 08:25:53.056362+00'),
	('6ce5ba9e-3c12-409b-94f2-4e056e432bce', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', 'streak_3', '2026-01-27 18:10:23.937057+00'),
	('e55f39e4-ea57-4679-8dc3-54b658655998', 'dd7deade-0e16-4a0e-b0d7-716b306a0120', 'perfect_ten', '2026-01-30 02:57:42.042691+00'),
	('a1b172c7-a76f-454f-ba51-3df884bae20e', '1ec3a70b-9568-4447-9113-00d5f54f6d8f', 'streak_7', '2026-01-31 10:16:30.537238+00'),
	('d337edcb-606e-4758-97ea-c249696bbe02', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'first_poop', '2026-01-31 19:56:55.166+00'),
	('f363e606-e7a5-4b33-8045-561b0dc13553', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'ten_poops', '2026-01-31 19:56:55.308818+00'),
	('bdeb498c-0a49-4334-bda6-5243994828b5', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'all_types', '2026-01-31 19:56:55.417202+00'),
	('b94ddac1-5da3-428f-95d4-aec8a5a046a4', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'all_sizes', '2026-01-31 19:56:55.557058+00'),
	('67ee4573-baec-4471-8e8e-7ea950758f8d', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'streak_3', '2026-01-31 19:56:55.693261+00'),
	('e6fc4a26-ef4b-4a31-b556-1bf860f0a0fb', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'streak_7', '2026-01-31 19:56:55.937234+00'),
	('540077b2-bef0-490d-b79c-8b59e0c8029a', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'midnight_pooper', '2026-01-31 19:56:56.069406+00'),
	('1aaaa3d9-3932-46c9-bed6-2ccb1b4064b0', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'early_bird', '2026-01-31 19:56:56.190875+00'),
	('4c42e49b-ef13-4d94-b2ce-d39b0ba48dc7', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'weekend_warrior', '2026-01-31 19:56:56.301668+00'),
	('f568c5ac-641e-4a0c-9728-f9b0bf1a3a16', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'weekday_warrior', '2026-01-31 19:56:56.408929+00'),
	('340589ad-635b-482d-ae36-ebf126d00000', 'd59fc3f7-d2e7-4cd4-9c99-532c237a4979', 'new_year', '2026-01-31 19:56:56.530441+00'),
	('6c17d515-06d4-45a2-b16c-acbbf52c0fb3', 'c29e4c4a-a262-40fe-b04b-f3dde775c335', 'first_poop', '2026-01-31 21:53:56.549408+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 137, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict n8U9ecZyEeBcorYydXtAadeXHmtF7lMA4LtpNCL5iSQjqhtQMyrpqpKRHwKZqpE

RESET ALL;
