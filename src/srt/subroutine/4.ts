module.exports = function SRT4(callback) { // "Scan UI; build navigation."
    let scanUI = function scanUI(node, func) { //  Scan UI
        func(node);
        node = node.firstChild;
        while (node) {
            scanUI(node, func);
            node = node.nextSibling;
        }
    }
    scanUI(nv.selectors.ui, function(node) { // Registers UI and all child elements thereof to nv.selectors for convenience.
        if (node.nodeType == 1 && node.nodeName != "svg" && node.nodeName != "g" && node.nodeName != "path" && node.nodeName != "polygon" && node.nodeName != "polyline") { // Ensures that it will only register nodes with TAGs, unlike text nodes.
            let uniqueRef = node.id.toLowerCase() || node.className.toLowerCase() || node.tagName.toLowerCase();
            if (nv.selectors[uniqueRef] == void 0) nv.selectors[uniqueRef] = node // If slot in nv.selectors is empty, register DOM element.
            else if (nv.selectors[uniqueRef] === node) { // If slot is occupied by the identical node.
                // Do nothing.
            } else { // Slot is not occupied by identical node.
                let x = 1;
                ! function noclobber(x) { // Increments the property name until a slot is available.
                    if (nv.selectors[uniqueRef.concat(++x)] == void 0) nv.selectors[uniqueRef.concat(x)] = node
                    else return noclobber(x)
                }(x);
            }
        }
    });
    if (nv.selectors.navigation) { //  Build UI
        let docFrag = document.createDocumentFragment(),
            srcLI = document.createElement('LI'),
            srcA = document.createElement("A");
        nv.spreads.each(function(spread) {
            let el = spread.el,
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
}