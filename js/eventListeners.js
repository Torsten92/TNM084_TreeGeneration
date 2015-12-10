

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

function onDocumentTouchStart( event ) {
	if ( event.touches.length === 1 ) {
		event.preventDefault();
		
		theTree.iterate();
		
		if(onMouseDownPosition.x) {
			camTheta -= onMouseDownPosition.x - event.touches[ 0 ].pageX;
			camPhi += onMouseDownPosition.y - event.touches[ 0 ].pageY;
		}
		
		onMouseDownPosition.x = event.touches[ 0 ].pageX;
		onMouseDownPosition.y = event.touches[ 0 ].pageY;

		camPhi = Math.min( 90, Math.max( 0, camPhi ) );
		
		camera.rotation.y = camTheta * Math.PI / 180;
		camera.rotation.x = -camPhi * Math.PI / 180;
		
		camera.position.x = camRadius * Math.sin( camTheta * Math.PI / 180 ) * Math.cos( camPhi * Math.PI / 180 );
		camera.position.y = camRadius * Math.sin( camPhi * Math.PI / 180 );
		camera.position.z = camRadius * Math.cos( camTheta * Math.PI / 180 ) * Math.cos( camPhi * Math.PI / 180 );
		
		camera.updateMatrix();
	}
}
