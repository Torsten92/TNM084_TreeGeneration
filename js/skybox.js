
function addSkybox() {
	this.urls = [
	  'textures/posx.png',
	  'textures/negx.png',
	  'textures/posy.png',
	  'textures/negy.png',
	  'textures/posz.png',
	  'textures/negz.png'
	];

	this.cubemap = THREE.ImageUtils.loadTextureCube(urls); // load textures
	//this.cubemap.format = THREE.RGBFormat;

	//this.shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
	//this.shader.uniforms['tCube'].value = cubemap; // apply textures to shader

	// create shader material
	//this.material = new THREE.ShaderMaterial( { fragmentShader: this.shader.fragmentShader, vertexShader: this.shader.vertexShader, uniforms: this.shader.uniforms, depthWrite: false, side: THREE.BackSide });
	
	//this.geometry = new THREE.CubeGeometry(100, 100, 100);
	
	// create skybox mesh
	//this.mesh = new THREE.Mesh( this.geometry , this.material );
}