function nv(settings, callback) { // NV Iota
    "use strict";
    var spreads_pending = 0;
    var navOriginalLength = 0;
    var spreads_scripts = {
        urls: [],
        codes: []
    };
    var subroutine = [
        function SRT0(settings, callback) { // "nv initialization."
            if (settings && typeof settings != "object") settings = !1, console.error("Settings is to be an object.");
            if (callback && typeof callback != "function") callback = !1, console.error("Callback is to be a function.");
            if (typeof window.nv == "function") { // Upon first spawn, this is a constructor.
                nv = {
                    arrays: {},
                    add: function add(element, name) {
                        return nv[(typeof element).concat('s')][name] = element;
                    },
                    booleans: {
                        respawn: !1 // This is the initial spawn, so run all initializations.
                    },
                    functions: {
                        get: function (target, onsuccess, data, onfail, callback) {
                            if (nv.fnc.loading_module) nv.fnc.loading_module('Downloading');
                            var elementToCreate = function (URL) {
                                if (URL.indexOf(".js") != -1) return "SCRIPT"
                                if (URL.indexOf(".css") != -1) return "STYLE"
                                return !1
                            };
                            if (onfail == void 0) onfail = function () {
                                var error_message = ['Failed to fetch from ', target].join('');
                                throw new URIError(error_message)
                            }
                            if (onsuccess == void 0) { // Assumes .JS or .CSS target.
                                if (typeof target == "string") {
                                    onsuccess = function (xhr) {
                                        var s = document.createElement(elementToCreate(target)),
                                            tempid = xhr.responseURL.split("/");
                                        tempid = tempid[tempid.length - 1];
                                        s.setAttribute("data-source", tempid);
                                        s.textContent = xhr.responseText.concat([("\n//# sourceURL="), xhr.responseURL].join(""));
                                        document.body.appendChild(s);
                                    };
                                }
                            }
                            if (Array.isArray(target)) {
                                var Q = target.reverse(),
                                    x = Q.length;
                                callback = onsuccess;
                                while (x--) { // CSS / JS handler is redundant.
                                    if (onfail == void 0) onfail = function () {}
                                    if (!x) {
                                        nv.functions.get(Q[x], onsuccess, data, onfail);
                                    } else {
                                        nv.functions.get(Q[x], onsuccess, data, onfail, callback)
                                    }
                                }
                                return !0
                            } else {
                                var xhr = new XMLHttpRequest();
                                xhr.data = data;
                                if (xhr.responseURL === void 0) xhr.responseURL = target.indexOf('//') === -1 ? window.location.href.concat(target) : target // Polyfill, responseURL is not common
                                xhr.open("GET", target);
                                xhr.onprogress = function (progress) {
                                        if (progress.lengthComputable) {
                                            var percentComplete = progress.loaded / progress.total;
                                            if (percentComplete != 1) console.log(percentComplete);
                                        }
                                    },
                                    xhr.onloadend = function () {
                                        if (xhr.status == 200) {
                                            onsuccess(xhr);
                                            if (nv.fnc.loading_module) nv.fnc.loading_module('');
                                        } else if (xhr.status >= 500 && xhr.status < 600) { // https://cloud.google.com/storage/docs/json_api/v1/how-tos/upload#exp-backoff
                                            console.warn("Server error, retrying request.");
                                            if (!nv.numbers.backoff) nv.numbers.backoff = .5
                                            if (nv.numbers.backoff < 5) {
                                                if (nv.fnc.loading_module) nv.fnc.loading_module('Error');
                                                return setTimeout(function () {
                                                    nv.functions.get(xhr.responseURL, onsuccess, data, onfail, callback)
                                                }, (Math.random() + (nv.numbers.backoff += nv.numbers.backoff)) * 1000)
                                            } else onfail(xhr)
                                        } else onfail(xhr)
                                    };
                                xhr.send();
                            }
                            return target
                        }
                    },
                    numbers: {},
                    objects: {},
                    selectors: {},
                    spreads: {
                        injected: [],
                        models: [],
                        cache: [],
                        scripts: {
                            urls: [],
                            codes: []
                        }
                    },
                    strings: {},
                    subroutine: subroutine,
                    writable: !0
                }
                nv.arr = nv.arrays;
                nv.bln = nv.booleans;
                nv.fnc = nv.functions;
                nv.nmb = nv.numbers;
                nv.obj = nv.objects;
                nv.slc = nv.selectors;
                nv.spr = nv.spreads;
                nv.str = nv.strings;
                nv.sbr = nv.subroutine;
            } else if (typeof window.nv == "object") { // Respawned.
                nv.booleans.respawn = !0;
                nv = window.nv;
            }
            return subroutine[1](settings, callback);
        },
        function SRT1(settings, callback) { // "Map settings."
            if (settings) {
                for (var x in settings) { // Traverse layer one nv.*
                    if (x !== "spreads") { // "spreads" special keyword for settings.
                        for (var y in settings[x]) { // Traverse layer two nv.*.*
                            if (settings[x].hasOwnProperty(y)) nv[x][y] = settings[x][y]
                        }
                    } else if (typeof settings[x] == "string") {
                        nv[x].injected.push(settings[x]); // Fix for single spread inject. Tears up string of URL and uses each letter. Untested with nv.spreads proto.
                    } else if (Array.isArray(settings[x])) {
                        var z = settings[x].length;
                        while (z--) nv[x].injected.push(settings[x][z]) // Push settings spreads to "nv.spreads.injected"
                    }
                }
            }
            var $ = nv.selectors;
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
                    var MAIN = document.createElement("MAIN");
                    MAIN.id = "Spreads";
                    $.spreads = MAIN;
                    document.body.appendChild(MAIN);
                    return subroutine[2](nv.spreads.injected, callback);
                } else return subroutine[4](callback) // Skip spread initializations (toolkit mode).
            }
        },
        function SRT2(spread_url, callback) { // "Spreads; scan for directories; scrape; restart."
            if (!spread_url || spread_url == void 0) {
                if (nv.spreads.cache) {
                    nv.spreads.injected = nv.spreads.cache;
                } // Merge cache to injected...not sure if optimal place?
                return subroutine[3](callback)
            }
            /**
             * This is the auto-spread-injector function.
             * Downloads array synchronously.
             */
            if (Array.isArray(spread_url)) { // If array, pull out elements and fetch. This is a simple queue system.
                if (spread_url.length) {
                    // console.log(spreads_pending,192);
                    spreads_pending = spread_url.length;
                    return subroutine[2](nv.spreads.injected.pop(), callback)
                } else return subroutine[3](callback)
            } else if (typeof spread_url == "string") { // Assume this is a URL (string).
                var isDirectory = !0; // Assume that this URL points to a directory.
                if (spread_url.lastIndexOf(".") != -1) // Is there a "." ?
                    if (spread_url.lastIndexOf(".") > spread_url.lastIndexOf("/")) // Is this dot pattern after the last "/" ?
                        if (spread_url.lastIndexOf("..") <= spread_url.lastIndexOf("/")) isDirectory = !1 // If this "." is not a ".." after the last "/" then this is a file.
                // # Nice comment for demos -> // console.log("Spread", ["\"", spread_url, "\""].join(""), "is a", isDirectory ? "directory." : "file.")
                if (isDirectory && spread_url.slice(-1) != "/") spread_url = spread_url.concat("/") // Add missing forward slash to URL if directory.
                nv.functions.get(spread_url, function onsuccess(xhr) {
                    if (xhr.responseURL.indexOf(".htm") != -1 || xhr.responseURL.indexOf(".php") != -1) { // If target URL containing .htm (.html) or .php extension, defer to individual injection.
                        // # Nice comment for demos -> // console.log(["✅ \"", spread_url, "\""].join(""))
                        nv.spreads.cache.push({
                            uri: spread_url,
                            data: xhr.response
                        });
                        subroutine[2](nv.spreads.injected.pop(), callback)
                    } else {
                        if (xhr.response.toUpperCase().indexOf("<!DOCTYPE HTML") != -1) { // HTML detected, time to scrape anchors.
                            var raw = xhr.response.match(/a href=\".+?\"/ig),
                                options = [];
                            if (raw == null) console.warn("Failed to scrape hrefs from target document.")
                            else {
                                var x = 0;
                                while (raw.length - 1 > x++) {
                                    if (raw[x].charAt(8) != "?") { // hrefs starting with "?" are only for the Apache directory screen. charAt(8) because 'a href="' is 7 characters long.
                                        var url = (raw[x].replace('a href="', '')).slice(0, -1);
                                        if (-1 === url.indexOf(" ")) url = decodeURI(url);
                                        options.push(url) // Extracts URL from within 'a href="', '"' wrapper.
                                    }
                                }
                            }
                        } else { // If HTML is not detected, assume that it is the proper array of URLs to spreads to inject. This could be a CMS array( ! )
                            try {
                                var options = JSON.parse(xhr.response); // JSON.parse is always risky business, so wrapping inside of try catch.
                            } catch (e) {
                                console.log("Invalid response from nv.functions.spreads(*) target", e, xhr.response);
                                return subroutine[2](nv.spreads.injected.pop(), callback); // Exit
                            }
                        }
                        var x = -1;
                        while (options.length - 1 > x++) {
                            if (Array.isArray(options[x])) {
                                var y = 0, // Array length of multidimensional (internal) array. [ "" , [ "" , ""] , "" ]
                                    z = y; // Offset.
                                while (options[x].length - 1 > y++) options.unshift(options[x][y]) // Flatten multidimensional array.
                                options.splice(x -= z, 1); // Remove multidimensional array.
                            }
                            if (options[x].match(/.+(?=(\.html?$|\.php$)).+/i) && (options[x].charAt(1) == "." || options[x].charAt(0) != ".") && options[x] != "index.php") {
                                nv.spreads.cache.push({
                                    uri: spread_url.concat(options[x])
                                }); // ajax "cache" store in ".cache". Also near line 180.
                                // console.log(["✅ \"", options[x], "\""].join(""))
                            } else console.log(["❌ \"", options[x], "\""].join(""))
                        }
                        subroutine[2](nv.spreads.injected.pop(), callback); // This allows for multiple directory checks.
                    }
                }, null, function onfail(xhr) {
                    console.error("XHR failure.", xhr);
                    subroutine[2](nv.spreads.injected.pop(), callback); // Proceed to next.
                });
            } else { // Constructed spread (object) encountered, likely a respawn. This is now damage control.
                nv.spreads.injected = []; // Wipe clean because one spread has already been popped off.
                var incomingSpreads = Object.keys(nv.spreads.cache),
                    collisions = [],
                    x = incomingSpreads.length;
                while (x--) {
                    nv.spreads.each(function (s) { // Search and destroy spread name collisions, reject incoming redundant spread names.
                        if (incomingSpreads[x].slice(incomingSpreads[x].lastIndexOf("/") + 1)
                            .toLowerCase().indexOf(s.el.id.toLowerCase()) !== -1) collisions.push(incomingSpreads.splice(x, 1)) // Reject the conflict.
                    })
                }
                if (collisions.length) console.error(["❌ Conflicts rejected: \"", collisions, "\""].join("")) // Report collisions.
                return subroutine[2](nv.spreads.cache.pop(), callback) // Damage control complete.
            }
        },
        function SRT3(callback) { // "Spread construction."
            // Test via a getter in the options object to see if the passive property is accessed
            var supportsPassive = false;
            try {
                var opts = Object.defineProperty({}, 'passive', {
                    get: function () {
                        supportsPassive = true;
                    }
                });
                window.addEventListener("testPassive", null, opts);
                window.removeEventListener("testPassive", null, opts);
            } catch (e) {}
            var parse_javascript = function parse_javascript(html_content) { //  html_content = STRING
                // # Nice comment for demos -> // console.log("✅", html_content.data);
                var html_content_copy = html_content;
                if (html_content_copy && html_content_copy.indexOf("<script") != -1) { // Scans for scripts.
                    var scriptParses = html_content_copy.match(/<script[\S\s]*?<\/script>/ig), // Parses scripts, preserves line breaks.
                        urls = [],
                        codesIndicies = [];
                    var x = scriptParses.length,
                        script_src_regex = /src=["'].+?["' ]/ig;
                    while (x--) urls.push(scriptParses[x].match(script_src_regex))
                    x = urls.length;
                    var z = x - 1, // Length offset to prepare for next loop.
                        script_url_regex = /[\'|\"]+/g; // Precompiled regex
                    var y = -1;
                    while (x--) { // urls = [Array[1], null]
                        if (urls[x]) { // Script has source, collect URL.
                            y = urls[x].length;
                            while (y--) { // Remove src=, and all single/double quotes to expose only script URL
                                if (urls[x][y]) {
                                    urls[x][y] = urls[x][y].replace("src=", "");
                                    spreads_scripts.urls.push(urls[x][y].replace(script_url_regex, ''))
                                }
                            }
                        } else codesIndicies.push(z - x) // Reverse index to loop again backwards.
                    }
                    x = codesIndicies.length;
                    y = -1;
                    var openScriptRegex = /<scrip.+?>/,
                        closeScriptRegex = /<\/scrip.+?>/;
                    while (x > ++y) { // Non matches for "script src=".
                        html_content_copy = scriptParses[codesIndicies[y]].replace(openScriptRegex, "");
                        html_content_copy = html_content_copy.replace(closeScriptRegex, "");
                        if (html_content_copy.length) spreads_scripts.codes.push(html_content_copy)
                    }
                }
                return html_content.replace(/\n\s+|\n/g, ''); // :-( Regex twice to preserve line breaks for code, then remove whitespace for "display:inline-block" bug, and pretty DOM.
            };
            if (nv.selectors.spreads) {
                var Spreads = function Spreads(DOMSpreads, injectURLs) { // Spread constructor and adds each to controller.
                    this.models = []; // Spreads completed prototype looks like: ".models", ".injected", ".active", ".scripts".
                    this.cache = [];
                    if (injectURLs) {
                        this.injected = [];
                        // this.scripts = { // Parses scripts from injected spreads, appends to document.body after AJAX to automatically execute.
                        // urls: [],
                        // codes: []
                        // };
                        var w = injectURLs.injected.length,
                            x = -1,
                            sectionSRC = document.createElement("SECTION");
                        spreads_pending = w;
                        // console.log(spreads_pending , w, 327);
                        while (w > ++x) {
                            var section = sectionSRC.cloneNode(!1); // The most efficient way to recreate an element.
                            if (typeof injectURLs.injected[x].uri == "string") { // URL expected. This is the proper way to pass in injected spreads.
                                var tempid = injectURLs.injected[x].uri.split("/");
                                section.setAttribute("data-injected", injectURLs.injected[x].uri); // Stores the URL of the spread's target file, read later during AJAX for injection.
                                tempid = tempid[tempid.length - 1].split(".")[0]; // Remove AJAX target file path, and file extension (typically ".html")
                                tempid = tempid.charAt(0).toUpperCase().concat(tempid.slice(1)); // Capitalize the first character.
                                section.id = tempid;
                                injectURLs.injected[x].selector = section;
                                nv.selectors.spreads[tempid] = section;
                                nv.selectors.spreads.appendChild(section) // If no existing spread(s), just append this spread as child of #Spreads.
                                this.injected.push(section); // Place this spread ("section") into beginning of nv.spreads.injected
                                if (!injectURLs.injected[x].data) { //  one
                                    var get_spread = function get_spread(xhr) {
                                        xhr.data.innerHTML = [
                                            "<article>",
                                            parse_javascript(xhr.response),
                                            "</article>"
                                        ].join('');
                                        xhr.data.children[0].addEventListener('touchstart', function () {}, supportsPassive ? { passive: true } : false);
                                        if (!--spreads_pending) {
                                            // console.log('spreads_pending!', spreads_pending);
                                            subroutine[6]();
                                        }
                                    };
                                    nv.functions.get(injectURLs.injected[x].uri, get_spread, section);
                                } else { //  two
                                    section.innerHTML = [
                                        "<article>",
                                        parse_javascript(injectURLs.injected[x].data),
                                        "</article>"
                                    ].join('');
                                    section.children[0].addEventListener('touchstart', function () {}, { passive: true });
                                    if (!--spreads_pending) {
                                        // console.log('spreads_pending!', spreads_pending);
                                        subroutine[6]();
                                    }
                                }
                            } else {
                                console.error(injectURLs.injected[x], "You passed in something unexpected for the injected spread. Please pass in a URL.");
                                continue;
                            }
                        }
                    }
                    this.register(DOMSpreads);
                    // subroutine[6](callback); //  Callback when spreads are ready.
                    return this;
                };
                Spreads.prototype = {
                    register: function (DOMSpreads) {
                        var spreads = this.models,
                            i = 0,
                            len = DOMSpreads.length;
                        if (typeof len !== 'number') DOMSpreads = [DOMSpreads]
                        while (len > i) spreads.push(new Spread(DOMSpreads[--len]))
                        return this;
                    },
                    each: function (fn) {
                        var spreads = this,
                            spreadArr = spreads.models,
                            x = spreadArr.length;
                        while (x--) fn(spreadArr[x])
                        return spreads;
                    },
                    wrapAll: function () {
                        this.each(function (spread) {
                            spread.wrap()
                        });
                        return this
                    },
                    hero: function () {
                        return this.models[this.models.length - 1]
                    },
                    measure: function () {
                        var spreads = this;
                        spreads.each(function (spread) {
                            var spreadTop = spread.el.getBoundingClientRect().top;
                            if (spreadTop < window.innerHeight / 2) { spreads.active = spread }
                        });
                        spreads.each(function (spread) {
                            if (spread == spreads.active) spread.addClass("Active")
                            else spread.removeClass("Active")
                        });
                        return spreads
                    }
                };
                var Spread = function Spread(el) {
                    this.el = el;
                    return this;
                };
                Spread.prototype = {
                    wrap: function () { // Constructs vertical-align: middle Spread by placing all content inside of a cell, as well as removing white-space in HTML (inline-block bug fix).
                        var spread = this,
                            el = spread.el,
                            inner = el.innerHTML;
                        if (el.children[0]) { // Might be redundant - but this is for handling injecting an empty spread.
                            if (el.children[0].getAttribute("onclick") != "" && el.children[0].tagName != "ARTICLE") { // For respawn, check if null-onclick-article is the child, a signature of generated spreads.
                                el.innerHTML = ['<article onclick>', el.innerHTML.replace(/\n\s+/g, ''), '</article>'].join(""); // Inserts AJAX'd HTML, and removes line indentation, for pretty DOM and "display: inline-block" bug fix.
                            } else nv.booleans.respawn = !0 // Sound the alarm!.
                        }
                        return spread;
                    },
                    addClass: function (clas) { // Polyfill for classList.add().
                        var el = this.el,
                            classNames = el.className.split(' ');
                        if (classNames[0] === '') classNames.shift()
                        if (classNames.indexOf(clas) === -1) {
                            classNames.push(clas);
                            el.className = classNames.join(' ');
                        }
                        return this;
                    },
                    removeClass: function (clas) { // Polyfill for classList.remove().
                        var el = this.el,
                            classNames = el.className.split(' '),
                            cnIndex = classNames.indexOf(clas);
                        if (cnIndex !== -1) {
                            classNames.splice(cnIndex, 1);
                            el.className = classNames.join(' ');
                        }
                        return this;
                    }
                };
                nv.spreads = new Spreads(nv.selectors.spreads.children, nv.spreads) // Register main#Spreads children, and injected spreads, to controller.
            }
            return subroutine[4](callback)
        },
        function SRT4(callback) { // "Scan UI; build navigation."
            var scanUI = function scanUI(node, func) { //  Scan UI
                func(node);
                node = node.firstChild;
                while (node) {
                    scanUI(node, func);
                    node = node.nextSibling;
                }
            }
            scanUI(nv.selectors.ui, function (node) { // Registers UI and all child elements thereof to nv.selectors for convenience.
                if (node.nodeType == 1 &&
                    node.nodeName != "svg" &&
                    node.nodeName != "g" &&
                    node.nodeName != "path" &&
                    node.nodeName != "polygon" &&
                    node.nodeName != "polyline") { // Ensures that it will only register nodes with TAGs, unlike text nodes.
                    var uniqueRef = node.id.toLowerCase() || node.className.toLowerCase() || node.tagName.toLowerCase();
                    if (nv.selectors[uniqueRef] == void 0) nv.selectors[uniqueRef] = node // If slot in nv.selectors is empty, register DOM element.
                    else if (nv.selectors[uniqueRef] === node) { // If slot is occupied by the identical node.
                        // Do nothing.
                    } else { // Slot is not occupied by identical node.
                        var x = 1;
                        ! function noclobber(x) { // Increments the property name until a slot is available.
                            if (nv.selectors[uniqueRef.concat(++x)] == void 0) nv.selectors[uniqueRef.concat(x)] = node
                            else return noclobber(x)
                        }(x);
                    }
                }
            });
            if (nv.selectors.navigation) { //  Build UI
                var docFrag = document.createDocumentFragment(),
                    srcLI = document.createElement('LI'),
                    srcA = document.createElement("A");
                nv.spreads.each(function (spread) {
                    var el = spread.el,
                        id = el.id,
                        li = srcLI.cloneNode(!1),
                        a = srcA.cloneNode(!1);
                    if (!id) id = el.tagName || el.className
                    a.href = "#".concat(id);
                    a.textContent = id;
                    li.appendChild(a);
                    docFrag.appendChild(li)
                });
                if (nv.booleans.respawn) nv.selectors.navigation.innerHTML = "" // If respawned, wipe nav clean.
                nv.selectors.navigation.appendChild(docFrag);
                navOriginalLength = nv.selectors.navigation.children.length; // Seems very dirty.
            }
            return subroutine[5](callback)
        },
        function SRT5(callback) { // "Events."
            if (!nv.booleans.respawn) { // Add events once.

                var frame_instructions = active_cb;
                if (nv.spreads.measure) frame_instructions();

                window.addEventListener('error', error_cb);
                window.addEventListener("beforeunload", beforeunload_cb);
                window.addEventListener("scroll", frame_instructions);
                window.addEventListener("hashchange", frame_instructions);

                var devs = /beta|localhost|127.0.0.1|hexxie|:\d/igm;
                if (!devs.test(location.href)) nv.functions.get("/js/intelligence.js")
                else nv.booleans.dev = true

                function error_cb() {
                    if (nv.fnc.loading_module) {
                        nv.fnc.loading_module('Error');
                        setTimeout(function () {
                            nv.fnc.loading_module('');
                        }, 1000);
                    }
                    return false;
                }

                function active_cb() {
                    nv.spreads.measure && nv.spreads.measure();
                    if (nv.selectors.navigation) {
                        var x = navOriginalLength;
                        while (x--) {
                            var viewing = nv.selectors.navigation.children[x] && nv.selectors.navigation.children[x].children[0];
                            if (viewing && nv.spreads.active.el.id == viewing.innerHTML) viewing.className = "Active"
                            else viewing.className = "";
                        }
                        if (nv.spreads.hero().el.id != nv.spreads.active.el.id) {
                            nv.selectors.navigation.setAttribute("data-viewing", nv.spreads.active.el.id) // Sets UI title to name of spread if not looking at the first spread.
                        } else nv.selectors.navigation.setAttribute("data-viewing", "Navigation") // If looking at the first spread, set title to "Navigation" so that it is clear to the user that it is a navigation bar.
                    }
                }

                function beforeunload_cb() {
                    frame_instructions = function idleMode() {
                        window.setTimeout(function () {
                            window.requestAnimationFrame(frame_instructions)
                        }, (1000 / 2));
                    }
                }
            }
            return nv
        },
        function SRT6(callback) { // Handle scripts within injected spreads. Called synchronously after all spreads are injected.
            var scriptSRC = document.createElement("SCRIPT");
            if (spreads_scripts.codes.length) { // Could be optimized? "var x" declaration in IF?
                var y = spreads_scripts.codes.length;
                var x = -1;
                while (y > ++x) {
                    var s = scriptSRC.cloneNode(!1);
                    s.textContent = spreads_scripts.codes[x];
                    document.body.appendChild(s)
                }
            }
            if (spreads_scripts.urls.length) { // Redundant logic.
                var y = spreads_scripts.urls.length;
                var x = -1;
                while (y > ++x) {
                    var s = scriptSRC.cloneNode(!1);
                    s.src = spreads_scripts.urls[x];
                    document.body.appendChild(s) // Independently appended (no document fragment) to each will execute each.
                }
            }
            if (window.location.hash.length) window.location = window.location; // Jump to hash href.
            if (callback) callback()
            return nv
        }
    ];
    window.nv = nv;
    return subroutine[0](settings, callback)
}