import * as THREE from 'three'
export function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;

	// There is no way to take e.g. sets of 5 elements from
	// a set of 4.
	if (k > set.length || k <= 0) {
		return [];
	}

	// K-sized set has only one K-sized subset.
	if (k == set.length) {
		return [set];
	}

	// There is N 1-sized subsets in a N-sized set.
	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}

	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		// head is a list that includes only our current element.
		head = set.slice(i, i + 1);
		// We take smaller combinations from the subsequent elements
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		// For each (k-1)-combination we join it with the current
		// and store it to the set of k-combinations.
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}

export function get_vector_length(vector) {
    return Math.pow(Math.pow(vector[0], 2) + Math.pow(vector[1], 2), 0.5);
}

export function sumForces(q) {
    let avgX = 0;
    let avgY = 0;
    q.forces.forEach(force => {
        avgX += force[0];
        avgY += force[1];
    })

    return [avgX/q.mass, avgY/q.mass];
}

 export function elasticCollision(m1,m2,u1,u2) {
    let x = (u1[0]*(m1-m2) + 2*m1*u2[0]) / (m1+m2)
    let y = (u1[1]*(m1-m2) + 2*m1*u2[1]) / (m1+m2)
    return [x, y]
 }

 export function scale(vector, mult) {
    return [vector[0]*mult, vector[1]*mult]
 }

 export function intersects(q1, q2) {
    let obj1 = q1.mesh;
    let obj2 = q2.mesh;
    let firstBB = new THREE.Box3().setFromObject(obj1);
    let secondBB = new THREE.Box3().setFromObject(obj2);
    return firstBB.intersectsBox(secondBB);
    /*
    for (var vertexIndex = 0; vertexIndex < obj1.geometry.vertices.length; vertexIndex++){       
      
        
        var localVertex = obj1.geometry.vertices[vertexIndex].clone();
        var globalVertex = obj1.matrix.multiplyVector3(localVertex);
        var directionVector = globalVertex.sub( obj1.position );
    
        var ray = new THREE.Raycaster( obj1.position, directionVector.clone().normalize() );
        var collisionResults = ray.intersectObjects( [obj2] );
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
            console.log("COLLISION")
            alert("collision")
        }

        
    }
    return false;
    */
 }

 export function normalise_vector(vector) {
    let l = get_vector_length(vector);
    if (l) {
        return [vector[0]/l, vector[1]/l]
    }

    return [0,0]
 }

export function combinations(set) {
	var k, i, combs, k_combs;
	combs = [];

	// Calculate all non-empty k-combinations
	for (k = 1; k <= set.length; k++) {
		k_combs = k_combinations(set, k);
		for (i = 0; i < k_combs.length; i++) {
			combs.push(k_combs[i]);
		}
	}
	return combs;
}