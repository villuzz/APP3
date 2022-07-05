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
    'sap/m/MessageToast',
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
            var sData = {
                INIZIOVAL: new Date(),
                FINEVAL: new Date()
            };
            oModel.setData(sData);
            this.getView().setModel(oModel, "sSelect");

            var oModel2 = new sap.ui.model.json.JSONModel();
            var sDataSel = [];
            oModel2.setData(sDataSel);
            this.getView().setModel(oModel2, "SelSede");

            var oModel3 = new sap.ui.model.json.JSONModel();
            var sDataSel = [];
            oModel3.setData(sDataSel);
            this.getView().setModel(oModel3, "SelSedeReale");

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
            // sData.MPTYP = await this._getTableDistinct("/Index_Azioni", [], "MPTYP");
            sData.OGGETTO_TECNICO = await this._getTableDistinct("/Index_Azioni", [], "OGGETTO_TECNICO");
            sData.PROFILO = await this._getTableDistinct("/Index_Azioni", [], "PROFILO");
            sData.TIPO_ATTIVITA = await this._getTableDistinct("/Index_Azioni", [], "TIPO_ATTIVITA");
            sData.TIPO_ORDINE = await this._getTableDistinct("/Index_Azioni", [], "TIPO_ORDINE");
            sData.VALORE = await this._getTableDistinct("/Index_Azioni", [], "VALORE");
            sData.AZIONE = await this._getTableDistinct("/Index_Azioni", [], "AZIONE");

            // sData.INDEX = await this._getTableDistinct("/Index_Azioni", [], "INDEX");
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
        onChangeStat: function (oEvent) {
          debugger
          var sData = this.getModel("allIndex").getData();
          sData.Toth = Number(sData.Num) * Number(sData.Persone) * Number(sData.Hper);
          sData.Toth1 = Number(sData.Num1) * Number(sData.Persone1) * Number(sData.Hper1);
          sData.Toth2 = Number(sData.Num2) * Number(sData.Persone2) * Number(sData.Hper2);
          sData.Toth3 = Number(sData.Num3) * Number(sData.Persone3) * Number(sData.Hper3);
          sData.Toth4 = Number(sData.Num4) * Number(sData.Persone4) * Number(sData.Hper4);
          sData.Toth5 = Number(sData.Num5) * Number(sData.Persone5) * Number(sData.Hper5);
          this.getView().getModel("allIndex").refresh();
        },
        handleWizardSubmit: async function () {
            sap.ui.core.BusyIndicator.show();
            var that = this;
            var allIndex2 = this.getView().getModel("allIndex2").getData();
            var msg = "";
            var ExtractionGrouped = _.groupBy(allIndex2, ele => ele.INDEX);

            var aIndex = [];
            for (var i = 0; i < allIndex2.length; i++) {
                if (!aIndex.includes(allIndex2[i].INDEX)) {
                    aIndex.push(allIndex2[i].INDEX);
                }
            }

            for (i = 0; i < aIndex.length; i++) {
                var element = ExtractionGrouped[aIndex[i]];
                var vIndex = await that.saveIndex(element[0]);
                for (var j = 0; j < element.length; j++) {
                    var vContatore = await that.saveAzioni(element[j], vIndex);
                    await that.saveMaterial(element[j], vIndex, vContatore);
                    await that.saveService(element[j], vIndex, vContatore);
                }
                msg = msg + " " + Number(vIndex).toFixed();
            }
            /*Object.keys(ExtractionGrouped).forEach(ele => {

                let element = ExtractionGrouped[ele];
                let vIndex = that.formatIndex(element[0]);

                element.forEach(row => {

                  let vContatore = that.saveAzioni(row, vIndex);
                  that.saveMaterial(row, vIndex, vContatore);
                  that.saveService(row, vIndex, vContatore);

                });

                msg = msg + vIndex;

            });*/

            MessageBox.success("Indici creati con successo: " + msg);
            this.byId("navCon").to(this.byId("Page1"));
            sap.ui.core.BusyIndicator.hide();
        },

        saveIndex: async function (sRow) {
            var sData = {
                Divisioneu: sRow.DIVISIONE,
                FineVal: sRow.FINEVAL,
                IndexPmo: "",
                InizioVal: sRow.INIZIOVAL,
                // Uzeit: "000000",
                // Appuntam	IN APP4
                // Azione	Non li popoliamo
                // Banfn	IN APP4
                Cdl: sRow.CENTRO_LAVORO,
                Cdl1: sRow.CENTRO_LAVORO,
                Cdl2: sRow.CENTRO_LAVORO,
                Cdl3: sRow.CENTRO_LAVORO,
                Cdl4: sRow.CENTRO_LAVORO,
                Cdl5: sRow.CENTRO_LAVORO,
                CentroLavoro: sRow.CENTRO_LAVORO,
                Ciclo: sRow.FREQ_CICLO,
                Classe: sRow.CLASSE,
                // CodAzione	Non li popoliamo
                Collective: sRow.COLLECTIVE,
                // Criticita	Non li popoliamo
                // DataInizCiclo	Non li popoliamo
                // Datum	Non li popoliamo
                // Daune	Non li popoliamo
                // DayAdv	Non li popoliamo
                DesBreve: sRow.DESC_BREVE,
                // DesComponente	Non li popoliamo
                // DesEstesa	da visualizzare in APP4
                Destinatario: sRow.DESTINATARIO,
                // Determinanza	Non li popoliamo
                // Differibile	Non li popoliamo
                Divisionec: sRow.DIVISIONEC,
                DurataCiclo: sRow.FREQ_TEMPO,
                // EquipmentCompo	Non li popoliamo
                // EquipmentOdm	Non li popoliamo
                // FineCard	Non li popoliamo
                FlagAttivo: (
                (sRow.ATTIVO === false) ? "" : "X"
            ),
                // FlagInterc	Non li popoliamo
                // FlagMateriali	Non li popoliamo
                // FlagOdm	Non li popoliamo
                // FlagPrestazioni	Non li popoliamo
                // FlgMail	Non li popoliamo
                Frequenza: sRow.UNITA_TEMPO,
                Hper: (
                (sRow.HPER === undefined || sRow.HPER === "") ? undefined : Number(sRow.HPER)
            ),
                Hper1: (
                (sRow.HPER_1 === undefined || sRow.HPER_1 === "") ? undefined : Number(sRow.HPER_1)
            ),
                Hper2: (
                (sRow.HPER_2 === undefined || sRow.HPER_2 === "") ? undefined : Number(sRow.HPER_2)
            ),
                Hper3: (
                (sRow.HPER_3 === undefined || sRow.HPER_3 === "") ? undefined : Number(sRow.HPER_3)
            ),
                Hper4: (
                (sRow.HPER_4 === undefined || sRow.HPER_4 === "") ? undefined : Number(sRow.HPER_4)
            ),
                Hper5: (
                (sRow.HPER_5 === undefined || sRow.HPER_5 === "") ? undefined : Number(sRow.HPER_5)
            ),
                Indisponibilita: sRow.INDISPONIBILITA,
                IntegTxtEsteso: (
                (sRow.TESTO_ESTESO === undefined || sRow.TESTO_ESTESO === "") ? "" : "X"
            ),
                Lstar: sRow.LSTAR,
                Lstar1: sRow.LSTAR_1,
                Lstar2: sRow.LSTAR_2,
                Lstar3: sRow.LSTAR_3,
                Lstar4: sRow.LSTAR_4,
                Lstar5: sRow.LSTAR_5,
                Num: (
                (sRow.NUM === undefined || sRow.NUM === "") ? undefined : Number(sRow.NUM)
            ),
                Num1: (
                (sRow.NUM_1 === undefined || sRow.NUM_1 === "") ? undefined : Number(sRow.NUM_1)
            ),
                Num2: (
                (sRow.NUM_2 === undefined || sRow.NUM_2 === "") ? undefined : Number(sRow.NUM_2)
            ),
                Num3: (
                (sRow.NUM_3 === undefined || sRow.NUM_3 === "") ? undefined : Number(sRow.NUM_3)
            ),
                Num4: (
                (sRow.NUM_4 === undefined || sRow.NUM_4 === "") ? undefined : Number(sRow.NUM_4)
            ),
                Num5: (
                (sRow.NUM_5 === undefined || sRow.NUM_5 === "") ? undefined : Number(sRow.NUM_5)
            ),
                Percorso: sRow.PERCORSO,
                Persone: (
                (sRow.PERSONE === undefined || sRow.PERSONE === "") ? undefined : Number(sRow.PERSONE)
            ),
                Persone1: (
                (sRow.PERSONE_1 === undefined || sRow.PERSONE_1 === "") ? undefined : Number(sRow.PERSONE_1)
            ),
                Persone2: (
                (sRow.PERSONE_2 === undefined || sRow.PERSONE_2 === "") ? undefined : Number(sRow.PERSONE_2)
            ),
                Persone3: (
                (sRow.PERSONE_3 === undefined || sRow.PERSONE_3 === "") ? undefined : Number(sRow.PERSONE_3)
            ),
                Persone4: (
                (sRow.PERSONE_4 === undefined || sRow.PERSONE_4 === "") ? undefined : Number(sRow.PERSONE_4)
            ),
                Persone5: (
                (sRow.PERSONE_5 === undefined || sRow.PERSONE_5 === "") ? undefined : Number(sRow.PERSONE_5)
            ),
                Point: sRow.POINT,
                Priorita: sRow.PRIORITA,
                Progres: sRow.PROGRES,
                // Scostamento	IN APP4
                // SedeTecOdm	Non li popoliamo
                Sistema: sRow.SISTEMA,
                // StComponente	Non li popoliamo
                Steus: sRow.STEUS,
                Steus1: sRow.STEUS_1,
                Steus2: sRow.STEUS_2,
                Steus3: sRow.STEUS_3,
                Steus4: sRow.STEUS_4,
                Steus5: sRow.STEUS_5,
                // TipoAggr	Non li popoliamo
                TipoAttivita: sRow.TIPO_ATTIVITA,
                TipoGestione: sRow.TIPO_GESTIONE,
                TipoGestione1: sRow.TIPO_GESTIONE_1,
                TipoGestione2: sRow.TIPO_GESTIONE_2,
                TipoOrdine: sRow.TIPO_ORDINE,
                TipoPmo: sRow.TIPOFREQUENZA,
                // Toth	  IN APP4
                // Toth1	IN APP4
                // Toth2	IN APP4
                // Toth3	IN APP4
                // Toth4	IN APP4
                // Toth5	IN APP4
                // TxtCiclo	Non li popoliamo
                // UltimaEsecuz	Non li popoliamo
                // Uname	Non li popoliamo
                // UnitaCiclo	Non li popoliamo

            };

            var sIndex = await this._saveHana("/T_PMO", sData);

            return sIndex.IndexPmo;
        },
        saveAzioni: async function (sRow, vINDEX) {
            var sData = {
                IndexPmo: vINDEX,
                Cont: "",
                Sistem: sRow.SISTEMA,
                Progres: sRow.PROGRES,
                Classe: sRow.CLASSE,
                DesComponente: sRow.DES_COMPONENTE,
                Tplnr: (
                  (sRow.SEDE_ECC === undefined || sRow.SEDE_ECC === "") ? "" : sRow.SEDE_ECC
              ),
                Equipment: sRow.EQUIPMENT,
                DesBreve: sRow.DESC_BREVE,
                IntegTxtEsteso: (
                (sRow.TESTO_ESTESO_P === undefined || sRow.TESTO_ESTESO_P === "") ? "" : "X"
            ),
                FlagAttivo: (
                (sRow.ATTIVO === false) ? "" : "X"
            ),
                Datum: new Date,
                Uname: "AE82826",
                // todo
                // Uzeit: "00:00:00" // todo
            };

            var sAzione = await this._saveHana("/T_ACT_EL", sData);

            if (sAzione.TESTO_ESTESO_P !== undefined && sAzione.TESTO_ESTESO_P !== null && sAzione.TESTO_ESTESO_P !== ""){

              /*CONCATENATE 'Z'
                     zpm4r_t_act_type-inizio_val
                     zpm4r_t_act_type-fine_val
                     zpm4r_t_act_type-divisione
                     zpm4r_t_act_type-sistema
                     zpm4r_t_act_type-progres
                     zpm4r_t_act_type-classe
                     zpm4r_t_act_type-uzeit */

              var Tdname = "ZI" + sAzione.IndexPmo.padStart(18, "0") + sAzione.INIZIOVAL + sAzione.FINEVAL + "000000";
              var sTestoAzioni = {
                "Tdname": Tdname,
                "Tdid": "ST",
                "Tdspras": "I",
                "Tdobject": "TEXT",
                "Overwrite": "X",
                "Testo": sAzione.TESTO_ESTESO_P
                };
              var result = await this._saveHanaNoError("/TestiEstesi", sTestoAzioni);
              if (result !== ""){
                var sUrl = "/TestiEstesi(Testo=" + sAzione.TESTO_ESTESO_P + ")";
                delete sTestoAzioni.Testo;
                await this._updateHanaNoError(sUrl, sTestoAzioni);
              }
            }

            return sAzione.Cont;
        },
        saveMaterial: async function (sRow, vINDEX, vCONTATORE) {
            if (sRow.Material !== undefined) {
                for (var i = 0; i < sRow.Material.length; i++) {
                    var sLine = {
                        IndexPmo: vINDEX,
                        Cont: vCONTATORE,
                        Matnr: sRow.Material[i].MATNR,
                        Maktx: sRow.Material[i].MAKTX,
                        Menge: sRow.Material[i].MENGE,
                        Meins: sRow.Material[i].MEINS,
                        Lgort: sRow.Material[i].LGORT,
                        Werks: sRow.Material[i].WERKS,
                        Ekgrp: sRow.Material[i].EKGRP,
                        Ekorg: sRow.Material[i].EKORG,
                        Afnam: sRow.Material[i].AFNAM,
                        Matkl: sRow.Material[i].MATKL
                    };
                    await this._saveHana("/T_PMO_M", sLine);
                }
            }
        },
        saveService: async function (sRow, vINDEX, vCONTATORE) {
            if (sRow.Servizi !== undefined) {
                for (var i = 0; i < sRow.Servizi.length; i++) {
                    var sLine = {
                        IndexPmo: vINDEX,
                        Cont: vCONTATORE,
                        Asnum: sRow.Servizi[i].ASNUM,
                        Asktx: sRow.Servizi[i].ASKTX,
                        Menge: sRow.Servizi[i].MENGE,
                        Meins: sRow.Servizi[i].MEINS,
                        Ekgrp: sRow.Servizi[i].EKGRP,
                        Ekorg: sRow.Servizi[i].EKORG,
                        Afnam: sRow.Servizi[i].AFNAM,
                        Matkl: sRow.Servizi[i].MATKL
                    };
                    await this._saveHana("/T_PMO_S", sLine);
                }
            }
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
                actions: [
                    "Si", sap.m.MessageBox.Action.NO
                ],
                emphasizedAction: "Si",
                initialFocus: sap.m.MessageBox.Action.NO,
                onClose: function (oAction) {
                    if (oAction === "NO") { // that.cancel();
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
        handleMaterial: async function (oEvent) {
            this.lineSelected = oEvent.getSource().getBindingContext("allIndex").getObject();
            if (this.lineSelected.Material === undefined) {
                this.lineSelected.Material = [];
            }
            for (var i = 0; i < this.lineSelected.Material.length; i++) {
              var matnr = this.lineSelected.Material[i].MATNR;
              this.lineSelected.Material[i].MATNR = ( matnr !== undefined && matnr !== null ) ? matnr.replace(/^0+/, "") : matnr;
            } 
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(this.lineSelected.Material);
            this.setModel(oModel, "aMaterial");

            await this.ExtractHelpMS();

            this.byId("popMateriali").open();
        },
        ExtractHelpMS: async function () {
          sap.ui.core.BusyIndicator.show();          
          var sHelp = this.getView().getModel("sHelp").getData();
          if (sHelp.MEINS === undefined){
            sHelp.MEINS = await this.Shpl("H_T006", "SH");
            // sData.LGORT = await this._getTableNoError("/StorageList");
            sHelp.EKGRP = await this.Shpl("H_T024", "SH");
            sHelp.EKORG = await this.Shpl("H_T024E", "SH");
            sHelp.AFNAM = await this.Shpl("ZSKSE_MMREQUNITS", "SH");
            sHelp.MATKL = await this.Shpl("H_T023", "SH");
            //DIVISIONE2 gia estratta
            this.getView().getModel("sHelp").refresh();
          }
          sap.ui.core.BusyIndicator.hide();
        },
        onSuggestLgort: async function (oEvent) {
          var sSelect = oEvent.getSource().getBindingContext("aMaterial").getObject();
          if (oEvent.getParameter("suggestValue").length >= 0 || (sSelect.WERKS !== "" && sSelect.WERKS !== undefined && sSelect.WERKS !== null)) {

              var aFilter = [];
              if (sSelect.WERKS !== "" && sSelect.WERKS !== undefined && sSelect.WERKS !== null) {
                  aFilter.push(new Filter("Werks", FilterOperator.EQ, sSelect.WERKS));
              }
              if (oEvent.getParameter("suggestValue").length >= 0) {
                  aFilter.push(new Filter("Code", FilterOperator.EQ, sSelect.LGORT));
              }

              var sHelp = this.getView().getModel("sHelp").getData();
              sHelp.LGORT = await this._getTableNoError("/StorageList", aFilter);
              this.getView().getModel("sHelp").refresh();
          }
      },
      onSuggestMatnrSelect: function (oEvent) {
        var sel = this.getView().getModel("sHelp").getData().MATNR[oEvent.getSource().getSelectedItem().split("-").pop()];
        var sSelect = oEvent.getSource().getBindingContext("aMaterial").getObject();
        sSelect.MAKTX = sel.Fieldname4;
        this.getView().getModel("aMaterial").refresh();        
      },
      onSuggestMatnr: async function (oEvent) {
        if (oEvent.getParameter("suggestValue").length >= 7) {

            var sSelect = oEvent.getSource().getBindingContext("aMaterial").getObject();

            var aFilter = [];
            if (sSelect.WERKS !== "" && sSelect.WERKS !== undefined && sSelect.WERKS !== null) {
                aFilter.push({
                    "Shlpname": "ZPM4R_SH_MATNR",
                    "Shlpfield": "WERKS",
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": sSelect.WERKS
                });
            }
            aFilter.push({
                "Shlpname": "ZPM4R_SH_MATNR",
                "Shlpfield": "SPRAS",
                "Sign": "I",
                "Option": "EQ",
                "Low": "IT"
            });
            aFilter.push({
                "Shlpname": "ZPM4R_SH_MATNR",
                "Shlpfield": "MATNR",
                "Sign": "I",
                "Option": "CP",
                "Low": oEvent.getParameter("suggestValue") + "*"
            });
            var sHelp = this.getView().getModel("sHelp").getData();
            sHelp.MATNR = await this.Shpl("ZPM4R_SH_MATNR", "SH", aFilter);
            this.getView().getModel("sHelp").refresh();
        }
    },
    onSuggestAsnum: async function (oEvent) {
      if (oEvent.getParameter("suggestValue").length >= 5) {
          var aFilter = [];
          aFilter.push({
              "Shlpname": "ZPM4R_SH_ASNUM",
              "Shlpfield": "ASNUM",
              "Sign": "I",
              "Option": "CP",
              "Low": oEvent.getParameter("suggestValue") + "*"
          });
          var sHelp = this.getView().getModel("sHelp").getData();
          sHelp.ASNUM = await this.Shpl("ZPM4R_SH_ASNUM", "SH", aFilter);
          this.getView().getModel("sHelp").refresh(true);
      }
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
            return {
                MATNR: "",
                MAKTX: "",
                WERKS: "",
                LGORT: "",
                MENGE: "",
                MEINS: "",
                EKGRP: "",
                EKORG: "",
                AFNAM: "",
                MATKL: ""
            };
        },
        handleServizi: async function (oEvent) {
            this.lineSelected = oEvent.getSource().getBindingContext("allIndex").getObject();
            if (this.lineSelected.Servizi === undefined) {
                this.lineSelected.Servizi = [];
            }
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(this.lineSelected.Servizi);
            this.setModel(oModel, "aServizi");

            await this.ExtractHelpMS();

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
            return {
                ASNUM: "",
                ASKTX: "",
                MENGE: "",
                MEINS: "",
                EKGRP: "",
                EKORG: "",
                AFNAM: "",
                MATKL: ""
            };

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
                case "Page1": error = this.checkInformazioni();
                    if (error) {
                        await this.addHelpSearch();
                        this.byId("navCon").to(this.byId("Page2"));
                    }
                    break;
                case "Page2": error = this.checkSpecifiche();
                    if (error) {

                        await this.onStep3Extract();
                        this.byId("navCon").to(this.byId("Page3"));
                    }
                    break;
                case "Page3": error = this.checkInterventi();
                    if (error) {
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

        addHelpSearch: async function () {
            var sData = this.getView().getModel("sHelp").getData();
            if (sData.DIVISIONE2 === undefined) {
                sData.DIVISIONE2 = await this.Shpl("H_T001W", "SH");
                sData.SISTEMA2 = await this._getTableNoError("/T_ACT_SYST");
                sData.PROGRES2 = await this._getTableNoError("/T_ACT_PROG");
                sData.CLASSE2 = await this._getTableNoError("/T_ACT_CL");
                sData.TIPO_GESTIONE = await this._getTableNoError("/T_TP_MAN");
                sData.TIPO_GESTIONE_1 = await this._getTableNoError("/T_TP_MAN1");
                sData.TIPO_GESTIONE_2 = await this._getTableNoError("/T_TP_MAN2");
                sData.CENTRO_LAVORO = await this._getTableNoError("/T_DEST");
                var aFilter = [];
                aFilter.push({
                    "Shlpname": "EHFND_ELM_EQART_T370K",
                    "Shlpfield": "SPRAS",
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "IT"
                }); // todo
                sData.OGGETTO_TECNICO = await this.Shpl("EHFND_ELM_EQART_T370K", "SH", aFilter);
                this.getView().getModel("sHelp").refresh(true);
            }
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
                            ItemAccorpate[j].INDEX ++;
                        }
                        ItemAccorpate[j].CONTATORE ++;
                        if (line.Servizi !== undefined) {
                            ItemAccorpate[j].Servizi = ItemAccorpate[j].Servizi.concat(line.Servizi);
                        }
                        if (line.Material !== undefined) {
                            ItemAccorpate[j].Material = ItemAccorpate[j].Material.concat(line.Material);
                        }
                    }
                }
                if (! trovata) {
                    control = {
                        INDEX: 1,
                        CONTATORE: 1,
                        DIVISIONE: line.DIVISIONE,
                        SEDE_TECNICA: line.SEDE_TECNICA,
                        DESC_SEDE: line.DESC_SEDE,
                        CENTRO_LAVORO: line.CENTRO_LAVORO,
                        STRATEGIA: line.STRATEGIA,
                        Servizi: (
                        (line.Servizi === undefined) ? [] : line.Servizi
                    ),
                        Material: (
                        (line.Material === undefined) ? [] : line.Material
                    )
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
            sap.ui.core.BusyIndicator.show();
            var aFilters = [];
            var oFilter = {};
            var tempFilter = [];
            var sFilter = this.getView().getModel("sSelect").getData();
            // this.getView().getModel("sFilter").getData();
            // var aSede = sFilter.SEDE.split("-");
            if (sFilter.SEDE_TECNICA !== undefined && sFilter.SEDE_TECNICA !== "") {
                oFilter = new Filter("SEDE_TECNICA", FilterOperator.EQ, sFilter.SEDE_TECNICA);
                aFilters.push(oFilter);
            }
            if (sFilter.SEDE != "" && sFilter.SEDE != null) {
                var aFilterSedeTipo = [];
                for (var j = 0; j < sFilter.SEDE.length; j++) {
                    var SedeEcc = {};
                    var aSede = sFilter.SEDE[j].split("-");
                    SedeEcc.LIVELLO1 = (aSede[0] === undefined ? "" : aSede[0]);
                    SedeEcc.LIVELLO2 = (aSede[1] === undefined ? "" : aSede[1]);
                    SedeEcc.LIVELLO3 = (aSede[2] === undefined ? "" : aSede[2]);
                    SedeEcc.LIVELLO4 = (aSede[3] === undefined ? "" : aSede[3]);
                    SedeEcc.LIVELLO5 = (aSede[4] === undefined ? "" : aSede[4]);
                    SedeEcc.LIVELLO6 = (aSede[5] === undefined ? "" : aSede[5]);

                    // Popola Filtri da Sede Tipo
                    var sFilterSedeTipo = await this.filtriSedeReale(SedeEcc);
                    aFilterSedeTipo.push(new sap.ui.model.Filter({filters: sFilterSedeTipo, and: true}));
                }

                aFilterSedeTipo = new sap.ui.model.Filter({filters: aFilterSedeTipo, and: false});
                aFilters = aFilters.concat(aFilterSedeTipo);
                /*
                var aSede = sFilter.SEDE.split("-");
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
                }*/
            }
            // oFilter = new Filter("ATTIVO", FilterOperator.EQ, true);
            // aFilters.push(oFilter);

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
            if (sFilter.AZIONE !== undefined) {
                if (sFilter.AZIONE.length !== 0) {
                    tempFilter = this.multiFilterNumber(sFilter.AZIONE, "AZIONE");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            /*
            if (sFilter.DIVISIONE !== "" && sFilter.DIVISIONE !== undefined) {
                oFilter = new Filter("DIVISIONE", FilterOperator.EQ, sFilter.DIVISIONE);
                aFilters.push(oFilter);
            }*/
            if (sFilter.EQUIPMENT !== undefined) {
                if (sFilter.EQUIPMENT.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.EQUIPMENT, "EQUIPMENT");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            if (sFilter.EQUIPMENT2 !== undefined) {
                oFilter = new Filter("EQUIPMENT", FilterOperator.EQ, sFilter.EQUIPMENT2);
                aFilters.push(oFilter);
            }
            /*if (sFilter.MPTYP !== "" && sFilter.MPTYP !== undefined) {
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
            }*/
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
            /*if (sFilter.ZBAU !== undefined) {
                if (sFilter.ZBAU.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.ZBAU, "ZBAU");
                    aFilters = aFilters.concat(tempFilter);
                }
            }*/

            if (sFilter.TIPO_ATTIVITA !== undefined) {
                if (sFilter.TIPO_ATTIVITA.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.TIPO_ATTIVITA, "TIPO_ATTIVITA");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            if (sFilter.TIPO_ORDINE !== undefined) {
                if (sFilter.TIPO_ORDINE.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.TIPO_ORDINE, "TIPO_ORDINE");
                    aFilters = aFilters.concat(tempFilter);
                }
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


            var allIndex = [],
                aIndex = [],
                sIndex = {},
                aTempIndex = [];
            var that = this;

            if (sFilter.SEDE_ECC !== undefined && sFilter.SEDE_ECC !== []) {
                for (var j = 0; j < sFilter.SEDE_ECC.length; j++) {

                    var SedeEcc = {};
                    var aSede = sFilter.SEDE_ECC[j].split("-");
                    SedeEcc.LIVELLO1 = (aSede[0] === undefined ? "" : aSede[0]);
                    SedeEcc.LIVELLO2 = (aSede[1] === undefined ? "" : aSede[1]);
                    SedeEcc.LIVELLO3 = (aSede[2] === undefined ? "" : aSede[2]);
                    SedeEcc.LIVELLO4 = (aSede[3] === undefined ? "" : aSede[3]);
                    SedeEcc.LIVELLO5 = (aSede[4] === undefined ? "" : aSede[4]);
                    SedeEcc.LIVELLO6 = (aSede[5] === undefined ? "" : aSede[5]);

                    // Popola Filtri da Sede Reale
                    var aFilterSedeReale = await this.filtriSedeReale(SedeEcc);
                    aFilterSedeReale = aFilterSedeReale.concat(aFilters);
                    // concatena gli altri filtri

                    // Estrazione per ogni sede tecnica Reale Inserita + Altri Filtri Sel Modelli
                    aIndex = await this._getTableIndexAzioni("/Index_Azioni", aFilterSedeReale);
                    aIndex = await this.compilaIndice(aIndex, sFilter, sFilter.SEDE_ECC[j]);
                    allIndex = allIndex.concat(aIndex);
                }
            } else {
                allIndex = await this._getTableIndexAzioni("/Index_Azioni", aFilters);
                allIndex = await this.compilaIndice(allIndex, sFilter);
            } aIndex = [],
            sIndex = {};
            this.colorToSet = "G";
            this.resetContatore = 0;
            this.resetIndex = 0;

            var ExtractionGrouped = _.groupBy(allIndex, ele => ele.INDEX);
            Object.keys(ExtractionGrouped).forEach(ele => {
                let element = ExtractionGrouped[ele];

                // Cancella righe duplicate e prepara la sede tecnica formattata con il RIFERIMENTO
                var sortElement = _.sortBy(element, "CONTATORE");
                aTempIndex = [];
                sortElement.forEach(row => {
                    row.SEDE_RAGG = this.SedeRiferimento(row);

                    // if (row.SEDE_RAGG !== sIndex.SEDE_RAGG || row.CONTATORE !== sIndex.CONTATORE ){
                    if (row.SEDE_TECNICA_P !== sIndex.SEDE_TECNICA_P || row.CONTATORE !== sIndex.CONTATORE) {
                        sIndex = row;
                        aTempIndex.push(row);
                    }
                });

                sIndex = {};

                // Sorta per Sede Tecnica le Azioni per accorparle
                sortElement = _.sortBy(aTempIndex, "SEDE_RAGG");
                sortElement.forEach(row => {

                    if ((row.SEDE_RAGG !== sIndex.SEDE_RAGG && row.RIFERIMENTO !== 0) || sIndex.RIFERIMENTO === undefined) { // Gestione Colore - Indice nuovo
                        this.resetIndex = this.resetIndex + 1;
                        if (this.colorToSet === "W") {
                            this.colorToSet = String("G");
                        } else {
                            this.colorToSet = String("W");
                        }
                    }

                    this.resetContatore = this.resetContatore + 1;
                    row.CONTATORE = this.resetContatore;
                    row.INDEX = this.resetIndex;
                    row.COLORSET = this.colorToSet;

                    sIndex = row;
                    aIndex.push(row);

                });
            });

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(aIndex);
            this.getView().setModel(oModel, "allIndex");
            sap.ui.core.BusyIndicator.hide();
        },
        SedeRiferimento: function (sIndex) {

            sIndex.SEDE_RAGG = sIndex.SEDE_TECNICA_P;
            var i = 0;
            if (sIndex.SEDE_TECNICA_P !== undefined) {
                var aSede = sIndex.SEDE_TECNICA_P.split("-");
                while (i < sIndex.RIFERIMENTO) {
                    if (aSede[i] !== undefined) {
                        if (i === 0) {
                            sIndex.SEDE_RAGG = aSede[i];
                        } else {
                            sIndex.SEDE_RAGG = sIndex.SEDE_RAGG + '-' + aSede[i];
                        }
                    }
                    i++;
                }
                // SEDE_TECNICA_P
                return sIndex.SEDE_RAGG;
            } else {
                return "";
            }
        },
        compilaIndice: async function (allIndex, sFilter, SEDE_ECC) {

            if (allIndex.length > 0) {
                for (var i = 0; i < allIndex.length; i++) { // PreCompila con i dati inseriti
                    if (sFilter.EQUIPMENT !== undefined) {
                        allIndex[i].EQUIPMENT = sFilter.EQUIPMENT;
                    }
                    if (sFilter.FINEVAL !== undefined) {
                        allIndex[i].FINEVAL = sFilter.FINEVAL;
                    }
                    if (sFilter.INIZIOVAL !== undefined) {
                        allIndex[i].INIZIOVAL = sFilter.INIZIOVAL;
                    }
                    if (sFilter.MPTYP !== undefined) {
                        allIndex[i].MPTYP = sFilter.MPTYP;
                    }
                    if (sFilter.OGGETTO_TECNICO !== undefined) {
                        allIndex[i].OGGETTO_TECNICO = sFilter.OGGETTO_TECNICO;
                    }
                    if (sFilter.PROFILO !== undefined) {
                        allIndex[i].PROFILO = sFilter.PROFILO;
                    }
                    if (SEDE_ECC !== undefined) {
                        allIndex[i].SEDE_ECC = SEDE_ECC;
                    }

                    // Gestione Materiali e Servizi
                    /*if (allIndex[i].MATNR !== "" && allIndex[i].MATNR !== undefined) {
                        var sMatnr = this.initMaterial();
                        sMatnr.MATNR = allIndex[i].MATNR;
                        allIndex[i].Material = [sMatnr];
                    }
                    if (allIndex[i].ASNUM !== "" && allIndex[i].ASNUM !== undefined) {
                        allIndex[i].Servizi = [{}];
                        var sServizi = this.initServizi();
                        sServizi.ASNUM = allIndex[i].ASNUM;
                        allIndex[i].Servizi = [sServizi];
                    }*/

                    // Estrazione Materiali e Servizi
                    var aFilter = [];
                    aFilter.push(new Filter("INDEX", FilterOperator.EQ, allIndex[i].INDEX));
                    aFilter.push(new Filter("CONTATORE", FilterOperator.EQ, allIndex[i].CONTATORE));
                    allIndex[i].Servizi = await this._getTableNoError("/AzioniServizi", aFilter);
                    allIndex[i].Material = await this._getTableNoError("/AzioniMateriali", aFilter);

                }
                return allIndex;
            } else {
                return [];
            }

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
                actions: [
                    "Si", sap.m.MessageBox.Action.NO
                ],
                emphasizedAction: "Si",
                initialFocus: sap.m.MessageBox.Action.NO,
                onClose: function (oAction) {
                    if (oAction === "NO") { // that.cancel();
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

            if ((oModel.SEDE_ECC === "" || oModel.SEDE_ECC === null || oModel.SEDE_ECC === undefined) && (oModel.EQUIPMENT2 === "" || oModel.EQUIPMENT2 === null || oModel.EQUIPMENT2 === undefined)) {
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
        },

        handleSedeTecnica: function () {

            this.onResetSedeTecnica();
            // this._sInputId = oEvent.getSource();
            var selItems = [];
            var sSelect = this.getView().getModel("sSelect").getData();
            if (sSelect.SEDE !== undefined) {

                var aItems = this.byId("cbSEDE").getSelectedItems();
                for (var i = 0; i < aItems.length; i++) {
                    selItems.push(aItems[i].getBindingContext("sHelp").getObject());
                }
                this.getView().getModel("SelSede").setData(selItems);
            } else {
                this.getView().getModel("SelSede").setData([]);
            }
            this.getView().getModel("SelSede").refresh(true);
            this.byId("DialogSede").open();

        },
        onConfirmSedeTecnica: function () { // this._sInputId.setValue(null);
            var aSel = this.getView().getModel("SelSede").getData();
            var sHelp = this.getView().getModel("sHelp").getData();
            sHelp.SEDE = aSel;

            this.getView().getModel("sHelp").refresh(true);
            this.byId("cbSEDE").setSelectedKeys(this.byId("cbSEDE").getKeys());
            this.byId("DialogSede").close();
        },
        onCloseSedeTecnica: function () { // this._sInputId.setValue(null);
            this.byId("DialogSede").close();
        },
        /*onPressSedeTecnica: function (oEvent) {
            var sel = oEvent.getSource().getBindingContext().getObject();
            // var selConcat = sel.SEDE_TECNICA + '-' + sel.LIVELLO1 + '-' + sel.LIVELLO2 + '-' + sel.LIVELLO3 + '-' + sel.LIVELLO4 + '-' + sel.LIVELLO5 + '-' + sel.LIVELLO6;
            var selConcat = sel.LIVELLO1 + '-' + sel.LIVELLO2 + '-' + sel.LIVELLO3 + '-' + sel.LIVELLO4 + '-' + sel.LIVELLO5 + '-' + sel.LIVELLO6;
            // Evita i - in eccesso in fondo
            selConcat = selConcat.replaceAll("--", "");
            if (selConcat[selConcat.length - 1] === "-") {
                selConcat = selConcat.substring(0, (selConcat.length - 1));
            }
            this.getModel("sSelect").getData().SEDE_TECNICA = sel.SEDE_TECNICA;
            this._sInputId.setValue(selConcat);
            this.byId("DialogSede").close();
        },*/
        moveToTable2: function (oEvent) {
            if (this.byId("tSedeTecnica").getSelectedIndex() != -1) { // var sel = this.byId("tSedeTecnica").getRows()[this.byId("tSedeTecnica").getSelectedIndex()].getBindingContext().getObject();
                var sel = this.getView().getModel("Sede").getData()[this.byId("tSedeTecnica").getSelectedIndex()];
                sel.SEDECONCAT = sel.LIVELLO1 + '-' + sel.LIVELLO2 + '-' + sel.LIVELLO3 + '-' + sel.LIVELLO4 + '-' + sel.LIVELLO5 + '-' + sel.LIVELLO6;
                sel.SEDECONCAT = sel.SEDECONCAT.replaceAll("--", "");
                if (sel.SEDECONCAT[sel.SEDECONCAT.length - 1] === "-") {
                    sel.SEDECONCAT = sel.SEDECONCAT.substring(0, (sel.SEDECONCAT.length - 1));
                }

                var aSel = this.getView().getModel("SelSede").getData();
                var control = true;
                for (var i = 0; i < aSel.length; i++) {
                    var selConcat = aSel[i].LIVELLO1 + '-' + aSel[i].LIVELLO2 + '-' + aSel[i].LIVELLO3 + '-' + aSel[i].LIVELLO4 + '-' + aSel[i].LIVELLO5 + '-' + aSel[i].LIVELLO6;
                    selConcat = selConcat.replaceAll("--", "");
                    if (selConcat[selConcat.length - 1] === "-") {
                        selConcat = selConcat.substring(0, (selConcat.length - 1));
                    }
                    if (sel.SEDECONCAT === selConcat) {
                        control = false;
                        break;
                    }
                }
                if (control) {
                    aSel.push(sel);
                    this.getView().getModel("SelSede").refresh(true);
                }
            }
        },
        deleteFromTable2: function () {
            if (this.byId("tSelSedeTecnica").getSelectedIndex() != -1) {
                this.getView().getModel("SelSede").getData().splice(this.byId("tSelSedeTecnica").getSelectedIndex(), 1);
                this.getView().getModel("SelSede").refresh(true);
            }
        },
        handleSedeTecnicaECC: function () {

            this.onResetSedeTecnicaReale();
            // this._sInputId = oEvent.getSource();
            var selItems = [];
            var sSelect = this.getView().getModel("sSelect").getData();
            if (sSelect.SEDE_ECC !== undefined) {

                var aItems = this.byId("cbSEDEECC").getSelectedItems();
                for (var i = 0; i < aItems.length; i++) {
                    selItems.push(aItems[i].getBindingContext("sHelp").getObject());
                }
                this.getView().getModel("SelSedeReale").setData(selItems);
            } else {
                this.getView().getModel("SelSede").setData([]);
            }
            this.getView().getModel("SelSedeReale").refresh(true);
            this.byId("DialogSedeReale").open();

        },
        onConfirmSedeTecnicaReale: function () { // this._sInputId.setValue(null);
            var aSel = this.getView().getModel("SelSedeReale").getData();
            var sHelp = this.getView().getModel("sHelp").getData();
            sHelp.SEDEECC = aSel;

            this.getView().getModel("sHelp").refresh(true);
            this.byId("cbSEDEECC").setSelectedKeys(this.byId("cbSEDEECC").getKeys());
            this.byId("DialogSedeReale").close();
        },
        onCloseSedeTecnicaReale: function () { // this._sInputId.setValue(null);
            this.byId("DialogSedeReale").close();
        },

        onResetSedeTecnicaReale: function () {
            var oModel = new sap.ui.model.json.JSONModel();
            var sData = {
                SEDE_TECNICA: ""
            };
            oModel.setData(sData);
            this.getView().setModel(oModel, "sSedeTecnicaReale");
            this.onFilterSedeTecnicaReale();
        },
        onFilterSedeTecnicaReale: async function () {
            sap.ui.core.BusyIndicator.show();
            var sSedeTecnica = this.getView().getModel("sSedeTecnicaReale").getData();

            var ListFl = {
                Language: "IT",
                GetDetails: "X",
                N_FunclocList: [],
                N_FunclocRa: [],
                N_CategoryRa: []
            }; // todo
            if (sSedeTecnica.SEDE_TECNICA != "" && sSedeTecnica.SEDE_TECNICA != null) {
                ListFl.N_FunclocRa.push({Sign: "I", Option: "CP", Low: sSedeTecnica.SEDE_TECNICA});
            }
            var sSelect = this.getView().getModel("sSelect").getData();
            ListFl.N_CategoryRa = [{
                    Sign: "I",
                    Option: "EQ",
                    Low: sSelect.SEDE_TECNICA
                }];
            if (sSelect.SEDE !== undefined) {
                if (sSelect.SEDE.length !== 0) {

                    for (var i = 0; i < sSelect.SEDE.length; i++) {

                        var sSedeTipo = this.getView().getModel("sSelect").getData().SEDE[i];

                        var countN = (sSedeTipo.indexOf("n") === -1) ? 50 : sSedeTipo.indexOf("n"),
                            countK = (sSedeTipo.indexOf("k") === -1) ? 50 : sSedeTipo.indexOf("k"),
                            countX = (sSedeTipo.indexOf("x") === -1) ? 50 : sSedeTipo.indexOf("x");

                        if (countN < countK && countN < countX) {
                            sSedeTipo = sSedeTipo.substring(0, countN) + "*";
                        } else if (countK < countN && countK < countX) {
                            sSedeTipo = sSedeTipo.substring(0, countK) + "*";
                        } else if (countX < countN && countX < countK) {
                            sSedeTipo = sSedeTipo.substring(0, countX) + "*";
                        } else {
                            sSedeTipo = sSedeTipo + "*";
                        } ListFl.N_FunclocRa.push({Sign: "I", Option: "CP", Low: sSedeTipo});
                    }
                }
            }

            var oModel = new sap.ui.model.json.JSONModel(),
                allSedi = [];
            // In realtà fa una read, andava richiamato il metodo Post
            allSedi = await this._saveHana("/ListFl", ListFl);
            allSedi = allSedi.N_FunclocList.results;
            oModel.setData(allSedi);
            this.getView().setModel(oModel, "SedeReale");
            sap.ui.core.BusyIndicator.hide();


        },
        moveToTable2Reale: function () {
            if (this.byId("tSedeTecnicaReale").getSelectedIndex() != -1) { // var sel = this.byId("tSedeTecnicaReale").getRows()[this.byId("tSedeTecnicaReale").getSelectedIndex()].getBindingContext("SedeReale").getObject();
                var sel = this.getView().getModel("SedeReale").getData()[this.byId("tSedeTecnicaReale").getSelectedIndex()];
                var aSel = this.getView().getModel("SelSedeReale").getData();
                var control = true;
                for (var i = 0; i < aSel.length; i++) {

                    if (sel.Functlocation === aSel[i].Functlocation) {
                        control = false;
                        break;
                    }
                }
                if (control) {
                    aSel.push(sel);
                    this.getView().getModel("SelSedeReale").refresh(true);
                }
            }
        },
        deleteFromTable2Reale: function () {
            if (this.byId("tSelSedeTecnicaReale").getSelectedIndex() != -1) {
                this.getView().getModel("SelSedeReale").getData().splice(this.byId("tSelSedeTecnicaReale").getSelectedIndex(), 1);
                this.getView().getModel("SelSedeReale").refresh(true);
            }
        },
        onSuggestMPTYP: async function (oEvent) {
          if (oEvent.getParameter("suggestValue").length >= 3) {
          var aFilter = [];
          aFilter.push({
              "Shlpname": "ZPM4R_SH_IMPM",
              "Shlpfield": "POINT",
              "Sign": "I",
              "Option": "CP",
              "Low": oEvent.getParameter("suggestValue") + "*"
          });
          var sHelp = this.getView().getModel("sHelp").getData();
          sHelp.MPTYP = await this.Shpl("ZPM4R_SH_IMPM", "SH", aFilter);
          this.getView().getModel("sHelp").refresh(true);
        }
      },
      onSuggestEquipment: async function (oEvent) {
          var sTerm = oEvent.getParameter("suggestValue");
          if (sTerm.length >= 3) {
              var aFilter = [];
              aFilter.push({
                  "Shlpname": "ZPM4R_SH_EQUI",
                  "Shlpfield": "SPRAS",
                  "Sign": "I",
                  "Option": "EQ",
                  "Low": "IT"
              });
              aFilter.push({
                  "Shlpname": "ZPM4R_SH_EQUI",
                  "Shlpfield": "EQUNR",
                  "Sign": "I",
                  "Option": "CP",
                  "Low": oEvent.getParameter("suggestValue") + "*"
              });
              var sHelp = this.getView().getModel("sHelp").getData();
              sHelp.EQUIPMENT2 = await this.Shpl("ZPM4R_SH_EQUI", "SH", aFilter);
              this.getView().getModel("sHelp").refresh(true);
          }
      },
      onChangeMatnr: function (oEvent) {
        oEvent.getSource().getBindingContext("aMaterial").getObject().MAKTX = oEvent.getSource().getSelectedItem().getBindingContext().getObject().MAKTX;
      },
      onChangeServizi: function (oEvent) {
        oEvent.getSource().getBindingContext("aServizi").getObject().ASKTX = oEvent.getSource().getSelectedItem().getBindingContext().getObject().ASKTX;
      },

    });
});
