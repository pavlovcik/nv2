import srt, { generateTestCallback } from './srt/constructor';

module.exports = function nv(settings: object, callback: Function) {

	const self = new srt(settings, callback);
	self.logMyself();
	return self
}