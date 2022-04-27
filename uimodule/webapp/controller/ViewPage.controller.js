sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "PM030/APP3/util/viewPiani",
    "sap/m/TablePersoController",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageToast'
], function (Controller, JSONModel, MessageBox, viewPiani, TablePersoController, Filter, FilterOperator, MessageToast) {
    "use strict";

    return Controller.extend("PM030.APP3.controller.ViewPage", {
        onInit: function () {

            this.getOwnerComponent().getRouter().getRoute("ViewPage").attachPatternMatched(this._onObjectMatched, this);

            var oModel = new sap.ui.model.json.JSONModel();
            var sData = {};
            oModel.setData(sData);
            this.getView().setModel(oModel, "sFilter");

            this._oTPC = new TablePersoController({table: this.getView().byId("tbPiani"), persoService: viewPiani}).activate();
        },
        _onObjectMatched: async function () {

            this.getValueHelp(); // PER QUELLI PICCOLI VA BENE, PER GLI ALTRI CHIAMARE SOLO AL BISOGNO TODO
        },
        getValueHelp: async function () {
            var sData = {};
            var oModelHelp = new sap.ui.model.json.JSONModel();
            sData.DIVISIONEC = await this.Shpl("H_T001W", "SH");
            oModelHelp.setData(sData);
            this.getView().setModel(oModelHelp, "sHelp");
        },
        Shpl: async function (ShplName, ShplType) {
            var aFilter = [];
            aFilter.push(new Filter("ShplName", FilterOperator.EQ, ShplName));
            aFilter.push(new Filter("ShplType", FilterOperator.EQ, ShplType));

            var result = await this._getTable("/dySearch", aFilter);
            if (result[0].ReturnFieldValueSet) {
                result = result[0].ReturnFieldValueSet.results;
                result.splice(0, 1);
            } else {
                result = [];
            }
            return result;
        },
        onPressIndex: async function (oEvent) {
            var sPiani = oEvent.getSource().getBindingContext("mPiani").getObject();
            sap.ui.getCore().setModel(sPiani, "Piani");
            this.navTo("DetailPage");
        },
        onModify: function (oEvent) {
          var items = this.getView().byId("tbPiani").getSelectedItems();
          if (items.length === 1) {
              //sap.ui.core.BusyIndicator.show();
              var sPiani = items[0].getBindingContext("mPiani").getObject();
              sap.ui.getCore().setModel(sPiani, "Piani");
              this.navTo("DetailPage");
          } else {
              MessageToast.show("Seleziona una riga");
          }
      },
        onClearFilter: function () {
            this.getView().getModel("sFilter").setData({});
        },
        onSearch: async function () {
            sap.ui.core.BusyIndicator.show();

            var aFilters = [];
            var sFilter = this.getView().getModel("sFilter").getData();
            var tempFilter = [];

            if (sFilter.DIVISIONEC !== undefined) {
                if (sFilter.DIVISIONEC.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.DIVISIONEC, "Divisioneu");
                    aFilters = aFilters.concat(tempFilter);
                }

                var sPiani = await this._getTable("/T_PMO", aFilters);
                var oPiani = new sap.ui.model.json.JSONModel();
                oPiani.setData(sPiani);
                this.getView().setModel(oPiani, "mPiani");
            } else {
                MessageBox.error("Inserisci almeno una Divisione");
            }
            sap.ui.core.BusyIndicator.hide();

        },
        multiFilterText: function (aArray, vName) {

            var aFilter = [];
            if (aArray.length === 0) {
                return new Filter(vName, FilterOperator.EQ, "");
            } else if (aArray.length === 1) {
                return new Filter(vName, FilterOperator.EQ, aArray[0]);
            } else {
                for (var i = 0; i < aArray.length; i++) {
                    aFilter.push(new Filter(vName, FilterOperator.EQ, aArray[i]));
                }
                return aFilter;
            }
        },
        onPersoButtonPressed: function () {
            this._oTPC.openDialog();
        },

        onBack: function () {
            sap.ui.core.UIComponent.getRouterFor(this).navTo("TilePage");
        }

    });
});
