var sketchdataURL;
var kineticdataURL;
var stage;
var redlineLayer, drawLayer, paint, line, tempshape, makeRect, makeCirc, makeCloud, rectCount = 0, followRect;
var click1 = false, click2 = false, click2X, click2Y;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var shape = new Array();
var shapes = new Array();
var rects = new Array();
var clicks = 0;
var msDown = false;
var messageLayer;

window.onload = function () {
    $('#editText').draggable();


    $('#tools').append('<button id="makeSketch">Make Sketch</button><button id="copySketch">Copy Sketch to Kinetic</button><button id="makeRect">Make Rectangle</button><button id="makeCloud">Make Comment Balloon</button><button id="makeCirc">Make Circle</button></br><button id="getKinetic">Get Kinetic Image</button><button id="hideRedlines">Hide Redlines</button><button id="erase">Erase Redlines</button>');
    stage = new Kinetic.Stage({
        container: 'kineticJS',
        width: 578,
        height: 200
    });

    var layer = new Kinetic.Layer();
    drawLayer = new Kinetic.Layer();
    redlineLayer = new Kinetic.Layer();
    messageLayer = new Kinetic.Layer();

    var drawRect = new Kinetic.Rect({

    });

    var redlinelayerBG = new Kinetic.Rect({
        width: 578,
        height: 200,
        x: 0,
        y: 0
    });
    followCirc = new Kinetic.Circle({
        width: 120,
        height: 20,
        x: -200,
        y: -200,
        stroke: 'red',
        strokeWidth: 2
    });
    followRect = new Kinetic.Rect({
        width: 120,
        height: 40,
        x: -200,
        y: -200,
        stroke: 'red',
        strokeWidth: 3
    });
    var cloud = new Kinetic.Shape({
        drawFunc: function (context) {
            context.beginPath();
            context.moveTo(50, 20);
            context.quadraticCurveTo(22, 16, 28, 42);
            context.quadraticCurveTo(18, 65, 39, 68);
            context.quadraticCurveTo(52, 84, 70, 74);
            context.quadraticCurveTo(87, 84, 100, 70);
            context.quadraticCurveTo(125, 72, 118, 48);
            context.quadraticCurveTo(126, 28, 106, 26);
            context.quadraticCurveTo(100, 10, 80, 20);
            context.quadraticCurveTo(68, 8, 50, 20);
            context.closePath();
            //this.fill(context);
            this.stroke(context);
        },

        stroke: "red",
        strokeWidth: 5
    });
    cloud.setScale(.45);
    cloud.setX(-200);
    cloud.setY(-200);

    redlinelayerBG.on("mousemove", function () {
        var mousePos = stage.getMousePosition();
        var x = mousePos.x;
        var y = mousePos.y;
        if (makeRect || makeCirc || makeCloud) {
            switch (true) {
                case makeCirc:
                    followCirc.setX(x + 5);
                    followCirc.setY(y + 5);
                    break;
                case makeRect:
                    followRect.setX(x + 5);
                    followRect.setY(y + 5);
                    break;
                case makeCloud:
                    cloud.setX(x - 5);
                    cloud.setY(y);
                    break;
            }
            
        }
        if (msDown) {
            var mousePos = stage.getMousePosition();
            var x = mousePos.x;
            var y = mousePos.y;
            //rect2.attrs.y = y;
            //rect2.attrs.x = x;
            //shapesLayer.draw();
            writeMessage(messageLayer, 'x: ' + x + ', y: ' + y);
        }
        drawLayer.draw();
    });
    
    drawLayer.on("mousedown", function (e) {
        clicks++;
        msDown = true;
        var mousePos = stage.getMousePosition();
        var x = mousePos.x;
        var y = mousePos.y;
        followCirc.setX(-200);
        followRect.setX(-200);
        cloud.setX(-200);

        drawLayer.draw();

        //
        return;

    });
    drawLayer.on("mouseup", function () {
        msDown = false;
        //alert(msDown);
        drawLayer.setVisible(false);
        makeCirc = false;
        makeCloud = false;
        makeRect = false;
    });



    drawLayer.add(cloud);

    drawLayer.add(redlinelayerBG);
    drawLayer.add(followCirc);
    drawLayer.add(followRect);



    var rect = new Kinetic.Rect({
        x: 239,
        y: 75,
        width: 100,
        height: 50,
        fill: 'green',
        stroke: 'black',
        strokeWidth: 2,
        draggable: true
    });

    // add the shape to the layer
    layer.add(rect);
    drawLayer.setVisible(false);
    // add the layer to the stage
    stage.add(layer);
    stage.add(redlineLayer);
    stage.add(drawLayer);
    stage.add(messageLayer);
    $('#makeSketch').click(function (event) {
        followCirc.setX(-200);
        followRect.setX(-200);
        cloud.setX(-200);
        redlineLayer.setVisible(true);
        makeSketch();
    });
    $('#makeCirc').click(function (e) {
        makeCirc = true;
        followCirc.setX(-200);
        followRect.setX(-200);
        cloud.setX(-200);
        drawLayer.setVisible(true);
        drawLayer.draw();

    });
    $("#putText").click(function (e) {
        var thisX = $("#editText").css('left');
        var thisY = $("#editText").css('top');
        thisX = parseInt(thisX)-5;
        thisY = parseInt(thisY)-10;
        view_text(thisX, thisY);
    });
    $("#erase").click(function (e) {
        redlineLayer.removeChildren();
        redlineLayer.draw();
    });
    $('#makeRect').click(function (e) {
        makeRect = true;
        followCirc.setX(-200);
        followRect.setX(-200);
        cloud.setX(-200);
        drawLayer.setVisible(true);
        drawLayer.draw();

    });
    $('#makeCloud').click(function (e) {
        makeCloud = true;
        followCirc.setX(-200);
        followRect.setX(-200);
        cloud.setX(-200);
        drawLayer.setVisible(true);
        drawLayer.draw();

    });
    $('#hideRedlines').click(function (e) {
        if (!redlineLayer.isVisible()) {
            redlineLayer.setVisible(true);
        } else {
            redlineLayer.setVisible(false);
        }
    });

    $('#getSketch').click(function (event) {
        SketchGetURL();
    });

    $('#getKinetic').click(function (event) {
        KineticGetURL();
    });

    $('#copySketch').click(function (event) {
        drawLines();
    });
    $('#copySketch2').click(function (event) {
        CopySketch();
    });

    $('#sketchCanvas').mousedown(function (e) {
        //var mouseX = e.pageX - this.offsetLeft;
        //var mouseY = e.pageY - this.offsetTop;
        //shape.length = 0;
        shape.length = 0;
        paint = true;
        //addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);

    });
    $('#sketchCanvas').bind('mouseup', function (e) {
        //alert("mouseup");
        shapes.push(pushArray(shape));
        paint = false;
        return;
    });
    $('#sketchCanvas').bind('mouseleave', function (e) {
        paint = false;
    });
    $('#sketchCanvas').bind('mousemove', function (e) {
        if (paint) {

            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        }
    });
};
function addToRedlineLayer(hereX, hereY, what,clicknum) {
    //clickTwo = false;

    switch (what) {
        case "circ":
            var newRect = new Kinetic.Circle({
                width: 120,
                height: 60,
                x: hereX,
                y: hereY,
                stroke: 'red',
                strokeWidth: 4,
                draggable: true

            });
            break;
        case "rect":
            var newRect = new Kinetic.Rect({
                width: 120,
                height: 40,
                x: hereX,
                y: hereY,
                stroke: 'red',
                strokeWidth: 3,
                draggable: true

            });
            break;
        case "cloud":
            var newRect = new Kinetic.Shape({
                drawFunc: function (context) {
                    context.beginPath();
                    context.moveTo(50, 20);
                    context.quadraticCurveTo(22, 16, 28, 42);
                    context.quadraticCurveTo(18, 65, 39, 68);
                    context.quadraticCurveTo(52, 84, 70, 74);
                    context.quadraticCurveTo(87, 84, 100, 70);
                    context.quadraticCurveTo(125, 72, 118, 48);
                    context.quadraticCurveTo(126, 28, 106, 26);
                    context.quadraticCurveTo(100, 10, 80, 20);
                    context.quadraticCurveTo(68, 8, 50, 20);
                    context.closePath();
                    //this.fill(context);
                    this.stroke(context);
                },
                draggable: true,
                stroke: "red",
                strokeWidth: 5
            });

            newRect.setScale(.9);
            break;
    }


    redlineLayer.add(newRect);
    newRect.setX(hereX);
    newRect.setY(hereY);

    redlineLayer.draw();
    //$("#editText").css('left', hereX+90);
    //$("#editText").css('top', hereY + 80);
   
   // $("#my_text").val("");
   // $("#editText").show('slide', function () { $("#my_text").focus(); });
    //var txtBox = document.getElementById("my_text");
    //txtBox.focus();
   
    makeRect = false;
    makeCirc = false;
    makeCloud = false;
    
}
function getDistance(touch1, touch2) {
    var x1 = touch1.x;
    var x2 = touch2.x;
    var y1 = touch1.y;
    var y2 = touch2.y;

    return Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
}
function getDistances(touch1, touch2) {
    var newPos = new Object();
    var x1 = touch1.x;
    var x2 = touch2.x;
    var y1 = touch1.y;
    var y2 = touch2.y;

    newPos.x = Math.sqrt((x2 - x1) * (x2 - x1));
    newPos.y = Math.sqrt((y2 - y1) * (y2 - y1));

    return newPos;
}
function pushArray(p) {
    var arrayToPush = new Array();
    for (eaP in p) {
        arrayToPush.push(p[eaP]);
    }
    return arrayToPush;
}

