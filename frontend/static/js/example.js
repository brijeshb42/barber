// /*var data = [ 16, 68, 20, 30, 54 ];

// document.addEventListener("DOMContentLoaded", function() {
//     var canvas = document.getElementById("bar");
//     var ctx = canvas.getContext("2d");
//     //ctx.fillStyle = "gray"; 
//     //ctx.fillRect(0,0,500,500);

//     ctx.fillStyle = "#08c"; 
//     for(var i=0; i<data.length; i++) { 
//         var dp = data[i]; 
//         ctx.fillRect(10 + i*100, 500 - dp*5 -10, 60, dp*5); 
//     }
//     ctx.strokeStyle = "black";
//     ctx.lineWidth = 2.0;
//     ctx.beginPath();
//     ctx.moveTo(10, 10);
//     ctx.lineTo(10, 490);
//     ctx.lineTo(490, 490);
//     ctx.stroke();

//     for(var i=0; i<6; i++) {
//         ctx.fillStyle = "black";
//         ctx.fillText(20*i+"", 1, 490 - i*100 - 5);
//         ctx.beginPath();
//         ctx.moveTo(10, 490 - i*100);
//         ctx.lineTo(5, 490 - i*100);
//         ctx.stroke();
//     }
// });
// */

// // shim layer with setTimeout fallback 
// window.requestAnimFrame = (function(){ 
//   return  window.requestAnimationFrame       ||  
//           window.webkitRequestAnimationFrame ||  
//           window.mozRequestAnimationFrame    ||  
//           window.oRequestAnimationFrame      ||  
//           window.msRequestAnimationFrame     ||  
//           function( callback ){ 
//             window.setTimeout(callback, 1000 / 60); 
//           }; 
// })();


// var canvas = document.getElementById('bar'); 
// var particles = []; 
// var tick = 0;


// function createParticles() { 
//     //check on every 10th tick check 
//     if(tick % 10 == 0) { 
//         //add particle if fewer than 100 
//         if(particles.length < 100) { 
//             particles.push({ 
//                     x: Math.random()*canvas.width, //between 0 and canvas width 
//                     y: 0, 
//                     speed: 2+Math.random()*2, //between 2 and 5 
//                     radius: 5+Math.random()*3, //between 5 and 10 
//                     color: "white", 
//             }); 
//         } 
//     } 
// } 
// function updateParticles() { 
//     for(var i in particles) { 
//         var part = particles[i]; 
//         part.y += part.speed; 
//     } 
// }
// function killParticles() { 
//     for(var i in particles) { 
//         var part = particles[i]; 
//         if(part.y > canvas.height) { 
//             part.y = 0;
//             //part.speed = 0; 
//         } 
//     } 
// }
// function drawParticles() { 
//     var c = canvas.getContext('2d'); 
//     c.fillStyle = "black"; 
//     c.fillRect(0,0,canvas.width,canvas.height); 
//     for(var i in particles) { 
//         var part = particles[i]; 
//         c.beginPath(); 
//         c.arc(part.x,part.y, part.radius, 0, Math.PI); 
//         c.closePath(); 
//         c.fillStyle = part.color; 
//         c.fill(); 
//     } 
// }
// function loop() { 
//     window.requestAnimFrame(loop); 
//     createParticles(); 
//     updateParticles(); 
//     killParticles(); 
//     drawParticles(); 
// } 
// window.requestAnimFrame(loop);


// /*document.addEventListener("DOMContentLoaded", function() {
//     var canvas = document.getElementById("bar");
//     var ctx = canvas.getContext("2d");
//     ctx.fillStyle = 'red';
//     ctx.globalAlpha = 0.5;
//     ctx.fillRect(50, 50, 100, 100);
//     ctx.globalAlpha = 0.3;
//     ctx.rotate(20 * 2*Math.PI/360);
//     ctx.fillRect(100, 100, 100, 100);
// });*/
document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("bar");
});

