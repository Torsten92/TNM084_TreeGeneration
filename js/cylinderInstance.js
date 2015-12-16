// innerRadius, outerRadius and height are floats. bottom and top are points describnig where the cylinder instance start and where it 
// ends. Note that the cylinder will grow from bottom to top based on the tree's growth rate.
// topNode is the index of the node positioned at the branch's top. finished goes from 0 to 1 as the branch grows from bottom to top.

function cylinderInstance(_bottom, _top, _iteration) {
	this.bottom = _bottom;
	this.top = _top;
	this.iteration = _iteration;
	this.finished = 0.0;
	
	this.material = new THREE.MeshPhongMaterial( { color: 0x8B4513, specular: 0x999999, shininess: 10, shading: THREE.FlatShading } );
	this.geometry = new THREE.CylinderGeometry( 0.0, 0.0, 0.0, 10 );
	this.mesh = new THREE.Mesh( this.geometry, this.material );

	var rotQ = new THREE.Quaternion();	//Rotation for each branch is fixed. Only apply this rotation.
	
	//direction = this.top - this.bottom
	this.direction = new THREE.Vector3(this.top.x - this.bottom.x, 
									   this.top.y - this.bottom.y, 
									   this.top.z - this.bottom.z);
	var temp = new THREE.Vector3();
	temp.copy(this.direction);
	
	rotQ.setFromUnitVectors( new THREE.Vector3(0.0,1.0,0.0), temp.normalize() );
	this.mesh.quaternion.multiply( rotQ );
	
	//Every cylinderInstance may have one or more children (Also cyliderInstances)
	this.children = [];
}

cylinderInstance.prototype.updateGeometry = function() {
	//stepSize must be a factor of 1 (1/2, 1/4, 1/8 etc.)
	var stepSize = 1/8;
	this.finished = Math.min (1.01, this.finished + stepSize);
	if(this.finished <= 1.0) {
		this.geometry = new THREE.CylinderGeometry( 0.01, 0.01, this.direction.length()*this.finished, 10 );	
		this.mesh.geometry = this.geometry;
		
		//We want the cylinder's bottom to be fixed, but its pivot is in its center. Translation is needed.
		var temp = new THREE. Vector3();
		temp.copy(this.direction);
		this.mesh.position.add(temp.multiplyScalar(stepSize/2.0));
		
		return 1;
	}
	return 0;
};

cylinderInstance.prototype.updateRadius = function(_iteration) {
	var topRad = Math.sqrt(_iteration / this.iteration) * 0.01;
	var botRad = Math.sqrt(_iteration / this.iteration) * 0.012;
	this.geometry = new THREE.CylinderGeometry( topRad, botRad, this.direction.length()*this.finished, 10 );	
	this.mesh.geometry = this.geometry;
	console.log("hej");
}