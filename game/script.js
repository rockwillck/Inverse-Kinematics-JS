var velocities = [[0, 0], [0, 0]]
function keydown(key) {
    if (key == "w") {
        velocities[0][1] = -1
    } if (key == "s") {
        velocities[0][1] = 1
    }

    if (key == "a") {
        velocities[0][0] = -1
    } if (key == "d") {
        velocities[0][0] = 1
    }
}

function keyup(key) {
    if (key == "w" && velocities[0][1] == -1) {
        velocities[0][1] = 0
    } if (key == "s" && velocities[0][1] == 1) {
        velocities[0][1] = 0
    }

    if (key == "a" && velocities[0][0] == -1) {
        velocities[0][0] = 0
    } if (key == "d" && velocities[0][0] == 1) {
        velocities[0][0] = 0
    }
}

function normalize(xy) {
    x = xy[0]
    y = xy[1]
    return x == 0 && y == 0 ? [0, 0] : [x/Math.sqrt(x**2 + y**2), y/Math.sqrt(x**2 + y**2)]
}

function click(position) {

}

// const gamepads = {};

// function gamepadHandler(event, connecting) {
//   const gamepad = event.gamepad;
//   // Note:
//   // gamepad === navigator.getGamepads()[gamepad.index]

//   if (connecting) {
//     gamepads[gamepad.index] = gamepad;
//   } else {
//     delete gamepads[gamepad.index];
//   }
// }

// window.addEventListener("gamepadconnected", (e) => { gamepadHandler(e, true); }, false);
// window.addEventListener("gamepaddisconnected", (e) => { gamepadHandler(e, false); }, false);s

gamepad = false
window.addEventListener("gamepadconnected", (e) => {
    const gp = navigator.getGamepads()[e.gamepad.index];
    console.log(`Gamepad connected at index ${gp.index}: ${gp.id} with ${gp.buttons.length} buttons, ${gp.axes.length} axes.`);
  
    // gameLoop()
    gamepad = true
});
window.addEventListener("gamepaddisconnected", (e) => {
    gamepad = false
})


// function gameLoop() {
//       const [gp] = navigator.getGamepads();
    
//       let a = 0;
//       let b = 0;
//       if (gp.axes[0] !== 0) {
//         b -= gp.axes[0];
//       } else if (gp.axes[1] !== 0) {
//         a += gp.axes[1];
//       } else if (gp.axes[2] !== 0) {
//         b += gp.axes[2];
//       } else if (gp.axes[3] !== 0) {
//         a -= gp.axes[3];
//       }
    
//       velocities[1] = [b, -a]
    
//       const start = requestAnimationFrame(gameLoop);
//   };

// var beingDragged = false
class Robo {
    constructor(a, b, c, d, r, q, direction, color, accent) {
        this.a = a
        this.b = b
        this.c = c
        this.d = d
        this.r = r
        this.q = q
        this.i0 = {x:(r<q ? a:c) + (r<q ? r : q)*Math.cos(0*Math.PI/180), y:(r<q ? b:d) + (r<q ? r:q)*Math.sin(0*Math.PI/180)}
        this.flip = direction
        this.color = color
        this.accent = accent
        this.closest = [0, 0]
        this.objects = []
        this.limit = 1
        this.points = 0
        // this.currentlyDragging = false
    }

