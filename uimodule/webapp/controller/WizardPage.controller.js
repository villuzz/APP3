    sap.ui.define([
      "./BaseController"
    ], function (Controller) {
      "use strict";

      return Controller.extend("PM030.APP3.controller.WizardPage", {
        onInit: function () {

          //leggere i modelli che ci servono 
          var sWerks = [{
            werks: "ITTM",
            description: "Italia",
          },{
            werks: "ITT3",
            description: "Italia2",
          },{
            werks: "ITT5",
            description: "Italia3",
          }];
          var oWerks = new sap.ui.model.json.JSONModel();
          oWerks.setData(sWerks);
          this.getView().setModel(oWerks, "sWerks");

          this.getOwnerComponent().getRouter().getRoute("WizardPage").attachPatternMatched(this._onObjectMatched, this);

        },
        _onObjectMatched: function () {

          var sData = {
            btnBack: false,
            btnNext: true,
            btnReview: false,
            btnFinish: false,
          };
          this.byId("WizardPiani").goToStep(this.byId("WizardPiani")._getStartingStep());
          var oModel = new sap.ui.model.json.JSONModel();
          oModel.setData(sData);
          this.getView().setModel(oModel, "sSelect");

        },
        onDialogNextButton: function () {
          if (this.byId("WizardPiani").getProgressStep().getValidated()) {
            this.byId("WizardPiani").nextStep();
          }

          this.handleButtonsVisibility();
        },
        onDialogBackButton: function () {
          this.byId("WizardPiani").previousStep();
          this.handleButtonsVisibility();
        },
        handleButtonsVisibility: function () {

          var oModel = this.getView().getModel("sSelect");
          switch (this.byId("WizardPiani").getProgress()){
            case 1:
              oModel.setProperty("/btnBack", false);
              oModel.setProperty("/btnNext", true);
              oModel.setProperty("/btnReview", false);
              oModel.setProperty("/btnFinish", false);
              break;
            case 2:
              oModel.setProperty("/btnBack", true);
              oModel.setProperty("/btnNext", true);
              oModel.setProperty("/btnReview", false);
              oModel.setProperty("/btnFinish", false);
              break;
            case 3:
              oModel.setProperty("/btnBack", true);
              oModel.setProperty("/btnNext", false);
              oModel.setProperty("/btnReview", true);
              oModel.setProperty("/btnFinish", false);
              break;
            case 4:
              oModel.setProperty("/btnBack", true);
              oModel.setProperty("/btnNext", false);
              oModel.setProperty("/btnReview", false);
              oModel.setProperty("/btnFinish", true);
              break;
            default: break;
          }

        },

        getPage: function () {
          return this.byId("dynamicPage");
        },

        onBack: function () {
          sap.ui.core.UIComponent.getRouterFor(this).navTo("TilePage");
        },

        checkInformazioni: function () {
          //Tech e Strategia
          /*var oModel = this.model;
          if (oModel.length < 3) {
            this._wizard.invalidateStep(this.byId("CreditCardStep"));
          } else {
            this._wizard.validateStep(this.byId("CreditCardStep"));
          }*/
        },
        checkSpecifiche: function () {
          //Tech e Strategia
          /*var oModel = this.model;
          if (oModel.length < 3) {
            this._wizard.invalidateStep(this.byId("CreditCardStep"));
          } else {
            this._wizard.validateStep(this.byId("CreditCardStep"));
          }*/
        },
        checkInterventi: function () {
          //Almeno una riga selezionata
          /*var oModel = this.model;
          if (oModel.length < 3) {
            this._wizard.invalidateStep(this.byId("CreditCardStep"));
          } else {
            this._wizard.validateStep(this.byId("CreditCardStep"));
          }*/
        },
        handleValueHelpWerks: function () {
        },

        completedHandler: function () {
          this._oNavContainer.to(this.byId("wizardBranchingReviewPage"));
        },
        handleSave: function () {

        },

        handleNavBack: function () {
          //Cancellare modello con informazioni selezionate e tornare al primo step
          this._navBackToStep(this.byId("Informazioni"));
        },

        handleNavBackToInformazioni: function () {
          this._navBackToStep(this.byId("Informazioni"));
        },

        _navBackToStep: function (step) {
          var fnAfterNavigate = function () {
            this._wizard.goToStep(step);
            this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
          }.bind(this);

          this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
          this._oNavContainer.to(this._oDynamicPage);
        }
      });
    });