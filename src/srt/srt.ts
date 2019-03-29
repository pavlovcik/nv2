import GET from "./get";

export function generateTestCallback() {
	return function testCallback(input: any) { console.log({ input }) }
}

class INVNTM {
	// settings: object;
	// callback: Function;

	// callback
	// test

	arrays: object;
	booleans: object;
	functions: object;
	numbers: object;
	objects: object;
	selectors: object;
	spreads: object;
	strings: object;
	subroutine: object;

	arr: object;
	bln: object;
	fnc: object;
	nmb: object;
	obj: object;
	slc: object;
	spr: object;
	str: object;
	sbr: object;


	// test: object;
	constructor(settings: object, callback: Function) {
		if (settings && typeof settings != "object") settings = {}, console.error("Settings is to be an object.");
		if (callback && typeof callback != "function") callback = () => { }, console.error("Callback is to be a function.");
		// this.settings = settings;
		// this.callback = callback;
		// this.test = {
		// add: function add(element, name) {
		// 	return nv[(typeof element).concat('s')][name] = element;
		// },
		// booleans: {
		// 	respawn: !1 // This is the initial spawn, so run all initializations.
		// },
		// subroutine: subroutine,
		// writable: !0
		// }

		/**
		*	Originals
		**/

		this.arrays = {};
		this.booleans = {};
		this.functions = { get: GET };
		this.numbers = {};
		this.objects = {};
		this.selectors = {};
		this.strings = {};
		this.subroutine = {};

		/**
		*	Aliases
		**/

		this.arr = this.arrays;
		this.bln = this.booleans;
		this.fnc = this.functions;
		this.nmb = this.numbers;
		this.obj = this.objects;
		this.slc = this.selectors;
		this.str = this.strings;
		this.sbr = this.subroutine;

		this.spreads = { injected: [], models: [], cache: [], scripts: { urls: [], codes: [] } };
		this.spr = this.spreads;

		// return srt[1](settings, callback);

		// } else if (typeof window.nv == "object") { // Respawned.
		//     nv.booleans.respawn = !0;
		//     nv = window.nv;
		// }
		// return subroutine[1](settings, callback);
	}
	// }

	logMyself() {
		console.log(this);
	}

}

export default INVNTM;
