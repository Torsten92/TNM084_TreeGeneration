

var isMouseDown = false, onMouseDownPosition, camRadius = 5, camTheta = 0, onMouseDownTheta = 0, camPhi = 0, onMouseDownPhi = 0,

onMouseDownPosition = new THREE.Vector2();

function onDocumentMouseDown(event) {
	event.preventDefault();
	
	if(event.clientX > window.innerWidth*0.1 && event.clientX < window.innerWidth) {
		isMouseDown = true;

		onMouseDownTheta = camTheta;
		onMouseDownPhi = camPhi;
	
		onMouseDownPosition.x = event.clientX;
		onMouseDownPosition.y = event.clientY;
	}
}

function onDocumentMouseMove(event) {

	event.preventDefault();

	if (isMouseDown) {

		camTheta =  - ((event.clientX - onMouseDownPosition.x) * 0.5) + onMouseDownTheta;
		camPhi = ((event.clientY - onMouseDownPosition.y) * 0.5) + onMouseDownPhi;

		camPhi = Math.min(90, Math.max(0, camPhi));

		camera.rotation.y = camTheta * Math.PI / 180;
		camera.rotation.x = -camPhi * Math.PI / 180;

		camera.position.x = camRadius * Math.sin(camTheta * Math.PI / 180) * Math.cos(camPhi * Math.PI / 180);
		camera.position.y = camRadius * Math.sin(camPhi * Math.PI / 180);
		camera.position.z = camRadius * Math.cos(camTheta * Math.PI / 180) * Math.cos(camPhi * Math.PI / 180);

		camera.updateMatrix();

	}

}

function onDocumentMouseUp(event) {

	event.preventDefault();
	//theTree[numTrees].iterate();
	isMouseDown = false;

	onMouseDownPosition.x = event.clientX - onMouseDownPosition.x;
	onMouseDownPosition.y = event.clientY - onMouseDownPosition.y;

}

function onDocumentMouseWheel(event) {
	
	//Firefox have a slower scroll than other browsers
	var isFirefox = typeof InstallTrigger !== 'undefined';
	if(!isFirefox)
		camRadius += 0.01 * event.deltaY;
	else
		camRadius += 0.2 * event.deltaY;
	camRadius = Math.min(20, Math.max(2, camRadius));

	camera.rotation.y = camTheta * Math.PI / 180;
	camera.rotation.x = -camPhi * Math.PI / 180;

	camera.position.x = camRadius * Math.sin(camTheta * Math.PI / 180) * Math.cos(camPhi * Math.PI / 180);
	camera.position.y = camRadius * Math.sin(camPhi * Math.PI / 180);
	camera.position.z = camRadius * Math.cos(camTheta * Math.PI / 180) * Math.cos(camPhi * Math.PI / 180);

	camera.updateMatrix();
}

function onWindowResize(event) {

	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight - 50;

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();

}

function onDocumentTouchStart(event) {
	if (event.touches.length === 1) {
		event.preventDefault();

		//theTree[numTrees].iterate();

		camTheta -= 0.03 * ((screen.width / 2) - event.touches[0].pageX);
		camPhi += 0.03 * ((screen.height / 2) - event.touches[0].pageY);

		camPhi = Math.min(90, Math.max(0, camPhi));

		camera.rotation.y = camTheta * Math.PI / 180;
		camera.rotation.x = -camPhi * Math.PI / 180;

		camera.position.x = camRadius * Math.sin(camTheta * Math.PI / 180) * Math.cos(camPhi * Math.PI / 180);
		camera.position.y = camRadius * Math.sin(camPhi * Math.PI / 180);
		camera.position.z = camRadius * Math.cos(camTheta * Math.PI / 180) * Math.cos(camPhi * Math.PI / 180);

		camera.updateMatrix();
	}
}

//Fanden fløjte mig drenge, bør dette fejres fandeme!
