module.exports = function SRT6(transport?: { callback?: Function }) {
  // Handle scripts within injected spreads. Called synchronously after all spreads are injected.
  rep(this, `codes`, `textContent`);
  rep(this, `urls`, `src`);
  if (window.location.hash.length) window.location = window.location; // Jump to hash href.
  if (transport && transport.callback) return transport.callback()
  // return nv
}
let scriptSRC = document.createElement(`SCRIPT`);
function rep(self: any, target: string, property: string) {
  if (self.spreadsScripts[target].length) { // Could be optimized? `var x` declaration in IF?
    let y = self.spreadsScripts[target].length;
    let x = -1;
    while (++x < y) {
      let s = scriptSRC.cloneNode(!1);
      s[property] = self.spreadsScripts[target][x];
      document.body.appendChild(s)
    }
  }
}