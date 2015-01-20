"use strict";

var _toArray = function (arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
};

// TODO: parse output and types to determine what classes to assign different spans
// TODO: console.log, warn, and error
// TODO: line numbers
// TODO: get ES6 statements working in the console
// TODO: code completion
// TODO: remember previous commands and allow a user to access them via the up key
// TODO[unreleated]: ideas for proxy objects:
// - use properties on objects to set attributes for DOM objects
// - RPC with iframes and web workers


var trueClick = require("./true_click");


function createConsole(container) {
    var textarea;
    var console;

    // initialization code
    if (false) {
        textarea = document.createElement("div");
        textarea.style.width = "100%";
        textarea.style.boxSizing = "border-box";
        textarea.setAttribute("contenteditable", "true");
        container.appendChild(textarea);

        trueClick.addEventListener(container, function (e) {
            textarea.focus();
        });

        textarea.addEventListener("keydown", function (e) {
            if (e.keyCode === 13) {
                if (!e.shiftKey) {
                    if (textarea.innerText.trim() !== "") {
                        addLine(textarea.innerText, "code");
                    }

                    // TODO: parse each line so that we can extract variable declaration to an outer context
                    runCode(textarea.innerText, function (result) {
                        console.log(result);
                        e.preventDefault();
                        resetInput();
                    });
                }
            }
        });
    }

    // hide the global definition
    // this allows multiple console emulators to run on the same page without
    // disrupting each other
    console = {
        log: function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            window.console.log.apply(window.console, args);
            var _args = _toArray(args);

            var first = _args[0];
            var rest = _toArray(_args).slice(1);

            addLine(first, typeof first);
        }
    };

    // "methods"
    var updateScroll = function () {
        setTimeout(function () {
            if (container.offsetHeight < container.scrollHeight) {
                container.scrollTop = container.scrollHeight - container.offsetHeight;
            }
        }, 0);
    };

    var addLine = function (value, cls) {
        var line = document.createElement("div");

        if (value instanceof Array) {
            line.appendChild(document.createTextNode("["));
            value.forEach(function (item, index) {
                if (index > 0) {
                    line.appendChild(document.createTextNode(", "));
                }
                var span = document.createElement("span");
                span.setAttribute("class", ["line", typeof item].join(" "));
                span.appendChild(document.createTextNode(item));
                line.appendChild(span);
            });
            line.appendChild(document.createTextNode("]"));
        } else {
            line.appendChild(document.createTextNode(value));
        }

        line.setAttribute("class", ["line", cls].join(" "));
        container.insertBefore(line, textarea);

        updateScroll();
    };

    var resetInput = function () {
        if (textarea) {
            textarea.innerText = "";
        }

        updateScroll();
    };

    var runCode = function (code, callback) {
        var result;
        try {
            // TODO: only use eval for commands typed into the console... everything else should use a new Function() { ...
            result = eval(code);
        } catch (e) {
            addLine(e.toString(), "error");
        } finally {
            if (callback) {
                callback(result);
            }
        }
    };

    var clear = function () {
        // requires polyfill
        //Array.from(container.querySelectorAll('div')).forEach(div => div.remove());
        var lines = document.querySelectorAll("div.line");
        for (var i = 0; i < lines.length; i++) {
            lines[i].remove();
        }
    };

    var setFontSize = function (fontSize) {
        container.style.fontSize = fontSize + "px";
    };

    var printError = function (errorText) {
        addLine(errorText, "error");
    };

    // public "interface"
    return {
        clear: clear,
        runCode: runCode,
        setFontSize: setFontSize,
        printError: printError
    };
}


var ConsoleEmulator = function (container) {
    var obj = createConsole(container);
    this.clear = obj.clear;
    this.runCode = obj.runCode;
    this.setFontSize = obj.setFontSize;
    this.printError = obj.printError;
};


module.exports = ConsoleEmulator;