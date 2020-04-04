import { Get, fetch_language_mapping } from './utils.js'

var app = new Vue({
	el: '#app',
					
	data: {	
		words: function () {
			let params = new URLSearchParams(location.search);
			let id = params.get('defid');
			let defn = Get(location.origin + "/defw/" + id );
			let words = defn[0].words[0];
			console.log('words');
			console.log(words);					
			return words
		}(),

		definition: function () {
			let params = new URLSearchParams(location.search);
			let id = params.get('defid')
			let defn = Get(location.origin + "/defn/" + id );			
			let definition = defn[0];
			console.log('defn');
			console.log(definition);
			return definition
		}(),

		language_mapping: fetch_language_mapping(),
	},

	methods: {
		addWord: function () {
		},

		saveChanges: function () {
			this.validate_changes()
			console.log('save Changes called');
			console.log(this.new_definitions);
			this.prepareRequest();
			this.sendRequest();
		},

		validate_changes: function () {
			console.log('validate new definitions');
			console.log('validate edited definitions');
		},

		prepareRequest: function () {
			console.log('request prepared')
		},

		sendRequest: function () {			
			console.log('request sent')
		},

		deleteWord: function (word) {
			console.log('deleteWord called');					
			if (this.words.includes(word)) {
				let index = this.words.indexOf(word);
				if (index > -1) {
				  this.words.splice(index, 1);
				}				
				console.log('deleted in definition list');
			}			
		},
	},

	computed: {
		editCount: function () {			
			return 0;
	    }
	}


});