/**
 * Empty object for groups in scenegraph.
 *
 * @namespace cog1.data
 * @module empty
 */

 define(["exports", "data", "./wachturmr"], function (exports, data, wachturmr) {
	"use strict";
  
	/**
	 * Create an instance of the model defined in this module.
	 *
	 * @parameter object with fields:
	 * @returns instance of this model.
	 */
	exports.create = function (parameter) {
	  if (parameter) {
		var scale = parameter.scale;
	  }
	  // Set default values if parameter is undefined.
	  if (scale == undefined) {
		scale = 100;
	  }
  
	  var instance = {};
  
	  instance.vertices = [];
	  instance.polygonVertices = [];
	  instance.polygonColors = [];
	  var arr = window.myWachturm.split(/\r?\n/);
	  let count = 0;
	  for (var i = 0; i < arr.length; i++) {
		if (arr[i].startsWith("v")) {
		  var split = arr[i].split(" ");
		  instance.vertices.push([split[1], split[2], split[3]]);

		  
		}

		if (arr[i].startsWith("f")) {
			count++;
		  var split = arr[i].split(" ");
		  console.log(split);
		  const tmp = [];
		  for(let j = 1; j < split.length; j++) {
			tmp.push(split[j].split("\/")[0]-1);
		  }
		  instance.polygonVertices.push(tmp);
		}
	  }
	  console.log(instance.polygonVertices);


	  for (var i=0;i<instance.polygonVertices.length;i++) {
		instance.polygonColors[i] = Math.floor(Math.random() * 6);
	}	
	  // Instance of the model to be returned.
  
	  data.applyScale.call(instance, scale);
	  return instance;
	};
  });