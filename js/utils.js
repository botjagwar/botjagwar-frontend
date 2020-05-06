function Request(target_url, method, data) {
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.open(method, target_url, false);
	Httpreq.send(data);
	return JSON.parse(Httpreq.responseText);
}

export function Get(target_url) {
	return Request(target_url, 'GET', null);
}

export function Post(target_url, data = {}) {
	return Request(target_url, 'POST', data);
}

export function Put(target_url, data = {}) {
	return Request(target_url, 'PUT', data);
}

export function Delete(target_url, data = {}) {
	return Request(target_url, 'DELETE', data);
}

export function fetch_language_mapping() {
	let mappings = {}
	//let lang_data = JSON.parse(Get(location.origin + "/langs" ));
	let lang_data = Get(location.origin + "/langs");
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
}

export function fetch_pos_mapping() {
	return Get(location.origin + "/pos.json")
}