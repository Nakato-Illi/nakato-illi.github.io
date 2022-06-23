/**
 * 3D Data Store for a model.
 * Missing properties/arrays (commented out)
 * are mixed in from data module.
 *  
 * @namespace cog1.data
 * @module myModel
 */
define(["exports", "data"], function (exports, data) {
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
            var textureURL = parameter.textureURL;
            // Each face shows a different area of the given texture (e.g, a dice).
            var sixFacesTexture = parameter.sixFacesTexture;
        }
        // Set default values if parameter is undefined.
        if (scale == undefined) {
            scale = 100;
        }
        if (textureURL == undefined) {
            textureURL = "";
        }
        if (sixFacesTexture == undefined) {
            sixFacesTexture = false;
        }

        // Instance of the model to be returned.
        var instance = {};



        instance.vertices = [
            // Fliegende Untertasse
           // x,y,z            INDEX
            [0, 0, 0],        // 0
            [0.3, 0, 1],      // 1
            [0.3, 0, -1],     // 2
            [1, 0, 1.8],      // 3
            [1, 0, -1.8],     // 4
            [2, 0, 2.2],      // 5
            [2, 0, -2.2],     // 6
            [3, 0, 2.2],      // 7
            [3, 0, -2.2],     // 8
            [4, 0, 1.8],      // 9
            [4, 0, -1.8],     // 10
            [4.7, 0, 1],      // 11
            [4.7, 0, -1],     // 12
            [5, 0, 0],        // 13

            [0, 0.5, 0],        // 14
            [0.3, 0.5, 1],        // 15
            [0.3, 0.5, -1],       // 16
            [1, 0.5, 1.8],        // 17
            [1, 0.5, -1.8],       // 18
            [2, 0.5, 2.2],        // 19
            [2, 0.5, -2.2],       // 20
            [3, 0.5, 2.2],        // 21
            [3, 0.5, -2.2],       // 22
            [4, 0.5, 1.8],        // 23
            [4, 0.5, -1.8],       // 24
            [4.7, 0.5, 1],        // 25
            [4.7, 0.5, -1],       // 26
            [5, 0.5, 0],          // 27

            // Hals 
            [0.5, 0, 0.5],    // 28
            [0.5, 0, -0.5],   // 29
            [1, 0, 0.5],      // 30
            [1, 0, -0.5],      // 31

            [-1.5, -1, 0.5],    // 32
            [-1.5, -1, -0.5],   // 33
            [-1, -1, 0.5],      // 34
            [-1, -1, -0.5],      // 35

            // Schiffsbauch
            [-0.5, -1, 0.7],  //36
            [-0.5, -1, -0.7],   //37
            [-4, -1, 0.7],    //38
            [-4, -1, -0.7],   //39

            [-0.5, -1.4, 0.4],  //40
            [-0.5, -1.4, -0.4],   //41
            [-4, -1.4, 0.4],    //42
            [-4, -1.4, -0.4],   //43

            // Antriebsbein Eins
            // unten
            [-3.5, -1, -0.2],    // 44
            [-3.5, -1, -0.5],   // 45
            [-3, -1, -0.2],      // 46
            [-3, -1, -0.5],      // 47

            [-4.5, 1.1, -1.2],    // 48
            [-4.5, 1.1, -1.5],   // 49
            [-4, 1.1, -1.2],      // 50
            [-4, 1.1, -1.5],      // 51

            // Antriebsbein Zwei
            // unten
            [-3.5, -1, 0.2],    // 52
            [-3.5, -1, 0.5],   // 53
            [-3, -1, 0.2],      // 54
            [-3, -1, 0.5],      // 55

            [-4.5, 1.1, 1.2],    // 56
            [-4.5, 1.1, 1.5],   // 57
            [-4, 1.1, 1.2],      // 58
            [-4, 1.1, 1.5],      // 59

            // Antrieb Eins
            [-3, 1.7, -0.9],    // 60
            [-3, 1.7, -1.7],   // 61
            [-3, 1.1, -0.9],      // 62
            [-3, 1.1, -1.7],      // 63

            [-8, 1.7, -0.9],    // 64
            [-8, 1.7, -1.7],   // 65
            [-8, 1.1, -0.9],      // 66
            [-8, 1.1, -1.7],      // 67

            // Antrieb Zwei
            [-3, 1.7, 1.7],    // 68
            [-3, 1.7, 0.9],   // 69
            [-3, 1.1, 1.7],      // 70
            [-3, 1.1, 0.9],      // 71

            [-8, 1.7, 0.9],    // 72
            [-8, 1.7, 1.7],   // 73
            [-8, 1.1, 0.9],      // 74
            [-8, 1.1, 1.7],      // 75

        ];


        instance.polygonVertices = [
            // untertasse unten
            [0, 2, 4, 6, 8, 10, 12, 13, 11, 9, 7, 5, 3, 1],
            // untertasse oben
            [14, 16, 18, 20, 22, 24, 26, 27, 25, 23, 21, 19, 17, 15],
            // untertassen Verbung
            [0, 2, 16, 14],
            [2, 4, 18, 16],
            [4, 6, 20, 18],
            [6, 8, 22, 20],
            [8, 10, 24, 22],
            [10, 12, 26, 24],
            [12, 13, 27, 26],
            [13, 11, 25, 27],
            [11, 9, 23, 25],
            [9, 7, 21, 23],
            [7, 5, 19, 21],
            [5, 3, 17, 19],
            [3, 1, 15, 17],
            [1, 0, 14, 15],
            // Hals
            [28, 30, 31, 29],
            [32, 33, 35, 34],
            [28, 29, 33, 32],
            [30, 31, 35, 34],
            [28, 30, 34, 32],
            [29, 31, 35, 33],
            // Schiffsbauch
            [36, 37, 39, 38],
            [40, 41, 43, 42],
            [36, 37, 41, 40],
            [38, 39, 43, 42],
            [36, 38, 42, 40],
            [37, 39, 43, 41],
            // Antriebsbein Eins
            [44, 45, 47, 46],
            [48, 49, 51, 50],
            [44, 45, 49, 48],
            [46, 47, 51, 50],
            [44, 46, 50, 48],
            [45, 47, 51, 49],
            // Antriebsbein Zwei
            [52, 53, 55, 54],
            [56, 57, 59, 58],
            [52, 53, 57, 56],
            [54, 55, 59, 58],
            [52, 54, 58, 56],
            [53, 55, 59, 57],
            // Antriebsgondel Eins
            [60,61,63,62],
            [64,65,67,66],
            [60,61,65,64],
            [62,63,67,66],
            [60,62,66,64],
            [61,63,67,65],
            // Antriebsgondel Zwei
            [68,69,71,70],
            [72,73,75,74],
            [68,69,72,73],
            [70,71,74,75],
            [68,70,75,73],
            [69,71,74,72],

        ];

        // zufall mit den Farben für alle Verticals
        const col = Math.floor(Math.random() * 8);
        instance.polygonColors = instance.polygonVertices.map(v => col);

        instance.textureURL = textureURL;

        data.applyScale.call(instance, scale);

        return instance;
    };
});