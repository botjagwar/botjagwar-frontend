import { Get, Put, fetch_language_mapping } from './utils.js'

var app = new Vue({
	el: '#app',

	data: {
		words: function () {
			let params = new URLSearchParams(location.search);
			let word_id = params.get('word');
			let words = Get(
				location.origin 
				+ "/api/json_dictionary?"
				+ "limit=100&"
				+ "select=id,word,language,part_of_speech,last_modified&"
				+ "order=id.desc");
			return words;
		}(),

		definitions: function () {
			let params = new URLSearchParams(location.search);
			let words = Get(
				location.origin 
				+ "/api/definitions?"
				+ "limit=100&"
				+ "select=id,definition,definition_language,date_changed&"
				+ "order=id.desc");
			return words;
		}(),

		language_mapping: fetch_language_mapping(),
	},

	methods: {
	},
});
