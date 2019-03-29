import GET from "./get";

// import SUBROUTINES from "./subroutines";


export function generateTestCallback() {
	return function testCallback(input: any) { console.log({ input }) }
}

class INVNTM {
	public arr: object; 	//	 arrays
	public bln: object; 	//	 booleans
	public fnc: object; 	//	 functions
	public nmb: object; 	//	 numbers
	public obj: object; 	//	 objects
	public slc: object; 	//	 selectors
	public spr: object; 	//	 spreads
	public str: object; 	//	 strings
	// public sbr: object; 	//	 subroutine

	public logMyself() {
		console.log(this);
	}

	private spreadsScripts = {
		urls: [],
		codes: []
	};

	private subroutineCursor: number = 0;

	private sbr = [
		null,
		require("./subroutine/1").bind(this),
		require("./subroutine/2").bind(this),
		require("./subroutine/3").bind(this),
		require("./subroutine/4").bind(this),
		require("./subroutine/5").bind(this),
		require("./subroutine/6").bind(this)
	];

	private next(transport: object, override?: number) {

		if (!override)++this.subroutineCursor;
		else this.subroutineCursor = override;

		let currentRoutine = this.sbr[this.subroutineCursor];

		console.log(currentRoutine);

		// console.log(this.subroutineCursor);
		// console.log(JSON.stringify(transport, null, `\t`));

		if (currentRoutine != void 0) return currentRoutine(transport)
		else return false
	}

	constructor(settings: object, callback: Function) {
		if (typeof settings != "object") settings = {}, console.warn("Settings is to be an object.");
		if (typeof callback != "function") callback = () => { }, console.warn("Callback is to be a function.");

		this.arr = {};
		this.bln = {};
		this.fnc = { get: GET };
		this.nmb = {};
		this.obj = {};
		this.slc = {};
		this.str = {};
		// this.sbr = [];
		this.spr = { injected: [], models: [], cache: [], scripts: { urls: [], codes: [] } };
		return this.next({
			settings,
			callback
		});
	}
}
export default INVNTM;