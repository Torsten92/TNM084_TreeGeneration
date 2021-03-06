//
// This function object will spawn a tree at startPoint which will grow towards its attraction points. Its method iterate creates new nodes for each iteration
// while the method updateBranches creates the actual growth.
// The faster (calls per second) iterate is called, the faster the tree will grow.
//
// D, dk and di are floats. N is an int representing the amount of attraction points. attractionRadius is a float which defines the radius of a spawning sphere.
// startPoint is a THREE.vector3.
//
// D represents the distance the tree grows in one iteration. dk is the minimum distance between an attractionpoint and a tree node to kill the attraction point.
// D should be smaller than 0.5*dk to avoid rare bugs. di is the radius of influence before a tree node is affected by an attraction point.
//
// attractionRadius should be around 50-100 % of height value to get a nice tree.
//
// Author: Torsten Gustafsson. LiU. (2016-01-05)
// Based on Adam Runions, Brendan Lane, and Przemyslaw Prusinkiewicz's article on the space colonisation algorithm.
// Their article may be found here: http://algorithmicbotany.org/papers/colonization.egwnp2007.html
//

function key(obj) {
	return obj.topNode;
}

function tree(_D, _dk, _di, _N, _attractionRadius, _startPoint, _height) {
	this.D = _D;
	this.dk = _dk;
	this.di = _di;
	this.N = _N;
	this.startPoint = _startPoint;
	this.attractionRadius = _attractionRadius;
	this.height = _height;

	this.base = new THREE.Object3D();
	this.finished = false;
	this.iteration = 1; //Only used for updating branches

	//Leaf texture sent to the branches
	this.texloader = new THREE.TextureLoader();
	this.leafTex = this.texloader.load("textures/leaf.png");
	this.leafMaterial = new THREE.MeshBasicMaterial({
			map : this.leafTex,
			side : THREE.DoubleSide,
			transparent : true,
			blending : THREE.CustomBlending
		})

		//Stores relation between a branch and its top node (not currently used)
		this.hashMap = {};

	//An array of cylinderInstances. Each element will represent a tree branch. numBranches represent the current amount of branches
	this.branches = [];
	this.numBranches = 1;

	//Placed in startPoint + height + random value in sphere
	this.attractionPoints = [];

	//Points that define where the tree actually grows. numNodes represents the current amount of nodes
	this.treeNodes = [];
	this.numNodes = 1;

	//Generate N attraction points in the space defined by startPosition, height and attractionRadius
	for (var i = 0; i < this.N; i++) {
		var phi = (Math.random() * Math.PI * 2);
		var theta = (Math.random() * Math.PI);

		this.attractionPoints[i] = new THREE.Vector3();
		this.attractionPoints[i].x = this.startPoint.x + this.attractionRadius * Math.random() * Math.sin(theta) * Math.cos(phi);
		this.attractionPoints[i].y = this.startPoint.y + this.height + this.attractionRadius * Math.random() * Math.cos(theta);
		this.attractionPoints[i].z = this.startPoint.z + this.attractionRadius * Math.random() * Math.sin(theta) * Math.sin(phi);
	}
	this.treeNodes[0] = new THREE.Vector3(_startPoint.x, _startPoint.y, _startPoint.z);
	cylinders[cylinderCounter++].init(this.startPoint, this.treeNodes[0], 0, new THREE.Vector3(0.0, 1.0, 0.0), this.treeNodes.length - 1);
	cylinderCounter = cylinderCounter > 9999 ? 0 : cylinderCounter;
	this.branches[0] = cylinders[cylinderCounter-1];

	this.hashMap[key(this.branches[0])] = this.branches[0];

	this.base.position.copy(_startPoint);
	this.base.add(this.branches[0].mesh);

}

