module.exports = function SRT3(transport) { // "Spread construction."

    // Test via a getter in the options object to see if the passive property is accessed
    let supportsPassive = false;
    try {
        let opts = Object.defineProperty({}, 'passive', {
            get: () => supportsPassive = true;
        });
        window.addEventListener("testPassive", null, opts);
        window.removeEventListener("testPassive", null, opts);

    } catch (e) { }

    if (this.slc.spreads) {
        this.spr = new Spreads(this.slc.spreads.children, this.spr) // Register main#Spreads children, and injected spreads, to controller.
    }
    return this.next(transport, 4)
}


function parseJavaScript(html_content: string) { //  html_content = STRING
    // # Nice comment for demos -> // console.log("✅", html_content.data);
    let html_content_copy = html_content;
    if (html_content_copy && html_content_copy.indexOf("<script") != -1) { // Scans for scripts.
        let scriptParses = html_content_copy.match(/<script[\S\s]*?<\/script>/ig), // Parses scripts, preserves line breaks.
            urls = [],
            codesIndicies = [];
        let x = scriptParses.length,
            script_src_regex = /src=["'].+?["' ]/ig;
        while (x--) urls.push(scriptParses[x].match(script_src_regex))
        x = urls.length;
        let z = x - 1, // Length offset to prepare for next loop.
            script_url_regex = /[\'|\"]+/g; // Precompiled regex
        let y = -1;
        while (x--) { // urls = [Array[1], null]
            if (urls[x]) { // Script has source, collect URL.
                y = urls[x].length;
                while (y--) { // Remove src=, and all single/double quotes to expose only script URL
                    if (urls[x][y]) {
                        urls[x][y] = urls[x][y].replace("src=", "");
                        spreadsScripts.urls.push(urls[x][y].replace(script_url_regex, ''))
                    }
                }
            } else codesIndicies.push(z - x) // Reverse index to loop again backwards.
        }
        x = codesIndicies.length;
        y = -1;
        let openScriptRegex = /<scrip.+?>/,
            closeScriptRegex = /<\/scrip.+?>/;
        while (x > ++y) { // Non matches for "script src=".
            html_content_copy = scriptParses[codesIndicies[y]].replace(openScriptRegex, "");
            html_content_copy = html_content_copy.replace(closeScriptRegex, "");
            if (html_content_copy.length) spreadsScripts.codes.push(html_content_copy)
        }
    }
    return html_content.replace(/\n\s+|\n/g, ''); // :-( Regex twice to preserve line breaks for code, then remove whitespace for "display:inline-block" bug, and pretty DOM.
};
function Spreads(DOMSpreads, injectURLs) { // Spread constructor and adds each to controller.
    this.models = []; // Spreads completed prototype looks like: ".models", ".injected", ".active", ".scripts".
    this.cache = [];
    if (injectURLs) {
        this.injected = [];
        // this.scripts = { // Parses scripts from injected spreads, appends to document.body after AJAX to automatically execute.
        // urls: [],
        // codes: []
        // };
        let w = injectURLs.injected.length,
            x = -1,
            sectionSRC = document.createElement("SECTION");
        this.spreadsPending = w;
        // console.log(this.spreadsPending , w, 327);
        while (w > ++x) {
            let section = sectionSRC.cloneNode(!1); // The most efficient way to recreate an element.
            if (typeof injectURLs.injected[x].uri == "string") { // URL expected. This is the proper way to pass in injected spreads.
                let tempid = injectURLs.injected[x].uri.split("/");
                section.setAttribute("data-injected", injectURLs.injected[x].uri); // Stores the URL of the spread's target file, read later during AJAX for injection.
                tempid = tempid[tempid.length - 1].split(".")[0]; // Remove AJAX target file path, and file extension (typically ".html")
                tempid = tempid.charAt(0).toUpperCase().concat(tempid.slice(1)); // Capitalize the first character.
                section.id = tempid;
                injectURLs.injected[x].selector = section;
                this.slc.spreads[tempid] = section;
                this.slc.spreads.appendChild(section) // If no existing spread(s), just append this spread as child of #Spreads.
                this.injected.push(section); // Place this spread ("section") into beginning of this.spreads.injected
                if (!injectURLs.injected[x].data) { //  one
                    this.fnc.get(injectURLs.injected[x].uri, getSpread, section);
                } else { //  two
                    section.innerHTML = [
                        "<article>",
                        parseJavaScript(injectURLs.injected[x].data),
                        "</article>"
                    ].join('');
                    section.children[0].addEventListener('touchstart', function() { }, { passive: true });
                    if (!--this.spreadsPending) {
                        // console.log('this.spreadsPending!', this.spreadsPending);
                        this.next(transport, 6)
                    }
                }
            } else {
                console.error(injectURLs.injected[x], "You passed in something unexpected for the injected spread. Please pass in a URL.");
                continue;
            }
        }
    }
    this.register(DOMSpreads);
    // this.next(
    // { transport.callback); //  Callback when spreads are ready}, 6
    // )
    return this;
    function getSpread(xhr) {
        xhr.data.innerHTML = [
            "<article>",
            parseJavaScript(xhr.response),
            "</article>"
        ].join('');
        xhr.data.children[0].addEventListener('touchstart', function() { }, supportsPassive ? { passive: true } : false);
        if (!--this.spreadsPending) {
            // console.log('this.spreadsPending!', this.spreadsPending);
            this.next(transport, 6)
        }
    };
};
Spreads.prototype = {
    register: function(DOMSpreads) {
        let spreads = this.models,
            i = 0,
            len = DOMSpreads.length;
        if (typeof len !== 'number') DOMSpreads = [DOMSpreads]
        while (len > i) spreads.push(new Spread(DOMSpreads[--len]))
        return this;
    },
    each: function(fn) {
        let spreads = this,
            spreadArr = spreads.models,
            x = spreadArr.length;
        while (x--) fn(spreadArr[x])
        return spreads;
    },
    wrapAll: function() {
        this.each(function(spread) {
            spread.wrap()
        });
        return this
    },
    hero: function() {
        return this.models[this.models.length - 1]
    },
    measure: function() {
        let spreads = this;
        spreads.each(function(spread) {
            let spreadTop = spread.el.getBoundingClientRect().top;
            if (spreadTop < window.innerHeight / 2) { spreads.active = spread }
        });
        spreads.each(function(spread) {
            if (spread == spreads.active) spread.addClass("Active")
            else spread.removeClass("Active")
        });
        return spreads
    }
};
let Spread = function Spread(el) {
    this.el = el;
    return this;
};
Spread.prototype = {
    wrap: function() { // Constructs vertical-align: middle Spread by placing all content inside of a cell, as well as removing white-space in HTML (inline-block bug fix).
        let spread = this,
            el = spread.el,
            inner = el.innerHTML;
        if (el.children[0]) { // Might be redundant - but this is for handling injecting an empty spread.
            if (el.children[0].getAttribute("onclick") != "" && el.children[0].tagName != "ARTICLE") { // For respawn, check if null-onclick-article is the child, a signature of generated spreads.
                el.innerHTML = ['<article onclick>', el.innerHTML.replace(/\n\s+/g, ''), '</article>'].join(""); // Inserts AJAX'd HTML, and removes line indentation, for pretty DOM and "display: inline-block" bug fix.
            } else this.booleans.respawn = !0 // Sound the alarm!.
        }
        return spread;
    },
    addClass: function(clas) { // Polyfill for classList.add().
        let el = this.el,
            classNames = el.className.split(' ');
        if (classNames[0] === '') classNames.shift()
        if (classNames.indexOf(clas) === -1) {
            classNames.push(clas);
            el.className = classNames.join(' ');
        }
        return this;
    },
    removeClass: function(clas) { // Polyfill for classList.remove().
        let el = this.el,
            classNames = el.className.split(' '),
            cnIndex = classNames.indexOf(clas);
        if (cnIndex !== -1) {
            classNames.splice(cnIndex, 1);
            el.className = classNames.join(' ');
        }
        return this;
    }
};