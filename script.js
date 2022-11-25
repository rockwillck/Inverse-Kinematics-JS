function keydown(key) {

}

function keyup(key) {

}

function normalize(xy) {
    x = xy[0]
    y = xy[1]
    return x == 0 && y == 0 ? [0, 0] : [x/Math.sqrt(x**2 + y**2), y/Math.sqrt(x**2 + y**2)]
}

function click(position) {

}

var shaking = false
var shakeFactor = 10
var a = 500
var b = 500
var c = 800
var d = 400
var r = 100
var q = 350
var accuracy = 360
const hold = 25
var dragged = false
var currentlyDragging = 0
const i0 = {x:(r<q ? a:c) + (r<q ? r : q)*Math.cos(0*Math.PI/180), y:(r<q ? b:d) + (r<q ? r:q)*Math.sin(0*Math.PI/180)}
var lastAngle = 0
function runtime() {
    ctx.save()
    if (shaking) {
        ctx.translate(Math.random() < 0.5 ? -Math.random()*shakeFactor : Math.random()*shakeFactor, Math.random() < 0.5 ? -Math.random()*shakeFactor : Math.random()*shakeFactor)
    }

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.arc(a, b, hold, 0, 2*Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.arc(c, d, hold, 0, 2*Math.PI)
    ctx.closePath()
    ctx.fill()

    closest = [Math.abs(distance(i0,{x:a, y:b}) - r) + Math.abs(distance(i0,{x:c, y:d}) - q), i0, 0]
    m = (d-b)/(c-a)
    yint = b-m*a
    for (i=0;i<360;i+=360/accuracy) {
        ctx.beginPath()
        center = {x:(r<q ? a:c) + (r<q ? r : q)*Math.cos(i*Math.PI/180), y:(r<q ? b:d) + (r<q ? r:q)*Math.sin(i*Math.PI/180)}
        if ((a < c ? 1 : -1)*center.y < (a < c ? 1 : -1)*m*center.x + (a < c ? 1 : -1)*yint) {
            ctx.arc(center.x, center.y, 2.5, 0, 2*Math.PI)
            if (Math.abs(distance(center, {x:a, y:b}) - r) + Math.abs(distance(center, {x:c, y:d}) - q) < closest[0]) {
                closest = [Math.abs(distance(center, {x:a, y:b}) - r) + Math.abs(distance(center, {x:c, y:d}) - q), center, i]
            }
            ctx.fillStyle = "blue"
            ctx.closePath()
            ctx.fill()
        }
    }

    ctx.lineWidth = 15
    ctx.beginPath()
    ctx.moveTo(a, b)
    ctx.lineTo(closest[1].x, closest[1].y)
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(closest[1].x, closest[1].y)
    ctx.lineTo(c, d)
    ctx.moveTo(a, b)
    ctx.closePath()
    ctx.stroke()

    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(a, b, r, 0, 2*Math.PI)
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(c, d, q, 0, 2*Math.PI)
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(closest[1].x, closest[1].y, 10, 0, 2*Math.PI)
    ctx.closePath()
    ctx.fillStyle = "red"
    ctx.fill()

    if (distance({x:a,y:b}, mousePosition) < hold) {
        if (mouseDown && !dragged) {
            dragged = true
            currentlyDragging = 1
        }
    } else if (distance({x:c,y:d}, mousePosition) < hold) {
        if (mouseDown && !dragged) {
            dragged = true
            currentlyDragging = 2
        }
    }
    if (!mouseDown) {
        currentlyDragging = 0
        dragged = false
    }
    if (currentlyDragging == 1) {
        if (distance(mousePosition, {x:c,y:d}) <= r+q) {
            a = mousePosition.x
            b = mousePosition.y
        }
    } else if (currentlyDragging == 2) {
        if (distance(mousePosition, {x:c,y:d}) <= r+q) {
            c = mousePosition.x
            d = mousePosition.y
        }
    }

    ctx.restore()
}