function makeSketch() {

    $('#sketchCanvas').clearSketch();
    $('#sketchCanvas').trigger('mouseleave');
    $('#sketchCanvas').sketch({ defaultSize: 4, defaultColor: "#f00" });
    $('#sketchCanvas').show();
}

function SketchGetURL() {
    if ($("#sketchCanvas").is(":visible")) {
        var canvas = $('#sketchCanvas')[0];
        sketchdataURL = canvas.toDataURL();
        window.open(sketchdataURL);
    }
}
function KineticGetURL() {
    stage.toDataURL({
        callback: function (dataUrl) {
            kineticdataURL = dataUrl;
            window.open(kineticdataURL);
        }
    });
}
function drawLines() {
    for (ea in shapes) {

        drawLine(shapes[ea]);
    }

    //for (var i = 0; i < clickX.length; i++) {
    //var line = new Kinetic.Line({
    //  points: [clickX[i], clickY[i], clickX[i+1], clickY[i+1]],
    //  strokeWidth: 4,
    //  stroke: "red"
    //});
    //redlineLayer.add(line);
    //}


    // var canvas = $('#sketchCanvas')[0];

    // var context = canvas.getContext("2d");

    // context.clearRect(0, 0, canvas.width, canvas.height);
    // context.beginPath();
    $('#sketchCanvas').hide();
    shapes.length = 0;
    clickX.length = 0;
    clickY.length = 0;

}
function drawLine(ea) {
    redlineLayer.setVisible(true);
    for (var l = 0; l < ea.length; l++) {
        if (l + 1 < ea.length) {
            var line = new Kinetic.Line({
                points: [ea[l].x, ea[l].y, ea[l + 1].x, ea[l + 1].y],
                strokeWidth: 4,
                stroke: "red"
            });
            redlineLayer.add(line);
        }
    }
    redlineLayer.draw();
    //stage.draw();

}
function CopySketch() {
    var canvas = stage.children[0];
    var context = canvas.getContext("2d");
    var canvas2 = $('#sketchCanvas')[0];
    sketchdataURL = canvas2.toDataURL();
    // load image from data url
    var imageObj = new Image();
    var imgSize = imageObj.getAttribute(['width']);
    imageObj.onload = function () {
        //context.drawImage(this, 0, 0);
        var redline = new Kinetic.Image({
            x: 0,
            y: 0,
            image: imageObj,
            width: 587,
            height: 200
        });
        redlineLayer.add(redline);
        stage.draw();

    };
    imageObj.src = sketchdataURL;
    $('#sketchCanvas').hide();
    clickX.length = 0;
    clickY.length = 0;
}

//Tracking drawing movments.
function addClick(x, y, dragging) {
    var shapeObj = new Object();
    shapeObj.x = x;
    shapeObj.y = y;
    shape.push(shapeObj);
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}
function writeMessage(messageLayer, message) {
    var context = messageLayer.getContext();
    messageLayer.clear();
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
}
