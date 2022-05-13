sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "PM030/APP3/model/formatter",
    "sap/m/MessageBox",
    "sap/ui/model/Sorter",
    "PM030/APP3/util/LocalFormatter",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/core/Fragment',
    "PM030/APP3/util/underscore-min",
],
/**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   * @param {typeof sap.ui.core.routing.History} History
   * @param {typeof sap.ui.core.UIComponent} UIComponent
   */
    function (Controller, History, UIComponent, formatter, MessageBox, Sorter, LocalFormatter, Filter, FilterOperator, Fragment, underscore) {
    "use strict";

    return Controller.extend("PM030.APP3.controller.BaseController", {
        formatter: formatter,
        LocalFormatter: LocalFormatter,
        underscore: underscore,
        /**
             * Convenience method for getting the view model by name in every controller of the application.
             * @public
             * @param {string} sName the model name
             * @returns {sap.ui.model.Model} the model instance
             */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        /**
             * Convenience method for setting the view model in every controller of the application.
             * @public
             * @param {sap.ui.model.Model} oModel the model instance
             * @param {string} sName the model name
             * @returns {sap.ui.mvc.View} the view instance
             */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
             * Convenience method for getting the resource bundle.
             * @public
             * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
             */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
             * Method for navigation to specific view
             * @public
             * @param {string} psTarget Parameter containing the string for the target navigation
             * @param {Object.<string, string>} pmParameters? Parameters for navigation
             * @param {boolean} pbReplace? Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
             */
        navTo: function (psTarget, pmParameters, pbReplace) {
            this.getRouter().navTo(psTarget, pmParameters, pbReplace);
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onNavBack: function () {
            var sPreviousHash = History.getInstance().getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.back();
            } else {
                this.getRouter().navTo("appHome", {}, true /*no history*/
                );
            }
        },
        handlePopoverPress: function (oEvent) {
            var oButton = oEvent.getSource(),
                oView = this.getView();
            // this.byId("").openBy(oButton);Fragment

            // create popover
            if (!this._pPopover) {
                this._pPopover = Fragment.load({id: oView.getId(), name: "PM030.APP3.fragment.popInfoSede", controller: this}).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    return oPopover;
                });
            }
            this._pPopover.then(function (oPopover) {
                oPopover.openBy(oButton);
            });


        },
        onFilterSedeTecnica: async function () {
            var sSedeTecnica = this.getView().getModel("sSedeTecnica").getData();

            var aFilter = [],
                oFilter = {},
                sData = [];

            aFilter.push(new Filter("LANGUAGE", FilterOperator.EQ, "IT")); // fisso IT - todo
            if (sSedeTecnica.SEDE_TECNICA != "" && sSedeTecnica.SEDE_TECNICA != null) {
                aFilter.push(new Filter("SEDE_TECNICA", FilterOperator.EQ, sSedeTecnica.SEDE_TECNICA));
            }
            if (sSedeTecnica.LIVELLO1 != "" && sSedeTecnica.LIVELLO1 != null) {
                aFilter.push(new Filter("LIVELLO1", FilterOperator.EQ, sSedeTecnica.LIVELLO1));
            }
            if (sSedeTecnica.LIVELLO2 != "" && sSedeTecnica.LIVELLO2 != null) {
                aFilter.push(new Filter("LIVELLO2", FilterOperator.EQ, sSedeTecnica.LIVELLO2));
            }
            if (sSedeTecnica.LIVELLO3 != "" && sSedeTecnica.LIVELLO3 != null) {
                aFilter.push(this.filterLivello3(sSedeTecnica.LIVELLO3));
            }
            if (sSedeTecnica.LIVELLO4 != "" && sSedeTecnica.LIVELLO4 != null) {
                aFilter.push(this.filterLivello4(sSedeTecnica.LIVELLO4));
            }
            if (sSedeTecnica.LIVELLO5 != "" && sSedeTecnica.LIVELLO5 != null) {
                aFilter.push(this.filterLivello5(sSedeTecnica.LIVELLO5));
            }
            if (sSedeTecnica.LIVELLO6 != "" && sSedeTecnica.LIVELLO6 != null) {
                aFilter.push(this.filterLivello6(sSedeTecnica.LIVELLO6));
            }
            var oModel = new sap.ui.model.json.JSONModel();
            sData = await this._getTableDistinct("/SedeDistinct", aFilter, "SEDE_TECNICA");
            oModel.setData(sData);
            this.getView().setModel(oModel, "SedeTecnica");
            
            var oModel1 = new sap.ui.model.json.JSONModel();
            sData = await this._getTableDistinct("/SedeDistinct", aFilter, "LIVELLO1");
            oModel1.setData(sData);
            this.getView().setModel(oModel1, "Livello1");

            var oModel2 = new sap.ui.model.json.JSONModel();
            sData = await this._getTableDistinct("/SedeDistinct", aFilter, "LIVELLO2");
            oModel2.setData(sData);
            this.getView().setModel(oModel2, "Livello2");

            var oModel3 = new sap.ui.model.json.JSONModel();
            sData = await this._getTableDistinct("/SedeDistinct", aFilter, "LIVELLO3");
            oModel3.setData(sData);
            this.getView().setModel(oModel3, "Livello3");

            var oModel4 = new sap.ui.model.json.JSONModel();
            sData = await this._getTableDistinct("/SedeDistinct", aFilter, "LIVELLO4");
            oModel4.setData(sData);
            this.getView().setModel(oModel4, "Livello4");

            var oModel5 = new sap.ui.model.json.JSONModel();
            sData = await this._getTableDistinct("/SedeDistinct", aFilter, "LIVELLO5");
            oModel5.setData(sData);
            this.getView().setModel(oModel5, "Livello5");

            var oModel6 = new sap.ui.model.json.JSONModel();
            sData = await this._getTableDistinct("/SedeDistinct", aFilter, "LIVELLO6");
            oModel6.setData(sData);
            this.getView().setModel(oModel6, "Livello6");

            // Da sostituire con lingua utente - todo
            oFilter = new Filter("LANGUAGE", FilterOperator.Contains, "IT");
            aFilter.push(oFilter);

            var oBinding = this.byId("tSedeTecnica").getBinding("items");
            oBinding.filter(aFilter);

        },
        onResetSedeTecnica: function () {
            var oModel = new sap.ui.model.json.JSONModel();
            var sData = {
                SEDE_TECNICA: "",
                LIVELLO1: "",
                LIVELLO2: "",
                LIVELLO3: "",
                LIVELLO4: "",
                LIVELLO5: "",
                LIVELLO6: ""
            };
            oModel.setData(sData);
            this.getView().setModel(oModel, "sSedeTecnica");
            this.onFilterSedeTecnica();
        },
        filterLivello3: function (LIVELLO3) {

            var value = "";
            if (LIVELLO3 === null || LIVELLO3 === undefined || LIVELLO3 === "") {
                return new Filter("LIVELLO3", FilterOperator.EQ, "");
            } else {

                var fLIVELLO3 = [];

                fLIVELLO3.push(new Filter("LIVELLO3", FilterOperator.EQ, LIVELLO3)); // ++
                value = LIVELLO3[0] + "x";
                fLIVELLO3.push(new Filter("LIVELLO3", FilterOperator.EQ, value));
                // +x

                // 2 -> numero
                if (!isNaN(Number(LIVELLO3[1]))) {
                    value = LIVELLO3[0] + "n";
                    fLIVELLO3.push(new Filter("LIVELLO3", FilterOperator.EQ, value)); // +n
                    fLIVELLO3.push(new Filter("LIVELLO3", FilterOperator.EQ, "xn")); // xn
                }

                // 1 -> alfabetico
                if (isNaN(Number(LIVELLO3[0]))) {
                    fLIVELLO3.push(new Filter("LIVELLO3", FilterOperator.EQ, "kx")); // kx
                }fLIVELLO3 = new sap.ui.model.Filter({filters: fLIVELLO3, and: false});
                return fLIVELLO3;
            }

        },
        filterLivello4: function (LIVELLO4) {

            var value = "";
            if (LIVELLO4 === null || LIVELLO4 === undefined || LIVELLO4 === "") {
                return new Filter("LIVELLO4", FilterOperator.EQ, "");
            } else {

                var fLIVELLO4 = [];

                fLIVELLO4.push(new Filter("LIVELLO4", FilterOperator.EQ, LIVELLO4)); // ++
                if (LIVELLO4.length === 3) {
                    value = LIVELLO4[0] + LIVELLO4[1] + "x";
                    fLIVELLO4.push(new Filter("LIVELLO4", FilterOperator.EQ, value)); // ++x
                }
                // -> numero
                if (!isNaN(Number(LIVELLO4))) {
                    fLIVELLO4.push(new Filter("LIVELLO4", FilterOperator.EQ, "nnn")); // nnn
                    fLIVELLO4.push(new Filter("LIVELLO4", FilterOperator.EQ, "nn")); // nn
                }

                // 1 -> numero
                if (!isNaN(Number(LIVELLO4[0])) && LIVELLO4.length === 2) {
                    value = "n" + LIVELLO4[1];
                    fLIVELLO4.push(new Filter("LIVELLO4", FilterOperator.EQ, value)); // n+
                }

                // 2 -> numero
                if (!isNaN(Number(LIVELLO4[1])) && LIVELLO4.length === 2) {
                    value = LIVELLO4[0] + "n";
                    fLIVELLO4.push(new Filter("LIVELLO4", FilterOperator.EQ, value)); // +n
                }

                // 1 -> alfabetico
                if (isNaN(Number(LIVELLO4[0])) && LIVELLO4.length === 2) {
                    value = "k" + LIVELLO4[1];
                    fLIVELLO4.push(new Filter("LIVELLO4", FilterOperator.EQ, value));
                    // k+
                    // 1 -> alfabetico 2 -> numero
                    if (!isNaN(Number(LIVELLO4[1]))) {
                        fLIVELLO4.push(new Filter("LIVELLO4", FilterOperator.EQ, "kn")); // kn
                    }
                }

                fLIVELLO4 = new sap.ui.model.Filter({filters: fLIVELLO4, and: false});
                return fLIVELLO4;
            }
        },
        filterLivello5: function (LIVELLO5) {

            var value = "";
            if (LIVELLO5 === null || LIVELLO5 === undefined || LIVELLO5 === "") {
                return new Filter("LIVELLO5", FilterOperator.EQ, "");
            } else {

                var fLIVELLO5 = [];

                fLIVELLO5.push(new Filter("LIVELLO5", FilterOperator.EQ, LIVELLO5)); // +++
                fLIVELLO5.push(new Filter("LIVELLO5", FilterOperator.EQ, "xx"));
                // xx

                // if numero
                if (!isNaN(Number(LIVELLO5))) { //
                    fLIVELLO5.push(new Filter("LIVELLO5", FilterOperator.EQ, "nn")); // nn
                }

                // 2 -> numero
                if (!isNaN(Number(LIVELLO5[1])) && LIVELLO5.length === 2) {
                    value = LIVELLO5[0] + "n";
                    fLIVELLO5.push(new Filter("LIVELLO5", FilterOperator.EQ, value)); // +n
                }


                // 2 -> alfabetico
                if (isNaN(Number(LIVELLO5[1])) && LIVELLO5.length === 2) {
                    value = LIVELLO5[0] + "k";
                    fLIVELLO5.push(new Filter("LIVELLO5", FilterOperator.EQ, value)); // +k
                }fLIVELLO5 = new sap.ui.model.Filter({filters: fLIVELLO5, and: false});
                return fLIVELLO5;
            }

        },
        filterLivello6: function (LIVELLO6) {

            var value = "";
            if (LIVELLO6 === null || LIVELLO6 === undefined || LIVELLO6 === "") {
                return new Filter("LIVELLO6", FilterOperator.EQ, "");
            } else {

                var fLIVELLO6 = [];

                fLIVELLO6.push(new Filter("LIVELLO6", FilterOperator.EQ, LIVELLO6)); // ++
                value = LIVELLO6[0] + "x";
                fLIVELLO6.push(new Filter("LIVELLO6", FilterOperator.EQ, value));
                // +x

                // -> numero
                if (!isNaN(Number(LIVELLO6))) {
                    fLIVELLO6.push(new Filter("LIVELLO6", FilterOperator.EQ, "nn")); // nn
                }

                // 2 -> numero
                if (!isNaN(Number(LIVELLO6[1]))) {
                    value = LIVELLO6[0] + "n";
                    fLIVELLO6.push(new Filter("LIVELLO6", FilterOperator.EQ, value)); // +n
                }fLIVELLO6 = new sap.ui.model.Filter({filters: fLIVELLO6, and: false});
                return fLIVELLO6;

            }
        },
        checkSede: async function (sel) {
            // control Sede Tecnica da lvl 3 a lvl 6
            // n = Numero - k = Alfabetico - x = Alfanumerico
            var aFilter = [];
            aFilter.push(new Filter("SEDE_TECNICA", FilterOperator.EQ, sel.SEDE_TECNICA));
            aFilter.push(new Filter("LIVELLO1", FilterOperator.EQ, sel.LIVELLO1));
            aFilter.push(new Filter("LIVELLO2", FilterOperator.EQ, sel.LIVELLO2));

            aFilter.push(this.filterLivello3(sel.LIVELLO3));
            aFilter.push(this.filterLivello4(sel.LIVELLO4));
            aFilter.push(this.filterLivello5(sel.LIVELLO5));
            aFilter.push(this.filterLivello6(sel.LIVELLO6));

            aFilter.push(new Filter("LANGUAGE", FilterOperator.EQ, "IT")); // fisso IT - todo

            var result = await this._getLine("/Sede", aFilter);
            if (result.SEDE_TECNICA !== undefined) {
                return true;
            } else {
                return false;
            }
        },
        _initIndexReal: function () {
            var sIndexReal = {
                Divisioneu: "",
                FineVal: "",
                IndexPmo: "",
                InizioVal: "",
                Uzeit: "",
                Appuntam: "",
                Azione: "",
                Banfn: "",
                Cdl: "",
                Cdl1: "",
                Cdl2: "",
                Cdl3: "",
                Cdl4: "",
                Cdl5: "",
                CentroLavoro: "",
                Ciclo: "",
                Classe: "",
                CodAzione: "",
                Collective: "",
                Criticita: "",
                DataInizCiclo: "",
                Datum: "",
                Daune: "",
                DayAdv: "",
                DesBreve: "",
                DesComponente: "",
                DesEstesa: "",
                Destinatario: "",
                Determinanza: "",
                Differibile: "",
                Divisionec: "",
                DurataCiclo: "",
                EquipmentCompo: "",
                EquipmentOdm: "",
                FineCard: "",
                FlagAttivo: "",
                FlagInterc: "",
                FlagMateriali: "",
                FlagOdm: "",
                FlagPrestazioni: "",
                FlgMail: "",
                Frequenza: "",
                Hper: "",
                Hper1: "",
                Hper2: "",
                Hper3: "",
                Hper4: "",
                Hper5: "",
                Indisponibilita: "",
                IntegTxtEsteso: "",
                Lstar: "",
                Lstar1: "",
                Lstar2: "",
                Lstar3: "",
                Lstar4: "",
                Lstar5: "",
                Num: "",
                Num1: "",
                Num2: "",
                Num3: "",
                Num4: "",
                Num5: "",
                Percorso: "",
                Persone: "",
                Persone1: "",
                Persone2: "",
                Persone3: "",
                Persone4: "",
                Persone5: "",
                Point: "",
                Priorita: "",
                Progres: "",
                Scostamento: "",
                SedeTecOdm: "",
                Sistema: "",
                StComponente: "",
                Steus: "",
                Steus1: "",
                Steus2: "",
                Steus3: "",
                Steus4: "",
                Steus5: "",
                TipoAggr: "",
                TipoAttivita: "",
                TipoGestione: "",
                TipoGestione1: "",
                TipoGestione2: "",
                TipoOrdine: "",
                TipoPmo: "",
                Toth: "",
                Toth1: "",
                Toth2: "",
                Toth3: "",
                Toth4: "",
                Toth5: "",
                TxtCiclo: "",
                UltimaEsecuz: "",
                Uname: "",
                UnitaCiclo: ""
            };
            return sIndexReal;
        },
        _initAzioneReal: function () {
            var sAzioneReal = {
                IndexPmo: "",
                Cont: "",
                Sistem: "",
                Progres: "",
                Classe: "",
                DesComponente: "",
                Tplnr: "",
                Equipment: "",
                ComponentTipo: "",
                DesBreve: "",
                IntegTxtEsteso: "",
                FlagAttivo: "",
                Datum: "",
                Uname: "",
                Uzeit: ""
            };
            return sAzioneReal;
        },
        _initMaterialReal: function () {
            var sMaterialReal = {
                IndexPmo: "",
                Cont: "",
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
            return sMaterialReal;
        },
        _initServiceReal: function () {
            var sServiceReal = {
                IndexPmo: "",
                Cont: "",
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
            return sServiceReal;
        },
        _saveHana: function (URL, sData) {
            var xsoDataModelReport = this.getView().getModel();
            return new Promise(function (resolve, reject) {
                xsoDataModelReport.create(URL, sData, {
                    success: function (oDataIn) {
                        resolve(oDataIn);
                    },
                    error: function (err) {
                        var responseObject = JSON.parse(err.responseText);
                        reject(MessageBox.error(responseObject.error.message.value));
                    }
                });
            });
        },
        _saveHanaNoError: function (URL, sData) {
            var xsoDataModelReport = this.getView().getModel();
            return new Promise(function (resolve, reject) {
                xsoDataModelReport.create(URL, sData, {
                    success: function (oDataIn) {
                        resolve(oDataIn);
                    },
                    error: function (err) {
                        var responseObject = JSON.parse(err.responseText);
                        resolve(responseObject.error.code);
                    }
                });
            });
        },
        _updateHanaNoError: function (sURL, oEntry) {
            var xsoDataModelReport = this.getOwnerComponent().getModel();
            return new Promise(function (resolve, reject) {
                xsoDataModelReport.update(sURL, oEntry, {
                    success: function (oDataIn) {
                        resolve(oDataIn);
                    },
                    error: function (err) {
                        var responseObject = JSON.parse(err.responseText);
                        resolve(responseObject.error.code);
                    }
                });
            });
        },
        _updateHana: function (sURL, oEntry) {
            var xsoDataModelReport = this.getOwnerComponent().getModel();
            return new Promise(function (resolve, reject) {
                xsoDataModelReport.update(sURL, oEntry, {
                    success: function (oDataIn) {
                        resolve(oDataIn);
                    },
                    error: function (err) {
                        var responseObject = JSON.parse(err.responseText);
                        reject(MessageBox.error(responseObject.error.message.value));
                    }
                });
            });
        },
        _removeHana: function (URL) {
            var xsoDataModelReport = this.getView().getModel();
            return new Promise(function (resolve) {
                xsoDataModelReport.remove(URL, {
                    success: function () {
                        resolve();
                    },
                    error: function () {
                        resolve();
                    }
                });
            });
        },
        _getLastItemData: function (Entity, Filters, SortBy) {
            var xsoDataModelReport = this.getView().getModel();
            return new Promise(function (resolve, reject) {
                xsoDataModelReport.read(Entity, {
                    filters: Filters,
                    sorters: [new Sorter(SortBy, true)],
                    urlParameters: {
                        "$select": SortBy,
                        "$top": 1
                    },
                    success: function (oDataIn) {
                        if (oDataIn.results[0] !== undefined) {
                            if (oDataIn.results[0][SortBy] === null) {
                                resolve(0);
                            } else {
                                resolve(oDataIn.results[0][SortBy]);
                            }
                        } else {
                            resolve(0);
                        }
                    },
                    error: function (err) {
                        var responseObject = JSON.parse(err.responseText);
                        reject(MessageBox.error(responseObject.error.message.value))
                    }
                });
            });
        },
        _getTableIndexAzioni: function (Entity, Filters) {
            var xsoDataModelReport = this.getView().getModel();
            return new Promise(function (resolve, reject) {
                xsoDataModelReport.read(Entity, {
                    filters: Filters,
                    sorters: [
                        new Sorter("INDEX", true),
                        new Sorter("CONTATORE", true)
                    ],
                    success: function (oDataIn) {
                        if (oDataIn.results !== undefined) {
                            resolve(oDataIn.results);
                        } else {
                            resolve(oDataIn);
                        }
                    },
                    error: function (err) {
                        var responseObject = JSON.parse(err.responseText);
                        reject(MessageBox.error(responseObject.error.message.value))
                    }
                });
            });
        },
        _getLine: function (Entity, Filters) {
            var xsoDataModelReport = this.getView().getModel();
            return new Promise(function (resolve, reject) {
                xsoDataModelReport.read(Entity, {
                    filters: Filters,
                    urlParameters: {
                        "$top": 1
                    },
                    success: function (oDataIn) {
                        if (oDataIn.results[0] !== undefined) {
                            resolve(oDataIn.results[0]);
                        } else {
                            resolve(oDataIn);
                        }
                    },
                    error: function (err) {
                        var responseObject = JSON.parse(err.responseText);
                        reject(MessageBox.error(responseObject.error.message.value))
                    }
                });
            });
        },
        _getTable: function (Entity, Filters) {
            var xsoDataModelReport = this.getView().getModel();
            return new Promise(function (resolve, reject) {
                xsoDataModelReport.read(Entity, {
                    filters: Filters,
                    success: function (oDataIn) {
                        if (oDataIn.results !== undefined) {
                            resolve(oDataIn.results);
                        } else {
                            resolve(oDataIn);
                        }
                    },
                    error: function (err) {
                        var responseObject = JSON.parse(err.responseText);
                        reject(MessageBox.error(responseObject.error.message.value));
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            });
        },
        _getTableNoError: function (Entity, Filters) {
          var xsoDataModelReport = this.getView().getModel();
          return new Promise(function (resolve, reject) {
              xsoDataModelReport.read(Entity, {
                  filters: Filters,
                  success: function (oDataIn) {
                      if (oDataIn.results !== undefined) {
                          resolve(oDataIn.results);
                      } else {
                          resolve(oDataIn);
                      }
                  },
                  error: function (err) {
                    resolve([]);
                  }
              });
          });
      },
        _getTableDistinct: function (Entity, Filters, Columns) {
            var xsoDataModelReport = this.getView().getModel();
            return new Promise(function (resolve) {
                xsoDataModelReport.read(Entity, {
                    filters: Filters,
                    urlParameters: {
                        "$select": Columns
                    },
                    success: function (oDataIn) {
                        resolve(oDataIn.results);
                    },
                    error: function () {
                        resolve();
                    }
                });
            });
        }
    });
});
