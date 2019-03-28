export function generateTestCallback() {
	return function testCallback() { }
}

class INVNTM {
	settings: object;
	callback: Function;
	constructor(settings: object, callback: Function) {
		this.settings = settings;
		this.callback = callback;
	}

	logMyself() {
		console.log(this);
	}
}

export default INVNTM;
