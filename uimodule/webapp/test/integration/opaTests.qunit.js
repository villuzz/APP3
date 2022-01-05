/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
    "use strict";

    sap.ui.require(["PM030/APP3/test/integration/AllJourneys"], function () {
        QUnit.start();
    });
});
