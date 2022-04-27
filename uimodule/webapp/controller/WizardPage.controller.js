sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "PM030/APP3/util/PianiTable",
    "PM030/APP3/util/PianiTable2",
    "sap/m/TablePersoController",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library",
    "PM030/APP3/util/xlsx",
    "PM030/APP3/util/ExcelDownload",
    'sap/m/MessageToast'
], function (Controller, JSONModel, MessageBox, PianiTable, PianiTable2, TablePersoController, Filter, FilterOperator, Spreadsheet, exportLibrary, xlsx, UtilExcel, MessageToast) {
    "use strict";

    return Controller.extend("PM030.APP3.controller.WizardPage", {
        onInit: function () { // leggere i modelli che ci servono
            this._oTPC = new TablePersoController({table: this.getView().byId("tbPiani"), componentName: "Piani", persoService: PianiTable}).activate();
            this._oTPC.setHasGrouping(true);
            this._oTPC2 = new TablePersoController({table: this.getView().byId("tbPiani2"), componentName: "Piani", persoService: PianiTable2}).activate();
            this._oTPC2.setHasGrouping(true);
            this.getOwnerComponent().getRouter().getRoute("WizardPage").attachPatternMatched(this._onObjectMatched, this);

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.attachRouteMatched(this.routeMatched, this);
        },
        _onObjectMatched: async function () {
          
          sap.ui.core.BusyIndicator.show(0);
          this.byId("navCon").to(this.byId("Page1"));

          var oModel = new sap.ui.model.json.JSONModel();
          var sData = {};
          oModel.setData(sData);
          this.getView().setModel(oModel, "sSelect");

          var oModel1 = new sap.ui.model.json.JSONModel();
          sData = {};
          sData.DIVISIONE = await this._getTableDistinct("/Index_Azioni", [], "DIVISIONE");
          sData.SEDE_TECNICA = await this._getTableDistinct("/Index_Azioni", [], "SEDE_TECNICA");
          sData.CLASSE_SEDE = await this._getTableDistinct("/Index_Azioni", [], "CLASSE_SEDE");
          sData.CARATT_SEDE = await this._getTableDistinct("/Index_Azioni", [], "CARATT_SEDE");
          sData.ZBAU = await this._getTableDistinct("/Index_Azioni", [], "ZBAU");
          sData.CLASSE = await this._getTableDistinct("/Index_Azioni", [], "CLASSE");
          sData.PROGRES = await this._getTableDistinct("/Index_Azioni", [], "PROGRES");
          sData.SISTEMA = await this._getTableDistinct("/Index_Azioni", [], "SISTEMA");
          sData.FREQ_TEMPO = await this._getTableDistinct("/Index_Azioni", [], "FREQ_TEMPO");
          sData.FREQ_CICLO = await this._getTableDistinct("/Index_Azioni", [], "FREQ_CICLO");
          sData.EQUIPMENT = await this._getTableDistinct("/Index_Azioni", [], "EQUIPMENT");
          sData.MPTYP = await this._getTableDistinct("/Index_Azioni", [], "MPTYP");
          sData.OGGETTO_TECNICO = await this._getTableDistinct("/Index_Azioni", [], "OGGETTO_TECNICO");
          sData.PROFILO = await this._getTableDistinct("/Index_Azioni", [], "PROFILO");
          sData.TIPO_ATTIVITA = await this._getTableDistinct("/Index_Azioni", [], "TIPO_ATTIVITA");
          sData.TIPO_ORDINE = await this._getTableDistinct("/Index_Azioni", [], "TIPO_ORDINE");
          sData.VALORE = await this._getTableDistinct("/Index_Azioni", [], "VALORE");

          oModel1.setData(sData);
          this.getView().setModel(oModel1, "sHelp");

          sap.ui.core.BusyIndicator.hide();
        },        
        routeMatched: async function () {
            // this.getView().byId("tSedeTecnica").getModel().setSizeLimit(200);
            // this.getView().byId("selSede").getModel().setSizeLimit(500);
            this.getView().byId("selLvl1").getModel().setSizeLimit(500);
            this.getView().byId("selLvl2").getModel().setSizeLimit(500);
            this.getView().byId("selLvl3").getModel().setSizeLimit(500);
            this.getView().byId("selLvl4").getModel().setSizeLimit(500);
            this.getView().byId("selLvl5").getModel().setSizeLimit(1000);
            this.getView().byId("selLvl6").getModel().setSizeLimit(1000);
        },
        onRefresh: async function () {
            sap.ui.core.BusyIndicator.show();
            await this.onStep3Extract();
            sap.ui.core.BusyIndicator.hide();
        },
        onPersoButtonRefresh: function () {
          var that = this;
          MessageBox.confirm("Con il Refresh eliminerai le modifiche, Confermi?", {
            styleClass: "sapUiSizeCompact",
            actions: ["Si", sap.m.MessageBox.Action.NO],
            emphasizedAction: "Si",
            initialFocus: sap.m.MessageBox.Action.NO,
            onClose: function (oAction) {
              if (oAction === "NO") {
                //that.cancel();
              } else if (oAction === "Si") {
                that.onRefresh();
              }
            }
          });
        },
        onPersoButtonPressed: function () {
            this._oTPC.openDialog();
        },
        onPersoButtonPressed2: function () {
            this._oTPC2.openDialog();
        },
        onCloseTestoConfirm: function () {
            if (this.lineSelected.sel === "P") {
                this.lineSelected.TESTO_ESTESO_P = this.getView().byId("vTextArea").getValue();
            } else {
                this.lineSelected.TESTO_ESTESO = this.getView().byId("vTextArea").getValue();
            }

            this.getView().getModel("sSelect").refresh();
            this.byId("popTesto").close();
        },
        HandleMaterialView: function (oEvent) {
            var oModel = new sap.ui.model.json.JSONModel();
            var line = {};
            if (oEvent.getSource().getBindingContext("accIndex") === undefined) {
                line = oEvent.getSource().getBindingContext("allIndex2").getObject();
            } else {
                line = oEvent.getSource().getBindingContext("accIndex").getObject();
            }
            if (line.Material === undefined) {
                line.Material = [];
            }

            oModel.setData(line.Material);
            this.setModel(oModel, "aMaterial");

            this.byId("popMaterialiView").open();
        },
        HandleServiziView: function (oEvent) {
            var oModel = new sap.ui.model.json.JSONModel();
            var line = {};
            if (oEvent.getSource().getBindingContext("accIndex") === undefined) {
                line = oEvent.getSource().getBindingContext("allIndex2").getObject();
            } else {
                line = oEvent.getSource().getBindingContext("accIndex").getObject();
            }
            if (line.Servizi === undefined) {
                line.Servizi = [];
            }
            oModel.setData(line.Servizi);
            this.setModel(oModel, "aServizi");

            this.byId("popServiziView").open();
        },
        onCloseMatnrView: function () {
            this.byId("popMaterialiView").close();
        },
        onCloseServiziView: function () {
            this.byId("popServiziView").close();
        },
        handleMaterial: function (oEvent) {
            this.lineSelected = oEvent.getSource().getBindingContext("allIndex").getObject();
            if (this.lineSelected.Material === undefined) {
                this.lineSelected.Material = [];
            }
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(this.lineSelected.Material);
            this.setModel(oModel, "aMaterial");

            this.byId("popMateriali").open();
        },
        onConfirmMatnr: function () {
            this.lineSelected.Material = this.getView().getModel("aMaterial").getData();
            this.getView().getModel("allIndex").refresh();
            this.byId("popMateriali").close();
        },
        onCloseMatnr: function () {
            this.byId("popMateriali").close();
        },
        onAddMatnr: function () {
            this.getView().getModel("aMaterial").getData().push(this.initMaterial());
            this.getView().getModel("aMaterial").refresh();
        },
        onCancelMatnr: function (oEvent) {
            var MATNR = this.getView().getModel("aMaterial").getData();
            var deleteRecord = oEvent.getSource().getBindingContext("aMaterial").getObject();
            for (var i = 0; i < MATNR.length; i++) {
                if (MATNR[i] === deleteRecord) {
                    MATNR.splice(i, 1);
                    this.getView().getModel("aMaterial").refresh();
                    break;
                }
            }
        },
        onHelpMatnr: function () {},
        initMaterial: function () {
            return {MATNR: "", MAKTX: "", WERKS: "", LGORT: "", MENGE: "", MEINS: "", TBTWR: ""};
        },
        handleServizi: function (oEvent) {
            this.lineSelected = oEvent.getSource().getBindingContext("allIndex").getObject();
            if (this.lineSelected.Servizi === undefined) {
                this.lineSelected.Servizi = [];
            }
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(this.lineSelected.Servizi);
            this.setModel(oModel, "aServizi");

            this.byId("popServizi").open();
        },
        onConfirmServizi: function () {
            this.lineSelected.Servizi = this.getView().getModel("aServizi").getData();
            this.getView().getModel("allIndex").refresh();
            this.byId("popServizi").close();
        },
        onCloseServizi: function () {
            this.byId("popServizi").close();
        },
        onAddServizi: function () {
            this.getView().getModel("aServizi").getData().push(this.initServizi());
            this.getView().getModel("aServizi").refresh();
        },
        onCancelServizi: function (oEvent) {
            var SERVIZI = this.getView().getModel("aServizi").getData();
            var deleteRecord = oEvent.getSource().getBindingContext("aServizi").getObject();
            for (var i = 0; i < SERVIZI.length; i++) {
                if (SERVIZI[i] === deleteRecord) {
                    SERVIZI.splice(i, 1);
                    this.getView().getModel("aServizi").refresh();
                    break;
                }
            }
        },
        onHelpServizi: function () {},
        initServizi: function () {
            return {N_ATT: "", DESC_SERVIZI: "", MENGE: "", MEINS: "", TBTWR: "", EKGRP: "", EKORG: ""};

        },
        handleTesto: function (oEvent) {
            this.lineSelected = oEvent.getSource().getBindingContext("allIndex").getObject();
            this.lineSelected.sel = "P";
            this.getView().byId("vTextArea").setValue(this.lineSelected.TESTO_ESTESO_P);
            this.byId("popTesto").open();
        },
        handleTesto2: function (oEvent) {
            this.lineSelected = oEvent.getSource().getBindingContext("allIndex").getObject();
            this.lineSelected.sel = "T";
            this.getView().byId("vTextArea").setValue(this.lineSelected.TESTO_ESTESO);
            this.byId("popTesto").open();
        },
        onCloseTesto: function () {
            this.byId("popTesto").close();
        },

        handleTestoView: function (oEvent) {
          this.lineSelected = oEvent.getSource().getBindingContext("allIndex2").getObject();
          this.getView().byId("vTextAreaView").setText(this.lineSelected.TESTO_ESTESO_P);
          this.byId("popTestoView").open();
        },
        handleTesto2View: function (oEvent) {
            this.lineSelected = oEvent.getSource().getBindingContext("allIndex2").getObject();
            this.getView().byId("vTextAreaView").setText(this.lineSelected.TESTO_ESTESO);
            this.byId("popTestoView").open();
          },
        onCloseTestoView: function () {
            this.byId("popTestoView").close();
        },
        handleSedeTecnica: function (oEvent) {

            this.onResetSedeTecnica();
            this._sInputId = oEvent.getSource();
            this.byId("DialogSede").open();

        },
        onCloseSedeTecnica: function () {
            this._sInputId.setValue(null);
            this.byId("DialogSede").close();
        },
        onPressSedeTecnica: function (oEvent) {
            var sel = oEvent.getSource().getBindingContext().getObject();
            //var selConcat = sel.SEDE_TECNICA + '-' + sel.LIVELLO1 + '-' + sel.LIVELLO2 + '-' + sel.LIVELLO3 + '-' + sel.LIVELLO4 + '-' + sel.LIVELLO5 + '-' + sel.LIVELLO6;
            var selConcat = sel.LIVELLO1 + '-' + sel.LIVELLO2 + '-' + sel.LIVELLO3 + '-' + sel.LIVELLO4 + '-' + sel.LIVELLO5 + '-' + sel.LIVELLO6;
            // Evita i - in eccesso in fondo
            selConcat = selConcat.replaceAll("--", "");
            if (selConcat[selConcat.length - 1] === "-") {
                selConcat = selConcat.substring(0, (selConcat.length - 1));
            }
            this.getModel("sSelect").getData().SEDE_TECNICA = sel.SEDE_TECNICA;
            this._sInputId.setValue(selConcat);
            this.byId("DialogSede").close();
        },
        onChangetipoFrequenza: function (oEvent) {

            this.byId("cbFREQ_TEMPO").setValue("");
            this.byId("cbFREQ_CICLO").setValue("");

            switch (oEvent.getSource().getSelectedKey()) {
                case "":
                    this.byId("frFREQ_TEMPO").setVisible(false);
                    this.byId("frFREQ_CICLO").setVisible(false);
                    break;
                case "C":
                    this.byId("frFREQ_TEMPO").setVisible(false);
                    this.byId("frFREQ_CICLO").setVisible(true);
                    break;
                case "T":
                    this.byId("frFREQ_TEMPO").setVisible(true);
                    this.byId("frFREQ_CICLO").setVisible(false);
                    break;
                default:
                    break;
            }
        },
        onDialogNextButton: async function () {
            sap.ui.core.BusyIndicator.show();
            var error = true;
            var navTo = this.byId("navCon").getCurrentPage().getId().split("-").pop();
            switch (navTo) {
              case "Page1":
                  error = this.checkInformazioni();
                  if (error){
                  this.byId("navCon").to(this.byId("Page2"));
                  }
                  break;
              case "Page2":
                  error = this.checkSpecifiche();
                  if (error){
                  await this.onStep3Extract();
                  this.byId("navCon").to(this.byId("Page3"));
                  }
                  break;
              case "Page3":
                  error = this.checkInterventi();
                  if (error){
                  await this.onStep4Extract();
                  this.byId("navCon").to(this.byId("Page4"));
                  }
                  break;
              case "Page4":
                  break;
              default:
                  break;
          }
          sap.ui.core.BusyIndicator.hide();
        },
        onDialogBackButton: function () {
          this.byId("navCon").back();
        },
        onStep4Extract: async function () {

            var aItems = this.getView().byId("tbPiani").getSelectedItems(),
                ItemsSel = [];

            var actual = {},
                control = {},
                ItemAccorpate = [],
                lastIndex,
                trovata = false;
            for (var i = 0; i < aItems.length; i++) {
                ItemsSel.push(aItems[i].getBindingContext("allIndex").getObject());
            }
            await ItemsSel.sort(function (a, b) {
              return a.INDEX - b.INDEX;
            });

            for (i = 0; i < ItemsSel.length; i++) {
                var line = ItemsSel[i];

                trovata = false;
                actual = line.DIVISIONE + line.SEDE_TECNICA + line.DESC_SEDE + line.CENTRO_LAVORO + line.STRATEGIA;
                actual = actual.replace("null", "");
                for (var j = 0; j < ItemAccorpate.length; j++) {
                    control = ItemAccorpate[j].DIVISIONE + ItemAccorpate[j].SEDE_TECNICA + ItemAccorpate[j].DESC_SEDE + ItemAccorpate[j].CENTRO_LAVORO + ItemAccorpate[j].STRATEGIA;
                    control = control.replace("null", "");
                    if (control === actual) {
                        trovata = true;
                        if (lastIndex !== Number(line.INDEX)) {
                            ItemAccorpate[j].INDEX++;
                        }
                        ItemAccorpate[j].CONTATORE++;
                        if (line.Servizi !== undefined) {
                          ItemAccorpate[j].Servizi = ItemAccorpate[j].Servizi.concat(line.Servizi);
                        }
                        if (line.Material !== undefined) {
                          ItemAccorpate[j].Material = ItemAccorpate[j].Material.concat(line.Material);
                        }
                    }
                }
                if (!trovata) {
                    control = {
                        INDEX: 1,
                        CONTATORE: 1,
                        DIVISIONE: line.DIVISIONE,
                        SEDE_TECNICA: line.SEDE_TECNICA,
                        DESC_SEDE: line.DESC_SEDE,
                        CENTRO_LAVORO: line.CENTRO_LAVORO,
                        STRATEGIA: line.STRATEGIA,
                        Servizi: ((line.Servizi === undefined) ? [] : line.Servizi),
                        Material: ((line.Material === undefined) ? [] : line.Material),
                    };
                    ItemAccorpate.push(control);
                }
                lastIndex = Number(line.INDEX);

            }

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(ItemsSel);
            this.getView().setModel(oModel, "allIndex2");

            var oModel2 = new sap.ui.model.json.JSONModel();
            oModel2.setData(ItemAccorpate);
            this.getView().setModel(oModel2, "accIndex");

        },
        onStep3Extract: async function () { // this.byId("dynamicPage").setShowFooter(false);
            var aFilters = [];
            var oFilter = {};

            var sFilter = this.getView().getModel("sSelect").getData();
            // this.getView().getModel("sFilter").getData();
            // var aSede = sFilter.SEDE.split("-");
            if (sFilter.SEDE_TECNICA !== undefined && sFilter.SEDE_TECNICA !== "") {
                oFilter = new Filter("SEDE_TECNICA", FilterOperator.EQ, sFilter.SEDE_TECNICA);
                aFilters.push(oFilter);
            }
            if (sFilter.SEDE != "" && sFilter.SEDE != null) {
                var aSede = sFilter.SEDE.split("-");
                /*if (aSede[0] !== undefined && aSede[0] !== "" && (sFilter.SEDE_TECNICA === undefined || sFilter.SEDE_TECNICA === "")) {
                    oFilter = new Filter("SEDE_TECNICA", FilterOperator.EQ, aSede[0]);
                    aFilters.push(oFilter);
                }*/
                if (aSede[0] !== undefined && aSede[0] !== "") {
                    oFilter = new Filter("LIVELLO1", FilterOperator.EQ, aSede[0]);
                    aFilters.push(oFilter);
                }
                if (aSede[1] !== undefined && aSede[1] !== "") {
                    oFilter = new Filter("LIVELLO2", FilterOperator.EQ, aSede[1]);
                    aFilters.push(oFilter);
                }
                if (aSede[2] !== undefined && aSede[2] !== "") {
                    oFilter = new Filter("LIVELLO3", FilterOperator.EQ, aSede[2]);
                    aFilters.push(oFilter);
                }
                if (aSede[3] !== undefined && aSede[3] !== "") {
                    oFilter = new Filter("LIVELLO4", FilterOperator.EQ, aSede[3]);
                    aFilters.push(oFilter);
                }
                if (aSede[4] !== undefined && aSede[4] !== "") {
                    oFilter = new Filter("LIVELLO5", FilterOperator.EQ, aSede[4]);
                    aFilters.push(oFilter);
                }
                if (aSede[5] !== undefined && aSede[5] !== "") {
                    oFilter = new Filter("LIVELLO6", FilterOperator.EQ, aSede[5]);
                    aFilters.push(oFilter);
                }
            }
            oFilter = new Filter("ATTIVO", FilterOperator.EQ, true);
            aFilters.push(oFilter);

            if (sFilter.CARATT_SEDE !== "" && sFilter.CARATT_SEDE !== undefined) {
                oFilter = new Filter("CARATT_SEDE", FilterOperator.EQ, sFilter.CARATT_SEDE);
                aFilters.push(oFilter);
            }
            if (sFilter.VALORE !== "" && sFilter.VALORE !== undefined) {
              oFilter = new Filter("VALORE", FilterOperator.EQ, sFilter.VALORE);
              aFilters.push(oFilter);
            }
            if (sFilter.CLASSE_SEDE !== "" && sFilter.CLASSE_SEDE !== undefined) {
                oFilter = new Filter("CLASSE_SEDE", FilterOperator.EQ, sFilter.CLASSE_SEDE);
                aFilters.push(oFilter);
            }
            if (sFilter.DIVISIONE !== undefined) {
              if (sFilter.DIVISIONE.length !== 0) {
                tempFilter = this.multiFilterText(sFilter.DIVISIONE, "DIVISIONE");
                aFilters = aFilters.concat(tempFilter);
              }
             }
            /*
            if (sFilter.DIVISIONE !== "" && sFilter.DIVISIONE !== undefined) {
                oFilter = new Filter("DIVISIONE", FilterOperator.EQ, sFilter.DIVISIONE);
                aFilters.push(oFilter);
            }
            if (sFilter.EQUIPMENT !== "" && sFilter.EQUIPMENT !== undefined) {
                oFilter = new Filter("EQUIPMENT", FilterOperator.EQ, sFilter.EQUIPMENT);
                aFilters.push(oFilter);
            }*/
            if (sFilter.MPTYP !== "" && sFilter.MPTYP !== undefined) {
                oFilter = new Filter("MPTYP", FilterOperator.EQ, sFilter.MPTYP);
                aFilters.push(oFilter);
            }
            if (sFilter.OGGETTO_TECNICO !== "" && sFilter.OGGETTO_TECNICO !== undefined) {
                oFilter = new Filter("OGGETTO_TECNICO", FilterOperator.EQ, sFilter.OGGETTO_TECNICO);
                aFilters.push(oFilter);
            }
            if (sFilter.PROFILO !== "" && sFilter.PROFILO !== undefined) {
                oFilter = new Filter("PROFILO", FilterOperator.EQ, sFilter.PROFILO);
                aFilters.push(oFilter);
            }
            /*
            if (sFilter.PROGRES !== "" && sFilter.PROGRES !== undefined) {
                oFilter = new Filter("PROGRES", FilterOperator.EQ, sFilter.PROGRES);
                aFilters.push(oFilter);
            }
            if (sFilter.SISTEMA !== "" && sFilter.SISTEMA !== undefined) {
                oFilter = new Filter("SISTEMA", FilterOperator.EQ, sFilter.SISTEMA);
                aFilters.push(oFilter);
            }
            if (sFilter.ZBAU !== "" && sFilter.ZBAU !== undefined) {
                oFilter = new Filter("ZBAU", FilterOperator.EQ, sFilter.ZBAU);
                aFilters.push(oFilter);
            }
            if (sFilter.CLASSE !== "" && sFilter.CLASSE !== undefined) {
              oFilter = new Filter("CLASSE", FilterOperator.EQ, sFilter.CLASSE);
              aFilters.push(oFilter);
          }*/

            if (sFilter.CLASSE !== undefined) {
              if (sFilter.CLASSE.length !== 0) {
                tempFilter = this.multiFilterText(sFilter.CLASSE, "CLASSE");
                aFilters = aFilters.concat(tempFilter);
              }
             }
             if (sFilter.PROGRES !== undefined) {
              if (sFilter.PROGRES.length !== 0) {
                tempFilter = this.multiFilterText(sFilter.PROGRES, "PROGRES");
                aFilters = aFilters.concat(tempFilter);
              }
             }
             if (sFilter.SISTEMA !== undefined) {
              if (sFilter.SISTEMA.length !== 0) {
                tempFilter = this.multiFilterText(sFilter.SISTEMA, "SISTEMA");
                aFilters = aFilters.concat(tempFilter);
              }
             }
            if (sFilter.ZBAU !== undefined) {
              if (sFilter.ZBAU.length !== 0) {
                tempFilter = this.multiFilterText(sFilter.ZBAU, "ZBAU");
                aFilters = aFilters.concat(tempFilter);
              }
             }
            if (sFilter.TIPO_ATTIVITA !== "" && sFilter.TIPO_ATTIVITA !== undefined) {
              oFilter = new Filter("TIPO_ATTIVITA", FilterOperator.EQ, sFilter.TIPO_ATTIVITA);
              aFilters.push(oFilter);
            }
            if (sFilter.TIPO_ORDINE !== "" && sFilter.TIPO_ORDINE !== undefined) {
              oFilter = new Filter("TIPO_ORDINE", FilterOperator.EQ, sFilter.TIPO_ORDINE);
              aFilters.push(oFilter);
            }
            if (sFilter.STRATEGIA !== undefined) {
              if (sFilter.STRATEGIA.length !== 0) {
                tempFilter = this.multiFilterText(sFilter.STRATEGIA, "STRATEGIA");
                aFilters = aFilters.concat(tempFilter);
              }
             }
            if (sFilter.TIPOFREQUENZA === "C") {
                sFilter.FREQ_TEMPO = "";
                if (sFilter.FREQ_CICLO !== "" && sFilter.FREQ_CICLO !== undefined) {
                    oFilter = new Filter("FREQ_CICLO", FilterOperator.EQ, sFilter.FREQ_CICLO);
                    aFilters.push(oFilter);
                }
            }

            if (sFilter.TIPOFREQUENZA === "T") {
                sFilter.FREQ_CICLO = "";
                if (sFilter.FREQ_TEMPO !== "" && sFilter.FREQ_TEMPO !== undefined) {
                    oFilter = new Filter("FREQ_TEMPO", FilterOperator.EQ, sFilter.FREQ_TEMPO);
                    aFilters.push(oFilter);
                }
            }

            // SEDE_TECNICA_ECC
            var colorToSet = "W",
                vIndex = "";
            var oModel = new sap.ui.model.json.JSONModel(),
                tempFilter = [];

            var allIndex = await this._getTableIndexAzioni("/Index_Azioni", aFilters);
            if (allIndex.length > 0) {
                aFilters = [];
                for (var i = 0; i < allIndex.length; i++) {
                    if (allIndex[i].INDEX !== vIndex) {
                        oFilter = new Filter("INDEX", FilterOperator.EQ, allIndex[i].INDEX);
                        tempFilter.push(oFilter);
                    }
                    vIndex = allIndex[i].INDEX;
                }
                oFilter = new sap.ui.model.Filter({filters: tempFilter, and: false});
                aFilters.push(oFilter);
                oFilter = new Filter("ATTIVO", FilterOperator.EQ, true);
                aFilters.push(oFilter);

                allIndex = await this._getTableIndexAzioni("/Index_Azioni", aFilters);

                vIndex = "";
                for (i = 0; i < allIndex.length; i++) {
                    allIndex[i].CHECK_CHECKBOX = false;
                    allIndex[i].DISPLAY_CHECKBOX = true;
                    if (allIndex[i].ID !== vIndex && vIndex !== "") {
                        if (colorToSet === "W") {
                            colorToSet = String("G");
                        } else {
                            colorToSet = String("W");
                        }
                    }
                    allIndex[i].COLORSET = colorToSet;
                    vIndex = allIndex[i].ID;
                }
            }
            oModel.setData(allIndex);
            this.getView().setModel(oModel, "allIndex");
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
        multiFilterNumber: function (aArray, vName) {

            var aFilter = [];
            if (aArray.length === 0) {
                return new Filter(vName, FilterOperator.EQ, "");
            } else if (aArray.length === 1) {
                return new Filter(vName, FilterOperator.EQ, Number(aArray[0]));
            } else {
                for (var i = 0; i < aArray.length; i++) {
                    aFilter.push(new Filter(vName, FilterOperator.EQ, Number(aArray[i])));
                }
                return aFilter;
            }
        },

        onTileBack: function () {
            sap.ui.core.UIComponent.getRouterFor(this).navTo("TilePage");
        },
        onBack: function () {
          var that = this;
          MessageBox.confirm("Tornando indietro perderai le modifiche, Confermi?", {
            styleClass: "sapUiSizeCompact",
            actions: ["Si", sap.m.MessageBox.Action.NO],
            emphasizedAction: "Si",
            initialFocus: sap.m.MessageBox.Action.NO,
            onClose: function (oAction) {
              if (oAction === "NO") {
                //that.cancel();
              } else if (oAction === "Si") {
                that.onTileBack();
              }
            }
          });
        },

        checkInformazioni: function () { // Selezione Modelli
            var oModel = this.getModel("sSelect").getData();
            var msg = "Selezionare campi obbligatori: Tecnologia e Strategia";

            if (oModel.SEDE_TECNICA === "" || oModel.SEDE_TECNICA === null || oModel.SEDE_TECNICA === undefined || oModel.STRATEGIA === undefined) {
                MessageToast.show(msg);
                return false;
            } else {
                if (oModel.STRATEGIA.length === 0) {
                    MessageToast.show(msg);
                    return false;
                } else {
                    return true;
                }
            }
        },
        checkSpecifiche: function () {
            var oModel = this.getModel("sSelect").getData();
            var msg = "Selezionare uno dei campi obbligatori: Sede Tecnica o Equipment";

            if ((oModel.SEDE_TECNICA_ECC === "" || oModel.SEDE_TECNICA_ECC === null || oModel.SEDE_TECNICA_ECC === undefined) && (oModel.EQUIPMENT === "" || oModel.EQUIPMENT === null || oModel.EQUIPMENT === undefined)) {
                MessageToast.show(msg);
                return false;
            } else {
                return true;
            }
        },
        checkInterventi: function () {

            var msg = "Selezionare almeno una riga";
            if (this.getView().byId("tbPiani").getSelectedItems().length === 0) {
                MessageToast.show(msg);
                return false;
            } else {
                return true;
            }
        },

        completedHandler: function () {
            this._oNavContainer.to(this.byId("wizardBranchingReviewPage"));
        }

    });
});
