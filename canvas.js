let mouseDownLocation = new Vec()
let mouseDownLocationABS = new Vec()
let fingerDistance = null
let view = {zoom: 1, offset: new Vec(0,0), center: new Vec(0,0)}
let screenCenter = new Vec(400,400)


function getViewXYfromScreenXY (pt) {
  return pt.subtract(screenCenter).scale(view.zoom).add(view.offset)
}

function getScreenXYfromViewXY (pt) {
  return pt.subtract(view.offset).scale(1/view.zoom).add(screenCenter)
}

function scaleView (sc) {
  const newZoom = view.zoom * sc
  view.zoom = Math.max(0.2, Math.min(5, newZoom))
  translateView(Vec.zero, view)
}

function translateView (dif) { 
  const newOffset = view.offset.add(dif.scale(view.zoom))
  view.offset = newOffset.bounds(screenCenter.scale(1/view.zoom))
}

function mousedown (event) {
  mouseDownLocationABS = new Vec(event.offsetX, event.offsetY)
  mouseDownLocation = new Vec(event.offsetX, event.offsetY)
  document.getElementById('board').addEventListener('mousemove', drag)
  document.getElementById('board').addEventListener('mouseup', removeMousemove)
}

function removeMousemove (event) {
  document.getElementById('board').removeEventListener('mousemove', drag)
  document.getElementById('board').removeEventListener('mouseup', removeMousemove)
}

function mouseWheel (event) {
  event.preventDefault()
  if (event.deltaY < 0) { scaleView(1 / 1.1) }
  if (event.deltaY > 0) { scaleView(1.1) }
  drawScreen(false)
}

function drag (e) {
  const offset = new Vec(e.offsetX, e.offsetY)
  const dif = mouseDownLocation.subtract(offset)
  if (mouseDownLocationABS.subtract(offset).mag > 20) {
    sel = { state: 0, actions: { attacks: [], menu: [] }, moves: [] }
    //drawScreen()
  }
  e.preventDefault(); e.stopPropagation()
  translateView(dif)
  mouseDownLocation = offset
  drawScreen(false)
}

function boardClick (event) {
  const clickLoc =  getViewXYfromScreenXY(new Vec(event.offsetX, event.offsetY))
  console.log("clickLoc", clickLoc);
  drawScreen()
}

function touchstart (event) {
  const { pageX, pageY } = event.touches[0]
  mouseDownLocation = new Vec(pageX, pageY)
  document.getElementById('board').addEventListener('touchmove', touchdrag)
  document.getElementById('board').addEventListener('touchend', removeTouchmove)
}

function removeTouchmove (event) {
  fingerDistance = null
  document.getElementById('board').removeEventListener('touchmove', touchdrag)
  document.getElementById('board').removeEventListener('touchend', removeTouchmove)
}

function touchdrag (event, view = views.spaceView) {
  event.preventDefault(); event.stopPropagation()

  const t1 = new Vec(event.touches[0].pageX, event.touches[0].pageY)
  if (event.touches[1]) {
    const t2 = new Vec(event.touches[1].pageX, event.touches[1].pageY)
    const fingerDistanceNew = t1.distance(t2)
    if (fingerDistance) {
      scaleView(fingerDistance / fingerDistanceNew)
    }
    fingerDistance = fingerDistanceNew
  } else fingerDistance = null
  translateView(mouseDownLocation.subtract(t1))
  mouseDownLocation = t1
  drawScreen(false)
}



function resizeScreen (event) {
  // console.log(window.innerHeight, window.innerWidth)
  const roundedHalfMin = (a) => Math.max(Math.floor(a / 2), 200)
  const center = new Vec(roundedHalfMin(window.innerWidth) - 3, roundedHalfMin(window.innerHeight) - 3)
  const canvas = document.getElementById('board')
  screenCenter = center
  canvas.width = center.x * 2
  canvas.height = center.y * 2
  drawScreen()
}


function drawScreen() {




  const ctx = document.body.querySelector('#board').getContext('2d')
  ctx.clearRect(-99999, -99999, 199999, 199999) 
  ctx.setTransform(1, 0,0, 1, 0, 0)
  ctx.setTransform(1/view.zoom, 0,0, 1/view.zoom, - view.offset.x/view.zoom  + screenCenter.x,  - view.offset.y/view.zoom + screenCenter.y)

  ctx.fillStyle = "white";

  for(var i = -500; i <= 500; i += 100){
      for(var j = -500; j <= 500; j += 100){
        // console.log(i);
        p = new Vec(i,j)
        ctx.fillRect(p.x, p.y, 10, 10)
    }
  }

//p => getScreenXYfromViewXY(p)).forEach(p => ctx.fillRect(p.x, p.y, 10, 10))


}