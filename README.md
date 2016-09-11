Author: Torsten Gustafsson. Linköpings Universitet.
Made for the course TNM084 - Procedurella metoder för bilder.


Use this link to run the project: http://cdn.rawgit.com/torsten92/tnm084_treegeneration/master/index.html


Procedural tree generation.

This application generates trees using the space colonisation algorihm (based on this article: http://algorithmicbotany.org/papers/colonization.egwnp2007.html) dynamically. Written in javascript using WebGL and THREE.js

Because this application is written in javascript and are very demanding on the CPU, the browser might crash if too many and too big trees 
are generated at once. Some simple error handlers have been implemented, for example if too many objects are in the scene at the same time, 
the scene will reset itself and a warning message will appear.

The user interface allows the user to change some paramaters, but the fundamental algorithmic parameters have been excluded there. This is 
because they may require some knowledge of the algorithm itself and are not intuitive for the average user. Instead these parameters have 
been given fixed values and may be only changed in the code itself.

The algorithm first creates a number of points (nodes) in an area defined by the user, and creates a base branch in the tree's start position. 
Then the iteration process begins (iteration time depends on the amount of objects in the scene to avoid crashes). For every iteration each 
branch will create new branches pointing towards its closest nodes, until no nodes remain. 

The parameters used by the algorithm are the branch distance (D) which represents the length of each branch. The influence distance (di) 
representing the radius of influence the nodes have on each branch (nodes too far away from a branch does not affect it). And finally 
the kill distance (dk) which tells us when to destroy a node (when the distance between a new branch and a node is small enough).

Values used for now are: D = 0.2m, di = 0.7m, dk = 0.6m.