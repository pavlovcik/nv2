const UNDEF = void 0;

function elementToCreate(URL: string) {
    if (URL.indexOf(`.js`) != -1) return `SCRIPT`
    if (URL.indexOf(`.css`) != -1) return `STYLE`
    return !1
};

function defaultOnSuccessCurry(target: string): Function {
    return function defaultOnSuccess(xhr) {
        let element = elementToCreate(target);
        if (!element) return

        let s = document.createElement(element),
            temporaryID = xhr.responseURL.split(`/`);

        temporaryID = temporaryID[temporaryID.length - 1];
        s.setAttribute(`data-source`, temporaryID);
        s.textContent = xhr.responseText.concat([(`\n//# sourceURL=`), xhr.responseURL].join(``));
        document.body.appendChild(s);
    }
};

function defaultOnFail() {
    let error_message = ['Failed to fetch from ', target].join('');
    throw new URIError(error_message)
}

export default function GET(
    target: string | Array<string>,
    onsuccess: Function,
    data: any,
    onfail: Function,
    callback: Function
) {
    if (SELF.fnc.loading_module) SELF.fnc.loading_module('Downloading');

    let SELF = this;

    if (onfail == UNDEF) onfail = defaultOnFail
    if (onsuccess == UNDEF) { // Assumes .JS or .CSS target.
        if (typeof target == `string`) onsuccess = defaultOnSuccessCurry(target)
    }
    if (Array.isArray(target)) {
        let Q = target.reverse(),
            x = Q.length;
        callback = onsuccess;
        while (x--) { // CSS / JS handler is redundant.
            if (onfail == UNDEF) onfail = function() { }
            if (!x) {
                SELF.functions.get(Q[x], onsuccess, data, onfail);
            } else {
                SELF.functions.get(Q[x], onsuccess, data, onfail, callback)
            }
        }
        return true
    } else {
        let xhr = new XMLHttpRequest();
        xhr.data = data;
        if (xhr.responseURL === UNDEF) xhr.responseURL = target.indexOf('//') === -1 ? window.location.href.concat(target) : target // Polyfill, responseURL is not common
        xhr.open(`GET`, target);
        xhr.onprogress = function(progress) {
            if (progress.lengthComputable) {
                let percentComplete = progress.loaded / progress.total;
                if (percentComplete != 1) console.log(percentComplete);
            }
        },
            xhr.onloadend = function() {
                if (xhr.status == 200) {
                    onsuccess(xhr);
                    if (SELF.fnc.loading_module) SELF.fnc.loading_module('');
                } else if (xhr.status >= 500 && xhr.status < 600) { // https://cloud.google.com/storage/docs/json_api/v1/how-tos/upload#exp-backoff
                    console.warn(`Server error, retrying request.`);
                    if (!SELF.numbers.backoff) SELF.numbers.backoff = .5
                    if (SELF.numbers.backoff < 5) {
                        if (SELF.fnc.loading_module) SELF.fnc.loading_module('Error');
                        return setTimeout(function() {
                            SELF.functions.get(xhr.responseURL, onsuccess, data, onfail, callback)
                        }, (Math.random() + (SELF.numbers.backoff += SELF.numbers.backoff)) * 1000)
                    } else onfail(xhr)
                } else onfail(xhr)
            };
        xhr.send();
    }
    return target
}