    draw() {
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.arc(this.a, this.b, hold, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()
        ctx.beginPath()
        ctx.arc(this.c, this.d, hold, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fill()

        this.closest = [Math.abs(distance(this.i0,{x:this.a, y:this.b}) - this.r) + Math.abs(distance(this.i0,{x:this.c, y:this.d}) - this.q), this.i0, 0]
        let m = (this.d-this.b)/(this.c-this.a)
        let yint = this.b-m*this.a
        for (let i=0;i<360;i+=360/accuracy) {
            ctx.beginPath()
            let center = {
                x:(this.r<this.q ? this.a:this.c) + (this.r<this.q ? this.r : this.q)*Math.cos(i*Math.PI/180), 
                y:(this.r<this.q ? this.b:this.d) + (this.r<this.q ? this.r:this.q)*Math.sin(i*Math.PI/180)
            }
            if (this.flip*(this.a < this.c ? 1 : -1)*center.y < this.flip*(this.a < this.c ? 1 : -1)*m*center.x + this.flip*(this.a < this.c ? 1 : -1)*yint) {
                if (Math.abs(distance(center, {x:this.a, y:this.b}) - this.r) + Math.abs(distance(center, {x:this.c, y:this.d}) - this.q) < this.closest[0]) {
                    this.closest = [Math.abs(distance(center, {x:this.a, y:this.b}) - this.r) + Math.abs(distance(center, {x:this.c, y:this.d}) - this.q), center, i]
                }
            }
        }

        ctx.lineWidth = 120
        ctx.strokeStyle = this.color
        ctx.beginPath()
        ctx.moveTo(this.a, this.b)
        ctx.lineTo(this.closest[1].x, this.closest[1].y)
        ctx.closePath()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(this.closest[1].x, this.closest[1].y)
        ctx.lineTo(this.c, this.d)
        ctx.moveTo(this.a, this.b)
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(this.closest[1].x, this.closest[1].y, 100, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fillStyle = this.accent
        ctx.fill()

        ctx.fillStyle = this.accent
        ctx.fillRect(this.a-100, this.b-50, 200, 100)
        ctx.font = "80px Arial"
        ctx.fillStyle = this.color
        ctx.fillText(this.points, this.a-80, this.b+30)

        this.objects.forEach((obj, index) => {
            let renderPosition = {
                x:this.c + this.flip*(obj + hold)*normalize([1, (this.closest[1].y - this.d)/(this.closest[1].x - this.c)])[0], 
                y:this.d + this.flip*(obj + hold)*normalize([1, (this.closest[1].y - this.d)/(this.closest[1].x - this.c)])[1]
            }
            ctx.beginPath()
            ctx.arc(renderPosition.x, renderPosition.y, obj, 0, 2*Math.PI)
            ctx.closePath()
            ctx.fillStyle = "red"
            ctx.fill()

            if (distance(target, renderPosition) <= target.radius + obj) {
                this.objects.splice(index, 1)
                this.points++
            }
        })

        // if (distance({x:this.c,y:this.d}, mousePosition) < hold && !beingDragged) {
        //     this.currentlyDragging = true
        //     beingDragged = true
        // }
        // if (!mouseDown) {
        //     this.currentlyDragging = false
        //     beingDragged = false
        // }
        // if (this.currentlyDragging == true) {
        //     // theta1 = Math.atan2((this.b-closest[1].y), -(this.a-closest[1].x))
        //     // theta2 = Math.atan2(closest[1].y - this.d, -closest[1].x + this.c) + Math.PI - theta1
        //     // theta1 *= 180/Math.PI
        //     // theta2 *= 180/Math.PI
        //     // console.log(theta2)
        //     // if (theta1 > interval1[0] && theta1 < interval1[1] && theta2 > interval2[0] && theta2 < interval2[1]) {
                
                    
                
        //     // }
        // }
    }

    move(x, y) {
        if (distance({x:this.a, y:this.b}, {x:this.c + x, y:this.d + y}) > this.r + this.q) { 
            let theta = Math.atan2(this.d + y - this.b, this.c + x - this.a)
            this.c = this.a + (this.r + this.q)*Math.cos(theta)
            this.d = this.b + (this.r + this.q)*Math.sin(theta)
        } else {
            this.c = this.c + x
            this.d = this.d + y
        }

        objects.forEach((obj, index) => {
            if (this.objects.length < this.limit && distance({x:this.c, y:this.d}, obj) <= obj.radius + hold) {
                this.objects.push(obj.radius)
                objects.splice(index, 1)
            }
        })
    }
}

var shaking = false
var shakeFactor = 10
var arms = [
    new Robo(125, 800, 600, 300, 400, 400, 1, "yellow", "orange"),
    new Robo(1411, 800, 936, 300, 400, 400, -1, "lightblue", "teal"),
]
var accuracy = 360
const hold = 25
var lastAngle = 0
var interval1 = [60, 120]
var interval2 = [85, 180]
var speed = 10
var target = {x:canvas.width/2, y:canvas.height/2, radius:50}
var objects = []
for (i=0;i<4;i++) {
    objects.push({x:Math.random()*canvas.width/2, y:850, radius:Math.random()*10 + 20})
    objects.push({x:canvas.width/2 + Math.random()*canvas.width/2, y:850, radius:Math.random()*10 + 20})
}
function runtime() {
    ctx.save()
    if (shaking) {
        ctx.translate(Math.random() < 0.5 ? -Math.random()*shakeFactor : Math.random()*shakeFactor, Math.random() < 0.5 ? -Math.random()*shakeFactor : Math.random()*shakeFactor)
    }

    ctx.fillStyle = "rgb(50, 50, 50)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (gamepad) {
        const [gp] = navigator.getGamepads();
    
        let a = 0;
        let b = 0;
        if (gp.axes[0] !== 0) {
          b -= gp.axes[0];
        } else if (gp.axes[1] !== 0) {
          a += gp.axes[1];
        } else if (gp.axes[2] !== 0) {
          b += gp.axes[2];
        } else if (gp.axes[3] !== 0) {
          a -= gp.axes[3];
        }
      
        velocities[1] = [b, -a]
    }

    ctx.beginPath()
    ctx.arc(target.x, target.y, target.radius, 0, 2*Math.PI)
    ctx.closePath()
    ctx.fillStyle = "black"
    ctx.strokeStyle = "white"
    ctx.lineWidth = 5
    ctx.fill()
    ctx.stroke()

    arms.forEach((arm, index) => {
        arm.draw()
        arms[index].move(normalize(velocities[index])[0]*speed, normalize(velocities[index])[1]*speed)
    })
    ctx.fillStyle = "gray"
    ctx.fillRect(0, 850, canvas.width, 200)
    
    objects.forEach((obj) => {
        ctx.beginPath()
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2*Math.PI)
        ctx.closePath()
        ctx.fillStyle = "red"
        ctx.fill()
    })

    ctx.restore()
}