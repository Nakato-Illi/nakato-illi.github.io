/**
 * Creates a unit sphere by subdividing a unit octahedron.
 * Starts with a unit octahedron and subdivides the faces,
 * projecting the resulting points onto the surface of a unit sphere.
 *
 * For the algorithm see:
 * https://sites.google.com/site/dlampetest/python/triangulating-a-sphere-recursively
 * http://sol.gfxile.net/sphere/index.html
 * http://nipy.sourceforge.net/dipy/reference/dipy.core.triangle_subdivide.html
 * http://skyview.gsfc.nasa.gov/blog/index.php/2008/12/31/skyview-to-include-healpix-and-wmap/
 *
 *        1
 *       /\
 *      /  \
 *    b/____\ c
 *    /\    /\
 *   /  \  /  \
 *  /____\/____\
 * 0      a     2
 *
 * Parameter:
 * 	recursionDepth
 * 	color or -1 = many colors
 *
 * For texture see:
 * http://earthobservatory.nasa.gov/Features/BlueMarble/
 *
 * @namespace cog1.data
 * @module sphere
 */

define(["exports", "data", "glMatrix"], function (exports, data) {
  "use strict";

  /**
   * Procedural calculation.
   *
   * @parameter object with fields:
   * @parameter scale
   * @parameter recursionDepth
   * @parameter color [-1 for many colors]
   */
  exports.create = function (parameter) {
    if (parameter) {
      var scale = parameter.scale;
      var recursionDepth = parameter.recursionDepth;
      var color = parameter.color;
      var textureURL = parameter.textureURL;
    }
    // Set default values if parameter is undefined.
    if (scale == undefined) {
      scale = 250;
    }
    if (recursionDepth == undefined) {
      recursionDepth = 3;
    }
    if (color == undefined) {
      color = 9;
    }
    if (textureURL == undefined) {
      textureURL = "";
    }

    // Instance of the model to be returned.
    var instance = {};

    // BEGIN exercise Sphere

    // Starting with octahedron vertices
    instance.vertices = [
		[-1, 0, 0], 		//0
		[1 , 0 , 0 ], 		//1
		[0 , -1 , 0 ], 		// 2
		[0 , 1 , 0 ], 		// 3
		[0 , 0 , -1 ], 		// 4
		[0 , 0 , 1 ], 		// 5
	  ];
    // octahedron triangles
    instance.polygonVertices = [
		[0, 4, 2],
		[2, 4, 1],
		[1, 4, 3],
		[3, 4, 0],
		[0, 2, 5],
		[2, 1, 5],
		[1, 3, 5],
		[3, 0, 5],
	  ];
    devide_all.call(instance, recursionDepth);

    // END exercise Sphere

    const col = Math.floor(Math.random() * 8);
    instance.polygonColors = instance.polygonVertices.map((v) =>
      Math.floor(Math.random() * 8)
    );

    instance.textureURL = textureURL;

    data.applyScale.call(instance, scale);

    return instance;
  };
  /**
   * Called with this pointer set to instance.
   * Generate texture coordinates one per each corner of a polygon,
   * thus a vertex can have more than one uv, depending on the polygon it is part of.
   * The coordinates u.v represent the angles theta and phi
   * of point vector to x and y axis.
   * See:
   * http://tpreclik.dyndns.org/codeblog/?p=9
   *
   * Assume that vertices are not yet scaled, thus have length 1.
   *
   */
 

  // BEGIN exercise Sphere

  function centerVertices(a, b) {
    var x = (a[0] + b[0]) / 2;
    var y = (a[1] + b[1]) / 2;
    var z = (a[2] + b[2]) / 2;
    return [x, y, z];
  }

  function projectPointOnSphere(p) {
    var factor = Math.sqrt(
      1 / (Math.pow(p[0], 2) + Math.pow(p[1], 2) + Math.pow(p[2], 2))
    );
    var x = p[0] * factor;
    var y = p[1] * factor;
    var z = p[2] * factor;
    return [x, y, z];
  }

  /**
   * Recursively divide all triangles.
   */
  function devide_all(recursionDepth, nbRecusions) {
    // nbRecusions is not set from initial call.
    if (nbRecusions == undefined) {
      nbRecusions = 0;
    }
    // Stop criterion.
    if (recursionDepth == nbRecusions) {
      return;
    }

    var polyCount = this.polygonVertices.length;
    for (var i = 0; i < polyCount; i++) {
      var p1 = centerVertices(
        this.vertices[this.polygonVertices[i][0]],
        this.vertices[this.polygonVertices[i][1]]
      );
      var p2 = centerVertices(
        this.vertices[this.polygonVertices[i][1]],
        this.vertices[this.polygonVertices[i][2]]
      );
      var p3 = centerVertices(
        this.vertices[this.polygonVertices[i][0]],
        this.vertices[this.polygonVertices[i][2]]
      );

      p1 = projectPointOnSphere(p1);
      p2 = projectPointOnSphere(p2);
      p3 = projectPointOnSphere(p3);

      var vLength = this.vertices.length;
      this.vertices.push(p1, p2, p3);
      this.polygonVertices.push(
        [this.polygonVertices[i][0], vLength, vLength + 2],
        [this.polygonVertices[i][1], vLength + 1, vLength],
        [this.polygonVertices[i][2], vLength + 2, vLength + 1],
        [vLength, vLength + 1, vLength + 2]
      );
    }

    this.polygonVertices.splice(0, polyCount);
    devide_all.call(this, recursionDepth, nbRecusions + 1);
    
  }

});
