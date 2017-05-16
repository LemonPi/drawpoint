/**
 * Created by johnson on 16.05.17.
 */
function array(nodeList) {
    return Array.prototype.slice.call(nodeList);
}
function find(qs) {
    return array(document.querySelectorAll(qs));
}

function loadAll() {
    var list = find("figure script[type='text/drawpointcode']");
    list.forEach(function(e, idx) {
        var figure = e.parentNode;
        var code = e.textContent.substring(1).split("\n");
        // e.parentNode.removeChild(e);

        // capture how deep the initial indent is
        var indent = "";
        code[0].replace(/^(\s+)/, function(a,b) { indent = b; });

        var len = code.length;

        // first newline will indicate the break into drawing and rendering code
        var startDrawLine = 0;
        for (let i = 0; i < len; ++i) {
            code[i] = code[i].replace(indent,'');
            if (startDrawLine === 0 && code[i] === '') {
                startDrawLine = i;
            }
        }
        var defineCode = code.slice(0, startDrawLine).join("\n");
        var drawCode = code.slice(startDrawLine+1).join("\n");
        console.log("define code", defineCode);
        console.log("draw code", drawCode);

        createInteractiveCanvas(idx, defineCode, drawCode);

        // view code area (always shown)
        var codearea = document.createElement("pre");
        codearea.classList.add("textarea");

        // this the is the actual drawing and rendering code which we'll do with our own p1 and p2
        codearea.textContent = defineCode + "\n\n" + drawCode;
        codearea.setAttribute("style", "height: " + (16*(len-1)) + "px!important;");
        figure.appendChild(codearea);

        // var ns = document.createElement("script");
        // ns.textContent = content;
        // document.querySelector("head").appendChild(ns);
    });
}

document.addEventListener("DOMContentLoaded", loadAll);