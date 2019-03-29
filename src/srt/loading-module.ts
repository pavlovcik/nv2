
export default function loading_module(className: string): string {
	// console.log(this);
	if (!this.bln.module_loading) {
		if (!this.slc.ui) {
			return false;
		}
		var fetch = function(url) {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.onloadend = function() {
				if (xhr.status == 200) {
					var s = document.createElement('STYLE');
					s.textContent = xhr.response;
					document.body.appendChild(s);
				} else if (xhr.status >= 300) {
					return fetch('//inventum.digital/css/module-loading.css');
				}
			};
			xhr.send();
		};
		fetch('/css/module-loading.css');
		var div = document.createElement('DIV');
		div.id = "Event";
		this.slc.event = div;
		this.slc.ui.appendChild(div);
	}
	this.bln.module_loading = true;
	this.slc.event = document.getElementById('Event'); //  Not sure why this is necessary.
	return this.slc.event.className = className;
}

