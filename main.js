(function () {

    var fs = require("fs"),
        Q = require("q"),
        tmpName = Q.denodeify(require("tmp").tmpName);

    var _generator;
    var documentId = null;

    var MENU_ID = "app-icons";
    var MENU_LABEL = "アイコン書き出し";

    function init(generator) {
        _generator = generator;

        _generator.addMenuItem(MENU_ID, MENU_LABEL, true, false).then(
        	function() {
        		console.log("Menu created");
        	},
        	function() {
        		console.log("Menu creation failed");
        	}
        );

        _generator.onPhotoshopEvent("generatorMenuChanged", handleGeneratorMenuClicked);
        _generator.onPhotoshopEvent("currentDocumentChanged", handleCurrentDocumentChanged);
        _generator.onPhotoshopEvent("imageChanged", handleImageChanged);
    }

    function handleImageChanged(document) {
        documentId = document.id;
    }
    function handleCurrentDocumentChanged(document) {
        documentId = document.id;
    }

    function handleGeneratorMenuClicked(event) {
        var path = "/Users/user_name/app.svg";

        _generator.getDocumentInfo(documentId).then(
            function(document) {
                var layerId = document.layers[0].id;
                var svgPromise = _generator.getSVG(layerId, 1);
                svgPromise.then(
                    function (svgJSON) {
                        fs.writeFile(path, decodeURI(svgJSON.svgText));
                    }
                );
            },
            function(err) {
            }
        );
    }

    exports.init = init;

}());