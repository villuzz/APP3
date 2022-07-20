sap.ui.define(['jquery.sap.global'], function (jQuery) {
    "use strict";
    var oResource;
    oResource = new sap.ui.model.resource.ResourceModel({bundleName: "PM030.APP3.i18n.i18n"}).getResourceBundle();

    var PisteTableHome = {
        oData: {
            _persoSchemaVersion: "1.0",
            aColumns: [
              {id: "Piani-tAzioni-aCol2", order: 2, text: oResource.getText("Cont"), visible: true},
              {id: "Piani-tAzioni-aCol3", order: 3, text: oResource.getText("FlagAttivo"), visible: true},
              {id: "Piani-tAzioni-aCol4", order: 4, text: oResource.getText("Datum"), visible: true},
              {id: "Piani-tAzioni-aCol5", order: 5, text: oResource.getText("Sistem"), visible: true},
              {id: "Piani-tAzioni-aCol6", order: 6, text: oResource.getText("Progres"), visible: true},
              {id: "Piani-tAzioni-aCol11", order: 7, text: oResource.getText("DesBreve"), visible: true},
              {id: "Piani-tAzioni-aCol7", order: 9, text: oResource.getText("Classe"), visible: true},
              {id: "Piani-tAzioni-aCol8", order: 10, text: oResource.getText("DesComponente"), visible: true},
              {id: "Piani-tAzioni-aCol9", order: 11, text: oResource.getText("Tplnr"), visible: true},
              {id: "Piani-tAzioni-aCol10", order: 12, text: oResource.getText("Equipment"), visible: true},
              {id: "Piani-tAzioni-aCol12", order: 16, text: oResource.getText("ComponentTipo"), visible: true},
              {id: "Piani-tAzioni-aCol13", order: 17, text: oResource.getText("IntegTxtEsteso"), visible: true},
              {id: "Piani-tAzioni-aCol14", order: 18, text: oResource.getText("Uname"), visible: true},

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
