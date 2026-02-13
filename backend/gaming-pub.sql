--
-- PostgreSQL database dump
--

\restrict XyzruTpf4a1VjN3qQeyjVCBfdqqigKV128BYJ8Pd3GpeNEb4t4VAVWu2vIuMVWP

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.0

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
-- Name: check_device_availability(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_device_availability() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM reservations
        WHERE device_type = NEW.device_type
        AND device_id = NEW.device_id
        AND reservation_date = NEW.reservation_date
        AND status = 'active'
        AND (
            -- Provera preklapanja vremena
            (start_time, start_time + (duration_hours || ' hours')::INTERVAL) 
            OVERLAPS 
            (NEW.start_time, NEW.start_time + (NEW.duration_hours || ' hours')::INTERVAL)
        )
        AND (NEW.reservation_id IS NULL OR reservation_id != NEW.reservation_id)
    ) THEN
        RAISE EXCEPTION 'Uređaj je već rezervisan u tom terminu';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_device_availability() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: descriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.descriptions (
    game_id integer NOT NULL,
    game_description text
);


ALTER TABLE public.descriptions OWNER TO postgres;

--
-- Name: games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.games (
    game_id integer NOT NULL,
    game_name character varying(100) NOT NULL,
    image_filename character varying(100)
);


ALTER TABLE public.games OWNER TO postgres;

--
-- Name: moto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.moto (
    moto_id integer CONSTRAINT "MOTO_moto_id_not_null" NOT NULL,
    moto_name character varying(20) CONSTRAINT "MOTO_moto_name_not_null" NOT NULL
);


ALTER TABLE public.moto OWNER TO postgres;

--
-- Name: pc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pc (
    pc_id integer CONSTRAINT "PC_pc_id_not_null" NOT NULL,
    pc_name character varying(5) CONSTRAINT "PC_pc_name_not_null" NOT NULL
);


ALTER TABLE public.pc OWNER TO postgres;

--
-- Name: promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotions (
    id integer NOT NULL,
    setup_id integer,
    duration_hours integer,
    price integer
);


ALTER TABLE public.promotions OWNER TO postgres;

--
-- Name: reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservations (
    reservation_id integer NOT NULL,
    user_id integer NOT NULL,
    setup_id integer NOT NULL,
    device_type character varying(10) NOT NULL,
    device_id integer NOT NULL,
    reservation_date date NOT NULL,
    start_time time without time zone NOT NULL,
    duration_hours integer NOT NULL,
    total_price integer NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reservations_device_type_check CHECK (((device_type)::text = ANY (ARRAY[('pc'::character varying)::text, ('sony'::character varying)::text, ('moto'::character varying)::text]))),
    CONSTRAINT reservations_status_check CHECK (((status)::text = ANY (ARRAY[('active'::character varying)::text, ('completed'::character varying)::text, ('cancelled'::character varying)::text])))
);


ALTER TABLE public.reservations OWNER TO postgres;

--
-- Name: reservations_reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservations_reservation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservations_reservation_id_seq OWNER TO postgres;

--
-- Name: reservations_reservation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservations_reservation_id_seq OWNED BY public.reservations.reservation_id;


--
-- Name: setups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.setups (
    id integer NOT NULL,
    setup_name character varying(100),
    setup_price integer,
    setup_count integer,
    description character varying(200)
);


ALTER TABLE public.setups OWNER TO postgres;

--
-- Name: sony; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sony (
    sony_id integer CONSTRAINT "SONY_sony_id_not_null" NOT NULL,
    sony_name character varying(10) CONSTRAINT "SONY_sony_name_not_null" NOT NULL
);


