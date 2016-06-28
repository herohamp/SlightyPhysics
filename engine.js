(function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
  })();
  
var canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d"),
width = 500,
height = 500,
player = {
    x: 10,
    y: height-10,
    width: 10,
    height: 10,
    speed: 3,
    jumpForce: 1.7,
    velX: 0,
    velY: 0,
    jumping: false,
    grounded: false,
    color: "orange",
    walljump: true,
    walljumpForceX: 2.2,
    walljumpForceY: 1.4
},
keys = [],
boxes = [],
execute=[],
friction = 0.8,
gravity = 0.3;

canvas.width = width;
canvas.height = height;

function addBox(sx, sy, xl, yl) {
    boxes.push({
        x: sx,
        y: sy,
        width: xl,
        height: yl
    });
    return boxes.length-1;
}
function addExe(sx, sy, xl, yl, Code, COLOR) {
    execute.push({
        x: sx,
        y: sy,
        width: xl,
        height: yl,
        code: Code,
        color: COLOR,
    });
  return execute.length-1;
}
function clearBox() {
  boxes = [];
  execute = [];
  addBox(0, 0, 10, height);
  addBox(0, 0, width, 10);
  addBox(0, height-10, width, 50);
  addBox(width - 10, 0, 50, height);
  player.x = 10;
  player.y = height-10;
}

clearBox();
  
function level1() {
  clearBox();
  addBox(120, 480, 50, 5);
  addBox(170, 460, 50, 5);
  addBox(230, 430, 50, 5);
  addBox(300, 400, 100, 5);
  addBox(430, 370, 60, 5);
  addBox(420, 340, 50, 5);
  addBox(400, 310, 50, 5);
  addBox(470, 310, 25, 5);
  addBox(360, 170, 5, 100);
  addBox(310, 170, 50, 5);
  addExe(310, 150, 20, 20, function() {
    addBox(250,170,30,5);
  }, "yellow");
  addExe(170,155,15,15, function() {
    gravity=0.1
  }, "blue");
  addBox(170,170,30,5);
  addBox(0,170,30,5);
  addExe(10,155,15,15, function() {
    level2();
  }, "green");
}
function level2() {
  clearBox();
  addBox(200, 440, 100, 10);
  addBox(150, 400, 40, 10);
  addBox(310, 400, 40, 10);
  addBox(120, 300, 10, 80);
  addBox(380, 300, 10, 80);
  addBox(200, 320, 100, 10);
  addBox(245, 220, 10, 70);
  addBox(80, 310, 40, 10);
  addBox(390, 310, 40, 10);
  addBox(310, 230, 40, 10);
  addBox(150, 230, 40, 10);
  addExe(320, 210, 20, 20, function() {
    addExe(160, 210, 20, 20, function() {
      end();
    }, "green");
  }, "yellow");
}
function end() {
    alert('Demo finished!');
}

function randBot() {
    clear()
    player.x = width/2;
    var min = 37;
    var max=39;
    var k;
    setInterval(function () {
        keys[k] = false;
        k = Math.floor(Math.random()*(max-min+1)+min);
        console.log(k);
        keys[k] = true;
    }, 600);
  }
  
  function update() {
    // check keys
    if (keys[38] || keys[32]) { // up arrow or space
      if (!player.jumping && player.grounded) {
        player.jumping = true;
        player.grounded = false;
        player.velY = -player.speed * player.jumpForce;
      }
    }
    if (keys[39]) {             // right arrow
      if (player.velX < player.speed) {
        player.velX++;
      }
    }
    if (keys[37]) {             // left arrow
      if (player.velX > -player.speed) {
        player.velX--;
      }
    }
    
    player.velX *= friction;
    player.velY += gravity;
    player.grounded = false;
    
    ctx.clearRect(0, 0, width, height);
    
    for (var i = 0; i < boxes.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = "black";
        drawBox(boxes[i]);
            
        var dir = colCheck(player, boxes[i]);
        
        if (dir === "r") {
            player.velX = 0;
            if (keys[38] && player.walljump == true) {
                player.velY = -player.speed * player.walljumpForceY;
                player.velX = player.velX - player.speed * player.walljumpForceX;
           }
        } else if (dir === "l" ) {
            player.velX = 0;
            if (keys[38] && player.walljump == true) {
                player.velY = -player.speed * player.walljumpForceY;
                player.velX = player.velX + player.speed * player.walljumpForceX;
            }
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
         player.velY *= -1;
        }
    }
    
    for (var i = 0; i <  execute.length; i++) {
      ctx.beginPath();
      drawExe(execute[i]);
          
      var dir = colCheck(player,  execute[i]);
      
      if (dir === "r" || dir === "l" || dir === "b" || dir === "t") {
          var code = execute[i].code;
          execute.splice(i,1);
          code();
      }
    }
    
    if(player.grounded) {
        player.velY = 0;
    }
    
    player.x += player.velX;
    player.y += player.velY;
    
    drawPlayer(player);
    
    requestAnimationFrame(update);
}

    function drawBox(p1) {
    ctx.fillStyle = "black";
    ctx.rect(p1.x, p1.y, p1.width, p1.height);
    ctx.fill();
    ctx.closePath();
}
function drawExe(p1) {
    ctx.fillStyle =p1.color;
    ctx.rect(p1.x, p1.y, p1.width, p1.height);
    ctx.fill();
    ctx.closePath();
}


function drawPlayer(p1) {
    ctx.fill();
    ctx.fillStyle = p1.color;
    ctx.fillRect(p1.x, p1.y, p1.width, p1.height);
}

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;
    
    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
         } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

window.addEventListener("load", function () {
    update();
});

level1();
