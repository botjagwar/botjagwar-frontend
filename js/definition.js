import { Get, Put, fetch_language_mapping } from './utils.js'

var app = new Vue({
	el: '#app',

	data: {
		words: function () {
			let params = new URLSearchParams(location.search);
			let id = params.get('defid');
			let defn = Get(location.origin + "/defw/" + id );
			let words = defn[0].words[0];
			//console.log('words');
			//console.log(words);
			return words
		}(),

		message: 'Ready.',

		deleted_words_association: [],
		new_words_version: [],

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

		cancelChanges: function () {
			// Reset changes
			for (let i = 0; i < this.new_words_version.length; i++) {			
				this.words.push(this.new_words_version[i]);
			}			
			this.new_words_version = [];
		},

		saveChanges: function () {
			this.validateChanges()
			console.log('save Changes called');
			this.updateMesage('info', 'Saving...');
			console.log(this.new_words_version);
			try {
				this.prepareRequest();
				this.sendRequest();
				this.updateMesage('success', 'Success!');
			}
			catch (error) {
				this.updateMesage('danger', 'An error occurred!');
			}
		},

		updateMesage: function (msg_type, msg) {
			this.message = msg;
			document.getElementById('status_msg').className = "badge badge-" + msg_type;
		},

		validateChanges: function () {
			console.log('validate new definitions');
			console.log('validate edited definitions');
		},

		prepareRequest: function () {
			console.log('request prepared')
			// Definition language
			this.definition.definition_language = this.definition.language

			// todo: words
			for (let j = 0; j < this.new_words_version.length; j++) {
				for (let k = 0; k < this.new_words_version[j].definitions.length; k++) {
					this.new_words_version[j].definitions[k].definition_language = this.new_words_version[j].definitions[k].language;
				}
			}
		},

		sendRequest: function () {
			console.log('request sent');
			// Definition
			Put('/defn/' + this.definition.id + '/edit', JSON.stringify(this.definition));
			// Words
			for (let i = 0; i < this.new_words_version.length; i++) {
				//console.log('/wrd/' + this.new_words_version[i].id + '/edit');
				//console.log(JSON.stringify(this.new_words_version[i]));
				Put('/dict/entry/' + this.new_words_version[i].id + '/edit', JSON.stringify(this.new_words_version[i]));
			}
			// Reset changes
			this.new_words_version = [];			
		},

		deleteWord: function (word) {
			console.log('deleteWord called');
			if (this.words.includes(word)) {
				let index = this.words.indexOf(word);
				if (index > -1) {
				  this.words.splice(index, 1);
				}
				this.deleted_words_association.push(word.id)
				console.log('deleted in definition list');
				let word_fetched = Get('/wrd/' + word.id);
				for (let i = 0; i < word_fetched.definitions.length; i++) {
					if (word_fetched.definitions[i].id === this.definition.id) {
						word_fetched.definitions.splice(i, 1);
						this.new_words_version.push(word_fetched);
						break;
					}
				}
			}
		},
	},
});