ALTER TABLE public.sony OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(40) NOT NULL,
    fname character varying(40) NOT NULL,
    lname character varying(40) NOT NULL,
    password character varying(40) NOT NULL,
    mail character varying(50) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: reservations reservation_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations ALTER COLUMN reservation_id SET DEFAULT nextval('public.reservations_reservation_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: descriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.descriptions (game_id, game_description) FROM stdin;
1	Precizan takticki shooter koji spaja CS stil pucanja sa jedinstvenim mocima agenata.
2	Najbolji takticki FPS gde brzina reakcije i timska igra odlucuju pobednika.
3	Dinamicna battle royale akcija sa gradnjom, sarenim svetom i konstantnim izazovima.
4	Najrealisticniji fudbalski dozivljaj sa brzim mecevima i kompetitivnom atmosferom.
5	Otvoren svet pun akcije, misija i beskrajnih mogucnosti za zabavu sa ekipom.
6	Najpoznatija igra gde strategija, timski rad i pravi izbor heroja odlucuju ishod borbe.
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.games (game_id, game_name, image_filename) FROM stdin;
1	VALORANT	valorant.jpg
2	Counter Strike 2	cs2.jpg
3	Fortnite	fortnite.jpg
5	GTA V	gta5.jpg
6	League of Legends	lol.jpg
4	EA FC 25	fc25.jpg
\.


--
-- Data for Name: moto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.moto (moto_id, moto_name) FROM stdin;
1	Moto#1
2	Moto#2
3	Moto#3
4	Moto#4
5	Moto#5
6	Moto#6
7	Moto#7
8	Moto#8
9	Moto#9
10	Moto#10
\.


--
-- Data for Name: pc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pc (pc_id, pc_name) FROM stdin;
1	PC#1
2	PC#2
3	PC#3
4	PC#4
5	PC#5
6	PC#6
7	PC#7
8	PC#8
9	PC#9
10	PC#10
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotions (id, setup_id, duration_hours, price) FROM stdin;
1	1	3	800
2	1	5	1200
3	1	8	1800
4	2	3	1350
5	2	5	2000
6	2	8	2800
7	3	3	2100
8	3	5	3300
9	3	8	4500
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservations (reservation_id, user_id, setup_id, device_type, device_id, reservation_date, start_time, duration_hours, total_price, status, created_at) FROM stdin;
9	1	1	pc	1	2026-02-05	12:00:00	3	1500	active	2026-02-03 15:19:34.748585
10	1	1	pc	2	2026-02-05	15:00:00	3	1500	active	2026-02-03 15:19:34.748585
11	1	1	pc	1	2026-02-05	18:00:00	3	1500	active	2026-02-03 15:19:34.748585
\.


--
-- Data for Name: setups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.setups (id, setup_name, setup_price, setup_count, description) FROM stdin;
1	PC Računari	300	10	Profesionalni gejming PC računari sa brzim monitorima, udobnim perifernim uređajima i stabilnom mrežnom vezom.
2	PlayStation	500	10	PlayStation gejming zona sa velikim ekranima i udobnim sedenjem, savršena za sportske igre, trke i multiplayer zabavu.
3	Moto Simulator (Gaming stolica)	800	10	Realistična moto sim-racing stolica sa upravljačima i pedalama, dizajnirana da pruži potpuno uranjajuće iskustvo vožnje.
\.


--
-- Data for Name: sony; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sony (sony_id, sony_name) FROM stdin;
1	Sony#1
2	Sony#2
3	Sony#3
4	Sony#4
5	Sony#5
6	Sony#6
7	Sony#7
8	Sony#8
9	Sony#9
10	Sony#10
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, fname, lname, password, mail) FROM stdin;
5	kk	j	k	Avram35	m@g.c
1	testuser	Test	User	password123	test@example.com
\.


--
-- Name: reservations_reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservations_reservation_id_seq', 11, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 5, true);


--
-- Name: moto MOTO_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.moto
    ADD CONSTRAINT "MOTO_pkey" PRIMARY KEY (moto_id);


--
-- Name: pc PC_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pc
    ADD CONSTRAINT "PC_pkey" PRIMARY KEY (pc_id);


--
-- Name: sony SONY_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sony
    ADD CONSTRAINT "SONY_pkey" PRIMARY KEY (sony_id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (game_id);


--
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (reservation_id);


--
-- Name: setups setups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.setups
    ADD CONSTRAINT setups_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: idx_reservations_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_date ON public.reservations USING btree (reservation_date);


--
-- Name: idx_reservations_device; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_device ON public.reservations USING btree (device_type, device_id, reservation_date);


--
-- Name: idx_reservations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_status ON public.reservations USING btree (status);


--
-- Name: idx_reservations_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_user ON public.reservations USING btree (user_id);


--
-- Name: reservations trigger_check_availability; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_check_availability BEFORE INSERT OR UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.check_device_availability();


--
-- Name: reservations fk_setup; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT fk_setup FOREIGN KEY (setup_id) REFERENCES public.setups(id) ON DELETE CASCADE;


--
-- Name: reservations fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: descriptions game_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.descriptions
    ADD CONSTRAINT game_id FOREIGN KEY (game_id) REFERENCES public.games(game_id);


--
-- Name: promotions promotions_setup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_setup_id_fkey FOREIGN KEY (setup_id) REFERENCES public.setups(id);


--
-- PostgreSQL database dump complete
--

\unrestrict XyzruTpf4a1VjN3qQeyjVCBfdqqigKV128BYJ8Pd3GpeNEb4t4VAVWu2vIuMVWP

