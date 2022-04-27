sap.ui.define(['jquery.sap.global'], function (jQuery) {
    "use strict";
    var oResource;
    oResource = new sap.ui.model.resource.ResourceModel({bundleName: "PM030.APP3.i18n.i18n"}).getResourceBundle();

    var PisteTableHome = {
        oData: {
            _persoSchemaVersion: "1.0",
            aColumns: [
              {id: "Piani-tServizi-mCol1", order: 1, text: oResource.getText("Cont"), visible: true},
              {id: "Piani-tServizi-mCol2", order: 2, text: oResource.getText("Matnr"), visible: true},
              {id: "Piani-tServizi-mCol3", order: 3, text: oResource.getText("Maktx"), visible: true},
              {id: "Piani-tServizi-mCol4", order: 4, text: oResource.getText("Menge"), visible: true},
              {id: "Piani-tServizi-mCol5", order: 5, text: oResource.getText("Meins"), visible: true},
              {id: "Piani-tServizi-mCol6", order: 6, text: oResource.getText("Lgort"), visible: true},
              {id: "Piani-tServizi-mCol7", order: 7, text: oResource.getText("Werks"), visible: true},
              {id: "Piani-tServizi-mCol8", order: 8, text: oResource.getText("Charg"), visible: true},
              {id: "Piani-tServizi-mCol9", order: 9, text: oResource.getText("Tbtwr"), visible: true},
              {id: "Piani-tServizi-mCol10", order: 10, text: oResource.getText("Waers"), visible: true},
              {id: "Piani-tServizi-mCol11", order: 11, text: oResource.getText("Ekgrp"), visible: true},
              {id: "Piani-tServizi-mCol12", order: 12, text: oResource.getText("Ekorg"), visible: true},
              {id: "Piani-tServizi-mCol13", order: 13, text: oResource.getText("Afnam"), visible: true},
              {id: "Piani-tServizi-mCol14", order: 14, text: oResource.getText("Matkl"), visible: true},


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
