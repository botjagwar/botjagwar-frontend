--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5 (Ubuntu 11.5-3.pgdg16.04+1)
-- Dumped by pg_dump version 11.7 (Ubuntu 11.7-2.pgdg18.04+1)

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

--
-- Name: events_definition_changed_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.events_definition_changed_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'DONE',
    'FAILED'
);


ALTER TYPE public.events_definition_changed_status OWNER TO postgres;

--
-- Name: add_pending_definition_change(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_pending_definition_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
IF NEW.definition != OLD.definition 
THEN
        INSERT into events_definition_changed (
            definition_id,   
            change_datetime,
            status,
            status_datetime,
            old_definition,
            new_definition,
            commentary
        ) values (
            NEW.id,
            current_timestamp,
            'PENDING',
            current_timestamp,
            OLD.definition,
            NEW.definition,
            ''
        );
END IF;
RETURN NULL;
END$$;


ALTER FUNCTION public.add_pending_definition_change() OWNER TO postgres;

--
-- Name: events_rel_definition_word_deleted(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.events_rel_definition_word_deleted() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        INSERT into events_rel_definition_word_deleted (
        definition,
        word,
        date_changed,
        comment
        ) values (
            OLD.definition,
            OLD.word,
            current_timestamp,
            'link removed'
        );
        RETURN OLD;

    END;
$$;


ALTER FUNCTION public.events_rel_definition_word_deleted() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: definitions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.definitions (
    id bigint NOT NULL,
    date_changed timestamp with time zone,
    definition character varying(250),
    definition_language character varying(6)
);


ALTER TABLE public.definitions OWNER TO postgres;

--
-- Name: definitions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.definitions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.definitions_id_seq OWNER TO postgres;

--
-- Name: definitions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.definitions_id_seq OWNED BY public.definitions.id;


--
-- Name: dictionary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dictionary (
    word bigint,
    definition bigint
);


ALTER TABLE public.dictionary OWNER TO postgres;

--
-- Name: events_definition_changed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events_definition_changed (
    id bigint NOT NULL,
    definition_id bigint NOT NULL,
    change_datetime timestamp with time zone NOT NULL,
    status public.events_definition_changed_status DEFAULT 'PENDING'::public.events_definition_changed_status NOT NULL,
    status_datetime timestamp with time zone NOT NULL,
    old_definition character varying(255) NOT NULL,
    new_definition character varying(255) NOT NULL,
    commentary text
);


ALTER TABLE public.events_definition_changed OWNER TO postgres;

--
-- Name: events_definition_changed_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_definition_changed_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_definition_changed_id_seq OWNER TO postgres;

--
-- Name: events_definition_changed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_definition_changed_id_seq OWNED BY public.events_definition_changed.id;


--
-- Name: events_rel_definition_word_deleted; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events_rel_definition_word_deleted (
    definition bigint NOT NULL,
    word bigint NOT NULL,
    date_changed timestamp with time zone NOT NULL,
    comment text
);


ALTER TABLE public.events_rel_definition_word_deleted OWNER TO postgres;

--
-- Name: language; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.language (
    iso_code character varying(7) NOT NULL,
    english_name character varying(100),
    malagasy_name character varying(100),
    language_ancestor character varying(6)
);


ALTER TABLE public.language OWNER TO postgres;

--
-- Name: word; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.word (
    id bigint NOT NULL,
    date_changed timestamp with time zone,
    word character varying(150),
    language character varying(10),
    part_of_speech character varying(15)
);


ALTER TABLE public.word OWNER TO postgres;

--
-- Name: word_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.word_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.word_id_seq OWNER TO postgres;

--
-- Name: word_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.word_id_seq OWNED BY public.word.id;


--
-- Name: definitions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.definitions ALTER COLUMN id SET DEFAULT nextval('public.definitions_id_seq'::regclass);


--
-- Name: events_definition_changed id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_definition_changed ALTER COLUMN id SET DEFAULT nextval('public.events_definition_changed_id_seq'::regclass);


--
-- Name: word id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.word ALTER COLUMN id SET DEFAULT nextval('public.word_id_seq'::regclass);


--
-- Name: word idx_16449_primary; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.word
    ADD CONSTRAINT idx_16449_primary PRIMARY KEY (id);


--
-- Name: json_dictionary; Type: MATERIALIZED VIEW; Schema: public; Owner: postgres
--

CREATE MATERIALIZED VIEW public.json_dictionary AS
 SELECT 'Word'::text AS type,
    wrd.id,
    wrd.word,
    wrd.language,
    wrd.part_of_speech,
    wrd.date_changed AS last_modified,
    array_to_json(array_agg(json_build_object('type', 'Definition', 'id', defn.id, 'definition', defn.definition, 'language', defn.definition_language, 'last_modified', defn.date_changed))) AS definitions
   FROM ((public.dictionary dct
     LEFT JOIN public.word wrd ON ((wrd.id = dct.word)))
     JOIN public.definitions defn ON ((defn.id = dct.definition)))
  GROUP BY wrd.id
  WITH NO DATA;


ALTER TABLE public.json_dictionary OWNER TO postgres;

--
-- Name: definitions idx_16427_primary; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.definitions
    ADD CONSTRAINT idx_16427_primary PRIMARY KEY (id);


--
-- Name: events_definition_changed idx_16436_primary; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events_definition_changed
    ADD CONSTRAINT idx_16436_primary PRIMARY KEY (id);


--
-- Name: language idx_16444_primary; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.language
    ADD CONSTRAINT idx_16444_primary PRIMARY KEY (iso_code);


--
-- Name: idx_16427_date_changed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16427_date_changed ON public.definitions USING btree (date_changed);


--
-- Name: idx_16427_definition; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16427_definition ON public.definitions USING gin (to_tsvector('simple'::regconfig, (definition)::text));


--
-- Name: idx_16427_definition_2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16427_definition_2 ON public.definitions USING btree (definition);


--
-- Name: idx_16427_definition_language; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16427_definition_language ON public.definitions USING btree (definition_language);


--
-- Name: idx_16431_definition_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16431_definition_idx ON public.dictionary USING btree (definition);


--
-- Name: idx_16431_word; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_16431_word ON public.dictionary USING btree (word, definition);


--
-- Name: idx_16431_word_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16431_word_idx ON public.dictionary USING btree (word);


--
-- Name: idx_16436_definition_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16436_definition_id ON public.events_definition_changed USING btree (definition_id, old_definition, new_definition);


--
-- Name: idx_16436_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16436_status ON public.events_definition_changed USING btree (status);


--
-- Name: idx_16449_date_changed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16449_date_changed ON public.word USING btree (date_changed);


--
-- Name: idx_16449_language; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16449_language ON public.word USING btree (language);


--
-- Name: idx_16449_part_of_speech; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16449_part_of_speech ON public.word USING btree (part_of_speech);


--
-- Name: idx_16449_word; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16449_word ON public.word USING btree (word);


--
-- Name: idx_16449_word_2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16449_word_2 ON public.word USING gin (to_tsvector('simple'::regconfig, (word)::text));


--
-- Name: idx_16449_word_3; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_16449_word_3 ON public.word USING btree (word, language, part_of_speech);


--
-- Name: definitions on_definition_changed_add_pending_definition_change; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_definition_changed_add_pending_definition_change AFTER UPDATE ON public.definitions FOR EACH ROW EXECUTE PROCEDURE public.add_pending_definition_change();


--
-- Name: dictionary on_row_deleted; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_row_deleted BEFORE DELETE ON public.dictionary FOR EACH ROW EXECUTE PROCEDURE public.events_rel_definition_word_deleted();


--
-- Name: dictionary dictionary_ibfk_1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_ibfk_1 FOREIGN KEY (word) REFERENCES public.word(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: dictionary dictionary_ibfk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dictionary
    ADD CONSTRAINT dictionary_ibfk_2 FOREIGN KEY (definition) REFERENCES public.definitions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--
