
function cylinderInstance(_innerRadius, _outerRadius, _height) {
	this.innerRadius = _innerRadius;
	this.outerRadius = _outerRadius;
	this.height = _height;
	//this.branches = null;
	//this.material = _material;

	this.material = new THREE.MeshPhongMaterial( { color: 0x8B4513, specular: 0x999999, shininess: 10, shading: THREE.FlatShading } );
	this.geometry = new THREE.CylinderGeometry( this.innerRadius, this.outerRadius, this.height, 10 );
	this.mesh = new THREE.Mesh( this.geometry, this.material );

	this.mesh.geometry.dynamical = true;
}

cylinderInstance.prototype.updateGeometry = function(_newHeight, _newInnerRadius, _newOuterRadius, _scene) {
	var selectedObject = _scene.getObjectById(this.mesh.id, true);
    _scene.remove( selectedObject );
	delete selectedObject;

	var posTemp = [this.mesh.position.x, this.mesh.position.y, this.mesh.position.z];
	
    this.geometry = new THREE.CylinderGeometry( _newInnerRadius, _newOuterRadius, _newHeight, 10 );
	this.mesh = new THREE.Mesh( this.geometry, this.material );

	this.mesh.position.x = posTemp[0];
	this.mesh.position.y = posTemp[1];
	this.mesh.position.z = posTemp[2];
	
	//We want the cylinder's bottom to be fixed, but its pivot is in its center. Translation is needed.
	this.mesh.position.y += (_newHeight- this.height)/2;
	this.height = _newHeight;
	this.innerRadius = _newInnerRadius;
	this.outerRadius = _newOuterRadius;
	
	_scene.add(this.mesh);
};