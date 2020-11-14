create view convergent_translations as
select
    st_en.word_id,
    st_en.word,
    st_en.language,
    st_en.part_of_speech,
    st_en.definition_id as en_definition_id,
    st_en.definition as en_definition,
    st_fr.definition_id as fr_definition_id,
    st_fr.definition as fr_definition,
    st_en.suggested_definition
from
    suggested_translations_fr_mg st_fr
    join suggested_translations_en_mg st_en on st_fr.word_id = st_en.word_id
where
    st_fr.suggested_definition = st_en.suggested_definition
