import { Get, Put, fetch_language_mapping, fetch_pos_mapping } from './utils.js'

var app = new Vue({
	el: '#app',

	data: {
		term: function () {
			let params = new URLSearchParams(location.search);
			if (params.get('word') != null) {
				let word_id = params.get('word')
				let word = Get(location.origin + "/wrd/" + word_id)
				return word.word;
			}
			else if (params.get('term') != null) {
				return params.get('term')
			}
		}(),

		words: function () {
			let params = new URLSearchParams(location.search);
			let words = {};
			// single element
			if (params.get('word') != null) {
				let word_id = params.get('word')
				words = Get(location.origin + "/wrd/" + word_id);
				return [words];
			}
			// multiple elements
			else if (params.get('term') != null) {
				let word = params.get('term')
				words = Get(location.origin + "/api/vw_json_dictionary?word=like." + word);
				return words;
			}
		}(),
		new_definition: {},
		new_definitions: {},
		edited_definitions: [],
		definitions_to_delete: [],
		message: 'Ready.',

		pos_mapping: fetch_pos_mapping(),
		language_mapping: fetch_language_mapping(),
	},

	methods: {
		addDefinition: function (word_id) {
			let new_definition = {
				type: 'Definition',
				definition: this.new_definition.definition,
				language: this.new_definition.language
			};

			console.log('add Definition called: ' + this);
			if (this.new_definitions[word_id] !== undefined) {
				this.new_definitions[word_id].push(new_definition)
			}
			else {
				this.new_definitions[word_id] = [new_definition]
			}

			for (let i = 0; i < this.words.length; i++) {
				if (this.words[i].id === word_id) {
					this.words[i].definitions.push(new_definition);
					break;
				}
			}
			this.new_definition = {};
		},

		saveChanges: function () {
			this.validateChanges()
			console.log('save Changes called');
			console.log(this.new_definitions);
			this.prepareRequest();
			this.sendRequest();
		},

		validateChanges: function () {
			console.log('validate new definitions');
			for (const word_id in this.new_definitions) {
				for (let i = 0; i < this.new_definitions[word_id].length; i++) {
					if (!this.validateLanguage(this.new_definitions[i].language)) {
						throw 'Language is not valid';
					}
				}
			}
			console.log('validate edited definitions');
		},

		validateLanguage: function (code) {
			return true;
		},

		prepareRequest: function () {
			console.log('request prepared')
			for (let i = 0; i < this.words.length; i++) {
				for (let j = 0; j < this.words[i].definitions.length; j++) {
					this.words[i].definitions[j].definition_language = this.words[i].definitions[j].language;
				}
			}
		},

		sendRequest: function () {
			console.log('request sent', this.word);
			for (let i = 0; i < this.words.length; i++) {
				Put('/dict/entry/' +  this.words[i].id + '/edit', JSON.stringify(this.words[i]));
			}
			this.new_definitions = [];
			this.edited_definitions.length = [];
			this.definitions_to_delete = [];
		},

		getLanguageName: function(code) {
			if (this.language_mapping[code] !== undefined) {
				return this.language_mapping[code];
			}
			else {
	    		return name; //this.language_mapping[this.language]
			}
		},

		deleteDefinition: function (word_id, definition) {
			console.log('delete Definition called ' + word_id + ', ' + definition);
			let word = null;
			for (let i = 0; i < this.words.length; i++) {
				if (this.words[i].id === word_id) {
					if (this.words[i].definitions.includes(definition)) {
						let index = this.words[i].definitions.indexOf(definition);
						if (index > -1) {
							this.words[i].definitions.splice(index, 1);
						}
						console.log('deleted in definition list');
					}
					break;
				}
			}
			if (this.new_definitions[word_id] !== undefined) {
				if (this.new_definitions[word_id].includes(definition)) {
					let index = this.new_definitions[word_id].indexOf(definition);
					if (index > -1) {
					this.new_definitions[word_id].splice(index, 1);
					}
					console.log('deleted in new definition list');
				}
			}

			if (!this.definitions_to_delete.includes(definition)) {
				if (definition.id !== undefined) {
					this.definitions_to_delete.push(definition);
				}
				console.log('added in definition to be deleted list');
			}
		},
	},

	computed: {
		editCount: function () {
			return (
				this.edited_definitions.length +
				this.definitions_to_delete.length
			);
	    }
	}
});
