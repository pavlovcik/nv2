module.exports = function SRT5(callback) { // "Events."
    if (!nv.booleans.respawn) { // Add events once.

        let frame_instructions = active_cb;
        if (nv.spreads.measure) frame_instructions();

        window.addEventListener('error', error_cb);
        window.addEventListener("beforeunload", beforeunload_cb);
        window.addEventListener("scroll", frame_instructions);
        window.addEventListener("hashchange", frame_instructions);

        let devs = /beta|localhost|127.0.0.1|hexxie|:\d/igm;
        if (!devs.test(location.href)) nv.functions.get("/js/intelligence.js")
        else nv.booleans.dev = true

        function error_cb() {
            if (nv.fnc.loading_module) {
                nv.fnc.loading_module('Error');
                setTimeout(function() {
                    nv.fnc.loading_module('');
                }, 1000);
            }
            return false;
        }

        function active_cb() {
            nv.spreads.measure && nv.spreads.measure();
            if (nv.selectors.navigation) {
                let x = navOriginalLength;
                while (x--) {
                    let viewing = nv.selectors.navigation.children[x] && nv.selectors.navigation.children[x].children[0];
                    if (viewing && nv.spreads.active.el.id == viewing.innerHTML) viewing.className = "Active"
                    else viewing.className = "";
                }
                if (nv.spreads.hero().el.id != nv.spreads.active.el.id) nv.selectors.navigation.setAttribute("data-viewing", nv.spreads.active.el.id) // Sets UI title to name of spread if not looking at the first spread.
                else nv.selectors.navigation.setAttribute("data-viewing", "Navigation") // If looking at the first spread, set title to "Navigation" so that it is clear to the user that it is a navigation bar.
            }
        }

        function beforeunload_cb() {
            frame_instructions = function idleMode() {
                window.setTimeout(function() {
                    window.requestAnimationFrame(frame_instructions)
                }, (1000 / 2));
            }
        }
    }
    return nv
}