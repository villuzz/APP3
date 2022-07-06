sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "PM030/APP3/util/viewPiani",
    "sap/m/TablePersoController",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/MessageToast',
    'sap/m/Token',
    "sap/ui/export/library",
    'sap/ui/core/library',
    "PM030/APP3/util/xlsx",
], function (Controller, JSONModel, MessageBox, viewPiani, TablePersoController, Filter, FilterOperator, MessageToast, Token, exportLibrary, coreLibrary, xlsx) {
    "use strict";
    var oResource;
    oResource = new sap.ui.model.resource.ResourceModel({bundleName: "PM030.APP3.i18n.i18n"}).getResourceBundle();
    var EdmType = exportLibrary.EdmType;
    var ValueState = coreLibrary.ValueState;
    return Controller.extend("PM030.APP3.controller.ViewPage", {
        onInit: function () {

            this.getOwnerComponent().getRouter().getRoute("ViewPage").attachPatternMatched(this._onObjectMatched, this);

            var oModel = new sap.ui.model.json.JSONModel();
            var sData = {};
            oModel.setData(sData);
            this.getView().setModel(oModel, "sFilter");

            this._oTPC = new TablePersoController({table: this.getView().byId("tbPiani"), componentName: "Piani", persoService: viewPiani}).activate();

            var oinIndex = this.getView().byId("inIndex");
            var oinAzioni = this.getView().byId("IContActEl");
            var fnValidator = function (args) {
                var text = args.text;

                return new Token({key: text, text: text});
            };
            oinIndex.addValidator(fnValidator);
            oinAzioni.addValidator(fnValidator);

        },
        _onObjectMatched: function (oEvent) {

            var ret = oEvent.getParameter("arguments").ret;
            if (this.getView().getModel("sHelp") === undefined) {
                this.getValueHelp(); // PER QUELLI PICCOLI VA BENE, PER GLI ALTRI CHIAMARE SOLO AL BISOGNO TODO
            }
            if (ret !== undefined && this.getView().getModel("sFilter").getData() !== {}) {
                this.onSearchFilters();
            } else {
                var oPiani = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oPiani, "mPiani");
            }

        },
        onDataExport: async function () {
            var oResource = this.getResourceBundle();
            var items = this.getView().byId("tbPiani").getSelectedItems(),
                aIndex = [],
                aContatore = [],
                aMateriali = [],
                aServizi = [];
            var k;
            var oAzioni = this.getView().getModel("mAzioni").getData();
            var oMatnr = this.getView().getModel("mMatnr").getData();
            var oServizi = this.getView().getModel("mServizi").getData();

            if (items.length !== 0) {
                for (var i = 0; i < items.length; i++) {
                    var line = items[i].getBindingContext("mPiani").getObject();
                    aIndex.push(this.rowIndex(line));
                    for (k = 0; k < oAzioni.length; k++) {
                        if (line.IndexPmo === oAzioni[k].IndexPmo) {
                            aContatore.push(this.rowContatore(oAzioni[k]));
                        }
                    }
                    for (k = 0; k < oMatnr.length; k++) {
                        if (line.IndexPmo === oMatnr[k].IndexPmo) {
                            aMateriali.push(this.rowMateriali(oMatnr[k]));
                        }
                    }
                    for (k = 0; k < oServizi.length; k++) {
                        if (line.IndexPmo === oServizi[k].IndexPmo) {
                            aServizi.push(this.rowServizi(oServizi[k]));
                        }
                    }
                }

                let wb = XLSX.utils.book_new();
                let ws = XLSX.utils.json_to_sheet(aIndex, {
                    header: this.ColumnIndex(),
                    skipHeader: false
                });
                XLSX.utils.book_append_sheet(wb, ws, oResource.getText("IndiciExcel"));
                ws = XLSX.utils.json_to_sheet(aContatore, {
                    header: this.ColumnContatore(),
                    skipHeader: false
                });
                XLSX.utils.book_append_sheet(wb, ws, oResource.getText("AzioniExcel"));
                ws = XLSX.utils.json_to_sheet(aMateriali, {
                    header: this.ColumnMateriali(),
                    skipHeader: false
                });
                XLSX.utils.book_append_sheet(wb, ws, oResource.getText("MaterialiExcel"));
                ws = XLSX.utils.json_to_sheet(aServizi, {
                    header: this.ColumnServizi(),
                    skipHeader: false
                });
                XLSX.utils.book_append_sheet(wb, ws, oResource.getText("ServiziExcel"));
                XLSX.writeFile(wb, "Prototipi.xlsx");

            } else {
                MessageToast.show("Seleziona almeno una riga");
            }
        },
        rowIndex: function (sLine) {
            var sData = {};
            sData[oResource.getText("ComponentTipo").replaceAll(" ", "_")] = sLine.ComponentTipo;
            sData[oResource.getText("Divisioneu").replaceAll(" ", "_")] = sLine.Divisioneu;
            sData[oResource.getText("FineVal").replaceAll(" ", "_")] = sLine.FineVal;
            sData[oResource.getText("IndexPmo").replaceAll(" ", "_")] = sLine.IndexPmo;
            sData[oResource.getText("InizioVal").replaceAll(" ", "_")] = sLine.InizioVal;
            sData[oResource.getText("Uzeit").replaceAll(" ", "_")] = sLine.Uzeit;
            sData[oResource.getText("Appuntam").replaceAll(" ", "_")] = sLine.Appuntam;
            sData[oResource.getText("Azione").replaceAll(" ", "_")] = sLine.Azione;
            sData[oResource.getText("Banfn").replaceAll(" ", "_")] = sLine.Banfn;
            sData[oResource.getText("Cdl").replaceAll(" ", "_")] = sLine.Cdl;
            sData[oResource.getText("Cdl1").replaceAll(" ", "_")] = sLine.Cdl1;
            sData[oResource.getText("Cdl2").replaceAll(" ", "_")] = sLine.Cdl2;
            sData[oResource.getText("Cdl3").replaceAll(" ", "_")] = sLine.Cdl3;
            sData[oResource.getText("Cdl4").replaceAll(" ", "_")] = sLine.Cdl4;
            sData[oResource.getText("Cdl5").replaceAll(" ", "_")] = sLine.Cdl5;
            sData[oResource.getText("CentroLavoro").replaceAll(" ", "_")] = sLine.CentroLavoro;
            sData[oResource.getText("Ciclo").replaceAll(" ", "_")] = sLine.Ciclo;
            sData[oResource.getText("Classe").replaceAll(" ", "_")] = sLine.Classe;
            sData[oResource.getText("CodAzione").replaceAll(" ", "_")] = sLine.CodAzione;
            sData[oResource.getText("Collective").replaceAll(" ", "_")] = sLine.Collective;
            sData[oResource.getText("Criticita").replaceAll(" ", "_")] = sLine.Criticita;
            sData[oResource.getText("DataInizCiclo").replaceAll(" ", "_")] = sLine.DataInizCiclo;
            sData[oResource.getText("Datum").replaceAll(" ", "_")] = sLine.Datum;
            sData[oResource.getText("Daune").replaceAll(" ", "_")] = sLine.Daune;
            sData[oResource.getText("DayAdv").replaceAll(" ", "_")] = sLine.DayAdv;
            sData[oResource.getText("DesBreve").replaceAll(" ", "_")] = sLine.DesBreve;
            sData[oResource.getText("DesComponente").replaceAll(" ", "_")] = sLine.DesComponente;
            sData[oResource.getText("DesEstesa").replaceAll(" ", "_")] = sLine.DesEstesa;
            sData[oResource.getText("Destinatario").replaceAll(" ", "_")] = sLine.Destinatario;
            sData[oResource.getText("Determinanza").replaceAll(" ", "_")] = sLine.Determinanza;
            sData[oResource.getText("Differibile").replaceAll(" ", "_")] = sLine.Differibile;
            sData[oResource.getText("Divisionec").replaceAll(" ", "_")] = sLine.Divisionec;
            sData[oResource.getText("DurataCiclo").replaceAll(" ", "_")] = sLine.DurataCiclo;
            sData[oResource.getText("EquipmentCompo").replaceAll(" ", "_")] = sLine.EquipmentCompo;
            sData[oResource.getText("EquipmentOdm").replaceAll(" ", "_")] = sLine.EquipmentOdm;
            sData[oResource.getText("FineCard").replaceAll(" ", "_")] = sLine.FineCard;
            sData[oResource.getText("FlagAttivo").replaceAll(" ", "_")] = ( sLine.FlagAttivo === true) ? "X" : "";
            sData[oResource.getText("FlagInterc").replaceAll(" ", "_")] = ( sLine.FlagInterc === true) ? "X" : "";
            sData[oResource.getText("FlagMateriali").replaceAll(" ", "_")] = ( sLine.FlagMateriali === true) ? "X" : "";
            sData[oResource.getText("FlagOdm").replaceAll(" ", "_")] = sLine.FlagOdm;
            sData[oResource.getText("FlagPrestazioni").replaceAll(" ", "_")] = ( sLine.FlagPrestazioni === true) ? "X" : "";
            sData[oResource.getText("FlgMail").replaceAll(" ", "_")] = sLine.FlgMail;
            sData[oResource.getText("Frequenza").replaceAll(" ", "_")] = sLine.Frequenza;
            sData[oResource.getText("Hper").replaceAll(" ", "_")] = sLine.Hper;
            sData[oResource.getText("Hper1").replaceAll(" ", "_")] = sLine.Hper1;
            sData[oResource.getText("Hper2").replaceAll(" ", "_")] = sLine.Hper2;
            sData[oResource.getText("Hper3").replaceAll(" ", "_")] = sLine.Hper3;
            sData[oResource.getText("Hper4").replaceAll(" ", "_")] = sLine.Hper4;
            sData[oResource.getText("Hper5").replaceAll(" ", "_")] = sLine.Hper5;
            sData[oResource.getText("Indisponibilita").replaceAll(" ", "_")] = sLine.Indisponibilita;
            sData[oResource.getText("IntegTxtEsteso").replaceAll(" ", "_")] = sLine.IntegTxtEsteso;
            sData[oResource.getText("Lstar").replaceAll(" ", "_")] = sLine.Lstar;
            sData[oResource.getText("Lstar1").replaceAll(" ", "_")] = sLine.Lstar1;
            sData[oResource.getText("Lstar2").replaceAll(" ", "_")] = sLine.Lstar2;
            sData[oResource.getText("Lstar3").replaceAll(" ", "_")] = sLine.Lstar3;
            sData[oResource.getText("Lstar4").replaceAll(" ", "_")] = sLine.Lstar4;
            sData[oResource.getText("Lstar5").replaceAll(" ", "_")] = sLine.Lstar5;
            sData[oResource.getText("Num").replaceAll(" ", "_")] = sLine.Num;
            sData[oResource.getText("Num1").replaceAll(" ", "_")] = sLine.Num1;
            sData[oResource.getText("Num2").replaceAll(" ", "_")] = sLine.Num2;
            sData[oResource.getText("Num3").replaceAll(" ", "_")] = sLine.Num3;
            sData[oResource.getText("Num4").replaceAll(" ", "_")] = sLine.Num4;
            sData[oResource.getText("Num5").replaceAll(" ", "_")] = sLine.Num5;
            sData[oResource.getText("Percorso").replaceAll(" ", "_")] = sLine.Percorso;
            sData[oResource.getText("Persone").replaceAll(" ", "_")] = sLine.Persone;
            sData[oResource.getText("Persone1").replaceAll(" ", "_")] = sLine.Persone1;
            sData[oResource.getText("Persone2").replaceAll(" ", "_")] = sLine.Persone2;
            sData[oResource.getText("Persone3").replaceAll(" ", "_")] = sLine.Persone3;
            sData[oResource.getText("Persone4").replaceAll(" ", "_")] = sLine.Persone4;
            sData[oResource.getText("Persone5").replaceAll(" ", "_")] = sLine.Persone5;
            sData[oResource.getText("Point").replaceAll(" ", "_")] = sLine.Point;
            sData[oResource.getText("Priorita").replaceAll(" ", "_")] = sLine.Priorita;
            sData[oResource.getText("Progres").replaceAll(" ", "_")] = sLine.Progres;
            sData[oResource.getText("Scostamento").replaceAll(" ", "_")] = sLine.Scostamento;
            sData[oResource.getText("SedeTecOdm").replaceAll(" ", "_")] = sLine.SedeTecOdm;
            sData[oResource.getText("Sistema").replaceAll(" ", "_")] = sLine.Sistema;
            sData[oResource.getText("StComponente").replaceAll(" ", "_")] = sLine.StComponente;
            sData[oResource.getText("Steus").replaceAll(" ", "_")] = sLine.Steus;
            sData[oResource.getText("Steus1").replaceAll(" ", "_")] = sLine.Steus1;
            sData[oResource.getText("Steus2").replaceAll(" ", "_")] = sLine.Steus2;
            sData[oResource.getText("Steus3").replaceAll(" ", "_")] = sLine.Steus3;
            sData[oResource.getText("Steus4").replaceAll(" ", "_")] = sLine.Steus4;
            sData[oResource.getText("Steus5").replaceAll(" ", "_")] = sLine.Steus5;
            sData[oResource.getText("TipoAggr").replaceAll(" ", "_")] = sLine.TipoAggr;
            sData[oResource.getText("TipoAttivita").replaceAll(" ", "_")] = sLine.TipoAttivita;
            sData[oResource.getText("TipoGestione").replaceAll(" ", "_")] = sLine.TipoGestione;
            sData[oResource.getText("TipoGestione1").replaceAll(" ", "_")] = sLine.TipoGestione1;
            sData[oResource.getText("TipoGestione2").replaceAll(" ", "_")] = sLine.TipoGestione2;
            sData[oResource.getText("TipoOrdine").replaceAll(" ", "_")] = sLine.TipoOrdine;
            sData[oResource.getText("TipoPmo").replaceAll(" ", "_")] = sLine.TipoPmo;
            sData[oResource.getText("Toth").replaceAll(" ", "_")] = sLine.Toth;
            sData[oResource.getText("Toth1").replaceAll(" ", "_")] = sLine.Toth1;
            sData[oResource.getText("Toth2").replaceAll(" ", "_")] = sLine.Toth2;
            sData[oResource.getText("Toth3").replaceAll(" ", "_")] = sLine.Toth3;
            sData[oResource.getText("Toth4").replaceAll(" ", "_")] = sLine.Toth4;
            sData[oResource.getText("Toth5").replaceAll(" ", "_")] = sLine.Toth5;
            sData[oResource.getText("TxtCiclo").replaceAll(" ", "_")] = sLine.TxtCiclo;
            sData[oResource.getText("UltimaEsecuz").replaceAll(" ", "_")] = sLine.UltimaEsecuz;
            sData[oResource.getText("Uname").replaceAll(" ", "_")] = sLine.Uname;
            sData[oResource.getText("UnitaCiclo").replaceAll(" ", "_")] = sLine.UnitaCiclo;
            return sData;
        },
        rowContatore: function (sLine) {
            var sData = {};
            sData[oResource.getText("IndexPmo").replaceAll(" ", "_")] = sLine.IndexPmo;
            sData[oResource.getText("Cont").replaceAll(" ", "_")] = sLine.Cont;
            sData[oResource.getText("Sistem").replaceAll(" ", "_")] = sLine.Sistem;
            sData[oResource.getText("Progres").replaceAll(" ", "_")] = sLine.Progres;
            sData[oResource.getText("Classe").replaceAll(" ", "_")] = sLine.Classe;
            sData[oResource.getText("DesComponente").replaceAll(" ", "_")] = sLine.DesComponente;
            sData[oResource.getText("Tplnr").replaceAll(" ", "_")] = sLine.Tplnr;
            sData[oResource.getText("Equipment").replaceAll(" ", "_")] = sLine.Equipment;
            sData[oResource.getText("ComponentTipo").replaceAll(" ", "_")] = sLine.ComponentTipo;
            sData[oResource.getText("DesBreve").replaceAll(" ", "_")] = sLine.DesBreve;
            sData[oResource.getText("IntegTxtEsteso").replaceAll(" ", "_")] = sLine.IntegTxtEsteso;
            sData[oResource.getText("FlagAttivo").replaceAll(" ", "_")] = sLine.FlagAttivo;
            sData[oResource.getText("Datum").replaceAll(" ", "_")] = sLine.Datum;
            sData[oResource.getText("Uname").replaceAll(" ", "_")] = sLine.Uname;
            sData[oResource.getText("Uzeit").replaceAll(" ", "_")] = sLine.Uzeit;
            return sData;
        },
        handleUploadPiani: function () {
            this.byId("UploadTable").open();
        },
        onCloseFileUpload: function () { // this.onSearch();
            this.byId("UploadTable").close();
        },
        handleUploadPress: async function () {

            if (this.getView().byId("fileUploader").getValue() === "") {
                MessageBox.warning("Inserire un File da caricare");
            } else {
                sap.ui.core.BusyIndicator.show();

                var aIndiciTemp = this.getView().getModel("uploadIndici").getData();
                var aAzioniTemp = this.getView().getModel("uploadAzioni").getData();
                var aMaterialTemp = this.getView().getModel("uploadMaterial").getData();
                var aServiziTemp = this.getView().getModel("uploadServizi").getData();

                var aIndex = [],
                    aAzione = [],
                    aMaterial = [],
                    aServizi = [],
                    result = [],
                    i = 0, k = 0,
                    aReturn = [],
                    line = {};

                for (i = 0; i < aIndiciTemp.length; i++) {
                    line = this.formatIndici(aIndiciTemp[i]);
                    aIndex.push(line);
                }
                for (i = 0; i < aAzioniTemp.length; i++) {
                    line = this.formatAzioni(aAzioniTemp[i]);
                    aAzione.push(line);
                }
                for (i = 0; i < aMaterialTemp.length; i++) {
                    line = this.formatMaterial(aMaterialTemp[i]);
                    aMaterial.push(line);
                }
                for (i = 0; i < aServiziTemp.length; i++) {
                    line = this.formatServizi(aServiziTemp[i]);
                    aServizi.push(line);
                }

                for (i = 0; i < aIndex.length; i++) {
                    result = await this.saveIndici(aIndex[i]);
                    if (result !== "") {
                        aReturn.push({
                            type: "Error",
                            title: "Indici riga " + (
                                i + 2
                            ) + " Excel andata in errore",
                            description: result
                        });
                    }
                    for (k = 0; k < aAzione.length; k++) {
                      result = await this.saveAzioni(aAzione[k]);
                      if (result !== "") {
                          aReturn.push({
                              type: "Error",
                              title: "Azione riga " + (
                                  k + 2
                              ) + " Excel andata in errore",
                              description: result
                          });
                      }
                    }
                    for (k = 0; k < aServizi.length; k++) {
                      result = await this.saveServizi(aServizi[k]);
                      if (result !== "") {
                          aReturn.push({
                              type: "Error",
                              title: "Servizio riga " + (
                                  k + 2
                              ) + " Excel andata in errore",
                              description: result
                          });
                      }
                    }
                    for (k = 0; k < aMaterial.length; k++) {
                      result = await this.saveMaterial(aMaterial[k]);
                      if (result !== "") {
                          aReturn.push({
                              type: "Error",
                              title: "Materiale riga " + (
                                  k + 2
                              ) + " Excel andata in errore",
                              description: result
                          });
                      }
                    }
                }
                if (aReturn.length === 0) {
                    aReturn.push({
                        type: "Success",
                        title: "Excel Caricato con successo",
                        description: "tutte le " + aIndiciTemp.length + " Righe caricate con successo"
                    });
                }
                this.handleOpenDialogMsg(aReturn);
                this.onSearchFilters();
                this.byId("UploadTable").close();
                sap.ui.core.BusyIndicator.hide(0);
            }
        },
        formatIndici: function (sValue) {
          var sData = {};
          sData.Divisioneu = (sValue[oResource.getText("Divisioneu").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Divisioneu").replaceAll(" ", "_")].toString();
          //sData.FineVal = (sValue[oResource.getText("FineVal").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("FineVal").replaceAll(" ", "_")].toString();
          sData.IndexPmo = (sValue[oResource.getText("IndexPmo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("IndexPmo").replaceAll(" ", "_")].toString();
          //sData.InizioVal = (sValue[oResource.getText("InizioVal").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("InizioVal").replaceAll(" ", "_")].toString();
          sData.Uzeit = (sValue[oResource.getText("Uzeit").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Uzeit").replaceAll(" ", "_")].toString();
          sData.Appuntam = (sValue[oResource.getText("Appuntam").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Appuntam").replaceAll(" ", "_")].toString();
          sData.Azione = (sValue[oResource.getText("Azione").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Azione").replaceAll(" ", "_")].toString();
          sData.Banfn = (sValue[oResource.getText("Banfn").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Banfn").replaceAll(" ", "_")].toString();
          sData.Cdl = (sValue[oResource.getText("Cdl").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Cdl").replaceAll(" ", "_")].toString();
          sData.Cdl1 = (sValue[oResource.getText("Cdl1").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Cdl1").replaceAll(" ", "_")].toString();
          sData.Cdl2 = (sValue[oResource.getText("Cdl2").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Cdl2").replaceAll(" ", "_")].toString();
          sData.Cdl3 = (sValue[oResource.getText("Cdl3").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Cdl3").replaceAll(" ", "_")].toString();
          sData.Cdl4 = (sValue[oResource.getText("Cdl4").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Cdl4").replaceAll(" ", "_")].toString();
          sData.Cdl5 = (sValue[oResource.getText("Cdl5").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Cdl5").replaceAll(" ", "_")].toString();
          sData.CentroLavoro = (sValue[oResource.getText("CentroLavoro").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("CentroLavoro").replaceAll(" ", "_")].toString();
          sData.Ciclo = (sValue[oResource.getText("Ciclo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Ciclo").replaceAll(" ", "_")].toString();
          sData.Classe = (sValue[oResource.getText("Classe").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Classe").replaceAll(" ", "_")].toString();
          sData.CodAzione = (sValue[oResource.getText("CodAzione").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("CodAzione").replaceAll(" ", "_")].toString();
          sData.Collective = (sValue[oResource.getText("Collective").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Collective").replaceAll(" ", "_")].toString();
          sData.Criticita = (sValue[oResource.getText("Criticita").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Criticita").replaceAll(" ", "_")].toString();
          //sData.DataInizCiclo = (sValue[oResource.getText("DataInizCiclo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("DataInizCiclo").replaceAll(" ", "_")].toString();
          //sData.Datum = (sValue[oResource.getText("Datum").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Datum").replaceAll(" ", "_")].toString();
          sData.Daune = (sValue[oResource.getText("Daune").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Daune").replaceAll(" ", "_")].toString();
          sData.DayAdv = (sValue[oResource.getText("DayAdv").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("DayAdv").replaceAll(" ", "_")].toString();
          sData.DesBreve = (sValue[oResource.getText("DesBreve").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("DesBreve").replaceAll(" ", "_")].toString();
          sData.DesComponente = (sValue[oResource.getText("DesComponente").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("DesComponente").replaceAll(" ", "_")].toString();
          sData.DesEstesa = (sValue[oResource.getText("DesEstesa").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("DesEstesa").replaceAll(" ", "_")].toString();
          sData.Destinatario = (sValue[oResource.getText("Destinatario").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Destinatario").replaceAll(" ", "_")].toString();
          sData.Determinanza = (sValue[oResource.getText("Determinanza").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Determinanza").replaceAll(" ", "_")].toString();
          sData.Differibile = (sValue[oResource.getText("Differibile").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Differibile").replaceAll(" ", "_")].toString();
          sData.Divisionec = (sValue[oResource.getText("Divisionec").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Divisionec").replaceAll(" ", "_")].toString();
          sData.DurataCiclo = (sValue[oResource.getText("DurataCiclo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("DurataCiclo").replaceAll(" ", "_")].toString();
          sData.EquipmentCompo = (sValue[oResource.getText("EquipmentCompo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("EquipmentCompo").replaceAll(" ", "_")].toString();
          sData.EquipmentOdm = (sValue[oResource.getText("EquipmentOdm").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("EquipmentOdm").replaceAll(" ", "_")].toString();
          //sData.FineCard = (sValue[oResource.getText("FineCard").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("FineCard").replaceAll(" ", "_")].toString();
          sData.FlagAttivo = (sValue[oResource.getText("FlagAttivo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("FlagAttivo").replaceAll(" ", "_")].toString();
          sData.FlagInterc = (sValue[oResource.getText("FlagInterc").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("FlagInterc").replaceAll(" ", "_")].toString();
          sData.FlagMateriali = (sValue[oResource.getText("FlagMateriali").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("FlagMateriali").replaceAll(" ", "_")].toString();
          sData.FlagOdm = (sValue[oResource.getText("FlagOdm").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("FlagOdm").replaceAll(" ", "_")].toString();
          sData.FlagPrestazioni = (sValue[oResource.getText("FlagPrestazioni").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("FlagPrestazioni").replaceAll(" ", "_")].toString();
          sData.FlgMail = (sValue[oResource.getText("FlgMail").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("FlgMail").replaceAll(" ", "_")].toString();
          sData.Frequenza = (sValue[oResource.getText("Frequenza").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Frequenza").replaceAll(" ", "_")].toString();
          sData.Hper = (sValue[oResource.getText("Hper").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Hper").replaceAll(" ", "_")].toString();
          sData.Hper1 = (sValue[oResource.getText("Hper1").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Hper1").replaceAll(" ", "_")].toString();
          sData.Hper2 = (sValue[oResource.getText("Hper2").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Hper2").replaceAll(" ", "_")].toString();
          sData.Hper3 = (sValue[oResource.getText("Hper3").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Hper3").replaceAll(" ", "_")].toString();
          sData.Hper4 = (sValue[oResource.getText("Hper4").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Hper4").replaceAll(" ", "_")].toString();
          sData.Hper5 = (sValue[oResource.getText("Hper5").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Hper5").replaceAll(" ", "_")].toString();
          sData.Indisponibilita = (sValue[oResource.getText("Indisponibilita").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Indisponibilita").replaceAll(" ", "_")].toString();
          sData.IntegTxtEsteso = (sValue[oResource.getText("IntegTxtEsteso").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("IntegTxtEsteso").replaceAll(" ", "_")].toString();
          sData.Lstar = (sValue[oResource.getText("Lstar").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Lstar").replaceAll(" ", "_")].toString();
          sData.Lstar1 = (sValue[oResource.getText("Lstar1").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Lstar1").replaceAll(" ", "_")].toString();
          sData.Lstar2 = (sValue[oResource.getText("Lstar2").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Lstar2").replaceAll(" ", "_")].toString();
          sData.Lstar3 = (sValue[oResource.getText("Lstar3").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Lstar3").replaceAll(" ", "_")].toString();
          sData.Lstar4 = (sValue[oResource.getText("Lstar4").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Lstar4").replaceAll(" ", "_")].toString();
          sData.Lstar5 = (sValue[oResource.getText("Lstar5").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Lstar5").replaceAll(" ", "_")].toString();
          sData.Num = (sValue[oResource.getText("Num").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Num").replaceAll(" ", "_")].toString();
          sData.Num1 = (sValue[oResource.getText("Num1").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Num1").replaceAll(" ", "_")].toString();
          sData.Num2 = (sValue[oResource.getText("Num2").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Num2").replaceAll(" ", "_")].toString();
          sData.Num3 = (sValue[oResource.getText("Num3").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Num3").replaceAll(" ", "_")].toString();
          sData.Num4 = (sValue[oResource.getText("Num4").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Num4").replaceAll(" ", "_")].toString();
          sData.Num5 = (sValue[oResource.getText("Num5").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Num5").replaceAll(" ", "_")].toString();
          sData.Percorso = (sValue[oResource.getText("Percorso").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Percorso").replaceAll(" ", "_")].toString();
          sData.Persone = (sValue[oResource.getText("Persone").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Persone").replaceAll(" ", "_")].toString();
          sData.Persone1 = (sValue[oResource.getText("Persone1").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Persone1").replaceAll(" ", "_")].toString();
          sData.Persone2 = (sValue[oResource.getText("Persone2").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Persone2").replaceAll(" ", "_")].toString();
          sData.Persone3 = (sValue[oResource.getText("Persone3").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Persone3").replaceAll(" ", "_")].toString();
          sData.Persone4 = (sValue[oResource.getText("Persone4").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Persone4").replaceAll(" ", "_")].toString();
          sData.Persone5 = (sValue[oResource.getText("Persone5").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Persone5").replaceAll(" ", "_")].toString();
          sData.Point = (sValue[oResource.getText("Point").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Point").replaceAll(" ", "_")].toString();
          sData.Priorita = (sValue[oResource.getText("Priorita").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Priorita").replaceAll(" ", "_")].toString();
          sData.Progres = (sValue[oResource.getText("Progres").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Progres").replaceAll(" ", "_")].toString();
          sData.Scostamento = (sValue[oResource.getText("Scostamento").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Scostamento").replaceAll(" ", "_")].toString();
          sData.SedeTecOdm = (sValue[oResource.getText("SedeTecOdm").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("SedeTecOdm").replaceAll(" ", "_")].toString();
          sData.Sistema = (sValue[oResource.getText("Sistema").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Sistema").replaceAll(" ", "_")].toString();
          sData.StComponente = (sValue[oResource.getText("StComponente").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("StComponente").replaceAll(" ", "_")].toString();
          sData.Steus = (sValue[oResource.getText("Steus").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Steus").replaceAll(" ", "_")].toString();
          sData.Steus1 = (sValue[oResource.getText("Steus1").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Steus1").replaceAll(" ", "_")].toString();
          sData.Steus2 = (sValue[oResource.getText("Steus2").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Steus2").replaceAll(" ", "_")].toString();
          sData.Steus3 = (sValue[oResource.getText("Steus3").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Steus3").replaceAll(" ", "_")].toString();
          sData.Steus4 = (sValue[oResource.getText("Steus4").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Steus4").replaceAll(" ", "_")].toString();
          sData.Steus5 = (sValue[oResource.getText("Steus5").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Steus5").replaceAll(" ", "_")].toString();
          sData.TipoAggr = (sValue[oResource.getText("TipoAggr").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("TipoAggr").replaceAll(" ", "_")].toString();
          sData.TipoAttivita = (sValue[oResource.getText("TipoAttivita").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("TipoAttivita").replaceAll(" ", "_")].toString();
          sData.TipoGestione = (sValue[oResource.getText("TipoGestione").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("TipoGestione").replaceAll(" ", "_")].toString();
          sData.TipoGestione1 = (sValue[oResource.getText("TipoGestione1").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("TipoGestione1").replaceAll(" ", "_")].toString();
          sData.TipoGestione2 = (sValue[oResource.getText("TipoGestione2").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("TipoGestione2").replaceAll(" ", "_")].toString();
          sData.TipoOrdine = (sValue[oResource.getText("TipoOrdine").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("TipoOrdine").replaceAll(" ", "_")].toString();
          sData.TipoPmo = (sValue[oResource.getText("TipoPmo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("TipoPmo").replaceAll(" ", "_")].toString();
          sData.Toth = (sValue[oResource.getText("Toth").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Toth").replaceAll(" ", "_")].toString();
          sData.Toth1 = (sValue[oResource.getText("Toth1").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Toth1").replaceAll(" ", "_")].toString();
          sData.Toth2 = (sValue[oResource.getText("Toth2").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Toth2").replaceAll(" ", "_")].toString();
          sData.Toth3 = (sValue[oResource.getText("Toth3").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Toth3").replaceAll(" ", "_")].toString();
          sData.Toth4 = (sValue[oResource.getText("Toth4").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Toth4").replaceAll(" ", "_")].toString();
          sData.Toth5 = (sValue[oResource.getText("Toth5").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Toth5").replaceAll(" ", "_")].toString();
          sData.TxtCiclo = (sValue[oResource.getText("TxtCiclo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("TxtCiclo").replaceAll(" ", "_")].toString();
          //sData.UltimaEsecuz = (sValue[oResource.getText("UltimaEsecuz").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("UltimaEsecuz").replaceAll(" ", "_")].toString();
          sData.Uname = (sValue[oResource.getText("Uname").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Uname").replaceAll(" ", "_")].toString();
          sData.UnitaCiclo = (sValue[oResource.getText("UnitaCiclo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("UnitaCiclo").replaceAll(" ", "_")].toString();          

          //sData.FlagAttivo = ( sData.FlagAttivo === "X") ? true : false;
          sData.FlagInterc = ( sData.FlagInterc === "X") ? true : false;
          sData.FlagMateriali = ( sData.FlagMateriali === "X") ? true : false;
          //sData.FlagOdm = ( sData.FlagOdm === "X") ? true : false;
          sData.FlagPrestazioni = ( sData.FlagPrestazioni === "X") ? true : false;
          //sData.FlgMail = ( sData.FlgMail === "X") ? true : false;

          return sData;
        },
        formatAzioni: function (sValue) {
          var sData = {};
          sData.IndexPmo = (sValue[oResource.getText("IndexPmo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("IndexPmo").replaceAll(" ", "_")].toString();
          sData.Cont = (sValue[oResource.getText("Cont").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Cont").replaceAll(" ", "_")].toString();
          sData.Sistem = (sValue[oResource.getText("Sistem").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Sistem").replaceAll(" ", "_")].toString();
          sData.Progres = (sValue[oResource.getText("Progres").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Progres").replaceAll(" ", "_")].toString();
          sData.Classe = (sValue[oResource.getText("Classe").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Classe").replaceAll(" ", "_")].toString();
          sData.DesComponente = (sValue[oResource.getText("DesComponente").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("DesComponente").replaceAll(" ", "_")].toString();
          sData.Tplnr = (sValue[oResource.getText("Tplnr").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Tplnr").replaceAll(" ", "_")].toString();
          sData.Equipment = (sValue[oResource.getText("Equipment").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Equipment").replaceAll(" ", "_")].toString();
          sData.ComponentTipo = (sValue[oResource.getText("ComponentTipo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("ComponentTipo").replaceAll(" ", "_")].toString();
          sData.DesBreve = (sValue[oResource.getText("DesBreve").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("DesBreve").replaceAll(" ", "_")].toString();
          sData.IntegTxtEsteso = (sValue[oResource.getText("IntegTxtEsteso").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("IntegTxtEsteso").replaceAll(" ", "_")].toString();
          sData.FlagAttivo = (sValue[oResource.getText("FlagAttivo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("FlagAttivo").replaceAll(" ", "_")].toString();
          //sData.Datum = (sValue[oResource.getText("Datum").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Datum").replaceAll(" ", "_")].toString();
          //sData.Uname = (sValue[oResource.getText("Uname").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Uname").replaceAll(" ", "_")].toString();
          //sData.Uzeit = (sValue[oResource.getText("Uzeit").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Uzeit").replaceAll(" ", "_")].toString();
          sData.GestioneLoad = (sValue[oResource.getText("GestioneLoad").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("GestioneLoad").replaceAll(" ", "_")].toString();
          return sData;
        },
        formatMaterial: function (sValue) {
          var sData = {};
          sData.IndexPmo = (sValue[oResource.getText("IndexPmo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("IndexPmo").replaceAll(" ", "_")].toString();
          sData.Cont = (sValue[oResource.getText("Cont").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Cont").replaceAll(" ", "_")].toString();
          sData.Matnr = (sValue[oResource.getText("Matnr").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Matnr").replaceAll(" ", "_")].toString();
          sData.Maktx = (sValue[oResource.getText("Maktx").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Maktx").replaceAll(" ", "_")].toString();
          sData.Menge = (sValue[oResource.getText("Menge").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Menge").replaceAll(" ", "_")].toString();
          sData.Meins = (sValue[oResource.getText("Meins").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Meins").replaceAll(" ", "_")].toString();
          sData.Lgort = (sValue[oResource.getText("Lgort").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Lgort").replaceAll(" ", "_")].toString();
          sData.Werks = (sValue[oResource.getText("Werks").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Werks").replaceAll(" ", "_")].toString();
          //sData.Charg = (sValue[oResource.getText("Charg").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Charg").replaceAll(" ", "_")].toString();
          //sData.Tbtwr = (sValue[oResource.getText("Tbtwr").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Tbtwr").replaceAll(" ", "_")].toString();
          //sData.Waers = (sValue[oResource.getText("Waers").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Waers").replaceAll(" ", "_")].toString();
          sData.Ekgrp = (sValue[oResource.getText("Ekgrp").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Ekgrp").replaceAll(" ", "_")].toString();
          sData.Ekorg = (sValue[oResource.getText("Ekorg").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Ekorg").replaceAll(" ", "_")].toString();
          sData.Afnam = (sValue[oResource.getText("Afnam").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Afnam").replaceAll(" ", "_")].toString();
          sData.Matkl = (sValue[oResource.getText("Matkl").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Matkl").replaceAll(" ", "_")].toString();          
          return sData;
        },
        formatServizi: function (sValue) {
          var sData = {};
          sData.IndexPmo = (sValue[oResource.getText("IndexPmo").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("IndexPmo").replaceAll(" ", "_")].toString();
          sData.Cont = (sValue[oResource.getText("Cont").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Cont").replaceAll(" ", "_")].toString();
          sData.Asnum = (sValue[oResource.getText("Asnum").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Asnum").replaceAll(" ", "_")].toString();
          sData.Asktx = (sValue[oResource.getText("Asktx").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Asktx").replaceAll(" ", "_")].toString();
          sData.Menge = (sValue[oResource.getText("Menge").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Menge").replaceAll(" ", "_")].toString();
          sData.Meins = (sValue[oResource.getText("Meins").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Meins").replaceAll(" ", "_")].toString();
          //sData.Tbtwr = (sValue[oResource.getText("Tbtwr").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Tbtwr").replaceAll(" ", "_")].toString();
          //sData.Waers = (sValue[oResource.getText("Waers").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Waers").replaceAll(" ", "_")].toString();
          sData.Ekgrp = (sValue[oResource.getText("Ekgrp").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Ekgrp").replaceAll(" ", "_")].toString();
          sData.Ekorg = (sValue[oResource.getText("Ekorg").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Ekorg").replaceAll(" ", "_")].toString();
          sData.Afnam = (sValue[oResource.getText("Afnam").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Afnam").replaceAll(" ", "_")].toString();
          sData.Matkl = (sValue[oResource.getText("Matkl").replaceAll(" ", "_")] === undefined) ? "" : sValue[oResource.getText("Matkl").replaceAll(" ", "_")].toString();
          return sData;

        },
        saveIndici: async function (sLine) {
            // Controlli

            // Salvataggio - solo Update
            var sUrl = "/T_PMO(IndexPmo='" + sLine.IndexPmo + "')";
            return await this._updateHanaShowError(sUrl, sLine);
        },
        saveAzioni: async function (sLine) {
            // Controlli

            // Salvataggio - Update Insert Spostamento Delete
            var sUrl = "/T_ACT_EL(IndexPmo='" + sLine.IndexPmo + "',Cont='" + sLine.Cont + "')";
            var result = "";
            if (sLine.GestioneLoad === "D" || sLine.GestioneLoad === "S"){
              delete sLine.GestioneLoad;
              result = await this._removeHanaShowError("/T_PMO_S");
            } else {
              delete sLine.GestioneLoad;
              result = await this._saveHanaShowError("/T_PMO_S", sLine);
              if (result !== "") {
                  result = await this._updateHanaShowError(sUrl, sLine);
              }
            }
            return result;
        },
        saveMaterial: async function (sLine) { // Controlli
            sLine.Matnr = sLine.Matnr.padStart(18, "0");


            // Salvataggio - Update o Insert
            var result = await this._saveHanaShowError("/T_PMO_M", sLine);
            if (result !== "") {
                var sUrl = "/T_PMO_M(IndexPmo='" + sLine.IndexPmo + "',Cont='" + sLine.Cont + "',Matnr='" + sLine.Matnr + "',Maktx='" + sLine.Maktx + "')";
                result = await this._updateHanaShowError(sUrl, sLine);
            }
            return result;
        },
        saveServizi: async function (sLine) {
            // Controlli

            // Salvataggio
            var result = await this._saveHanaShowError("/T_PMO_S", sLine);
            if (result !== "") {
                var sUrl = "/T_PMO_S(IndexPmo='" + sLine.IndexPmo + "',Cont='" + sLine.Cont + "',Asnum='" + sLine.Asnum + "',Asktx='" + sLine.Asktx + "')";
                result = await this._updateHanaShowError(sUrl, sLine);
            }
            return result;
        },
        rowMateriali: function (sLine) {
            var sData = {};
            sData[oResource.getText("IndexPmo").replaceAll(" ", "_")] = sLine.IndexPmo;
            sData[oResource.getText("Cont").replaceAll(" ", "_")] = sLine.Cont;
            sData[oResource.getText("Matnr").replaceAll(" ", "_")] = sLine.Matnr;
            sData[oResource.getText("Maktx").replaceAll(" ", "_")] = sLine.Maktx;
            sData[oResource.getText("Menge").replaceAll(" ", "_")] = sLine.Menge;
            sData[oResource.getText("Meins").replaceAll(" ", "_")] = sLine.Meins;
            sData[oResource.getText("Lgort").replaceAll(" ", "_")] = sLine.Lgort;
            sData[oResource.getText("Werks").replaceAll(" ", "_")] = sLine.Werks;
            //sData[oResource.getText("Charg").replaceAll(" ", "_")] = sLine.Charg;
            //sData[oResource.getText("Tbtwr").replaceAll(" ", "_")] = sLine.Tbtwr;
            //sData[oResource.getText("Waers").replaceAll(" ", "_")] = sLine.Waers;
            sData[oResource.getText("Ekgrp").replaceAll(" ", "_")] = sLine.Ekgrp;
            sData[oResource.getText("Ekorg").replaceAll(" ", "_")] = sLine.Ekorg;
            sData[oResource.getText("Afnam").replaceAll(" ", "_")] = sLine.Afnam;
            sData[oResource.getText("Matkl").replaceAll(" ", "_")] = sLine.Matkl;
            return sData;
        },
        rowServizi: function (sLine) {
            var sData = {};
            sData[oResource.getText("IndexPmo").replaceAll(" ", "_")] = sLine.IndexPmo;
            sData[oResource.getText("Cont").replaceAll(" ", "_")] = sLine.Cont;
            sData[oResource.getText("Asnum").replaceAll(" ", "_")] = sLine.Asnum;
            sData[oResource.getText("Asktx").replaceAll(" ", "_")] = sLine.Asktx;
            sData[oResource.getText("Menge").replaceAll(" ", "_")] = sLine.Menge;
            sData[oResource.getText("Meins").replaceAll(" ", "_")] = sLine.Meins;
            //sData[oResource.getText("Tbtwr").replaceAll(" ", "_")] = sLine.Tbtwr;
            //sData[oResource.getText("Waers").replaceAll(" ", "_")] = sLine.Waers;
            sData[oResource.getText("Ekgrp").replaceAll(" ", "_")] = sLine.Ekgrp;
            sData[oResource.getText("Ekorg").replaceAll(" ", "_")] = sLine.Ekorg;
            sData[oResource.getText("Afnam").replaceAll(" ", "_")] = sLine.Afnam;
            sData[oResource.getText("Matkl").replaceAll(" ", "_")] = sLine.Matkl;
            return sData;
        },
        ColumnIndex: function () {
            var sData = [];
            var aColumn = this._oTPC._oPersonalizations.aColumns;
            for (var i = 0; i < aColumn.length; i++) {
                sData.push(aColumn[i].text.replaceAll(" ", "_"));
            }
            return sData;
        },
        ColumnContatore: function () {
            var sData = [];
            var vValue = oResource.getText("IndexPmo").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Cont").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Sistem").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Progres").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Classe").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("DesComponente").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Tplnr").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Equipment").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("ComponentTipo").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("DesBreve").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("IntegTxtEsteso").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("FlagAttivo").replaceAll(" ", "_");
            sData.push(vValue);
            //vValue = oResource.getText("Datum").replaceAll(" ", "_");
            //sData.push(vValue);
            //vValue = oResource.getText("Uname").replaceAll(" ", "_");
            //sData.push(vValue);
            //vValue = oResource.getText("Uzeit").replaceAll(" ", "_");
            //sData.push(vValue);
            vValue = oResource.getText("GestioneLoad").replaceAll(" ", "_");
            sData.push(vValue);
            return sData;
        },
        ColumnMateriali: function () {
            var sData = [];
            var vValue = oResource.getText("IndexPmo").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Cont").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Matnr").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Maktx").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Menge").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Meins").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Lgort").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Werks").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Ekgrp").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Ekorg").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Afnam").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Matkl").replaceAll(" ", "_");
            sData.push(vValue);
            return sData;
        },
        ColumnServizi: function () {
            var sData = [];
            var vValue = oResource.getText("IndexPmo").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Cont").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Asnum").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Asktx").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Menge").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Meins").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Ekgrp").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Ekorg").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Afnam").replaceAll(" ", "_");
            sData.push(vValue);
            vValue = oResource.getText("Matkl").replaceAll(" ", "_");
            sData.push(vValue);
            return sData;
        },
        _createColumnConfig: function () {
            var oCols = this.byId("tbPiani").getColumns().map((c) => {
                var templ = "";
                var typ = EdmType.String;
                var prop = c.getCustomData()[0].getValue();

                if (prop === "InizioVal" || prop === "FineVal" || prop === "UltimaEsecuz" || prop === "Datum" || prop === "DataInizCiclo") {
                    typ = EdmType.Date;
                }
                return {
                    label: c.getHeader().getText(),
                    property: prop,
                    type: typ,
                    format: (value) => {},
                    template: templ
                };
            }) || [];
            return oCols;
        },
        onSuggestSEDE: async function (oEvent) {
            if (oEvent.getParameter("suggestValue").length >= 3) {
                var sTerm = oEvent.getParameter("suggestValue");

                var ListFl = {
                    Language: "IT",
                    GetDetails: "X",
                    N_FunclocList: [],
                    N_FunclocRa: [],
                    N_CategoryRa: []
                };
                if (sTerm != "" && sTerm != null) {
                    ListFl.N_FunclocRa.push({
                        Sign: "I",
                        Option: "CP",
                        Low: sTerm + "*"
                    });
                }

                var allSedi = await this._saveHana("/ListFl", ListFl);
                var sHelp = this.getView().getModel("sHelp").getData();
                sHelp.SedeRealeSingle = allSedi.N_FunclocList.results;
                this.getView().getModel("sHelp").refresh(true);
            }
        },
        onChangeAttivo: async function (oEvent) {
            this.lineSelected = oEvent.getSource().getBindingContext("mPiani").getObject();
            var that = this;
            var Source = oEvent.getSource();
            var aFilters = [];
            aFilters.push(new Filter("IIndexPmo", FilterOperator.EQ, this.lineSelected.IndexPmo));
            var sPiani = await this._getTable("/JoinPMO", aFilters);
            if (sPiani[0].T_ACT_ELSet.results.length > 0) {
                MessageBox.confirm("Confermi l operazione di cambio stato? ", {
                    styleClass: "sapUiSizeCompact",
                    actions: [
                        "Si", sap.m.MessageBox.Action.NO
                    ],
                    emphasizedAction: "Si",
                    initialFocus: sap.m.MessageBox.Action.NO,
                    onClose: function (oAction) {
                        if (oAction === "NO") {
                            Source.setState(! Source.getState());
                        } else if (oAction === "Si") {
                            that.onChangeAttivoConfirm();
                        }
                    }
                });
            } else {
                Source.setState(! Source.getState());
                MessageBox.error("L'indice selezionato non ha Azioni elementari quindi non può essere in stato Attivo");
            }
        },
        onChangeAttivoConfirm: async function () {

            var sIndex = {
                IndexPmo: this.lineSelected.IndexPmo,
                FlagAttivo: ""
            };

            if (this.lineSelected.FlagAttivo) {
                sIndex.FlagAttivo = "X";
            } else {
                sIndex.FlagAttivo = "";
            }

            var sURL = "/T_PMO('" + this.lineSelected.IndexPmo + "')";
            await this._updateHana(sURL, sIndex);

        },
        handleDelete: function () {
            var items = this.getView().byId("tbPiani").getSelectedItems();
            if (items.length > 0) {
                MessageBox.warning(oResource.getText("msgCancella"), {
                    actions: [
                        MessageBox.Action.OK, MessageBox.Action.CANCEL
                    ],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {
                            this.onCancellaData();
                        }
                    }.bind(this)
                });
            } else {
                MessageToast.show("Seleziona una riga");
            }
        },
        onCancellaData: async function () {

            sap.ui.core.BusyIndicator.show();
            var items = this.getView().byId("tbPiani").getSelectedItems();
            if (items.length > 0) {

                for (var j = 0; j < items.length; j++) {

                    var line = items[j].getBindingContext("mPiani").getObject();
                    var aFilters = [];
                    aFilters.push(new Filter("IIndexPmo", FilterOperator.EQ, line.IndexPmo));
                    var sPiani = await this._getTable("/JoinPMO", aFilters);

                    var aAzioni = sPiani[0].T_ACT_ELSet.results;
                    var aMatnr = sPiani[0].T_PMO_MSet.results;
                    var aServizi = sPiani[0].T_PMO_SSet.results;
                    var sURL = "",
                        i = 0;

                    // Righe Rimosse
                    for (i = 0; i < aAzioni.length; i++) {
                        sURL = "/T_ACT_EL(IndexPmo='" + aAzioni[i].IndexPmo + "',Cont='" + aAzioni[i].Cont + "')";
                        await this._removeHana(sURL);
                    }
                    for (i = 0; i < aMatnr.length; i++) {
                        sURL = "/T_PMO_M(IndexPmo='" + aMatnr[i].IndexPmo + "',Cont='" + aMatnr[i].Cont + "',Matnr='" + aMatnr[i].Matnr.padStart(18, "0") + "',Maktx='" + aMatnr[i].Maktx + "')";
                        await this._removeHana(sURL);
                    }
                    for (i = 0; i < aServizi.length; i++) {
                        sURL = "/T_PMO_S(IndexPmo='" + aServizi[i].IndexPmo + "',Cont='" + aServizi[i].Cont + "',Asnum='" + aServizi[i].Asnum + "',Asktx='" + aServizi[i].Asktx + "')";
                        await this._removeHana(sURL);
                    }
                    sURL = "/T_PMO('" + line.IndexPmo + "')";
                    await this._removeHana(sURL);
                }
                MessageBox.success("Indici cancellati con successo");
                this.onSearchFilters();
            } else {
                MessageToast.show("Seleziona una riga");
            } sap.ui.core.BusyIndicator.hide();
        },
        getValueHelp: async function () {
            sap.ui.core.BusyIndicator.show();
            var sData = {};
            var oModelHelp = new sap.ui.model.json.JSONModel();

            sData.IDivisioneu = await this.Shpl("T001W", "CH");
            sData.ICentroLavoro = await this._getTableNoError("/T_DEST");
            sData.ITipoOrdine = await this.Shpl("T003O", "CH");
            sData.ITipoAttivita = await this.Shpl("T353I", "CH");
            sData.IPriorita = await this.Shpl("ZPM4R_D_PRIORITA", "FV");
            sData.IIndisponibilita = await this.Shpl("T357M", "CH");
            sData.IFrequenza = await this.Shpl("T006", "CH");
            sData.ITipoGestione = await this._getTableNoError("/T_TP_MAN");
            sData.ITipoGestione1 = await this._getTableNoError("/T_TP_MAN1");
            sData.ITipoGestione2 = await this._getTableNoError("/T_TP_MAN2");


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
                aFilterSystem = [];

            if (sFilter.IDivisioneu !== undefined) {
                if (sFilter.IDivisioneu.length !== 0) {
                    tempFilter = await this.multiFilterText(sFilter.IDivisioneu, "Werks");
                    aFiltersClass = aFiltersClass.concat(tempFilter);
                    aFilterProgress = aFilterProgress.concat(tempFilter);
                    aFilterSystem = aFilterSystem.concat(tempFilter);
                }
            }
            /*if (sFilter.SISTEMA !== undefined) {
                if (sFilter.SISTEMA.length !== 0) {
                    tempFilter = await this.multiFilterText(sFilter.SISTEMA, "Sistema");
                    aFiltersClass = aFiltersClass.concat(tempFilter);
                    aFilterProgress = aFilterProgress.concat(tempFilter);
                }
            }*/

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
            this.getView().getModel("sHelp").refresh();
            // sap.ui.core.BusyIndicator.hide();
        },
        onTestoEsteso: async function (line) {
            if (line.DesEstesa === "X") {
                var aFilter = [];
                var vNome = "ZI" + line.IndexPmo.padStart(18, "0") + this.formatDate(line.INIZIOVAL) + this.formatDate(line.FINEVAL) + line.Uzeit.replaceAll(":", "");
                aFilter.push(new Filter("Tdname", FilterOperator.EQ, vNome));
                aFilter.push(new Filter("Tdid", FilterOperator.EQ, "ST"));
                aFilter.push(new Filter("Tdspras", FilterOperator.EQ, "I"));
                aFilter.push(new Filter("Tdobject", FilterOperator.EQ, "TEXT"));
                var result = await this._getLinenoError("/TestiEstesi", aFilter);
                if (result === undefined) {
                    return "";
                } else {
                    return result.Testo;
                }
            } else {
                return "";
            }
        },
        handleTestoView: async function (oEvent) {
            this.lineSelected = oEvent.getSource().getBindingContext("mPiani").getObject();

            var DesEstesa = await this.onTestoEsteso(this.lineSelected);
            this.getView().byId("vTextArea").setText(DesEstesa);
            this.byId("popTestoView").open();
        },
        onCloseTestoView: function () {
            this.byId("popTestoView").close();
        },
        onPressIndex: async function (oEvent) {
            var sPiani = oEvent.getSource().getBindingContext("mPiani").getObject();
            sap.ui.getCore().setModel(sPiani, "Piani");
            this.navTo("DetailPage");
        },
        onModify: function () {
            var items = this.getView().byId("tbPiani").getSelectedItems();
            if (items.length === 1) {
                this.navTo("DetailPage", {
                    INDEX: items[0].getBindingContext("mPiani").getObject().IndexPmo.replace(/^0+/, "")
                });
            } else {
                MessageToast.show("Seleziona una riga");
            }
        },
        onCopy: function () {
            var items = this.getView().byId("tbPiani").getSelectedItems();
            if (items.length === 1) {
                this.navTo("DetailPage", {
                    INDEX: items[0].getBindingContext("mPiani").getObject().IndexPmo.replace(/^0+/, ""),
                    COPY: "X"
                });
            } else {
                MessageToast.show("Seleziona una riga");
            }
        },
        onClearFilter: function () {
            this.getView().getModel("sFilter").setData({});
            this.onFilterHelp();
        },
        onSearchFilters: async function () {
            sap.ui.core.BusyIndicator.show();

            var aFilters = [],
                i = 0;
            var sFilter = this.getView().getModel("sFilter").getData();
            var tempFilter = [];

            if (sFilter.IDivisioneu !== undefined) {
                if (sFilter.IDivisioneu.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.IDivisioneu, "IDivisioneu");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            if (sFilter.ICentroLavoro !== undefined) {
                if (sFilter.ICentroLavoro.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.ICentroLavoro, "ICentroLavoro");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            if (sFilter.IDestinatario !== undefined) {
                if (sFilter.IDestinatario.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.IDestinatario, "IDestinatario");
                    aFilters = aFilters.concat(tempFilter);
                }
            }

            if (sFilter.ISistema !== undefined) {
                if (sFilter.ISistema.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.ISistema, "ISistema");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            if (sFilter.IClasse !== undefined) {
                if (sFilter.IClasse.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.IClasse, "IClasse");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            if (sFilter.IProgres !== undefined) {
                if (sFilter.IProgres.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.IProgres, "IProgres");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            if (sFilter.ISistemActEl !== undefined) {
                if (sFilter.ISistemActEl.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.ISistemActEl, "ISistemActEl");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            if (sFilter.IClasseActEl !== undefined) {
                if (sFilter.IClasseActEl.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.IClasseActEl, "IClasseActEl");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            if (sFilter.IProgressActEl !== undefined) {
                if (sFilter.IProgressActEl.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.IProgressActEl, "IProgressActEl");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            if (sFilter.IEquipmentCompo !== undefined && sFilter.IEquipmentCompo !== "") {
                aFilters.push(new Filter("IEquipmentCompo", FilterOperator.EQ, sFilter.IEquipmentCompo));
            }
            if (sFilter.IEquipmentActEl !== undefined && sFilter.IEquipmentActEl !== "") {
                aFilters.push(new Filter("IEquipmentActEl", FilterOperator.EQ, sFilter.IEquipmentActEl));
            }
            if (sFilter.IComponentTipoActEl !== undefined && sFilter.IComponentTipoActEl !== "") {
                aFilters.push(new Filter("IComponentTipoActEl", FilterOperator.CP, sFilter.IComponentTipoActEl));
            }

            if (sFilter.IPriorita !== undefined) {
                if (sFilter.IPriorita.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.IPriorita, "IPriorita");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            if (sFilter.IIndisponibilita !== undefined) {
                if (sFilter.IIndisponibilita.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.IIndisponibilita, "IIndisponibilita");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            var aSelIndici = "",
                aSelInd = [];

            if (this.getView().byId("inIndex").getTokens().length > 0) {
                aSelIndici = this.getView().byId("inIndex").getTokens();
                aSelInd = [];
                for (i = 0; i < aSelIndici.length; i++) {
                    aSelInd.push(aSelIndici[i].getProperty("key"));
                }
                tempFilter = this.multiFilterText(aSelInd, "IIndexPmo");
                aFilters = aFilters.concat(tempFilter);

            }
            if (this.getView().byId("IContActEl").getTokens().length > 0) {
                aSelIndici = this.getView().byId("IContActEl").getTokens();
                aSelInd = [];
                for (i = 0; i < aSelIndici.length; i++) {
                    aSelInd.push(aSelIndici[i].getProperty("key"));
                }
                tempFilter = this.multiFilterText(aSelInd, "IContActEl");
                aFilters = aFilters.concat(tempFilter);

            }


            if (sFilter.ITipoOrdine !== undefined) {
                if (sFilter.ITipoOrdine.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.ITipoOrdine, "ITipoOrdine");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            if (sFilter.ITipoAttivita !== undefined) {
                if (sFilter.ITipoAttivita.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.ITipoAttivita, "ITipoAttivita");
                    aFilters = aFilters.concat(tempFilter);
                }
            }
            if (sFilter.IFrequenza !== undefined) {
                if (sFilter.IFrequenza.length !== 0) {
                    tempFilter = this.multiFilterText(sFilter.IFrequenza, "IFrequenza");
                    aFilters = aFilters.concat(tempFilter);
                }
            }

            if (sFilter.IDurataCiclo !== undefined && sFilter.IDurataCiclo !== "") {
                aFilters.push(new Filter("IDurataCiclo", FilterOperator.EQ, sFilter.IDurataCiclo));
            }
            if (sFilter.ITipoPmo !== undefined && sFilter.ITipoPmo !== "") {
                aFilters.push(new Filter("ITipoPmo", FilterOperator.EQ, sFilter.ITipoPmo));
            }
            if (sFilter.IDesBreve !== undefined && sFilter.IDesBreve !== "") {
                aFilters.push(new Filter("IDesBreve", "CP", sFilter.IDesBreve));
            }
            if (sFilter.IAzione !== undefined && sFilter.IAzione !== "") {
                aFilters.push(new Filter("IAzione", "CP", sFilter.IAzione));
            }
            if (sFilter.IDesComponenteActEl !== undefined && sFilter.IDesComponenteActEl !== "") {
                aFilters.push(new Filter("IDesComponenteActEl", "CP", sFilter.IDesComponenteActEl));
            }

            /*if (sFilter.Collective !== undefined && sFilter.Collective !== "") {
                    aFilters.push(new Filter("Collective", FilterOperator.EQ, sFilter.Collective));
                }*/
            var vValue = "";
            // if (sFilter.IFlagAttivo !== undefined && sFilter.IFlagAttivo !== "") {
            vValue = sFilter.IFlagAttivo;
            if (vValue === "X") {
                vValue = "";
            } else {
                vValue = "X";
            } aFilters.push(new Filter("IFlagAttivo", FilterOperator.EQ, vValue));
            // }
            if (sFilter.ICriticita !== undefined && sFilter.ICriticita !== "") {
                vValue = sFilter.ICriticita;
                if (vValue === "0") {
                    vValue = "";
                }
                aFilters.push(new Filter("ICriticita", FilterOperator.EQ, vValue));
            }
            if (sFilter.IDeterminanza !== undefined && sFilter.IDeterminanza !== "") {
                vValue = sFilter.IDeterminanza;
                if (vValue === "0") {
                    vValue = "";
                }
                aFilters.push(new Filter("IDeterminanza", FilterOperator.EQ, vValue));
            }
            if (sFilter.IDifferibile !== undefined && sFilter.IDifferibile !== "") {
                vValue = sFilter.IDifferibile;
                if (vValue === "0") {
                    vValue = "";
                }
                aFilters.push(new Filter("IDifferibile", FilterOperator.EQ, vValue));
            }

            var aIndici = [];
            oPiani = new sap.ui.model.json.JSONModel();
            oPiani.setData(aIndici);
            this.getView().setModel(oPiani, "mPiani");

            var sPiani = await this._getTable("/JoinPMO", aFilters);

            var sIndex = sPiani[0].T_PMOSet.results;
            var sAzioni = sPiani[0].T_ACT_ELSet.results;

            for (i = 0; i < sIndex.length; i++) {

                sIndex[i].Esteso = (sIndex[i].IntegTxtEsteso === "X") ? true : false;
                sIndex[i].Uzeit = this.formatUzeit(sIndex[i].Uzeit.ms);
                if (sIndex[i].FlagAttivo === "X") {
                    sIndex[i].FlagAttivo = true;
                } else {
                    sIndex[i].FlagAttivo = false;
                }
            }
            if (sFilter.IFlagAttivo === "X") {
                aIndici = sIndex;
            } else {
                for (i = 0; i < sIndex.length; i++) {
                    var trovato = false;
                    for (var j = 0; j < sAzioni.length; j++) {
                        if (sIndex[i].IndexPmo === sAzioni[j].IndexPmo) {
                            trovato = true;
                            break;
                        }
                    }
                    if (trovato) {
                        aIndici.push(sIndex[i]);
                    }
                }
            }
            var oPiani = new sap.ui.model.json.JSONModel();
            oPiani.setData(aIndici);
            this.getView().setModel(oPiani, "mPiani");

            var oAzioni = new sap.ui.model.json.JSONModel();
            oAzioni.setData(sPiani[0].T_ACT_ELSet.results);
            this.getView().setModel(oAzioni, "mAzioni");

            var oMatnr = new sap.ui.model.json.JSONModel();
            oMatnr.setData(sPiani[0].T_PMO_MSet.results);
            this.getView().setModel(oMatnr, "mMatnr");

            var oServizi = new sap.ui.model.json.JSONModel();
            oServizi.setData(sPiani[0].T_PMO_SSet.results);
            this.getView().setModel(oServizi, "mServizi");

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
                sHelp.EQUIPMENT = await this.Shpl("ZPM4R_SH_EQUI", "SH", aFilter);
                this.getView().getModel("sHelp").refresh(true);
            }
        },
        onUpload: function (e) {
            this._import(e.getParameter("files") && e.getParameter("files")[0]);
        },
        _import: function (file) {
            var oResource = this.getResourceBundle();
            var that = this;
            var oMainModel = new sap.ui.model.json.JSONModel();
            var oMainModel1 = new sap.ui.model.json.JSONModel();
            var oMainModel2 = new sap.ui.model.json.JSONModel();
            var oMainModel3 = new sap.ui.model.json.JSONModel();
            this.getView().setModel(oMainModel, "uploadIndici");
            this.getView().setModel(oMainModel1, "uploadAzioni");
            this.getView().setModel(oMainModel2, "uploadMaterial");
            this.getView().setModel(oMainModel3, "uploadServizi");
            var excelData = {};
            if (file && window.FileReader) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {type: 'binary'});
                    workbook.SheetNames.forEach(function (sheetName) { // Here is your object for every sheet in workbook
                        excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                        if (excelData.length > 0) {
                            switch (sheetName) {
                                case oResource.getText("IndiciExcel"): that.getView().getModel("uploadIndici").setData(excelData);
                                    that.getView().getModel("uploadIndici").refresh(true);
                                    break;
                                case oResource.getText("AzioniExcel"): that.getView().getModel("uploadAzioni").setData(excelData);
                                    that.getView().getModel("uploadAzioni").refresh(true);
                                    break;
                                case oResource.getText("MaterialiExcel"): that.getView().getModel("uploadMaterial").setData(excelData);
                                    that.getView().getModel("uploadMaterial").refresh(true);
                                    break;
                                case oResource.getText("ServiziExcel"): that.getView().getModel("uploadServizi").setData(excelData);
                                    that.getView().getModel("uploadServizi").refresh(true);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                };
                reader.onerror = function (ex) {
                    console.log(ex);
                };
                reader.readAsBinaryString(file);
            }
        },
        onSuggestPoint: async function (oEvent) {
            var sTerm = oEvent.getParameter("suggestValue");
            if (sTerm.length >= 3) {
                var aFilter = [];
                aFilter.push({
                    "Shlpname": "ZPM4R_SH_IMPM",
                    "Shlpfield": "POINT",
                    "Sign": "I",
                    "Option": "CP",
                    "Low": oEvent.getParameter("suggestValue") + "*"
                });
                var sHelp = this.getView().getModel("sHelp").getData();
                sHelp.POINT = await this.Shpl("ZPM4R_SH_IMPM", "SH", aFilter);
                this.getView().getModel("sHelp").refresh(true);
            }
        }

    });
});
