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
			let params = new URLSearchParams(location.search);
			let id = params.get('language');
			let words = Get(location.origin + "/dict/" + id );
			return words
		}(),


		changes: [],
		title:'Dictionary',
	},

	methods: {
		setLanguage: function (language) {
			this.language = language;
		},


		fetchWords: function () {
			this.isLoading = true;
			this.words = Get(location.origin + "/dict/" + this.language);
			this.isLoading = false;
		},
	}
});