/*var $urlInput;
var $fileInput;
var $container;

function addListeners(img) {
    console.log(img);
    
    var div = $("<div />");
    div.css({
        "border": "1px dashed #fff",
        "position": "absolute"
    });
    div.hide();
    
    var startx, starty;
    var endx, endy;
    
    img.addEventListener("dragstart", function(e) {
        e.preventDefault();
        /*console.log("Drag Start");
        console.log(e);
        startx = e.x;
        starty = e.y;
        endx = startx + 1;
        endy = starty + 1;
        console.log({"startx":startx, "starty":starty});
        div.show();* /
    });
    img.addEventListener("mousemove", function(e) {
        console.log(e);
        console.log("Drag end");
        console.log(startx, starty, endx, endy);
        if(e.x < startx) {
            startx = e.x;
        }
        if(e.x < starty) {
            starty = e.y;
        }
        div.css({
            top: starty+"px",
            left: startx+"px",
            width: (Math.abs(e.x-startx))+"px",
            height: (Math.abs(e.y-starty))+"px"
        });
    });
    img.addEventListener("drag", function(e) {
        if(e.x === 0 && e.y === 0) {
            return;
        }
        //console.log(e);
        var top, left, w, h;
        top = starty;
        left = startx;
        w = Math.abs(e.x - startx);
        h = Math.abs(e.y -starty);
        if(e.x < startx) {
            left = e.x;
            w = Math.abs(startx - left);
        }
        if(e.y < starty) {
            top = e.y;
            h = Math.abs(starty - top);
        }
        var css = {
            top: top+"px",
            left: left+"px",
            width: w+"px",
            height: h+"px"
        };
        //console.log(css);
        div.css(css);
        startx = left;
        starty = top;
        endx = startx + w;
        endy = starty + h;
        /*console.log({
            startx: startx,
            starty: starty,
            width: endx,
            height: endy
        });* /
    });
    img.addEventListener("click", function() {
        div.hide();
    });
    $container.append(div);
}


var Imager = function (data, container) {
    var self = this;
    var mousedown = false;

    this.container = container;
    this.width = this.height = 0;
    this.origWidth = this.origHeight = 0;
    this.startX = this.startY = 0;

    var image = new Image();

    image.onload = function(e) {
        //console.log(image);
        self.origHeight = image.naturalHeight;
        self.origWidth = image.naturalWidth;
        self.width = image.width;
        self.height = image.height;
    };

    image.src = data;

    var holder = document.createElement("div");
    holder.setAttribute("class", "im-holder")
    //holder.setAttribute("style", "position: relative");

    var cropper = document.createElement("div");
    cropper.setAttribute("class", "im-cropper")
    //cropper.setAttribute("style", "position: absolute; border: 1px dashed #fff");
    holder.appendChild(image);
    holder.appendChild(cropper);

    this.holder = holder;
    this.cropper = cropper;
    this.image = image;

    container.appendChild(holder);

    this.isMouseDown = function() {
        return mousedown;
    };

    this.setMouseDown = function(bool) {
        mousedown = bool;
    };

    this.addEvents();

};

Imager.prototype.addEvents = function() {
    if(!this.image) {
        return;
    }
    var img = this.image;
    var self = this;

    img.addEventListener("dragstart", function(e) {
        e.preventDefault();
    });

    img.addEventListener("mousedown", function(e) {
        self.setMouseDown(true);
        console.log("mousedown");
        console.log(e);
        self.startX = e.layerX;
        self.startY = e.layerY;
        self.setCropperPosition(e.layerX, e.layerY);
    });

    img.addEventListener("mouseup", function(e) {
        self.setMouseDown(false);
        //console.log(e.type);
    });
    img.addEventListener("click", function(e) {
        self.setMouseDown(false);
        console.log(e.type);
    });
    img.addEventListener("mouseout", function(e) {
        //self.setMouseDown(false);
        console.log(e.type);
    });
    img.addEventListener("mouseup", function(e) {
        self.setMouseDown(false);
        console.log(e.type);
    });
    /*img.addEventListener("mouseout", function(e) {
        self.setMouseDown(false);
    });* /

    img.addEventListener("mousemove", function(e) {
        if(!self.isMouseDown())
            return;
        console.log(e.type);
        self.setDimension(e.layerX-2, e.layerY-2);
    });

    console.log(this);
};


Imager.prototype.hideCropper = function() {
    this.cropper.style.display = "none";
};

Imager.prototype.showCropper = function() {
    this.cropper.style.display = "block";
};

Imager.prototype.setDimension = function(width, height) {
    if(width !== null)
        this.cropper.style.width = width+"px";
    if(height !== null)
        this.cropper.style.height = height+"px";
};

Imager.prototype.setCropperPosition = function(left, top, width, height) {
    this.cropper.style.top = top+"px";
    this.cropper.style.left = left+"px";
    if(width !== null)
        this.cropper.style.width = width+"px";
    if(height !== null)
        this.cropper.style.height = height+"px";
};

Imager.prototype.selectAll = function() {
    this.setCropperPosition(0, 0, this.width-2, this.height-2);
};*/
