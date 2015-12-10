//
// D, dk and di are floats. N is an int representing the amount of attraction points. attractionRadius is a float which defines the radius of a spawning sphere. 
// startPoint is a THREE.vector3.
// 
// This function/object will spawn a tree at startPoint which will grow towards its attraction points. Its function iterate will creates the actual growth. 
// The faster (calls per second) iterate is called, the faster the tree will grow.
//
// D represents the distance the tree grows in one iteration. dk is the minimum distance between an attractionpoint and a tree node to kill the attraction point.
// D should be smaller than 0.5*dk to avoid rare bugs. di is the radius of influence before a tree node is affected by an attraction point.   
// 
// attractionRadius should be around 50-100 % of height value to get a nice tree.
//
// Author: Torsten Gustafsson (2015-12-07)
// Based on Adam Runions, Brendan Lane, and Przemyslaw Prusinkiewicz's article on the space colonisation algorithm.
// Their article may be found here: http://algorithmicbotany.org/papers/colonization.egwnp2007.html
//

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
	
	//An array of cylinderInstances. Each element will represent a tree branch. numBranches represent the current amount of branches
	this.branches = [];
	this.numBranches = 0;
	
	//Placed in startPoint + height + random value in sphere
	this.attractionPoints = [];
	
	//Points that define where the tree actually grows. numNodes represents the current amount of nodes
	this.treeNodes = [];
	this.numNodes = 1;
	
	//this.material = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0x999999, shininess: 10, shading: THREE.FlatShading } );
	
	//Generate N attraction points in the space defined by startPosition, height and attractionRadius
	for(var i = 0; i < this.N; i++) {
		var phi = (Math.random() * Math.PI * 2);
		var theta = (Math.random() * Math.PI);
		
		this.attractionPoints[i] = new THREE.Vector3();
		this.attractionPoints[i].x = this.startPoint.x + this.attractionRadius * Math.random()*Math.sin(theta)*Math.cos(phi);
		this.attractionPoints[i].y = this.startPoint.y + this.height + this.attractionRadius * Math.random()*Math.cos(theta);
		this.attractionPoints[i].z = this.startPoint.z + this.attractionRadius * Math.random()*Math.sin(theta)*Math.sin(phi);
	}
	this.treeNodes[0] = new THREE.Vector3(_startPoint.x, _startPoint.y, _startPoint.z);
	this.branches[0] = new cylinderInstance(0.02, 0.02, this.D, this.startPoint, this.startPoint);
	
	this.base.position.copy(_startPoint);
	this.base.add(this.branches[0].mesh);
}


tree.prototype.iterate = function() {
	if(this.finished)
		return;
	
	//Remove nodes that get too close to each other
	for(var i = 0; i < this.numNodes; i++) {
		for(var j = this.numNodes-1; j > i; j--) {
			var tempVector = new THREE.Vector3();
			tempVector.subVectors(this.treeNodes[i], this.treeNodes[j]);
			if(tempVector.length() < 0.75*this.D) {
				this.treeNodes.splice(j, 1);
				this.numNodes -= 1;
				console.log("removed!");
			}
		}
	}
	this.numNodes = this.treeNodes.length;
	
	//Calculate new nodes for each current tree node and attraction point
	for(var i = 0; i < this.numNodes; i++) {
		var newBranchDir = new THREE.Vector3(0.0, 0.0, 0.0);
		
		//Loop backwards for removal of attraction points to work correctly
		for(var j = this.attractionPoints.length-1; j >= 0; j--) {
			var tempVector = new THREE.Vector3( (this.attractionPoints[j].x - this.treeNodes[i].x), 
												(this.attractionPoints[j].y - this.treeNodes[i].y), 
												(this.attractionPoints[j].z - this.treeNodes[i].z) );
			if(tempVector.length() < this.di ) {
				if(tempVector.length() < this.dk ) {
					this.attractionPoints.splice(j, 1);
				}
				
				newBranchDir.add(tempVector.normalize());
			}
		}
		//Keep going if we found any attraction points
		if(newBranchDir.length() > 0.0) {
			newBranchDir.normalize();
			this.treeNodes[this.treeNodes.length] = new THREE.Vector3(this.treeNodes[i].x + (newBranchDir.x * this.D), this.treeNodes[i].y + (newBranchDir.y * this.D), this.treeNodes[i].z + (newBranchDir.z * this.D));
			
			var rotQ = new THREE.Quaternion();
			rotQ.setFromUnitVectors( new THREE.Vector3(0.0, 1.0, 0.0), newBranchDir );
			this.branches[++this.numBranches] = new cylinderInstance(0.02, 0.02, this.D);
			this.branches[this.numBranches].mesh.quaternion.multiply( rotQ );
			this.branches[this.numBranches].mesh.position.copy(this.treeNodes[this.treeNodes.length-1]).sub(this.startPoint).sub(newBranchDir.multiplyScalar(this.D/2));
			this.base.add(this.branches[this.numBranches].mesh);
			}
	}
	//If we didn't find any new nodes it means that the tree is either complete or it wasn't able to start
	if(this.numNodes == this.treeNodes.length) {
		if(this.treeNodes.length == 1) {
			this.treeNodes[0].y += this.D; //Move node upwards if it didn't start
			
			this.branches[++this.numBranches] = new cylinderInstance(0.02, 0.02, this.D);
			this.branches[this.numBranches].mesh.position.copy(this.treeNodes[this.treeNodes.length-1]).sub(this.startPoint).sub(new THREE.Vector3(0.0,1.0,0.0).multiplyScalar(this.D/2));
			this.base.add(this.branches[this.numBranches].mesh);
		}
		else
			this.finished = true;
	}
	
	this.numNodes = this.treeNodes.length;
	//console.log("numNodes numBranches aP.length = " + this.numNodes + " "+ this.numBranches + " " + this.attractionPoints.length + " " + this.finished);
	
	//var rotQ = new THREE.Quaternion();
	//rotQ.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), 0.1 );
	//this.branches[0].mesh.quaternion.multiply( rotQ );
};
