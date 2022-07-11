sap.ui.define(['jquery.sap.global'], function (jQuery) {
    "use strict";
    var oResource;
    oResource = new sap.ui.model.resource.ResourceModel({bundleName: "PM030.APP3.i18n.i18n"}).getResourceBundle();

    var PisteTableHome = {
        oData: {
            _persoSchemaVersion: "1.0", 
            aColumns: [
              {id: "Piani-tbPiani-Rcol1", order: 0, text: oResource.getText("INDEX"), visible: true},
              {id: "Piani-tbPiani-Rcol3", order: 1, text: oResource.getText("ATTIVO"), visible: true},
              {id: "Piani-tbPiani-Rcol2", order: 2, text: oResource.getText("CONTATORE"), visible: true},
              {id: "Piani-tbPiani-Rcol104", order: 3, text: oResource.getText("MATNR"), visible: true},
              {id: "Piani-tbPiani-Rcol105", order: 4, text: oResource.getText("ASNUM"), visible: true},
              {id: "Piani-tbPiani-Rcol5", order: 5, text: oResource.getText("SISTEMA"), visible: true},
              {id: "Piani-tbPiani-Rcol8", order: 6, text: oResource.getText("CLASSE"), visible: true},
              {id: "Piani-tbPiani-Rcol6", order: 7, text: oResource.getText("PROGRES"), visible: true},
              {id: "Piani-tbPiani-Rcol7", order: 8, text: oResource.getText("DESC_PROG"), visible: true},
              {id: "Piani-tbPiani-Rcol10", order: 9, text: oResource.getText("DIVISIONE"), visible: true},
              {id: "Piani-tbPiani-Rcol20", order: 10, text: oResource.getText("SEDE_TECNICA"), visible: true},
              {id: "Piani-tbPiani-Rcol21", order: 11, text: oResource.getText("SEDE_TECNICA_P"), visible: true},
              {id: "Piani-tbPiani-Rcol22", order: 12, text: oResource.getText("SEDE_ECC"), visible: true},
              {id: "Piani-tbPiani-Rcol27", order: 13, text: oResource.getText("DESC_SEDE"), visible: true},
              {id: "Piani-tbPiani-Rcol30", order: 20, text: oResource.getText("CLASSE_SEDE"), visible: true},
              {id: "Piani-tbPiani-Rcol31", order: 21, text: oResource.getText("CARATT_SEDE"), visible: true},
              {id: "Piani-tbPiani-Rcol35", order: 22, text: oResource.getText("VALORE"), visible: true},
              {id: "Piani-tbPiani-Rcol32", order: 23, text: oResource.getText("OGGETTO_TECNICO"), visible: true},
              {id: "Piani-tbPiani-Rcol33", order: 24, text: oResource.getText("PROFILO"), visible: true},
              {id: "Piani-tbPiani-Rcol34", order: 25, text: oResource.getText("ZBAU"), visible: true},
              {id: "Piani-tbPiani-Rcol28", order: 26, text: oResource.getText("EQUIPMENT"), visible: true},
              {id: "Piani-tbPiani-Rcol9", order: 27, text: oResource.getText("DES_COMPONENTE"), visible: true},

              {id: "Piani-tbPiani-Rcol106", order: 28, text: oResource.getText("COLLECTIVE"), visible: true},
              {id: "Piani-tbPiani-Rcol107", order: 29, text: oResource.getText("PERCORSO"), visible: true},
              {id: "Piani-tbPiani-Rcol108", order: 32, text: oResource.getText("FINEVAL"), visible: true},
              {id: "Piani-tbPiani-Rcol109", order: 31, text: oResource.getText("INIZIOVAL"), visible: true},
              {id: "Piani-tbPiani-Rcol110", order: 33, text: oResource.getText("DESTINATARIO"), visible: true},

              
              {id: "Piani-tbPiani-Rcol37", order: 41, text: oResource.getText("STRATEGIA"), visible: true},
              {id: "Piani-tbPiani-Rcol38", order: 42, text: oResource.getText("STRATEGIA_DESC"), visible: true},
              {id: "Piani-tbPiani-Rcol58", order: 43, text: oResource.getText("TIPO_ORDINE"), visible: true},
              {id: "Piani-tbPiani-Rcol53", order: 44, text: oResource.getText("PRIORITA"), visible: true},
              {id: "Piani-tbPiani-Rcol54", order: 45, text: oResource.getText("TIPO_ATTIVITA"), visible: true},
              {id: "Piani-tbPiani-Rcol55", order: 46, text: oResource.getText("DESC_BREVE"), visible: true},
              {id: "Piani-tbPiani-Rcol57", order: 47, text: oResource.getText("INDISPONIBILITA"), visible: true},
              {id: "Piani-tbPiani-Rcol50", order: 48, text: oResource.getText("TIPO_GESTIONE"), visible: true},
              {id: "Piani-tbPiani-Rcol51", order: 49, text: oResource.getText("TIPO_GESTIONE_1"), visible: true},
              {id: "Piani-tbPiani-Rcol52", order: 50, text: oResource.getText("TIPO_GESTIONE_2"), visible: true},
              {id: "Piani-tbPiani-Rcol40", order: 51, text: oResource.getText("CENTRO_LAVORO"), visible: true},
              {id: "Piani-tbPiani-Rcol39", order: 52, text: oResource.getText("DIVISIONEC"), visible: true},
              {id: "Piani-tbPiani-Rcol29", order: 60, text: oResource.getText("TESTO_ESTESO_P"), visible: false},
              {id: "Piani-tbPiani-Rcol56", order: 61, text: oResource.getText("TESTO_ESTESO"), visible: false},
              {id: "Piani-tbPiani-Rcol59", order: 62, text: oResource.getText("LSTAR"), visible: false},
              {id: "Piani-tbPiani-Rcol60", order: 63, text: oResource.getText("STEUS"), visible: false},
              {id: "Piani-tbPiani-Rcol61", order: 64, text: oResource.getText("NUM"), visible: false},
              {id: "Piani-tbPiani-Rcol62", order: 65, text: oResource.getText("PERSONE"), visible: false},
              {id: "Piani-tbPiani-Rcol63", order: 66, text: oResource.getText("HPER"), visible: false},
              {id: "Piani-tbPiani-Rcol120", order: 67, text: oResource.getText("Toth"), visible: false},
              
              {id: "Piani-tbPiani-Rcol64", order: 70, text: oResource.getText("LSTAR_1"), visible: false},
              {id: "Piani-tbPiani-Rcol65", order: 71, text: oResource.getText("STEUS_1"), visible: false},
              {id: "Piani-tbPiani-Rcol66", order: 72, text: oResource.getText("NUM_1"), visible: false},
              {id: "Piani-tbPiani-Rcol67", order: 73, text: oResource.getText("PERSONE_1"), visible: false},
              {id: "Piani-tbPiani-Rcol68", order: 74, text: oResource.getText("HPER_1"), visible: false},
              {id: "Piani-tbPiani-Rcol121", order: 75, text: oResource.getText("Toth1"), visible: false},

              {id: "Piani-tbPiani-Rcol69", order: 80, text: oResource.getText("LSTAR_2"), visible: false},
              {id: "Piani-tbPiani-Rcol70", order: 81, text: oResource.getText("STEUS_2"), visible: false},
              {id: "Piani-tbPiani-Rcol71", order: 82, text: oResource.getText("NUM_2"), visible: false},
              {id: "Piani-tbPiani-Rcol72", order: 83, text: oResource.getText("PERSONE_2"), visible: false},
              {id: "Piani-tbPiani-Rcol73", order: 84, text: oResource.getText("HPER_2"), visible: false},
              {id: "Piani-tbPiani-Rcol122", order: 85, text: oResource.getText("Toth2"), visible: false},

              {id: "Piani-tbPiani-Rcol75", order: 90, text: oResource.getText("LSTAR_3"), visible: false},
              {id: "Piani-tbPiani-Rcol76", order: 91, text: oResource.getText("STEUS_3"), visible: false},
              {id: "Piani-tbPiani-Rcol77", order: 92, text: oResource.getText("NUM_3"), visible: false},
              {id: "Piani-tbPiani-Rcol78", order: 93, text: oResource.getText("PERSONE_3"), visible: false},
              {id: "Piani-tbPiani-Rcol79", order: 94, text: oResource.getText("HPER_3"), visible: false},
              {id: "Piani-tbPiani-Rcol123", order: 95, text: oResource.getText("Toth3"), visible: false},

              {id: "Piani-tbPiani-Rcol80", order: 100, text: oResource.getText("LSTAR_4"), visible: false},
              {id: "Piani-tbPiani-Rcol81", order: 101, text: oResource.getText("STEUS_4"), visible: false},
              {id: "Piani-tbPiani-Rcol82", order: 102, text: oResource.getText("NUM_4"), visible: false},
              {id: "Piani-tbPiani-Rcol83", order: 103, text: oResource.getText("PERSONE_4"), visible: false},
              {id: "Piani-tbPiani-Rcol84", order: 104, text: oResource.getText("HPER_4"), visible: false},
              {id: "Piani-tbPiani-Rcol124", order: 105, text: oResource.getText("Toth4"), visible: false},

              {id: "Piani-tbPiani-Rcol85", order: 110, text: oResource.getText("LSTAR_5"), visible: false},
              {id: "Piani-tbPiani-Rcol86", order: 111, text: oResource.getText("STEUS_5"), visible: false},
              {id: "Piani-tbPiani-Rcol87", order: 112, text: oResource.getText("NUM_5"), visible: false},
              {id: "Piani-tbPiani-Rcol88", order: 113, text: oResource.getText("PERSONE_5"), visible: false},
              {id: "Piani-tbPiani-Rcol89", order: 114, text: oResource.getText("HPER_5"), visible: false},
              {id: "Piani-tbPiani-Rcol125", order: 115, text: oResource.getText("Toth5"), visible: false},

              {id: "Piani-tbPiani-Rcol95", order: 120, text: oResource.getText("RISK"), visible: false},
              {id: "Piani-tbPiani-Rcol96", order: 121, text: oResource.getText("LIMITE"), visible: false},
              {id: "Piani-tbPiani-Rcol103", order: 122, text: oResource.getText("TIPOFREQUENZA"), visible: false},
              {id: "Piani-tbPiani-Rcol97", order: 123, text: oResource.getText("FREQ_TEMPO"), visible: false},
              {id: "Piani-tbPiani-Rcol98", order: 124, text: oResource.getText("UNITA_TEMPO"), visible: false},
              {id: "Piani-tbPiani-Rcol99", order: 125, text: oResource.getText("FREQ_CICLO"), visible: false},
              {id: "Piani-tbPiani-Rcol100", order: 126, text: oResource.getText("UNITA_CICLO"), visible: false},
              {id: "Piani-tbPiani-Rcol101", order: 127, text: oResource.getText("POINT"), visible: false},
              {id: "Piani-tbPiani-Rcol102", order: 128, text: oResource.getText("MPTYP"), visible: false}

            ]
        },

        getPersData: function () {
            var oDeferred = new jQuery.Deferred();
            if (!this._oBundle) {
                this._oBundle = this.oData;
            }
            var oBundle = this._oBundle;
            oDeferred.resolve(oBundle);
            return oDeferred.promise();
        },

        setPersData: function (oBundle) {
            var oDeferred = new jQuery.Deferred();
            this._oBundle = oBundle;
            oDeferred.resolve();
            return oDeferred.promise();
        },
        getGroup : function(oColumn) {
          if ( oColumn.getStyleClass() === "columnPosizioni") {
            return "Azioni Elementari";
          }
          return "Indice";
        }
    };

    return PisteTableHome;

});
