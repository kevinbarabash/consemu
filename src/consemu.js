// TODO: clear console button
// TODO: execute expressions in the console
// TODO: parse output and types to determine what classes to assign different spans
// TODO: console.log, warn, and error
// TODO: line numbers
// TODO: get ES6 statements working in the console
// TODO: code completion

var container = document.querySelector(".container");
var log = console.log;

var updateScroll = function() {
    setTimeout(() => {
        if (container.offsetHeight < container.scrollHeight) {
            container.scrollTop = container.scrollHeight - container.offsetHeight;
        }
    }, 0);
};

var addLine = function (text, cls) {
    var line = document.createElement("div");
    line.innerText = text;
    line.setAttribute("class", ["line", cls].join(" "));
    container.insertBefore(line, input);

    updateScroll();
};

console.log = function(...args) {
    //var err = new Error();
    //console.warn(err.stack);
    
    log.apply(console, args);

    var [first, ...rest] = args;
    
    addLine(first, typeof first);
};

var input = document.createElement("textarea");
container.appendChild(input);


var distance = function(p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
};

var timestamp, mousePos;
container.addEventListener("mousedown", function (e) {
    timestamp = Date.now();
    mousePos = {
        x: e.pageX,
        y: e.pageY
    };
});

container.addEventListener("mouseup", function (e) {
    var elapsed = Date.now() - timestamp;
    if (elapsed < 300) {
        if (distance(mousePos, { x: e.pageX, y: e.pageY }) < 10) {
            input.focus();
        }
    }
    e.preventDefault();
});


var resetInput = function () {
    input.value = "";
    lineCount = 1;
    input.style.height = (1.3 * lineCount) + "em";

    updateScroll();
};

var lineCount = 1;
input.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        if (e.shiftKey) {
            lineCount++;
            input.style.height = (1.3 * lineCount) + "em";
        } else {
            addLine(input.value, "code");

            // TODO: parse each line so that we can extract variable declaration to an outer context
            try {
                var result = eval(input.value);
                console.log(result);
            } catch (e) {
                addLine(e.toString(), "error");
            } finally {
                e.preventDefault();
                resetInput();
            }
        }
    } 
});

var clear = function () {
    // requires polyfill
    //Array.from(container.querySelectorAll('div')).forEach(div => div.remove());
    var lines = document.querySelectorAll('div.line');
    for (var i = 0; i < lines.length; i++) {
        lines[i].remove();
    }
};

var clearButton = document.querySelector("#clearButton");
clearButton.addEventListener("click", () => clear());

// TODO: ideas for proxy objects:
// - use properties on objects to set attributes for DOM objects
// - RPC with iframes and web workers
