import GET from "./get";
import LOADING_MOD from "./loading-module";

class INVNTM {
	public arr: object; 	//	 arrays
	public bln: object; 	//	 booleans
	public fnc: object; 	//	 functions
	public nmb: object; 	//	 numbers
	public obj: object; 	//	 objects
	public slc: object; 	//	 selectors
	public spr: object; 	//	 spreads
	public str: object; 	//	 strings
	private sbr = Array<Function>;

	// public logMyself() {
	// 	console.log(this);
	// }
	private spreadsScripts = { urls: [], codes: [] };
	private spreadsPending: number = 0;
	private subroutineCursor: number = 0;
	private next(transport: object, override?: number) {
		if (!override)++this.subroutineCursor;
		else this.subroutineCursor = override;
		let currentRoutine = this.sbr[this.subroutineCursor];
		if (currentRoutine != void 0) return currentRoutine(transport)
		else return false
	}
	constructor(settings: object, callback: Function) {
		if (typeof settings != "object") settings = {}, console.warn("Settings is to be an object.");
		if (typeof callback != "function") callback = () => { }, console.warn("Callback is to be a function.");
		this.arr = {};
		this.bln = {};
		this.fnc = { get: GET, loading_module: LOADING_MOD.bind(this) };
		this.nmb = {};
		this.obj = {};
		this.slc = {};
		this.str = {};
		//
		this.sbr =
			// [];
			[ 	//	 subroutine
				null,
				require("./subroutine/1").bind(this),
				require("./subroutine/2").bind(this),
				require("./subroutine/3").bind(this),
				require("./subroutine/4").bind(this),
				require("./subroutine/5").bind(this),
				require("./subroutine/6").bind(this)
			];
		this.spr = { injected: [], models: [], cache: [], scripts: { urls: [], codes: [] } };
		return this.next({ settings, callback });
	}
}
export default INVNTM;