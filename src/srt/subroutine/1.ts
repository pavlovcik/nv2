module.exports = function SRT1(settings, callback) { // "Map settings."
    if (settings) {
        for (var x in settings) { // Traverse layer one nv.*
            if (x !== "spreads") { // "spreads" special keyword for settings.
                for (var y in settings[x]) { // Traverse layer two nv.*.*
                    if (settings[x].hasOwnProperty(y)) nv[x][y] = settings[x][y]
                }
            } else if (typeof settings[x] == "string") {
                nv[x].injected.push(settings[x]); // Fix for single spread inject. Tears up string of URL and uses each letter. Untested with nv.spreads proto.
            } else if (Array.isArray(settings[x])) {
                let z = settings[x].length;
                while (z--) nv[x].injected.push(settings[x][z]) // Push settings spreads to "nv.spreads.injected"
            }
        }
    }
    let $ = nv.selectors;
    if (!$.ui) $.ui = document.getElementById("UI") || document.getElementsByClassName("UI")[0] || document.getElementsByTagName("UI")[0] || !1 // If no UI tag, find it.
    if ($.ui) { // Navigation must be present only within UI. If no UI found, implies no Navigation.
        if (!$.ui.id) $.ui.id = "UI" // If no UI id, assign it.
        if (!$.navigation) $.navigation = document.getElementById("Navigation") || $.ui.getElementsByClassName("Navigation")[0] || $.ui.getElementsByTagName("nav")[0] || !1
        if ($.navigation && !$.navigation.id) $.navigation.id = "Navigation"
    }
    $.spreads = $.spreads || document.getElementById('Spreads') || !1
    if ($.spreads) {
        if (!$.spreads.id) $.spreads.id = "Spreads"
        if (nv.spreads.injected.length) return subroutine[2](nv.spreads.injected, callback) // Injection and native spreads.
        else return subroutine[3](callback) // Native only.
    } else {
        if (nv.spreads.injected.length) { // Injection only.
            let MAIN = document.createElement("MAIN");
            MAIN.id = "Spreads";
            $.spreads = MAIN;
            document.body.appendChild(MAIN);
            return subroutine[2](nv.spreads.injected, callback);
        } else return subroutine[4](callback) // Skip spread initializations (toolkit mode).
    }
}