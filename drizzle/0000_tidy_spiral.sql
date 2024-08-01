ALTER TABLE public.reports
    ADD COLUMN instance_id INTEGER;

ALTER TABLE public.reports
    DROP CONSTRAINT reports_char_id_spec_id_difficulty_key;

ALTER TABLE public.reports
    ADD CONSTRAINT reports_char_id_spec_id_difficulty_instance_id_key UNIQUE (char_id, spec_id, difficulty, instance_id);

ALTER TABLE public.reports
    ADD FOREIGN KEY (instance_id) REFERENCES public.instances(id);