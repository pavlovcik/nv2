module.exports = function SRT6(callback) { // Handle scripts within injected spreads. Called synchronously after all spreads are injected.
  let scriptSRC = document.createElement("SCRIPT");
  if (spreadsScripts.codes.length) { // Could be optimized? "var x" declaration in IF?
    let y = spreadsScripts.codes.length;
    let x = -1;
    while (y > ++x) {
      let s = scriptSRC.cloneNode(!1);
      s.textContent = spreadsScripts.codes[x];
      document.body.appendChild(s)
    }
  }
  if (spreadsScripts.urls.length) { // Redundant logic.
    let y = spreadsScripts.urls.length;
    let x = -1;
    while (y > ++x) {
      let s = scriptSRC.cloneNode(!1);
      s.src = spreadsScripts.urls[x];
      document.body.appendChild(s) // Independently appended (no document fragment) to each will execute each.
    }
  }
  if (window.location.hash.length) window.location = window.location; // Jump to hash href.
  if (callback) callback()
  return nv
}