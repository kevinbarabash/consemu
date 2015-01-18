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
    var lineCount;
    var console;

    // initialization code
    textarea = document.createElement("textarea");
    container.appendChild(textarea);

    trueClick.addEventListener(container, function (e) {
        textarea.focus();
    });

    lineCount = 1;
    textarea.addEventListener("keydown", function (e) {
        if (e.keyCode === 13) {
            if (e.shiftKey) {
                lineCount++;
                textarea.style.height = 1.3 * lineCount + "em";
            } else {
                addLine(textarea.value, "code");

                // TODO: parse each line so that we can extract variable declaration to an outer context
                runCode(textarea.value, function () {
                    e.preventDefault();
                    resetInput();
                });
            }
        }
    });

    // hide the global definition
    // this allows multiple console emulators to run on the same page without
    // disrupting each other
    console = {
        log: function () {
            for (var _len = arguments.length,
                args = Array(_len),
                _key = 0; _key < _len; _key++) {
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
        line.innerText = value;
        line.setAttribute("class", ["line", cls].join(" "));
        container.insertBefore(line, textarea);

        updateScroll();
    };

    var resetInput = function () {
        textarea.value = "";
        lineCount = 1;
        textarea.style.height = 1.3 * lineCount + "em";

        updateScroll();
    };

    var runCode = function (code, callback) {
        try {
            var result = eval(textarea.value);
            console.log(result);
        } catch (e) {
            addLine(e.toString(), "error");
        } finally {
            callback();
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

    // public "interface"
    return {
        clear: clear,
        runCode: runCode
    };
}


var ConsoleEmulator = function (container) {
    var obj = createConsole(container);
    this.clear = obj.clear;
    this.runCode = obj.runCode;
};


module.exports = ConsoleEmulator;