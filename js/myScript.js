var renderer = PIXI.autoDetectRenderer(500, 500, { antialias: true });
renderer.backgroundColor = 0xf7eecf;
renderer.view.style.position = 'absolute';
renderer.view.style.left = '50%';
renderer.view.style.top = '50%';
renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();
stage.interactive = true;

var MAXDEPTH = 0;
var scale = 1;
var mousePos = new PIXI.Point();
var stale = true;
stage.mousemove = function(mouseData) {
    mouseX = mouseData.data.getLocalPosition(stage, mousePos);
    stale = true;
}
var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);
left.press = function() {
};
right.press = function() {
}
up.press = function() {
    if (scale < 10.5) {
        scale += 0.25;
        stage.setTransform(0,0,scale,scale,0,0,0,0,0);
    }
};
down.press = function() {
    if (scale > 0.5) {
        scale -= 0.25;
        stage.setTransform(0,0,scale,scale,0,0,0,0,0);
    }
}
var graphics = new PIXI.Graphics();

stage.addChild(graphics);

// run the render loop
animate();

var x = 150;
function animate() {
    if (stale) {
        MAXDEPTH = Math.floor((mousePos.x+150)/40)+1;
        MAXDEPTH = Math.min(Math.max(MAXDEPTH, 1), 13);
        graphics.clear();
        branch(x,350, 60+x, 400, 0);
        stale = false;
    }
    renderer.render(stage);
    requestAnimationFrame( animate );
}


function branch(x1, y1, x2, y2, depth) {
    if (depth >= MAXDEPTH || depth < 0) {
        return;
    }
    var dx = x2 - x1;
    var dy = y1 - y2;
    var x3 = x2 - dy;
    var y3 = y2 - dx;
    var x4 = x1 - dy;
    var y4 = y1 - dx;
    var x5 = x4 + 0.5 *(dx - dy);
    var y5 = y4 - 0.5 *(dx + dy);

    graphics.beginFill(0x22B14C);
    graphics.lineStyle(0.1, 0x0d5901, 1);
    graphics.moveTo(x1,y1);
    graphics.lineTo(x2,y2);
    graphics.lineTo(x3,y3);
    graphics.lineTo(x4,y4);
    graphics.endFill();

    graphics.beginFill(0xFF3300);
    graphics.lineStyle(0.1, 0x97050f, 1);
    graphics.moveTo(x3,y3);
    graphics.lineTo(x4,y4);
    graphics.lineTo(x5,y5);
    graphics.endFill();

    branch(x4, y4, x5, y5, depth+1);
    branch(x5, y5, x3, y3, depth+1);

}

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}