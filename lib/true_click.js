"use strict";

var distance = function (p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
};

var addEventListener = function (element, callback) {
    var timestamp, mousePos;

    element.addEventListener("mousedown", function (e) {
        timestamp = Date.now();
        mousePos = {
            x: e.pageX,
            y: e.pageY
        };
    });

    element.addEventListener("mouseup", function (e) {
        var elapsed = Date.now() - timestamp;
        if (elapsed < 300) {
            if (distance(mousePos, { x: e.pageX, y: e.pageY }) < 10) {
                callback(e);
            }
        }
        e.preventDefault();
    });
};

module.exports = {
    addEventListener: addEventListener
};