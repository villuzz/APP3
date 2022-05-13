sap.ui.define(['jquery.sap.global'], function (jQuery) {
    "use strict";
    var oResource;
    oResource = new sap.ui.model.resource.ResourceModel({bundleName: "PM030.APP3.i18n.i18n"}).getResourceBundle();

    var PisteTableHome = {
        oData: {
            _persoSchemaVersion: "1.0", 
            aColumns: [
              {id: "Piani-tbPiani-col3", order: 1, text: oResource.getText("ATTIVO"), visible: true},
              {id: "Piani-tbPiani-col2", order: 2, text: oResource.getText("CONTATORE"), visible: true},
              {id: "Piani-tbPiani-col104", order: 3, text: oResource.getText("MATNR"), visible: true},
              {id: "Piani-tbPiani-col105", order: 4, text: oResource.getText("ASNUM"), visible: true},
              {id: "Piani-tbPiani-col5", order: 5, text: oResource.getText("SISTEMA"), visible: true},
              {id: "Piani-tbPiani-col8", order: 6, text: oResource.getText("CLASSE"), visible: true},
              {id: "Piani-tbPiani-col6", order: 7, text: oResource.getText("PROGRES"), visible: true},
              {id: "Piani-tbPiani-col7", order: 8, text: oResource.getText("DESC_PROG"), visible: true},
              {id: "Piani-tbPiani-col10", order: 9, text: oResource.getText("DIVISIONE"), visible: true},
              {id: "Piani-tbPiani-col20", order: 10, text: oResource.getText("SEDE_TECNICA"), visible: true},
              {id: "Piani-tbPiani-col21", order: 11, text: oResource.getText("SEDE_TECNICA_P"), visible: true},
              {id: "Piani-tbPiani-col27", order: 12, text: oResource.getText("DESC_SEDE"), visible: true},
              {id: "Piani-tbPiani-col30", order: 20, text: oResource.getText("CLASSE_SEDE"), visible: true},
              {id: "Piani-tbPiani-col31", order: 21, text: oResource.getText("CARATT_SEDE"), visible: true},
              {id: "Piani-tbPiani-col35", order: 22, text: oResource.getText("VALORE"), visible: true},
              {id: "Piani-tbPiani-col32", order: 23, text: oResource.getText("OGGETTO_TECNICO"), visible: true},
              {id: "Piani-tbPiani-col33", order: 24, text: oResource.getText("PROFILO"), visible: true},
              {id: "Piani-tbPiani-col34", order: 25, text: oResource.getText("ZBAU"), visible: true},
              {id: "Piani-tbPiani-col28", order: 26, text: oResource.getText("EQUIPMENT"), visible: true},
              {id: "Piani-tbPiani-col9", order: 27, text: oResource.getText("DES_COMPONENTE"), visible: true},

              {id: "Piani-tbPiani-col106", order: 28, text: oResource.getText("COLLECTIVE"), visible: true},
              {id: "Piani-tbPiani-col107", order: 29, text: oResource.getText("PERCORSO"), visible: true},
              {id: "Piani-tbPiani-col108", order: 32, text: oResource.getText("FINEVAL"), visible: true},
              {id: "Piani-tbPiani-col109", order: 31, text: oResource.getText("INIZIOVAL"), visible: true},
              {id: "Piani-tbPiani-col110", order: 33, text: oResource.getText("DESTINATARIO"), visible: true},

              {id: "Piani-tbPiani-col1", order: 40, text: oResource.getText("INDEX"), visible: true},
              {id: "Piani-tbPiani-col37", order: 41, text: oResource.getText("STRATEGIA"), visible: true},
              {id: "Piani-tbPiani-col38", order: 42, text: oResource.getText("STRATEGIA_DESC"), visible: true},
              {id: "Piani-tbPiani-col58", order: 43, text: oResource.getText("TIPO_ORDINE"), visible: true},
              {id: "Piani-tbPiani-col53", order: 44, text: oResource.getText("PRIORITA"), visible: true},
              {id: "Piani-tbPiani-col54", order: 45, text: oResource.getText("TIPO_ATTIVITA"), visible: true},
              {id: "Piani-tbPiani-col55", order: 46, text: oResource.getText("DESC_BREVE"), visible: true},
              {id: "Piani-tbPiani-col57", order: 47, text: oResource.getText("INDISPONIBILITA"), visible: true},
              {id: "Piani-tbPiani-col50", order: 48, text: oResource.getText("TIPO_GESTIONE"), visible: true},
              {id: "Piani-tbPiani-col51", order: 49, text: oResource.getText("TIPO_GESTIONE_1"), visible: true},
              {id: "Piani-tbPiani-col52", order: 50, text: oResource.getText("TIPO_GESTIONE_2"), visible: true},
              {id: "Piani-tbPiani-col40", order: 51, text: oResource.getText("CENTRO_LAVORO"), visible: true},
              {id: "Piani-tbPiani-col39", order: 52, text: oResource.getText("DIVISIONEC"), visible: true},
              {id: "Piani-tbPiani-col29", order: 60, text: oResource.getText("TESTO_ESTESO_P"), visible: false},
              {id: "Piani-tbPiani-col56", order: 61, text: oResource.getText("TESTO_ESTESO"), visible: false},
              {id: "Piani-tbPiani-col59", order: 62, text: oResource.getText("LSTAR"), visible: false},
              {id: "Piani-tbPiani-col60", order: 63, text: oResource.getText("STEUS"), visible: false},
              {id: "Piani-tbPiani-col61", order: 64, text: oResource.getText("NUM"), visible: false},
              {id: "Piani-tbPiani-col62", order: 65, text: oResource.getText("PERSONE"), visible: false},
              {id: "Piani-tbPiani-col63", order: 66, text: oResource.getText("HPER"), visible: false},
              
              {id: "Piani-tbPiani-col64", order: 67, text: oResource.getText("LSTAR_1"), visible: false},
              {id: "Piani-tbPiani-col65", order: 68, text: oResource.getText("STEUS_1"), visible: false},
              {id: "Piani-tbPiani-col66", order: 69, text: oResource.getText("NUM_1"), visible: false},
              {id: "Piani-tbPiani-col67", order: 70, text: oResource.getText("PERSONE_1"), visible: false},
              {id: "Piani-tbPiani-col68", order: 71, text: oResource.getText("HPER_1"), visible: false},

              {id: "Piani-tbPiani-col69", order: 72, text: oResource.getText("LSTAR_2"), visible: false},
              {id: "Piani-tbPiani-col70", order: 73, text: oResource.getText("STEUS_2"), visible: false},
              {id: "Piani-tbPiani-col71", order: 74, text: oResource.getText("NUM_2"), visible: false},
              {id: "Piani-tbPiani-col72", order: 75, text: oResource.getText("PERSONE_2"), visible: false},
              {id: "Piani-tbPiani-col73", order: 76, text: oResource.getText("HPER_2"), visible: false},

              {id: "Piani-tbPiani-col75", order: 77, text: oResource.getText("LSTAR_3"), visible: false},
              {id: "Piani-tbPiani-col76", order: 78, text: oResource.getText("STEUS_3"), visible: false},
              {id: "Piani-tbPiani-col77", order: 79, text: oResource.getText("NUM_3"), visible: false},
              {id: "Piani-tbPiani-col78", order: 80, text: oResource.getText("PERSONE_3"), visible: false},
              {id: "Piani-tbPiani-col79", order: 81, text: oResource.getText("HPER_3"), visible: false},

              {id: "Piani-tbPiani-col80", order: 82, text: oResource.getText("LSTAR_4"), visible: false},
              {id: "Piani-tbPiani-col81", order: 83, text: oResource.getText("STEUS_4"), visible: false},
              {id: "Piani-tbPiani-col82", order: 84, text: oResource.getText("NUM_4"), visible: false},
              {id: "Piani-tbPiani-col83", order: 85, text: oResource.getText("PERSONE_4"), visible: false},
              {id: "Piani-tbPiani-col84", order: 86, text: oResource.getText("HPER_4"), visible: false},

              {id: "Piani-tbPiani-col85", order: 87, text: oResource.getText("LSTAR_5"), visible: false},
              {id: "Piani-tbPiani-col86", order: 88, text: oResource.getText("STEUS_5"), visible: false},
              {id: "Piani-tbPiani-col87", order: 89, text: oResource.getText("NUM_5"), visible: false},
              {id: "Piani-tbPiani-col88", order: 90, text: oResource.getText("PERSONE_5"), visible: false},
              {id: "Piani-tbPiani-col89", order: 91, text: oResource.getText("HPER_5"), visible: false},

              {id: "Piani-tbPiani-col95", order: 95, text: oResource.getText("RISK"), visible: false},
              {id: "Piani-tbPiani-col96", order: 96, text: oResource.getText("LIMITE"), visible: false},
              {id: "Piani-tbPiani-col103", order: 97, text: oResource.getText("TIPOFREQUENZA"), visible: false},
              {id: "Piani-tbPiani-col97", order: 98, text: oResource.getText("FREQ_TEMPO"), visible: false},
              {id: "Piani-tbPiani-col98", order: 99, text: oResource.getText("UNITA_TEMPO"), visible: false},
              {id: "Piani-tbPiani-col99", order: 100, text: oResource.getText("FREQ_CICLO"), visible: false},
              {id: "Piani-tbPiani-col100", order: 101, text: oResource.getText("UNITA_CICLO"), visible: false},
              {id: "Piani-tbPiani-col101", order: 102, text: oResource.getText("POINT"), visible: false},
              {id: "Piani-tbPiani-col102", order: 103, text: oResource.getText("MPTYP"), visible: false}
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
