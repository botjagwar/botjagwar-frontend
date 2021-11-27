import { Get, fetch_language_mapping } from './js/utils.js'

var app = new Vue({
	el: '#app',

	data: {
		language_mapping: fetch_language_mapping(),
		languages: function () {
			let words = Get("/static/list");
			return words
		}(),
	},
});
