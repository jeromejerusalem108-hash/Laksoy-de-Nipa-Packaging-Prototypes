
/*
 * PROJECT L.A.K.A.S.
 * Evaluation Website Configuration
 *
 * Change these settings when your adviser
 * approves a different evaluation arrangement.
 */

const EVALUATION_CONFIG = {

    // Available modes:
    // "3d"       = 3D presentations only
    // "sketches" = Original sketch images only
    // "both"     = Both representations
    materialMode: "3d",

    // Presentation order.
    // Rearrange these codes if your adviser requests it.
    sketchOrder: [
        "S1",
        "S2",
        "S3",
        "S4",
        "S5"
    ],

    // Each sketch code keeps its identity
    // regardless of its presentation position.
    materials: {
        S1: {
            name: "Prototype A - V1 Sleek Laksoy",
            modelFile: "prototype-a-v1-sleek-laksoy.html",
            sketchImage: null
        },

        S2: {
            name: "Prototype B - V1 Classic Laksoy",
            modelFile: "prototype-b-v1-classic-laksoy.html",
            sketchImage: null
        },

        S3: {
            name: "Prototype C - Laksoy x Sake",
            modelFile: "prototype-c-laksoy-x-sake.html",
            sketchImage: null
        },

        S4: {
            name: "Prototype A - V2 Nipa Heritage",
            modelFile: "prototype-a-v2-nipa-heritage.html",
            sketchImage: null
        },

        S5: {
            name: "Prototype B - V2 Habi ng Nipa",
            modelFile: "prototype-b-v2-habi-ng-nipa.html",
            sketchImage: null
        }
    }
};

