sap.ui.define([
  "./BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "PM030/APP3/util/PianiTable",
	"sap/m/TablePersoController"
], function (Controller, JSONModel, MessageBox, PianiTable, TablePersoController) {
  "use strict";

  return Controller.extend("PM030.APP3.controller.ViewPage", {
    onInit: function () {

      //leggere i modelli che ci servono 
      var sPiani = [{
        Piani: "ITTM",
        description: "Italia",
      }];
      var oPiani = new sap.ui.model.json.JSONModel();
      oPiani.setData(sPiani);
      this.getView().setModel(oPiani, "mPiani");

      this.getOwnerComponent().getRouter().getRoute("ViewPage").attachPatternMatched(this._onObjectMatched, this);

    },
    _onObjectMatched: function () {
        this._mViewSettingsDialogs = {};
        this._oTPC = new TablePersoController({
          table: this.byId("tbPiani"),
          componentName: "Piani",
          persoService: PianiTable
        }).activate();
    },

    onPersoButtonPressed: function () {
        this._oTPC.openDialog();
    },

    onBack: function () {
      sap.ui.core.UIComponent.getRouterFor(this).navTo("TilePage");
    }

  });
});