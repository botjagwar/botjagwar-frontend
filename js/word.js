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
			let word_id = params.get('word')
			let words = JSON.parse(Get(location.origin + "/wrd/" + word_id));			
			return words;
		}(),
		new_definition: {},
		new_definitions: [],
		edited_definitions: [],
		definitions_to_delete: [],
		
		language_mapping: function () {
			let mappings = {}
			let lang_data = JSON.parse(Get(location.origin + "/langs" ));
			for (let i = 0; i < lang_data.length; i++) {
				if (lang_data[i]["english_name"] !== null) {
					mappings[lang_data[i]["iso_code"]] = lang_data[i]["english_name"];
				}
				else if (lang_data[i]["malagasy_name"] !== null) {
					mappings[lang_data[i]["iso_code"]] = lang_data[i]["malagasy_name"];
				}
				else {
					mappings[lang_data[i]["iso_code"]] = 'Unknwown (' + lang_data[i]["iso_code"] + ')'; 
				}
			}
			return mappings			
		}(),
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