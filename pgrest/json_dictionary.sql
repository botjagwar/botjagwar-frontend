SELECT
	'Word' as type,
	wrd.id,
	wrd.word,
	wrd.language,
	wrd.part_of_speech,
	wrd.date_changed as last_modified,
	array_to_json(array_agg(json_build_object(
		'type', 'Definition',
		'id', defn.id,
		'definition', defn.definition,
		'language', defn.definition_language,
		'last_modified', defn.date_changed
	))) as definitions
FROM "public"."dictionary" dct
	left join "public"."word" wrd
		on wrd.id = dct.word
	inner join "public"."definitions" defn
		on defn.id = dct.definition
GROUP BY
	wrd.id