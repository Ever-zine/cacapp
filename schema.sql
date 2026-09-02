


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."location_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" character varying(100) NOT NULL,
    "emoji" character varying(10) DEFAULT '📍'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."location_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."poop_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "date" "date" NOT NULL,
    "time" time without time zone NOT NULL,
    "location" character varying(255) NOT NULL,
    "poop_type" character varying(10) NOT NULL,
    "comments" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "address" "text",
    "latitude" double precision,
    "longitude" double precision,
    "size" character varying(20) DEFAULT 'normal'::character varying NOT NULL,
    CONSTRAINT "poop_logs_poop_type_check" CHECK ((("poop_type")::"text" = ANY ((ARRAY['type1'::character varying, 'type2'::character varying, 'type3'::character varying, 'type4'::character varying, 'type5'::character varying, 'type6'::character varying, 'type7'::character varying])::"text"[]))),
    CONSTRAINT "poop_logs_size_check" CHECK ((("size")::"text" = ANY ((ARRAY['small'::character varying, 'medium'::character varying, 'normal'::character varying, 'big'::character varying, 'monster'::character varying, 'destroyer'::character varying])::"text"[])))
);


ALTER TABLE "public"."poop_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "pseudo" character varying(50),
    "avatar_emoji" character varying(10) DEFAULT '💩'::character varying,
    "accent_color" character varying(20) DEFAULT 'amber'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_trophies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "trophy_id" character varying(50) NOT NULL,
    "unlocked_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_trophies" OWNER TO "postgres";


ALTER TABLE ONLY "public"."location_tags"
    ADD CONSTRAINT "location_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."location_tags"
    ADD CONSTRAINT "location_tags_user_id_name_key" UNIQUE ("user_id", "name");



ALTER TABLE ONLY "public"."poop_logs"
    ADD CONSTRAINT "poop_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."user_trophies"
    ADD CONSTRAINT "user_trophies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_trophies"
    ADD CONSTRAINT "user_trophies_user_id_trophy_id_key" UNIQUE ("user_id", "trophy_id");



CREATE INDEX "idx_location_tags_user_id" ON "public"."location_tags" USING "btree" ("user_id");



CREATE INDEX "idx_poop_logs_date" ON "public"."poop_logs" USING "btree" ("date" DESC);



CREATE INDEX "idx_poop_logs_user_id" ON "public"."poop_logs" USING "btree" ("user_id");



CREATE INDEX "idx_user_profiles_user_id" ON "public"."user_profiles" USING "btree" ("user_id");



CREATE INDEX "idx_user_trophies_trophy_id" ON "public"."user_trophies" USING "btree" ("trophy_id");



CREATE INDEX "idx_user_trophies_user_id" ON "public"."user_trophies" USING "btree" ("user_id");



ALTER TABLE ONLY "public"."location_tags"
    ADD CONSTRAINT "location_tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."poop_logs"
    ADD CONSTRAINT "poop_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_trophies"
    ADD CONSTRAINT "user_trophies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Anyone can view all poop_logs" ON "public"."poop_logs" FOR SELECT USING (true);



CREATE POLICY "Anyone can view all profiles" ON "public"."user_profiles" FOR SELECT USING (true);



CREATE POLICY "Anyone can view all trophies" ON "public"."user_trophies" FOR SELECT USING (true);



CREATE POLICY "Users can delete own location_tags" ON "public"."location_tags" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete own poop_logs" ON "public"."poop_logs" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own location_tags" ON "public"."location_tags" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own poop_logs" ON "public"."poop_logs" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own profile" ON "public"."user_profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own trophies" ON "public"."user_trophies" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own location_tags" ON "public"."location_tags" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own poop_logs" ON "public"."poop_logs" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own profile" ON "public"."user_profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own location_tags" ON "public"."location_tags" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."location_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."poop_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_trophies" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."location_tags" TO "anon";
GRANT ALL ON TABLE "public"."location_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."location_tags" TO "service_role";



GRANT ALL ON TABLE "public"."poop_logs" TO "anon";
GRANT ALL ON TABLE "public"."poop_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."poop_logs" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."user_trophies" TO "anon";
GRANT ALL ON TABLE "public"."user_trophies" TO "authenticated";
GRANT ALL ON TABLE "public"."user_trophies" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































