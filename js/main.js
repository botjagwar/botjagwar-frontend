import { Get, fetch_language_mapping } from './utils.js'

var app = new Vue({
	el: '#app',
					
	data: {	
		language: 'akz',
		language_mapping: fetch_language_mapping(),
		isLoading: false,							
		words: JSON.parse(Get(location.origin + "/dict/akz" )),
		changes: [],
		title:'Dictionary',
	},

	methods: {
		setLanguage: function (language) {
			this.language = language;
		},


		fetchWords: function () {
			this.isLoading = true;
			this.words = JSON.parse(Get(location.origin + "/dict/" + this.language));
			this.isLoading = false;
		},
	}
});