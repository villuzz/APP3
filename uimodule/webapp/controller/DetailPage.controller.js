sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/TablePersoController",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "PM030/APP3/util/AzioniTable",
    "PM030/APP3/util/MaterialTable",
    "PM030/APP3/util/ServiceTable",
], function (Controller, JSONModel, MessageBox, TablePersoController, Filter, FilterOperator, AzioniTable, MaterialTable, ServiceTable) {
    "use strict";

    return Controller.extend("PM030.APP3.controller.DetailPage", {
        onInit: function () {

            this.getOwnerComponent().getRouter().getRoute("DetailPage").attachPatternMatched(this._onObjectMatched, this);
            if (sap.ui.getCore().getModel("Piani") === undefined) {
                this.navTo("ViewPage");
            }
            this._oTPCAE = new TablePersoController({table: this.getView().byId("tAzioni"), persoService: AzioniTable}).activate();
            this._oTPCM = new TablePersoController({table: this.getView().byId("tMateriali"), persoService: MaterialTable}).activate();
            this._oTPCS = new TablePersoController({table: this.getView().byId("tServizi"), persoService: ServiceTable}).activate();
        },
        _onObjectMatched: function () {
            sap.ui.core.BusyIndicator.show(0);
            this.delAzioni = [];
            this.delServizi = [];
            this.delMaterial = [];

            this.byId("iconTabBar").setSelectedKey(this.byId("iconTabBar").getItems()[0].getId());

            if (sap.ui.getCore().getModel("Piani") !== undefined) {

                var sPiani = sap.ui.getCore().getModel("Piani");

                var oPiani = new sap.ui.model.json.JSONModel();
                oPiani.setData(sPiani);
                this.getView().setModel(oPiani, "PianiDetail");

                var oAzioni = new sap.ui.model.json.JSONModel();
                oAzioni.setData(sPiani.T_ACT_ELSet.results);
                this.getView().setModel(oAzioni, "AzioniDetail");

                var oMatnr = new sap.ui.model.json.JSONModel();
                oMatnr.setData(sPiani.T_PMO_MSet.results);
                this.getView().setModel(oMatnr, "MatnrDetail");

                var oServizi = new sap.ui.model.json.JSONModel();
                oServizi.setData(sPiani.T_PMO_SSet.results);
                this.getView().setModel(oServizi, "ServiziDetail");

            }

            sap.ui.core.BusyIndicator.hide();
        },
        onColumnAE: function () {
            this._oTPCAE.openDialog();
        },
        onCopyAE: function () {
            sap.ui.core.BusyIndicator.show();
            var sel = this.getView().byId("tAzioni").getSelectedItems();
            for (var i = 0; i < sel.length; i++) {
                var line = JSON.stringify(sel[i].getBindingContext("AzioniDetail").getObject());
                line = JSON.parse(line);
                line.Cont = "New";
                this.getView().getModel("AzioniDetail").getData().push(line);

            }
            this.getView().byId("tAzioni").removeSelections();
            this.getView().getModel("AzioniDetail").refresh();
            sap.ui.core.BusyIndicator.hide();
        },
        onAddAE: function () {
            this.getView().getModel("AzioniDetail").getData().push(this.initAEModel());
            this.getView().getModel("AzioniDetail").refresh();
        },
        onCancelAE: function () {
            var sel = this.getView().byId("tAzioni").getSelectedItems();
            var AZIONI = this.getView().getModel("AzioniDetail").getData();
            // var deleteRecord = oEvent.getSource().getBindingContext("sSelect").getObject();
            for (var i =( sel.length - 1); i >= 0; i--) {
                var line = sel[i].getBindingContext("AzioniDetail").getObject();
                this.delAzioni.push(line);
                AZIONI.splice(Number(sel[i].getId().split("-").pop()), 1);
            }
            this.getView().getModel("AzioniDetail").refresh();
            this.getView().byId("tAzioni").removeSelections();
        },
        initAEModel: function () {

            var Azioni = {
                Cont: "New",
                FlagAttivo: "X",
                Datum: new Date(),
                Sistem: "",
                Progres: null,
                Classe: "",
                DesComponente: "",
                Tplnr: "",
                Equipment: "",
                DesBreve: "",
                ComponentTipo: "",
                IntegTxtEsteso: "",
                Uname: ""
            };
            return Azioni;

        },

        onColumnS: function () {
            this._oTPCS.openDialog();
        },
        onCopyS: function () {
            sap.ui.core.BusyIndicator.show();
            var sel = this.getView().byId("tServizi").getSelectedItems();
            for (var i = 0; i < sel.length; i++) {
                var line = JSON.stringify(sel[i].getBindingContext("ServiziDetail").getObject());
                line = JSON.parse(line);
                line.Cont = "New";
                this.getView().getModel("ServiziDetail").getData().push(line);

            }
            this.getView().byId("tServizi").removeSelections();
            this.getView().getModel("ServiziDetail").refresh();
            sap.ui.core.BusyIndicator.hide();
        },
        onAddS: function () {
            this.getView().getModel("ServiziDetail").getData().push(this.initSModel());
            this.getView().getModel("ServiziDetail").refresh();
        },
        onCancelS: function () {
            var sel = this.getView().byId("tServizi").getSelectedItems();
            var SERVIZI = this.getView().getModel("ServiziDetail").getData();
            // var deleteRecord = oEvent.getSource().getBindingContext("sSelect").getObject();
            for (var i =( sel.length - 1); i >= 0; i--) {
                var line = sel[i].getBindingContext("ServiziDetail").getObject();
                this.delServizi.push(line);
                SERVIZI.splice(Number(sel[i].getId().split("-").pop()), 1);
            }
            this.getView().getModel("ServiziDetail").refresh();
            this.getView().byId("tServizi").removeSelections();
        },
        initSModel: function () {

            var Servizi = {
                Cont: "New",
                IndexPmo: "New",
                Asnum: "",
                Asktx: "",
                Menge: "",
                Meins: "",
                Tbtwr: "",
                Waers: "",
                Ekgrp: "",
                Ekorg: "",
                Afnam: "",
                Matkl: ""
            };
            return Servizi;

        },

        onColumnM: function () {
            this._oTPCM.openDialog();
        },
        onCopyM: function () {
            sap.ui.core.BusyIndicator.show();
            var sel = this.getView().byId("tMateriali").getSelectedItems();
            for (var i = 0; i < sel.length; i++) {
                var line = JSON.stringify(sel[i].getBindingContext("MatnrDetail").getObject());
                line = JSON.parse(line);
                line.Cont = "New";
                this.getView().getModel("MatnrDetail").getData().push(line);

            }
            this.getView().byId("tMateriali").removeSelections();
            this.getView().getModel("MatnrDetail").refresh();
            sap.ui.core.BusyIndicator.hide();
        },
        onAddM: function () {
            this.getView().getModel("MatnrDetail").getData().push(this.initMModel());
            this.getView().getModel("MatnrDetail").refresh();
        },
        onCancelM: function () {
            var sel = this.getView().byId("tMateriali").getSelectedItems();
            var SERVIZI = this.getView().getModel("MatnrDetail").getData();
            // var deleteRecord = oEvent.getSource().getBindingContext("sSelect").getObject();
            for (var i =( sel.length - 1); i >= 0; i--) {
                var line = sel[i].getBindingContext("MatnrDetail").getObject();
                this.delServizi.push(line);
                SERVIZI.splice(Number(sel[i].getId().split("-").pop()), 1);
            }
            this.getView().getModel("MatnrDetail").refresh();
            this.getView().byId("tMateriali").removeSelections();
        },
        initMModel: function () {

            var Materiali = {
                IndexPmo: "New",
                Cont: "New",
                Matnr: "",
                Maktx: "",
                Menge: "",
                Meins: "",
                Lgort: "",
                Werks: "",
                Charg: "",
                Tbtwr: "",
                Waers: "",
                Ekgrp: "",
                Ekorg: "",
                Afnam: "",
                Matkl: ""
            };
            return Materiali;

        },
        onBack: function () {
            this.navTo("ViewPage");
        }
    });
});
