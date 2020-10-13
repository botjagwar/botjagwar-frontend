create materialized view en_mg as
select
    word,
    part_of_speech,
    definition
from (
    select
        word.word,
        word.part_of_speech,
        (select
            word
         from
            word ww
         where
            word = definitions.definition
            and ww.part_of_speech = word.part_of_speech
            and language = 'mg'
        ) as definition
    from dictionary
        join definitions on definitions.id = dictionary.definition
        join word on dictionary.word = word.id
    where
        language = 'en'
        and definitions.definition_language = 'mg'
    ) t
where
    definition is not null;

create index idx_en_mg index on en_mg(word);
create index idx_en_mg index on en_mg(definition);
