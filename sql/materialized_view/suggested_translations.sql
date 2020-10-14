create view unaggregated_dictionary as
SELECT
    wrd.id as word_id,
    wrd.word,
    wrd.language,
    wrd.part_of_speech,
    defn.id as definition_id,
    defn.definition,
    defn.definition_language
FROM ((public.dictionary dct
     LEFT JOIN public.word wrd ON ((wrd.id = dct.word)))
     JOIN public.definitions defn ON ((defn.id = dct.definition)))
;

create materialized view suggested_translations_en_mg as
select
    unaggregated_dictionary.*,
    en_mg.definition as suggested_definition
from
    unaggregated_dictionary
    right join en_mg on (
        en_mg.word = unaggregated_dictionary.definition
        and en_mg.part_of_speech = unaggregated_dictionary.part_of_speech)
where
    unaggregated_dictionary.definition_language = 'en'



create materialized view suggested_translations_fr_mg as
select
    unaggregated_dictionary.*,
    fr_mg.definition as suggested_definition
from
    unaggregated_dictionary
    right join fr_mg on (
        fr_mg.word = unaggregated_dictionary.definition
        and en_mg.part_of_speech = unaggregated_dictionary.part_of_speech)
where
    unaggregated_dictionary.definition_language = 'fr'
