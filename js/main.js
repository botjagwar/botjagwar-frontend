function Get(yourUrl) {
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.open("GET", yourUrl, false);
	Httpreq.send(null);
	return Httpreq.responseText;          
}

var app = new Vue({
	el: '#app',
					
	data: {	
		language: 'akz',
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