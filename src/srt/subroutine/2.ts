module.exports = function SRT2(spread_url, callback) { // "Spreads; scan for directories; scrape; restart."
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
            // console.log(spreadsPending,192);
            spreadsPending = spread_url.length;
            return subroutine[2](nv.spreads.injected.pop(), callback)
        } else return subroutine[3](callback)
    } else if (typeof spread_url == "string") { // Assume this is a URL (string).
        let isDirectory = !0; // Assume that this URL points to a directory.
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
                    let raw = xhr.response.match(/a href=\".+?\"/ig),
                        options = [];
                    if (raw == null) console.warn("Failed to scrape hrefs from target document.")
                    else {
                        let x = 0;
                        while (raw.length - 1 > x++) {
                            if (raw[x].charAt(8) != "?") { // hrefs starting with "?" are only for the Apache directory screen. charAt(8) because 'a href="' is 7 characters long.
                                let url = (raw[x].replace('a href="', '')).slice(0, -1);
                                if (-1 === url.indexOf(" ")) url = decodeURI(url);
                                options.push(url) // Extracts URL from within 'a href="', '"' wrapper.
                            }
                        }
                    }
                } else { // If HTML is not detected, assume that it is the proper array of URLs to spreads to inject. This could be a CMS array( ! )
                    try {
                        let options = JSON.parse(xhr.response); // JSON.parse is always risky business, so wrapping inside of try catch.
                    } catch (e) {
                        console.log("Invalid response from nv.functions.spreads(*) target", e, xhr.response);
                        return subroutine[2](nv.spreads.injected.pop(), callback); // Exit
                    }
                }
                let x = -1;
                while (options.length - 1 > x++) {
                    if (Array.isArray(options[x])) {
                        let y = 0, // Array length of multidimensional (internal) array. [ "" , [ "" , ""] , "" ]
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
        let incomingSpreads = Object.keys(nv.spreads.cache),
            collisions = [],
            x = incomingSpreads.length;
        while (x--) {
            nv.spreads.each(function(s) { // Search and destroy spread name collisions, reject incoming redundant spread names.
                if (incomingSpreads[x].slice(incomingSpreads[x].lastIndexOf("/") + 1).toLowerCase().indexOf(s.el.id.toLowerCase()) !== -1) collisions.push(incomingSpreads.splice(x, 1)) // Reject the conflict.
            })
        }
        if (collisions.length) console.error(["❌ Conflicts rejected: \"", collisions, "\""].join("")) // Report collisions.
        return subroutine[2](nv.spreads.cache.pop(), callback) // Damage control complete.
    }
}