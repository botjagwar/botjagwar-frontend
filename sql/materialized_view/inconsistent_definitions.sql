
CREATE MATERIALIZED VIEW public.matview_inconsistent_definitions AS

select *
from (
    SELECT
        w.id as w_id,
        w.word as w1,
        w.part_of_speech as w1_pos,
        w.language as w1_lang,
        d.definition as w1_defn,
        d.id as d_id,
        d.definition_language as d_lang,
        (select
            word
         from
            word w2
         where
            w2.word = d.definition
            and w2.language = d.definition_language
         limit 1
        ) as w2,
        (select
            part_of_speech
         from
            word w2
         where
            w2.word = d.definition
            and w2.language = d.definition_language
         limit 1
        ) as w2_pos

    FROM
        dictionary x
        join definitions d on x.definition = d.id
        join word w on w.id = x.word

) t1
where
    w2 is not NULL
    and w2_pos != w1_pos
    and (
        (w1_pos = 'ana'
         and w2_pos in ('mpam-ana', 'mat'))
      or (
        (w1_pos in ('mat', 'mpam-ana')
         and w2_pos = 'ana')))
