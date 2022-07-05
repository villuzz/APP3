sap.ui.define(['jquery.sap.global'], function (jQuery) {
    "use strict";
    var oResource;
    oResource = new sap.ui.model.resource.ResourceModel({bundleName: "PM030.APP3.i18n.i18n"}).getResourceBundle();

    var PisteTableHome = {
        oData: {
            _persoSchemaVersion: "1.0",
            aColumns: [
              {id: "Piani-tbPiani-col86", order: 0, text: oResource.getText("FlagAttivo"), visible: true},
              {id: "Piani-tbPiani-col1", order: 1, text: oResource.getText("IndexPmo"), visible: true},
              {id: "Piani-tbPiani-col2", order: 2, text: oResource.getText("InizioVal"), visible: true},
              {id: "Piani-tbPiani-col3", order: 3, text: oResource.getText("FineVal"), visible: true},
              {id: "Piani-tbPiani-col4", order: 4, text: oResource.getText("Divisioneu"), visible: true},
              {id: "Piani-tbPiani-col5", order: 5, text: oResource.getText("TipoPmo"), visible: true},
              {id: "Piani-tbPiani-col6", order: 6, text: oResource.getText("Priorita"), visible: true},
              {id: "Piani-tbPiani-col7", order: 7, text: oResource.getText("TipoOrdine"), visible: true},
              {id: "Piani-tbPiani-col8", order: 8, text: oResource.getText("TipoAttivita"), visible: true},
              {id: "Piani-tbPiani-col9", order: 9, text: oResource.getText("DesBreve"), visible: true},
              {id: "Piani-tbPiani-col10", order: 10, text: oResource.getText("Sistema"), visible: true},
              {id: "Piani-tbPiani-col11", order: 11, text: oResource.getText("Classe"), visible: true},
              {id: "Piani-tbPiani-col12", order: 12, text: oResource.getText("Progres"), visible: true},
              {id: "Piani-tbPiani-col13", order: 13, text: oResource.getText("Indisponibilita"), visible: true},
              {id: "Piani-tbPiani-col14", order: 14, text: oResource.getText("TipoGestione"), visible: true},
              {id: "Piani-tbPiani-col15", order: 15, text: oResource.getText("TipoGestione1"), visible: true},
              {id: "Piani-tbPiani-col16", order: 16, text: oResource.getText("TipoGestione2"), visible: true},
              {id: "Piani-tbPiani-col17", order: 17, text: oResource.getText("Collective"), visible: true},
              {id: "Piani-tbPiani-col18", order: 18, text: oResource.getText("IntegTxtEsteso"), visible: true},
              {id: "Piani-tbPiani-col19", order: 19, text: oResource.getText("DurataCiclo"), visible: true},
              {id: "Piani-tbPiani-col20", order: 20, text: oResource.getText("Frequenza"), visible: true},
              {id: "Piani-tbPiani-col21", order: 21, text: oResource.getText("UltimaEsecuz"), visible: true},
              {id: "Piani-tbPiani-col22", order: 22, text: oResource.getText("Destinatario"), visible: true},
              {id: "Piani-tbPiani-col23", order: 23, text: oResource.getText("Percorso"), visible: true},
              {id: "Piani-tbPiani-col24", order: 24, text: oResource.getText("Cdl"), visible: false},
              {id: "Piani-tbPiani-col25", order: 25, text: oResource.getText("Lstar"), visible: false},
              {id: "Piani-tbPiani-col26", order: 26, text: oResource.getText("Steus"), visible: false},
              {id: "Piani-tbPiani-col27", order: 27, text: oResource.getText("Num"), visible: false},
              {id: "Piani-tbPiani-col28", order: 28, text: oResource.getText("Persone"), visible: false},
              {id: "Piani-tbPiani-col29", order: 29, text: oResource.getText("Hper"), visible: false},
              {id: "Piani-tbPiani-col30", order: 30, text: oResource.getText("Toth"), visible: false},
              {id: "Piani-tbPiani-col31", order: 31, text: oResource.getText("Cdl1"), visible: false},
              {id: "Piani-tbPiani-col32", order: 32, text: oResource.getText("Lstar1"), visible: false},
              {id: "Piani-tbPiani-col33", order: 33, text: oResource.getText("Steus1"), visible: false},
              {id: "Piani-tbPiani-col34", order: 34, text: oResource.getText("Num1"), visible: false},
              {id: "Piani-tbPiani-col35", order: 35, text: oResource.getText("Persone1"), visible: false},
              {id: "Piani-tbPiani-col36", order: 36, text: oResource.getText("Hper1"), visible: false},
              {id: "Piani-tbPiani-col37", order: 37, text: oResource.getText("Toth1"), visible: false},
              {id: "Piani-tbPiani-col38", order: 38, text: oResource.getText("Cdl2"), visible: false},
              {id: "Piani-tbPiani-col39", order: 39, text: oResource.getText("Lstar2"), visible: false},
              {id: "Piani-tbPiani-col40", order: 40, text: oResource.getText("Steus2"), visible: false},
              {id: "Piani-tbPiani-col41", order: 41, text: oResource.getText("Num2"), visible: false},
              {id: "Piani-tbPiani-col42", order: 42, text: oResource.getText("Persone2"), visible: false},
              {id: "Piani-tbPiani-col43", order: 43, text: oResource.getText("Hper2"), visible: false},
              {id: "Piani-tbPiani-col44", order: 44, text: oResource.getText("Toth2"), visible: false},
              {id: "Piani-tbPiani-col45", order: 45, text: oResource.getText("Cdl3"), visible: false},
              {id: "Piani-tbPiani-col46", order: 46, text: oResource.getText("Lstar3"), visible: false},
              {id: "Piani-tbPiani-col47", order: 47, text: oResource.getText("Steus3"), visible: false},
              {id: "Piani-tbPiani-col48", order: 48, text: oResource.getText("Num3"), visible: false},
              {id: "Piani-tbPiani-col49", order: 49, text: oResource.getText("Persone3"), visible: false},
              {id: "Piani-tbPiani-col50", order: 50, text: oResource.getText("Hper3"), visible: false},
              {id: "Piani-tbPiani-col51", order: 51, text: oResource.getText("Toth3"), visible: false},
              {id: "Piani-tbPiani-col52", order: 52, text: oResource.getText("Cdl4"), visible: false},
              {id: "Piani-tbPiani-col53", order: 53, text: oResource.getText("Lstar4"), visible: false},
              {id: "Piani-tbPiani-col54", order: 54, text: oResource.getText("Steus4"), visible: false},
              {id: "Piani-tbPiani-col55", order: 55, text: oResource.getText("Num4"), visible: false},
              {id: "Piani-tbPiani-col56", order: 56, text: oResource.getText("Persone4"), visible: false},
              {id: "Piani-tbPiani-col57", order: 57, text: oResource.getText("Hper4"), visible: false},
              {id: "Piani-tbPiani-col58", order: 58, text: oResource.getText("Toth4"), visible: false},
              {id: "Piani-tbPiani-col59", order: 59, text: oResource.getText("Cdl5"), visible: false},
              {id: "Piani-tbPiani-col60", order: 60, text: oResource.getText("Lstar5"), visible: false},
              {id: "Piani-tbPiani-col61", order: 61, text: oResource.getText("Steus5"), visible: false},
              {id: "Piani-tbPiani-col62", order: 62, text: oResource.getText("Num5"), visible: false},
              {id: "Piani-tbPiani-col63", order: 63, text: oResource.getText("Persone5"), visible: false},
              {id: "Piani-tbPiani-col64", order: 64, text: oResource.getText("Hper5"), visible: false},
              {id: "Piani-tbPiani-col65", order: 65, text: oResource.getText("Toth5"), visible: false},
              {id: "Piani-tbPiani-col66", order: 66, text: oResource.getText("Uzeit"), visible: false},
              {id: "Piani-tbPiani-col67", order: 67, text: oResource.getText("Appuntam"), visible: false},
              {id: "Piani-tbPiani-col68", order: 68, text: oResource.getText("Azione"), visible: false},
              {id: "Piani-tbPiani-col69", order: 69, text: oResource.getText("Banfn"), visible: false},
              {id: "Piani-tbPiani-col70", order: 70, text: oResource.getText("CentroLavoro"), visible: false},
              {id: "Piani-tbPiani-col71", order: 71, text: oResource.getText("Ciclo"), visible: false},
              {id: "Piani-tbPiani-col72", order: 72, text: oResource.getText("CodAzione"), visible: false},
              {id: "Piani-tbPiani-col73", order: 73, text: oResource.getText("Criticita"), visible: false},
              {id: "Piani-tbPiani-col74", order: 74, text: oResource.getText("DataInizCiclo"), visible: false},
              {id: "Piani-tbPiani-col75", order: 75, text: oResource.getText("Datum"), visible: false},
              {id: "Piani-tbPiani-col76", order: 76, text: oResource.getText("Daune"), visible: false},
              {id: "Piani-tbPiani-col77", order: 77, text: oResource.getText("DayAdv"), visible: false},
              {id: "Piani-tbPiani-col78", order: 78, text: oResource.getText("DesComponente"), visible: false},
              {id: "Piani-tbPiani-col79", order: 79, text: oResource.getText("DesEstesa"), visible: false},
              {id: "Piani-tbPiani-col80", order: 80, text: oResource.getText("Determinanza"), visible: false},
              {id: "Piani-tbPiani-col81", order: 81, text: oResource.getText("Differibile"), visible: false},
              {id: "Piani-tbPiani-col82", order: 82, text: oResource.getText("Divisionec"), visible: false},
              {id: "Piani-tbPiani-col83", order: 83, text: oResource.getText("EquipmentCompo"), visible: false},
              {id: "Piani-tbPiani-col84", order: 84, text: oResource.getText("EquipmentOdm"), visible: false},
              {id: "Piani-tbPiani-col85", order: 85, text: oResource.getText("FineCard"), visible: false},
              
              {id: "Piani-tbPiani-col87", order: 87, text: oResource.getText("FlagInterc"), visible: false},
              {id: "Piani-tbPiani-col88", order: 88, text: oResource.getText("FlagMateriali"), visible: false},
              {id: "Piani-tbPiani-col89", order: 89, text: oResource.getText("FlagOdm"), visible: false},
              {id: "Piani-tbPiani-col90", order: 90, text: oResource.getText("FlagPrestazioni"), visible: false},
              {id: "Piani-tbPiani-col91", order: 91, text: oResource.getText("FlgMail"), visible: false},
              {id: "Piani-tbPiani-col92", order: 92, text: oResource.getText("Point"), visible: false},
              {id: "Piani-tbPiani-col93", order: 93, text: oResource.getText("Scostamento"), visible: false},
             //{id: "Piani-tbPiani-col94", order: 94, text: oResource.getText("SedeTecOdm"), visible: false},
              {id: "Piani-tbPiani-col95", order: 95, text: oResource.getText("StComponente"), visible: false},
              {id: "Piani-tbPiani-col96", order: 96, text: oResource.getText("TipoAggr"), visible: false},
              {id: "Piani-tbPiani-col97", order: 97, text: oResource.getText("TxtCiclo"), visible: false},
              {id: "Piani-tbPiani-col98", order: 98, text: oResource.getText("Uname"), visible: false},
              {id: "Piani-tbPiani-col99", order: 99, text: oResource.getText("UnitaCiclo"), visible: false}

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
    };

    return PisteTableHome;

});
