import { Get, fetch_language_mapping } from './utils.js'

var app = new Vue({
	el: '#app',

	data: {
		language: function () {
			let params = new URLSearchParams(location.search);
			return params.get('language');
		}(),
		language_mapping: fetch_language_mapping(),
		isLoading: false,
		words: function () {
			$('#fetch_spinner').show();
			let params = new URLSearchParams(location.search);
			let words = Get(location.origin + "/api/convergent_translations?limit=1000");
			$('#fetch_spinner').hide();
			return words
		}(),

		changes: [],
		title:'Convergent translations',
	},

	methods: {
		setLanguage: function (language) {
			this.language = language;
		},

		dissociate: function () {
		},

		fix_part_of_speech: function () {
		}
	}
});
