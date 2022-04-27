sap.ui.define(['jquery.sap.global'], function (jQuery) {
    "use strict";
    var oResource;
    oResource = new sap.ui.model.resource.ResourceModel({bundleName: "PM030.APP3.i18n.i18n"}).getResourceBundle();

    var PisteTableHome = {
        oData: {
            _persoSchemaVersion: "1.0", 
            aColumns: [
              {id: "Piani-tbPiani2-vCol2", order: 2, text: oResource.getText("CONTATORE"), visible: true},
              {id: "Piani-tbPiani2-vCol104", order: 3, text: oResource.getText("CONTATORE"), visible: true},
              {id: "Piani-tbPiani2-vCol105", order: 4, text: oResource.getText("CONTATORE"), visible: true},
              {id: "Piani-tbPiani2-vCol5", order: 5, text: oResource.getText("SISTEMA"), visible: true},
              {id: "Piani-tbPiani2-vCol8", order: 6, text: oResource.getText("CLASSE"), visible: true},
              {id: "Piani-tbPiani2-vCol6", order: 7, text: oResource.getText("PROGRES"), visible: true},
              {id: "Piani-tbPiani2-vCol7", order: 8, text: oResource.getText("DESC_PROG"), visible: true},
              {id: "Piani-tbPiani2-vCol10", order: 9, text: oResource.getText("DIVISIONE"), visible: true},
              {id: "Piani-tbPiani2-vCol20", order: 10, text: oResource.getText("SEDE_TECNICA"), visible: true},
              {id: "Piani-tbPiani2-vCol21", order: 11, text: oResource.getText("SEDE_TECNICA_P"), visible: true},
              {id: "Piani-tbPiani2-vCol27", order: 12, text: oResource.getText("DESC_SEDE"), visible: true},
              {id: "Piani-tbPiani2-vCol30", order: 20, text: oResource.getText("CLASSE_SEDE"), visible: true},
              {id: "Piani-tbPiani2-vCol31", order: 21, text: oResource.getText("CARATT_SEDE"), visible: true},
              {id: "Piani-tbPiani2-vCol35", order: 22, text: oResource.getText("VALORE"), visible: true},
              {id: "Piani-tbPiani2-vCol32", order: 23, text: oResource.getText("OGGETTO_TECNICO"), visible: true},
              {id: "Piani-tbPiani2-vCol33", order: 24, text: oResource.getText("PROFILO"), visible: true},
              {id: "Piani-tbPiani2-vCol34", order: 25, text: oResource.getText("ZBAU"), visible: true},
              {id: "Piani-tbPiani2-vCol28", order: 26, text: oResource.getText("EQUIPMENT"), visible: true},
              {id: "Piani-tbPiani2-vCol9", order: 27, text: oResource.getText("DES_COMPONENTE"), visible: true},
              {id: "Piani-tbPiani2-vCol1", order: 40, text: oResource.getText("INDEX"), visible: true},
              {id: "Piani-tbPiani2-vCol37", order: 41, text: oResource.getText("STRATEGIA"), visible: true},
              {id: "Piani-tbPiani2-vCol38", order: 42, text: oResource.getText("STRATEGIA_DESC"), visible: true},
              {id: "Piani-tbPiani2-vCol58", order: 43, text: oResource.getText("TIPO_ORDINE"), visible: true},
              {id: "Piani-tbPiani2-vCol53", order: 44, text: oResource.getText("PRIORITA"), visible: true},
              {id: "Piani-tbPiani2-vCol54", order: 45, text: oResource.getText("TIPO_ATTIVITA"), visible: true},
              {id: "Piani-tbPiani2-vCol55", order: 46, text: oResource.getText("DESC_BREVE"), visible: true},
              {id: "Piani-tbPiani2-vCol57", order: 47, text: oResource.getText("INDISPONIBILITA"), visible: true},
              {id: "Piani-tbPiani2-vCol50", order: 48, text: oResource.getText("TIPO_GESTIONE"), visible: true},
              {id: "Piani-tbPiani2-vCol51", order: 49, text: oResource.getText("TIPO_GESTIONE_1"), visible: true},
              {id: "Piani-tbPiani2-vCol52", order: 50, text: oResource.getText("TIPO_GESTIONE_2"), visible: true},
              {id: "Piani-tbPiani2-vCol40", order: 51, text: oResource.getText("CENTRO_LAVORO"), visible: true},
              {id: "Piani-tbPiani2-vCol39", order: 52, text: oResource.getText("DIVISIONEC"), visible: true},
              {id: "Piani-tbPiani2-vCol29", order: 60, text: oResource.getText("TESTO_ESTESO_P"), visible: false},
              {id: "Piani-tbPiani2-vCol56", order: 61, text: oResource.getText("TESTO_ESTESO"), visible: false},
              {id: "Piani-tbPiani2-vCol59", order: 62, text: oResource.getText("LSTAR"), visible: false},
              {id: "Piani-tbPiani2-vCol60", order: 63, text: oResource.getText("STEUS"), visible: false},
              {id: "Piani-tbPiani2-vCol61", order: 64, text: oResource.getText("NUM"), visible: false},
              {id: "Piani-tbPiani2-vCol62", order: 65, text: oResource.getText("PERSONE"), visible: false},
              {id: "Piani-tbPiani2-vCol63", order: 66, text: oResource.getText("HPER"), visible: false},
              
              {id: "Piani-tbPiani2-vCol64", order: 67, text: oResource.getText("LSTAR_1"), visible: false},
              {id: "Piani-tbPiani2-vCol65", order: 68, text: oResource.getText("STEUS_1"), visible: false},
              {id: "Piani-tbPiani2-vCol66", order: 69, text: oResource.getText("NUM_1"), visible: false},
              {id: "Piani-tbPiani2-vCol67", order: 70, text: oResource.getText("PERSONE_1"), visible: false},
              {id: "Piani-tbPiani2-vCol68", order: 71, text: oResource.getText("HPER_1"), visible: false},

              {id: "Piani-tbPiani2-vCol69", order: 72, text: oResource.getText("LSTAR_2"), visible: false},
              {id: "Piani-tbPiani2-vCol70", order: 73, text: oResource.getText("STEUS_2"), visible: false},
              {id: "Piani-tbPiani2-vCol71", order: 74, text: oResource.getText("NUM_2"), visible: false},
              {id: "Piani-tbPiani2-vCol72", order: 75, text: oResource.getText("PERSONE_2"), visible: false},
              {id: "Piani-tbPiani2-vCol73", order: 76, text: oResource.getText("HPER_2"), visible: false},

              {id: "Piani-tbPiani2-vCol75", order: 77, text: oResource.getText("LSTAR_3"), visible: false},
              {id: "Piani-tbPiani2-vCol76", order: 78, text: oResource.getText("STEUS_3"), visible: false},
              {id: "Piani-tbPiani2-vCol77", order: 79, text: oResource.getText("NUM_3"), visible: false},
              {id: "Piani-tbPiani2-vCol78", order: 80, text: oResource.getText("PERSONE_3"), visible: false},
              {id: "Piani-tbPiani2-vCol79", order: 81, text: oResource.getText("HPER_3"), visible: false},

              {id: "Piani-tbPiani2-vCol80", order: 82, text: oResource.getText("LSTAR_4"), visible: false},
              {id: "Piani-tbPiani2-vCol81", order: 83, text: oResource.getText("STEUS_4"), visible: false},
              {id: "Piani-tbPiani2-vCol82", order: 84, text: oResource.getText("NUM_4"), visible: false},
              {id: "Piani-tbPiani2-vCol83", order: 85, text: oResource.getText("PERSONE_4"), visible: false},
              {id: "Piani-tbPiani2-vCol84", order: 86, text: oResource.getText("HPER_4"), visible: false},

              {id: "Piani-tbPiani2-vCol85", order: 87, text: oResource.getText("LSTAR_5"), visible: false},
              {id: "Piani-tbPiani2-vCol86", order: 88, text: oResource.getText("STEUS_5"), visible: false},
              {id: "Piani-tbPiani2-vCol87", order: 89, text: oResource.getText("NUM_5"), visible: false},
              {id: "Piani-tbPiani2-vCol88", order: 90, text: oResource.getText("PERSONE_5"), visible: false},
              {id: "Piani-tbPiani2-vCol89", order: 91, text: oResource.getText("HPER_5"), visible: false},

              {id: "Piani-tbPiani2-vCol95", order: 95, text: oResource.getText("RISK"), visible: false},
              {id: "Piani-tbPiani2-vCol96", order: 96, text: oResource.getText("LIMITE"), visible: false},
              {id: "Piani-tbPiani2-vCol103", order: 97, text: oResource.getText("TIPOFREQUENZA"), visible: false},
              {id: "Piani-tbPiani2-vCol97", order: 98, text: oResource.getText("FREQ_TEMPO"), visible: false},
              {id: "Piani-tbPiani2-vCol98", order: 99, text: oResource.getText("UNITA_TEMPO"), visible: false},
              {id: "Piani-tbPiani2-vCol99", order: 100, text: oResource.getText("FREQ_CICLO"), visible: false},
              {id: "Piani-tbPiani2-vCol100", order: 101, text: oResource.getText("UNITA_CICLO"), visible: false},
              {id: "Piani-tbPiani2-vCol101", order: 102, text: oResource.getText("POINT"), visible: false},
              {id: "Piani-tbPiani2-vCol102", order: 103, text: oResource.getText("MPTYP"), visible: false},

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
