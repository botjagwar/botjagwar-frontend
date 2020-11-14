CREATE VIEW public.word_with_additional_data AS
SELECT 'Word'::text AS type,
    wrd.id,
    wrd.word,
    wrd.language,
    wrd.part_of_speech,
    wrd.date_changed AS last_modified,
    array_to_json(
        array_agg(
            json_build_object(
                'type', 'AdditionalData',
                'data_type', awi.type,
                'data', awi.information
            )
        )
    ) AS additional_data
FROM
    word wrd
    JOIN additional_word_information awi ON awi.word_id = wrd.id
GROUP BY wrd.id;
