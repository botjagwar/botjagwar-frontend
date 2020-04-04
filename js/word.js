import { Get, Put, fetch_language_mapping } from './utils.js'

var app = new Vue({
	el: '#app',
					
	data: {	
		word: function () {
			let params = new URLSearchParams(location.search);
			let word_id = params.get('word')
			//let words = JSON.parse(Get(location.origin + "/wrd/" + word_id));
			let words = Get(location.origin + "/wrd/" + word_id);
			return words;
		}(),
		new_definition: {},
		new_definitions: [],
		edited_definitions: [],
		definitions_to_delete: [],
		status: '',
		
		language_mapping: fetch_language_mapping(),
	},

	methods: {
		addDefinition: function () {
			let new_definition = {
				type: 'Definition',
				definition: this.new_definition.definition,
				language: this.new_definition.language
			};

			this.word.definitions.push(new_definition);
			console.log('add Definition called: ' + this);
			this.new_definitions.push(new_definition)
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
			for (let i = 0; i < this.new_definitions.length; i++) {
				if (!this.validateLanguage(this.new_definitions[i].language)) {
					throw 'Language is not valid';
				}
			}
			console.log('validate edited definitions');
		},

		validateLanguage: function (code) {			
			return true;
		},

		prepareRequest: function () {
			console.log('request prepared')
			for (let j = 0; j < this.word.definitions.length; j++) {
				this.word.definitions[j].definition_language = this.word.definitions[j].language;
			}
		},

		sendRequest: function () {			
			console.log('request sent', this.word);
			Put('/dict/entry/' +  this.word.id + '/edit', JSON.stringify(this.word));
		},

		getLanguageName: function(code) {
			if (this.language_mapping[code] !== undefined) {
				return this.language_mapping[code];
			}
			else {				
	    		return name; //this.language_mapping[this.language]
			}
		},

		deleteDefinition: function (definition) {		
			console.log('delete Definition called');					
			if (this.word.definitions.includes(definition)) {
				let index = this.word.definitions.indexOf(definition);
				if (index > -1) {
				  this.word.definitions.splice(index, 1);
				}				
				console.log('deleted in definition list');
			}

			if (this.new_definitions.includes(definition)) {
				let index = this.new_definitions.indexOf(definition);
				if (index > -1) {
				  this.new_definitions.splice(index, 1);
				}				
				console.log('deleted in new definition list');
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
			return (this.new_definitions.length +
			this.edited_definitions.length +
			this.definitions_to_delete.length);
	    }
	}


});