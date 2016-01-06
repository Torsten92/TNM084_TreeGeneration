function createSkybox() {
	var urls = [
	  'textures/skybox/posx.png',
	  'textures/skybox/negx.png',
	  'textures/skybox/posy.png',
	  'textures/skybox/negy.png',
	  'textures/skybox/posz.png',
	  'textures/skybox/negz.png'
	];

	var cubemap = THREE.ImageUtils.loadTextureCube(urls); // load textures
	cubemap.format = THREE.RGBFormat;

	var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
	shader.uniforms['tCube'].value = cubemap; // apply textures to shader

	// create shader material
	var skyBoxMaterial = new THREE.ShaderMaterial( {
	  fragmentShader: shader.fragmentShader,
	  vertexShader: shader.vertexShader,
	  uniforms: shader.uniforms,
	  depthWrite: false,
	  side: THREE.BackSide
	});

	// create skybox mesh and add it to the current scene
	var skybox = new THREE.Mesh( new THREE.CubeGeometry(100, 100, 100), skyBoxMaterial );
	sceneHandler.scene.add( skybox );
}