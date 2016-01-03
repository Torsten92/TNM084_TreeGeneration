// innerRadius, outerRadius and height are floats. bottom and top are points describnig where the cylinder instance start and where it
// ends. Note that the cylinder will grow from bottom to top based on the tree's growth rate.
// topNode is the index of the node positioned at the branch's top. finished goes from 0 to 1 as the branch grows from bottom to top.

function cylinderInstance(_bottom, _top, _iteration, _parentDir, _topNode) {
	this.bottom = _bottom;
	this.top = _top;
	this.iteration = _iteration;
	this.finished = 0.0;

	//Only used for indexing the tree's hash map.
	this.topNode = _topNode;

	this.material = new THREE.MeshPhongMaterial({
			color : 0x8B4513,
			specular : 0x999999,
			shininess : 10,
			shading : THREE.FlatShading
		});
	this.geometry = new THREE.CylinderGeometry(0.0, 0.0, 0.0, 10);
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.staticQuaternion = new THREE.Quaternion();

	var rotQ = new THREE.Quaternion(); //Rotation for each branch is fixed. Only apply this rotation.

	//direction = this.top - this.bottom
	this.direction = new THREE.Vector3(this.top.x - this.bottom.x,
			this.top.y - this.bottom.y,
			this.top.z - this.bottom.z);

	var temp = new THREE.Vector3();
	temp.copy(this.direction);
	var temp2 = new THREE.Vector3();
	temp2.copy(_parentDir);
	rotQ.setFromUnitVectors(temp2.normalize(), temp.normalize());
	//rotQ.setFromAxisAngle(new THREE.Vector3(0.0,0.0,1.0), 0.2);
	this.staticQuaternion.multiplyQuaternions(this.mesh.quaternion, rotQ.inverse());
	this.mesh.quaternion.copy(this.staticQuaternion);

	//Every cylinderInstance may have one or more children (leaves)
	this.children = [];
}

cylinderInstance.prototype.updateGeometry = function (_leafMaterial) {
	//stepSize must be add up evenly to 1 (1/2, 1/4, 1/8 etc.)
	var stepSize = 0.125; // 1/8
	this.finished = Math.min(1.01, this.finished + stepSize);
	if (this.finished <= 1.0) {
		this.geometry = new THREE.CylinderGeometry(0.01, 0.01, this.direction.length() * this.finished, 10);
		this.geometry.translate(0.0, this.direction.length() * this.finished / 2, 0.0);
		this.mesh.geometry = this.geometry;

		if (this.finished == 1 && this.iteration > 7) {
			var planeGeometry = new THREE.PlaneGeometry(0.2, 0.1);

			this.children[0] = new THREE.Mesh(planeGeometry, _leafMaterial);
			var rotation = Math.random() * 2.0 * Math.PI;
			this.children[0].quaternion.setFromAxisAngle(new THREE.Vector3(0.0, 1.0, 0.0), rotation);
			this.children[0].position.x = Math.cos(rotation) * 0.1;
			this.children[0].position.z = -Math.sin(rotation) * 0.1;
			this.children[0].position.y = this.direction.length() * this.finished / 2;
			this.mesh.add(this.children[0]);
		}

		return 1;
	}
	return 0;
};

cylinderInstance.prototype.updateRadius = function (_iteration) {
	//var topRad = Math.sqrt(_iteration-this.iteration) * 0.01;
	//var botRad = Math.sqrt(1+_iteration-this.iteration) * 0.01;
	var topRad = Math.sqrt(_iteration / this.iteration) * 0.01;
	var botRad = Math.sqrt(_iteration / this.iteration) * 0.012;
	this.geometry = new THREE.CylinderGeometry(topRad, botRad, this.direction.length() * this.finished, 10);
	this.geometry.translate(0.0, this.direction.length() * this.finished / 2, 0.0);
	this.mesh.geometry = this.geometry;

	if (this.children[0] != null && topRad > 0.04) {

		this.mesh.remove(this.children[0]);
	}
}

cylinderInstance.prototype.shake = function (_strength) {
	var tempQ = new THREE.Quaternion();
	var tempV = new THREE.Vector3(0.5, 0.5, 1.0).normalize();
	tempV.applyQuaternion(this.staticQuaternion);
	tempQ.setFromAxisAngle(tempV, _strength);
	this.mesh.quaternion.multiply(tempQ);
}
