function Get(yourUrl) {
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.open("GET", yourUrl, false);
	Httpreq.send(null);
	return Httpreq.responseText;          
}

var app = new Vue({
	el: '#app',
					
	data: {	
		word: function () {
			let params = new URLSearchParams(location.search);
			word_id = params.get('word')
			return JSON.parse(Get(location.origin + "/wrd/" + word_id ))
		}(),
		new_definition: {},
		new_definitions: [],
		edited_definitions: [],
		definitions_to_delete: [],

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