// interface SettingsAndCallback {
//     settings?: object;
//     callback?: Function;
// }

module.exports = function SRT1(transport: any) { // `Map settings.`

    let settings = transport.settings;
    const callback = transport.callback;

    // settings: object, callback: Function
    // settings: object, callback: Function,

    if (settings) {
        for (var x in settings) { // Traverse layer one this.*
            if (x !== `spreads`) { // `spreads` special keyword for settings.
                for (var y in settings[x]) { // Traverse layer two this.*.*
                    if (settings[x].hasOwnProperty(y)) this[x][y] = settings[x][y]
                }
            } else if (typeof settings[x] == `string`) {
                this.spr.injected.push(settings[x]); // Fix for single spread inject. Tears up string of URL and uses each letter. Untested with this.spreads proto.
            } else if (Array.isArray(settings[x])) {
                let z = settings[x].length;
                while (z--) this.spr.injected.push(settings[x][z]) // Push settings spr to `this.spr.injected`
            }
        }

        delete transport.settings

    }

    let $ = this.slc;

    //    if (!$.ui) $.ui = document.getElementById(`UI`) || document.getElementsByClassName(`UI`)[0] || document.getElementsByTagName(`UI`)[0] || false // If no UI tag, find it.
    //    if ($.ui) { // Navigation must be present only within UI. If no UI found, implies no Navigation.
    //        if (!$.ui.id) $.ui.id = `UI` // If no UI id, assign it.
    //        if (!$.navigation) $.navigation = document.getElementById(`Navigation`) || $.ui.getElementsByClassName(`Navigation`)[0] || $.ui.getElementsByTagName(`nav`)[0] || false
    //        if ($.navigation && !$.navigation.id) $.navigation.id = `Navigation`
    //    }

    $.spr = $.spr || document.getElementById(`Spreads`) || false
    if ($.spr) {

        if (!$.spr.id) $.spr.id = `Spreads`
        if (this.spr.injected.length) return this.next({ injected: this.spr.injected, callback }, 2)// Injection and native spr.
        else return this.next(transport, 3)// Native only.

    } else {

        if (this.spr.injected.length) { // Injection only.
            let MAIN = document.createElement(`MAIN`);
            MAIN.id = `Spreads`;
            $.spr = MAIN;
            document.body.appendChild(MAIN);
            return this.next({ injected: this.spr.injected, callback }, 2);
        } else return this.next(transport, 4)// Skip spread initializations (toolkit mode).
    }

}