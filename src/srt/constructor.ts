import GET from "./get";

import SUBROUTINES from "./subroutines";

export function generateTestCallback() {
	return function testCallback(input: any) { console.log({ input }) }
}

class INVNTM {
	public arr: object;	// arrays
	public bln: object;	// booleans
	public fnc: object;	// functions
	public nmb: object;	// numbers
	public obj: object;	// objects
	public slc: object;	// selectors
	public spr: object;	// spreads
	public str: object;	// strings
	public sbr: object;	// subroutine

	public logMyself() {
		console.log(this);
	}

	private next(settings: object, callback: Function) {
		console.log(SUBROUTINES);
		let currentRoutine = SUBROUTINES.shift();
		if (currentRoutine != void 0) return currentRoutine(settings, callback)
		else return false
	}

	constructor(settings: object, callback: Function) {
		if (settings && typeof settings != "object") settings = {}, console.warn("Settings is to be an object.");
		if (callback && typeof callback != "function") callback = () => { }, console.warn("Callback is to be a function.");
		this.arr = {};
		this.bln = {};
		this.fnc = { get: GET };
		this.nmb = {};
		this.obj = {};
		this.slc = {};
		this.str = {};
		this.sbr = {};
		this.spr = { injected: [], models: [], cache: [], scripts: { urls: [], codes: [] } };
		return this.next(settings, callback);
	}
}
export default INVNTM;