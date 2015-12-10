

var isMouseDown = false, onMouseDownPosition, camRadius = 5, camTheta = 0, onMouseDownTheta = 0, camPhi = 0, onMouseDownPhi = 0,

onMouseDownPosition = new THREE.Vector2();


function onDocumentMouseDown( event ) {
event.preventDefault();

isMouseDown = true;

onMouseDownTheta = camTheta;
onMouseDownPhi = camPhi;
onMouseDownPosition.x = event.clientX;
onMouseDownPosition.y = event.clientY;
//onMouseDownPosition.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
//onMouseDownPosition.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
}

function onDocumentMouseMove( event ) {

event.preventDefault();

if ( isMouseDown ) {

	camTheta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
	camPhi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;

	camPhi = Math.min( 90, Math.max( 0, camPhi ) );
	
	camera.rotation.y = camTheta * Math.PI / 180;
	camera.rotation.x = -camPhi * Math.PI / 180;
	
	camera.position.x = camRadius * Math.sin( camTheta * Math.PI / 180 ) * Math.cos( camPhi * Math.PI / 180 );
	camera.position.y = camRadius * Math.sin( camPhi * Math.PI / 180 );
	camera.position.z = camRadius * Math.cos( camTheta * Math.PI / 180 ) * Math.cos( camPhi * Math.PI / 180 );
	
	camera.updateMatrix();

}

}

function onDocumentMouseUp( event ) {

event.preventDefault();
theTree.iterate();
isMouseDown = false;

onMouseDownPosition.x = event.clientX - onMouseDownPosition.x;
onMouseDownPosition.y = event.clientY - onMouseDownPosition.y;

}


function onDocumentMouseWheel( event ) {

camRadius += 0.03 * event.deltaY;
camRadius = Math.min( 10, Math.max( 2, camRadius ) );

camera.rotation.y = camTheta * Math.PI / 180;
camera.rotation.x = -camPhi * Math.PI / 180;

camera.position.x = camRadius * Math.sin( camTheta * Math.PI / 180 ) * Math.cos( camPhi * Math.PI / 180 );
camera.position.y = camRadius * Math.sin( camPhi * Math.PI / 180 );
camera.position.z = camRadius * Math.cos( camTheta * Math.PI / 180 ) * Math.cos( camPhi * Math.PI / 180 );

camera.updateMatrix();
}



function onWindowResize( event ) {

	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight-50;

	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();

}


var ongoingTouches = new Array();

function handleStart(evt) {
  evt.preventDefault();

  var ctx = window.getContext("2d");
  var touches = evt.changedTouches;
        
  for (var i = 0; i < touches.length; i++) {
    ongoingTouches.push(copyTouch(touches[i]));
    var color = colorForTouch(touches[i]);
    ctx.beginPath();
    ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function handleMove(evt) {
  evt.preventDefault();
  var ctx = window.getContext("2d");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var color = colorForTouch(touches[i]);
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ctx.beginPath();
      log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();

      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
      log(".");
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  theTree.iterate();
  var ctx = window.getContext("2d");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var color = colorForTouch(touches[i]);
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    } else {
      log("can't figure out which touch to end");
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  log("touchcancel.");
  var touches = evt.changedTouches;
  
  for (var i = 0; i < touches.length; i++) {
    ongoingTouches.splice(i, 1);  // remove it; we're done
  }
}


//Fanden fløjte mig drenge, bør dette fejres fandeme!
