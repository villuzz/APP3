sap.ui.define(['jquery.sap.global'], function (jQuery) {
    "use strict";
    var oResource;
    oResource = new sap.ui.model.resource.ResourceModel({bundleName: "PM030.APP3.i18n.i18n"}).getResourceBundle();

    var PisteTableHome = { 
        oData: {
            _persoSchemaVersion: "1.0",
            aColumns: [
                {
                    id: "Piani-tbPiani-col1",
                    order: 0,
                    text: oResource.getText("Piani"),
                    visible: true
                },
                {
                  id: "Piani-tbPiani-col2",
                  order: 1,
                  text: oResource.getText("description"),
                  visible: true
              },
              {
                id: "Piani-tbPiani-col3",
                order: 2,
                text: oResource.getText("description"),
                visible: false
            }
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
        }
    };

    return PisteTableHome;

});
