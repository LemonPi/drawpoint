/**
 * Created by johnson on 16.05.17.
 */
function drawPoint(ctx, p, offset) {
    offset = offset || {x: 0, y: 0};
    var ox = offset.x;
    var oy = offset.y;

    ctx.beginPath();
    ctx.arc(p.x + ox, p.y + oy, 3, 0, 2 * Math.PI);
    ctx.stroke();
}

var controlPointLineStyle = "#999";
function drawControlPoints(ctx, p1, p2) {
    // draw control points
    drawPoint(ctx, p1);
    drawPoint(ctx, p2);
    dp.applyToCurve(p1, p2, {
        linear: function () {
        },
        quadratic: function (p1, cp, p2) {
            drawPoint(ctx, cp);
            ctx.save();
            ctx.strokeStyle = controlPointLineStyle;
            ctx.beginPath();
            dp.drawPoints(ctx, p1, cp, p2);
            ctx.stroke();
            ctx.restore();
        },
        cubic: function (p1, cp1, cp2, p2) {
            drawPoint(ctx, cp1);
            drawPoint(ctx, cp2);
            ctx.save();
            ctx.strokeStyle = controlPointLineStyle;
            ctx.beginPath();
            dp.drawPoints(ctx, p1, cp1, dp.breakPoint, p2, cp2);
            ctx.stroke();
            ctx.restore();
        }
    });
}

function fixMouseEvent(e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
        rect = target.getBoundingClientRect();
    e.offsetX = e.clientX - rect.left;
    e.offsetY = e.clientY - rect.top;
}

function handleInteraction(canvas, p1, p2) {
    var points = [p1, p2];
    dp.applyToCurve(p1, p2, {
        linear: function () {
        },
        quadratic: function (ignore, cp) {
            points.push(cp);
        },
        cubic: function (ignore, cp1, cp2) {
            points.push(cp1);
            points.push(cp2);
        }
    });

    var mousePoint;
    var movingPoint = null;
    var moving = false;
    var handler = {
        onupdate: function () {
        }
    };

    // start dragging a point
    canvas.addEventListener("mousedown", function (e) {
        fixMouseEvent(e);
        mousePoint = dp.point(e.offsetX, e.offsetY);

        points.forEach(function (p) {
            if (dp.norm(dp.diff(p, mousePoint)) < 10) {
                moving = true;
                movingPoint = p;
            }
        });
    });

    // stop dragging a point
    canvas.addEventListener("mouseup", function () {
        if (moving === false) {
            return;
        }

        canvas.style.cursor =  "default";

        moving = false;
        movingPoint = null;
    });

    // while dragging a point
    canvas.addEventListener("mousemove", function (e) {
        fixMouseEvent(e);
        var newMousePoint = dp.point(e.offsetX, e.offsetY);

        var movingNearPoint = false;
        points.forEach(function (p) {
            if (dp.norm(dp.diff(p, newMousePoint)) < 10) {
                movingNearPoint = true;
            }
        });

        canvas.style.cursor = movingNearPoint? "pointer" : "default";

        if (moving === false) {
            return;
        }

        // we want to capture relative movement to avoid instantaneous teleport
        var movedPoint = dp.add(movingPoint, dp.diff(mousePoint, newMousePoint));
        movingPoint.x = movedPoint.x;
        movingPoint.y = movedPoint.y;
        mousePoint = newMousePoint;
        // handle update
        handler.onupdate();
    });

    return handler;
}

function createInteractiveCanvas(idx, defineCode, drawCode) {
    // create DOM element
    var figure = find("figure")[idx];
    var canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    var ctx = new Context2DTracked(canvas.getContext("2d"));
    figure.appendChild(canvas);

    // give it the newly created context
    // return draw points that define the curve
    defineCode = "(function() { " + defineCode + "; return {p1:p1, p2:p2}; })();";
    var drawer = eval("(function() { function draw(ctx, p1, p2) { " + drawCode + "} return draw; })();");
    console.log(drawer);

    // inject code
    var points = eval(defineCode);
    var p1 = points.p1;
    var p2 = points.p2;

    var handler = handleInteraction(canvas, points.p1, points.p2);
    // redraw curve on every update
    handler.onupdate = function () {
        console.log("updating");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawer(ctx, p1, p2);
        drawControlPoints(ctx, points.p1, points.p2);
    };

    handler.onupdate();
}