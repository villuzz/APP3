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

            this._oTPC = new TablePersoController({table: this.getView().byId("tbPiani"), componentName: "Piani", persoService: viewPiani}).activate();
        },
        _onObjectMatched: function () {
            this.getValueHelp(); // PER QUELLI PICCOLI VA BENE, PER GLI ALTRI CHIAMARE SOLO AL BISOGNO TODO
        },
        getValueHelp: async function () {
            sap.ui.core.BusyIndicator.show();
            var sData = {};
            var oModelHelp = new sap.ui.model.json.JSONModel();
            // sData.DIVISIONEC = await this.Shpl("H_T001W", "SH");
            //sData.DIVISIONEC = await this._getTableNoError("/T_DEST");
            sData.DIVISIONEC = await this.Shpl("T001W", "CH");
            sData.CENTRO_LAVORO = await this._getTableNoError("/T_DEST");
            sData.TIPO_ORDINE = await this.Shpl("T003O", "CH");
            sData.TIPO_ATTIVITA = await this.Shpl("T353I", "CH");

            // sData.SISTEMA = await this._getTableDistinct("/Index_Azioni", [], "SISTEMA");
            // sData.PROGRES = await this._getTableDistinct("/Index_Azioni", [], "PROGRES");
            // sData.CLASSE = await this._getTableDistinct("/Index_Azioni", [], "CLASSE");

            oModelHelp.setData(sData);
            this.getView().setModel(oModelHelp, "sHelp");
            await this.onFilterHelp();
            sap.ui.core.BusyIndicator.hide();
        },

        onFilterHelp: async function () { // sap.ui.core.BusyIndicator.show();
            var sFilter = this.getView().getModel("sFilter").getData();
            var tempFilter = [];
            var aFiltersClass = [],
                aFilterProgress = [],
                aFilterSystem = [],
                aFilterDivisione = [];

            if (sFilter.DIVISIONEC !== undefined) {
                if (sFilter.DIVISIONEC.length !== 0) {
                    tempFilter = await this.multiFilterText(sFilter.DIVISIONEC, "Werks");
                    aFiltersClass = aFiltersClass.concat(tempFilter);
                    aFilterProgress = aFilterProgress.concat(tempFilter);
                    aFilterSystem = aFilterSystem.concat(tempFilter);
                    tempFilter = await this.multiFilterText(sFilter.DIVISIONEC, "Divisioneu");
                    aFilterDivisione = aFilterDivisione.concat(tempFilter);
                }
            }
            if (sFilter.SISTEMA !== undefined) {
                if (sFilter.SISTEMA.length !== 0) {
                    tempFilter = await this.multiFilterText(sFilter.SISTEMA, "Sistema");
                    aFiltersClass = aFiltersClass.concat(tempFilter);
                    aFilterProgress = aFilterProgress.concat(tempFilter);
                }
            }

            var sHelp = this.getView().getModel("sHelp").getData();

            if (aFilterSystem !== []) {
                sHelp.SISTEMA = await this._getTableNoError("/T_ACT_SYST", aFilterSystem);
            }
            if (aFilterProgress !== []) {
                sHelp.PROGRES = await this._getTableNoError("/T_ACT_PROG", aFilterProgress);
            }
            if (aFiltersClass !== []) {
                sHelp.CLASSE = await this._getTableNoError("/T_ACT_CL", aFiltersClass);
            }
            if (aFilterDivisione !== []) {
                sHelp.INDEX = await this._getTableDistinct("/T_PMO", aFilterDivisione, "IndexPmo");
            }
            this.getView().getModel("sHelp").refresh();
            // sap.ui.core.BusyIndicator.hide();
        },
        Shpl: async function (ShplName, ShplType) {
            var aFilter = [];
            aFilter.push(new Filter("ShplName", FilterOperator.EQ, ShplName));
            aFilter.push(new Filter("ShplType", FilterOperator.EQ, ShplType));

            var result = await this._getTableNoError("/dySearch", aFilter);
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
            if (items.length === 1) { // sap.ui.core.BusyIndicator.show();
                var sPiani = items[0].getBindingContext("mPiani").getObject();
                sap.ui.getCore().setModel(sPiani, "Piani");
                this.navTo("DetailPage");
            } else {
                MessageToast.show("Seleziona una riga");
            }
        },
        onClearFilter: function () {
            this.getView().getModel("sFilter").setData({});
            this.onFilterHelp();
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
                if (sFilter.CENTRO_LAVORO !== undefined) {
                    if (sFilter.CENTRO_LAVORO.length !== 0) {
                        tempFilter = this.multiFilterText(sFilter.CENTRO_LAVORO, "CentroLavoro");
                        aFilters = aFilters.concat(tempFilter);
                    }
                }
                if (sFilter.SISTEMA !== undefined) {
                    if (sFilter.SISTEMA.length !== 0) {
                        tempFilter = this.multiFilterText(sFilter.SISTEMA, "Sistema");
                        aFilters = aFilters.concat(tempFilter);
                    }
                }
                if (sFilter.PROGRESS !== undefined) {
                    if (sFilter.PROGRESS.length !== 0) {
                        tempFilter = this.multiFilterText(sFilter.PROGRESS, "Progres");
                        aFilters = aFilters.concat(tempFilter);
                    }
                }
                if (sFilter.CLASSE !== undefined) {
                    if (sFilter.CLASSE.length !== 0) {
                        tempFilter = this.multiFilterText(sFilter.CLASSE, "Classe");
                        aFilters = aFilters.concat(tempFilter);
                    }
                }
                if (sFilter.INDEX !== undefined) {
                    if (sFilter.INDEX.length !== 0) {
                        tempFilter = this.multiFilterText(sFilter.INDEX, "IndexPmo");
                        aFilters = aFilters.concat(tempFilter);
                    }
                }
                if (sFilter.TIPO_ORDINE !== undefined) {
                    if (sFilter.TIPO_ORDINE.length !== 0) {
                        tempFilter = this.multiFilterText(sFilter.TIPO_ORDINE, "TipoOrdine");
                        aFilters = aFilters.concat(tempFilter);
                    }
                }
                if (sFilter.TIPO_ATTIVITA !== undefined) {
                    if (sFilter.TIPO_ATTIVITA.length !== 0) {
                        tempFilter = this.multiFilterText(sFilter.TIPO_ATTIVITA, "IndexPmo");
                        aFilters = aFilters.concat(tempFilter);
                    }
                }
                if (sFilter.TIPOFREQUENZA !== undefined && sFilter.TIPOFREQUENZA !== "") {
                    aFilters.push(new Filter("TipoPmo", FilterOperator.EQ, sFilter.TIPOFREQUENZA));
                }
                if (sFilter.Collective !== undefined && sFilter.Collective !== "") {
                    aFilters.push(new Filter("Collective", FilterOperator.EQ, sFilter.Collective));
                }
                if (sFilter.ATTIVO !== undefined && sFilter.ATTIVO !== "") {
                    aFilters.push(new Filter("FlagAttivo", FilterOperator.EQ, sFilter.ATTIVO));
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
