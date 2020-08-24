import { Get, Put, fetch_language_mapping } from './utils.js'

var app = new Vue({
	el: '#app',

	data: {
		words: function () {
			let params = new URLSearchParams(location.search);
			let term = params.get('term')
			let items = Get(location.origin + "/api/json_dictionary?word=like." + term + '&limit=100');
			return items;
		}(),

		definitions: function () {
			let params = new URLSearchParams(location.search);
			let term = params.get('term')
			let items = Get(location.origin + "/api/definitions?definition=like." + term + '%&limit=100');
			return items;
		}(),

		language_mapping: fetch_language_mapping()
	},
});
