
let frame_instructions: Function;
// let scrolling: boolean = false;
module.exports = function SRT5() { // `Events.`
    // if (!this.bln.respawn) { // Add events once.

    frame_instructions = active_cb;
    if (this.spr.measure) frame_instructions.bind(this);

    window.addEventListener(`error`, error_cb.bind(this));
    window.addEventListener(`beforeunload`, beforeunload_cb.bind(this));
    window.addEventListener(`scroll`, frame_instructions.bind(this));

    // window.addEventListener(`scroll`, () => scrolling = true);
    // window.setInterval(() => {
    //     // console.log(scrolling);
    //     if (scrolling) {
    //         frame_instructions.bind(this);
    //         scrolling = false;
    //     }
    // }, 1000 / 60);

    window.addEventListener(`hashchange`, frame_instructions.bind(this));

    let devs = /beta|localhost|127.0.0.1|hexxie|:\d/igm;
    if (!devs.test(location.href)) this.fnc.get(`/js/intelligence.js`)
    else this.bln.dev = true


    // }
    // return nv
}

function error_cb() {
    if (this.fnc.loading_module) {
        this.fnc.loading_module(`Error`);
        setTimeout(function() {
            this.fnc.loading_module(``);
        }, 1000);
    }
    return false;
}

function active_cb() {
    this.spr.measure && this.spr.measure();
    if (this.slc.navigation) {
        let x = navOriginalLength;
        while (x--) {
            let viewing = this.slc.navigation.children[x] && this.slc.navigation.children[x].children[0];
            if (viewing && this.spr.active.el.id == viewing.innerHTML) viewing.className = `Active`
            else viewing.className = ``;
        }
        if (this.spr.hero().el.id != this.spr.active.el.id) this.slc.navigation.setAttribute(`data-viewing`, this.spr.active.el.id) // Sets UI title to name of spread if not looking at the first spread.
        else this.slc.navigation.setAttribute(`data-viewing`, `Navigation`) // If looking at the first spread, set title to `Navigation` so that it is clear to the user that it is a navigation bar.
    }
}

function beforeunload_cb() {
    frame_instructions = function idleMode() {
        window.setTimeout(function() {
            window.requestAnimationFrame(frame_instructions)
        }, (1000 / 2));
    }
}