tree.prototype.iterate = function () {
	if (this.finished) {
		//Clear arrays
		this.attractionPoints.splice(0, this.attractionPoints.length);
		this.treeNodes.splice(0, this.treeNodes.length);
		return;
	}

	//Calculate new nodes for each current tree node and attraction point
	for (var i = 0; i < this.numNodes; i++) {
		var newBranchDir = new THREE.Vector3(0.0, 0.0, 0.0);

		//Loop backwards for removal of attraction points to work correctly
		for (var j = this.attractionPoints.length - 1; j >= 0; j--) {
			var tempVector = new THREE.Vector3(this.attractionPoints[j].x - this.treeNodes[i].x,
					this.attractionPoints[j].y - this.treeNodes[i].y,
					this.attractionPoints[j].z - this.treeNodes[i].z);
			if (tempVector.length() < this.di) {
				if (tempVector.length() < this.dk) {
					this.attractionPoints.splice(j, 1);
				}

				newBranchDir.add(tempVector.normalize());
			}
		}
		//Keep going if we found any attraction points
		if (newBranchDir.length() > 0.0) {
			newBranchDir.normalize();

			//Store node position for evaluation
			var tempPos = new THREE.Vector3(this.treeNodes[i].x + (newBranchDir.x * this.D),
					this.treeNodes[i].y + (newBranchDir.y * this.D),
					this.treeNodes[i].z + (newBranchDir.z * this.D));

			var breakCondition = false;
			for (var k = 0; k < this.numNodes; k++) {
				var temp = new THREE.Vector3(tempPos.x, tempPos.y, tempPos.z); //Another temporary variable needed because of THREE.js vector operators
				if (temp.sub(this.treeNodes[k]).length() < 0.9 * this.D) { //Prevents branches from growing into each other
					breakCondition = true;
				}
			}

			if (breakCondition == false) {
				this.treeNodes[this.treeNodes.length] = tempPos;

				//Create a new branch and add it to the hashMap. Then add that branch as a child to the current branch
				cylinders[cylinderCounter++].init(this.hashMap[i].top, this.treeNodes[this.treeNodes.length - 1], ++this.iteration, this.hashMap[i].direction, this.treeNodes.length - 1);
				cylinderCounter = cylinderCounter > 9999 ? 0 : cylinderCounter;
				this.branches[this.numBranches++] = cylinders[cylinderCounter-1];

				//var tempDir = new THREE.Vector3(this.hashMap[i].direction.x, this.hashMap[i].direction.y, this.hashMap[i].direction.z);
				this.branches[this.numBranches - 1].mesh.position.set(0, this.D, 0);

				this.hashMap[key(this.branches[this.numBranches - 1])] = this.branches[this.numBranches - 1];
				this.hashMap[i].mesh.add(this.branches[this.numBranches - 1].mesh);
			}
		}
	}
	//If we didn't find any new nodes it means that the tree is either complete or it wasn't able to start
	if (this.numNodes == this.treeNodes.length) {
		if (this.treeNodes.length == 1) {
			this.treeNodes[0].y += this.D; //Move node upwards if it didn't start
			
			cylinders[cylinderCounter++].init(new THREE.Vector3(this.treeNodes[0].x, this.treeNodes[0].y-this.D, this.treeNodes[0].z), this.treeNodes[0], ++this.iteration, new THREE.Vector3(0, this.D, 0), 0);
			cylinderCounter = cylinderCounter > 9999 ? 0 : cylinderCounter;
			this.branches[this.numBranches++] = cylinders[cylinderCounter-1];

			this.branches[this.numBranches - 1].mesh.position.set(0, this.D, 0);
			this.hashMap[key(this.branches[this.numBranches - 1])] = this.branches[this.numBranches - 1];
			this.branches[this.numBranches - 2].mesh.add(this.branches[this.numBranches - 1].mesh);
		} else
			this.finished = true;

		return; //This iteration is finished. Next step will tell us how to proceed.
	}

	this.numNodes = this.treeNodes.length;
	this.numBranches = this.branches.length;

	//Update radius for all branches
	for (var i = 0; i < this.numBranches; i++) {
		this.branches[i].updateRadius(this.iteration);
	}
};

tree.prototype.updateBranches = function () {
	var temp = 0;
	for (var i = 0; i < this.branches.length; i++) {
		temp += this.branches[i].updateGeometry(this.leafMaterial);
	}
	if (temp == 0)
		this.iterate();
}

tree.prototype.generateWind = function (_time, _windSpeed) {
	for (var i = 0; i < this.branches.length; i++) {
		this.branches[i].shake(1/_windSpeed * Math.PI * Math.cos(_time) / 180);	//Amplitude of wind
	}
}
