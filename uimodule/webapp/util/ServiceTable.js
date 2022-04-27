sap.ui.define(['jquery.sap.global'], function (jQuery) {
    "use strict";
    var oResource;
    oResource = new sap.ui.model.resource.ResourceModel({bundleName: "PM030.APP3.i18n.i18n"}).getResourceBundle();

    var PisteTableHome = {
        oData: {
            _persoSchemaVersion: "1.0",
            aColumns: [
              {id: "Piani-tServizi-sCol1", order: 1, text: oResource.getText("Cont"), visible: true},
              {id: "Piani-tServizi-sCol2", order: 2, text: oResource.getText("Asnum"), visible: true},
              {id: "Piani-tServizi-sCol3", order: 3, text: oResource.getText("Asktx"), visible: true},
              {id: "Piani-tServizi-sCol4", order: 4, text: oResource.getText("Menge"), visible: true},
              {id: "Piani-tServizi-sCol5", order: 5, text: oResource.getText("Meins"), visible: true},
              {id: "Piani-tServizi-sCol6", order: 6, text: oResource.getText("Tbtwr"), visible: true},
              {id: "Piani-tServizi-sCol7", order: 7, text: oResource.getText("Waers"), visible: true},
              {id: "Piani-tServizi-sCol8", order: 8, text: oResource.getText("Ekgrp"), visible: true},
              {id: "Piani-tServizi-sCol9", order: 9, text: oResource.getText("Ekorg"), visible: true},
              {id: "Piani-tServizi-sCol10", order: 10, text: oResource.getText("Afnam"), visible: true},
              {id: "Piani-tServizi-sCol11", order: 11, text: oResource.getText("Matkl"), visible: true},
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
