sap.ui.define([], function () {
  "use strict";
  return {
    visualAzioneElementare: function (oValue) {
      return this.byId("switchFilterVisualId").getState();
    }
  };
});
