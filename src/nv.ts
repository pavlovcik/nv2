import srt, { generateTestCallback } from './srt/srt';

module.exports = function nv(settings: object, callback: Function) {
	const self = new srt(settings, generateTestCallback());
	self.logMyself();
	return self
}