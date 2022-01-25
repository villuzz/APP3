sap.ui.define(["./BaseController",
  "sap/m/MessageBox"
], function (Controller, MessageBox) {
  "use strict";

  return Controller.extend("PM030.APP3.controller.TilePage", {
   
    onInit: function () {
          },
          onCrea: function () {
            sap.ui.core.UIComponent.getRouterFor(this).navTo("WizardPage");
          },
          onVisualizza: function () {
            sap.ui.core.UIComponent.getRouterFor(this).navTo("ViewPage");
          },
          
  });
});
