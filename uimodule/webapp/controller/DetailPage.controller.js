sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/TablePersoController",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "PM030/APP3/util/AzioniTable",
    "PM030/APP3/util/MaterialTable",
    "PM030/APP3/util/ServiceTable",
], function (Controller, JSONModel, MessageBox, TablePersoController, Filter, FilterOperator, AzioniTable, MaterialTable, ServiceTable) {
    "use strict";

    return Controller.extend("PM030.APP3.controller.DetailPage", {
        onInit: function () {

            this.getOwnerComponent().getRouter().getRoute("DetailPage").attachPatternMatched(this._onObjectMatched, this);
            /*if (sap.ui.getCore().getModel("Piani") === undefined) {
                    this.navTo("ViewPage");
                }*/
            this._oTPCAE = new TablePersoController({table: this.getView().byId("tAzioni"), persoService: AzioniTable}).activate();
            this._oTPCM = new TablePersoController({table: this.getView().byId("tMateriali"), persoService: MaterialTable}).activate();
            this._oTPCS = new TablePersoController({table: this.getView().byId("tServizi"), persoService: ServiceTable}).activate();
        },
        _onObjectMatched: async function (oEvent) {

            this.selINDEX = oEvent.getParameter("arguments").INDEX;
            this.selCOPY = oEvent.getParameter("arguments").COPY;
            sap.ui.core.BusyIndicator.show(0);
            this.delAzioni = [];
            this.delServizi = [];
            this.delMaterial = [];
            this.spostaAzioni = [];

            this.byId("iconTabBar").setSelectedKey(this.byId("iconTabBar").getItems()[0].getId());

            var aFilters = [];
            aFilters.push(new Filter("IIndexPmo", FilterOperator.EQ, this.selINDEX));
            var sPiani = await this._getTable("/JoinPMO", aFilters);


            if ( this.selCOPY === "X"){
              var Contatore = 1;
              sPiani[0].T_PMOSet.results[0].Create = "X";
              sPiani[0].T_PMOSet.results[0].IndexPmo = "";
              for (var i = 0; i < sPiani[0].T_ACT_ELSet.results.length; i++) {
                sPiani[0].T_ACT_ELSet.results[i].IndexPmo = "";
                sPiani[0].T_ACT_ELSet.results[i].Create = "X";
                for (var j = 0; j < sPiani[0].T_PMO_MSet.results.length; j++) {
                  if (sPiani[0].T_PMO_MSet.results[j].Cont === sPiani[0].T_ACT_ELSet.results[i].Cont){
                    sPiani[0].T_PMO_MSet.results[j].IndexPmo = "";
                    sPiani[0].T_PMO_MSet.results[j].Cont = Contatore;
                    sPiani[0].T_PMO_MSet.results[j].Create = "X";
                  }
                }
                for (var k = 0; k < sPiani[0].T_PMO_SSet.results.length; k++) {
                  if (sPiani[0].T_PMO_SSet.results[k].Cont === sPiani[0].T_ACT_ELSet.results[i].Cont){
                    sPiani[0].T_PMO_SSet.results[k].IndexPmo = "";
                    sPiani[0].T_PMO_SSet.results[k].Cont = Contatore;
                    sPiani[0].T_PMO_SSet.results[k].Create = "X";
                  }
                }
                sPiani[0].T_ACT_ELSet.results[i].Cont = Contatore;
                Contatore = Contatore + 1;
              }
            } else {
              sPiani[0].T_PMOSet.results[0].IndexPmo = this.formatZero(sPiani[0].T_PMOSet.results[0].IndexPmo);
              for (var i = 0; i < sPiani[0].T_ACT_ELSet.results.length; i++) {
                sPiani[0].T_ACT_ELSet.results[i].IndexPmo = this.formatZero(sPiani[0].T_ACT_ELSet.results[i].IndexPmo);
                sPiani[0].T_ACT_ELSet.results[i].Cont = this.formatZero(sPiani[0].T_ACT_ELSet.results[i].Cont);
              }
              for (var j = 0; j < sPiani[0].T_PMO_MSet.results.length; j++) {
                  sPiani[0].T_PMO_MSet.results[j].IndexPmo = this.formatZero(sPiani[0].T_PMO_MSet.results[j].IndexPmo);
                  sPiani[0].T_PMO_MSet.results[j].Cont = this.formatZero(sPiani[0].T_PMO_MSet.results[j].Cont);
              }
              for (var k = 0; k < sPiani[0].T_PMO_SSet.results.length; k++) {
                  sPiani[0].T_PMO_SSet.results[k].IndexPmo = this.formatZero(sPiani[0].T_PMO_SSet.results[k].IndexPmo);
                  sPiani[0].T_PMO_SSet.results[k].Cont = this.formatZero(sPiani[0].T_PMO_SSet.results[k].Cont);
              }

            }
            var oPiani = new sap.ui.model.json.JSONModel();
            sPiani[0].T_PMOSet.results[0].Uzeit = this.formatUzeit(sPiani[0].T_PMOSet.results[0].Uzeit.ms);
            oPiani.setData(sPiani[0].T_PMOSet.results[0]);
            this.getView().setModel(oPiani, "PianiDetail");

            for (var i = 0; i < sPiani[0].T_ACT_ELSet.results.length; i++) {
              if (sPiani[0].T_ACT_ELSet.results[i].FlagAttivo === "X" ){
                sPiani[0].T_ACT_ELSet.results[i].FlagAttivo = true;
              } else {
                sPiani[0].T_ACT_ELSet.results[i].FlagAttivo = false;
              }
            }
            var oAzioni = new sap.ui.model.json.JSONModel();
            oAzioni.setData(sPiani[0].T_ACT_ELSet.results);
            this.getView().setModel(oAzioni, "AzioniDetail");

            var oMatnr = new sap.ui.model.json.JSONModel();
            oMatnr.setData(sPiani[0].T_PMO_MSet.results);
            this.getView().setModel(oMatnr, "MatnrDetail");

            var oServizi = new sap.ui.model.json.JSONModel();
            oServizi.setData(sPiani[0].T_PMO_SSet.results);
            this.getView().setModel(oServizi, "ServiziDetail");

            if (this.getView().getModel("sHelp") === undefined) {
                await this.getValueHelp(); // PER QUELLI PICCOLI VA BENE, PER GLI ALTRI CHIAMARE SOLO AL BISOGNO TODO
            }sap.ui.core.BusyIndicator.hide();
        },
        onChangeStat: function () {
          var sData = this.getModel("PianiDetail").getData();
          sData.Toth = Number(sData.Num) * Number(sData.Persone) * Number(sData.Hper);
          sData.Toth1 = Number(sData.Num1) * Number(sData.Persone1) * Number(sData.Hper1);
          sData.Toth2 = Number(sData.Num2) * Number(sData.Persone2) * Number(sData.Hper2);
          sData.Toth3 = Number(sData.Num3) * Number(sData.Persone3) * Number(sData.Hper3);
          sData.Toth4 = Number(sData.Num4) * Number(sData.Persone4) * Number(sData.Hper4);
          sData.Toth5 = Number(sData.Num5) * Number(sData.Persone5) * Number(sData.Hper5);
          this.getView().getModel("PianiDetail").refresh();
        },
        formatZero: function (value) {
          return ( value !== undefined && value !== null ) ? value.replace(/^0+/, "") : value;
        },
        onSuggestSEDE: async function (oEvent) {
          if (oEvent.getParameter("suggestValue").length >= 3) {
            var sTerm = oEvent.getParameter("suggestValue");

            var ListFl = {
                Language: "IT",
                GetDetails: "X",
                N_FunclocList: [],
                N_FunclocRa: [],
                N_CategoryRa: []
            };
            if (sTerm != "" && sTerm != null) {
                ListFl.N_FunclocRa.push({Sign: "I", Option: "CP", Low: sTerm + "*"});
            }

            var allSedi = await this._saveHana("/ListFl", ListFl);
           var sHelp = this.getView().getModel("sHelp").getData();
            sHelp.SedeRealeSingle = allSedi.N_FunclocList.results;
            this.getView().getModel("sHelp").refresh(true);
        }
      },
        getValueHelp: async function () {
            var sData = {};
            var oModelHelp = new sap.ui.model.json.JSONModel();
            sData.PRIORITA = await this.Shpl("ZPM4R_D_PRIORITA", "FV");
            sData.TIPO_ORDINE = await this.Shpl("T003O", "CH");
            sData.DIVISIONE = await this.Shpl("H_T001W", "SH");
            sData.TIPO_ATTIVITA = await this.Shpl("T353I", "CH");
            sData.TIPO_GESTIONE = await this._getTableNoError("/T_TP_MAN");
            sData.TIPO_GESTIONE_1 = await this._getTableNoError("/T_TP_MAN1");
            sData.TIPO_GESTIONE_2 = await this._getTableNoError("/T_TP_MAN2");
            sData.CENTRO_LAVORO = await this._getTableNoError("/T_DEST");
            sData.SISTEMA = await this._getTableNoError("/T_ACT_SYST");
            sData.CLASSE = await this._getTableNoError("/T_ACT_CL");
            // Tipo schedulazione , Flag Collective , Unità Frequenza Tempo, PROGRES

            sData.STEUS = await this.Shpl("T430", "CH");
            sData.POINT = await this.Shpl("T370P", "CH");
            sData.LSTAR = await this.Shpl("LARTN", "SH");

            sData.MEINS = await this.Shpl("H_T006", "SH");
            sData.EKGRP = await this.Shpl("H_T024", "SH");
            sData.EKORG = await this.Shpl("H_T024E", "SH");
            sData.AFNAM = await this.Shpl("ZSKSE_MMREQUNITS", "SH");
            sData.MATKL = await this.Shpl("H_T023", "SH");

            oModelHelp.setData(sData);
            this.getView().setModel(oModelHelp, "sHelp");
        },
        handleSavePress: async function () {

            sap.ui.core.BusyIndicator.show();

            var result = {}, resultIndex = {}, actualCont = "";
            var sIndex = this.getView().getModel("PianiDetail").getData();
            var aAzioni = this.getView().getModel("AzioniDetail").getData();
            var aMatnr = this.getView().getModel("MatnrDetail").getData();
            var aServizi = this.getView().getModel("ServiziDetail").getData();
            var i,
                sURL;

            // Righe Rimosse
            for (i = 0; i < this.delAzioni.length; i++) {
                if (this.delAzioni[i].Create !== "X") {
                    sURL = "/T_ACT_EL(IndexPmo='" + this.delAzioni[i].IndexPmo + "',Cont='" + this.delAzioni[i].Cont + "')";
                    await this._removeHana(sURL, this.delAzioni[i]);

                    for (var j = 0; j < aMatnr.length; j++) {
                      if (this.delAzioni[i].Cont === aMatnr[j].Cont){
                        sURL = "/T_PMO_M(IndexPmo='" + aMatnr[j].IndexPmo + "',Cont='" + aMatnr[j].Cont + "',Matnr='" + aMatnr[j].Matnr.padStart(18, "0") + "',Maktx='" + aMatnr[j].Maktx + "')";
                        await this._removeHana(sURL, aMatnr[j]);
                      }
                    }
                    for (var k = 0; k < aServizi.length; k++) {
                      if (this.delAzioni[i].Cont === aServizi[k].Cont){
                        sURL = "/T_PMO_S(IndexPmo='" + aServizi[k].IndexPmo + "',Cont='" + aServizi[k].Cont + "',Asnum='" + aServizi[k].Asnum + "',Asktx='" + aServizi[k].Asktx + "')";
                        await this._removeHana(sURL, aServizi[k]);
                      }
                    }
                }
            }
            for (i = 0; i < this.delMaterial.length; i++) {
                if (this.delMaterial[i].Create !== "X") {
                    sURL = "/T_PMO_M(IndexPmo='" + this.delMaterial[i].IndexPmo + "',Cont='" + this.delMaterial[i].Cont + "',Matnr='" + this.delMaterial[i].Matnr.padStart(18, "0") + "',Maktx='" + this.delMaterial[i].Maktx + "')";
                    await this._removeHana(sURL, this.delMaterial[i]);
                }
            }
            for (i = 0; i < this.delServizi.length; i++) {
                if (this.delServizi[i].Create !== "X") {
                    sURL = "/T_PMO_S(IndexPmo='" + this.delServizi[i].IndexPmo + "',Cont='" + this.delServizi[i].Cont + "',Asnum='" + this.delServizi[i].Asnum + "',Asktx='" + this.delServizi[i].Asktx + "')";
                    await this._removeHana(sURL, this.delServizi[i]);
                }
            }
            if (aAzioni.length === 0){
                sIndex.FlagAttivo = "";
            }
            if (sIndex.Create !== "X"){
              sURL = "/T_PMO('" + sIndex.IndexPmo + "')";
              await this._updateHana(sURL, this.compilaIndex(sIndex));
            } else {
              sURL = "/T_PMO('" + sIndex.IndexPmo + "')";
              sIndex.Uzeit = this.createUzeit();
              result = await this._saveHana("/T_PMO", this.compilaIndex(sIndex));
              sIndex.IndexPmo = result.IndexPmo;
            }
            for (i = 0; i < aAzioni.length; i++) {
              if (aAzioni[i].FlagAttivo){
                aAzioni[i].FlagAttivo = "X";
              } else {
                aAzioni[i].FlagAttivo = "";
              }
                if (aAzioni[i].Create !== "X") {
                    sURL = "/" + aAzioni[i].__metadata.uri.split("/")[aAzioni[i].__metadata.uri.split("/").length - 1];
                    await this._updateHana(sURL, this.compilaAzione(aAzioni[i]));
                    actualCont = aAzioni[i].Cont;
                } else {
                    aAzioni[i].IndexPmo = sIndex.IndexPmo;
                    actualCont = aAzioni[i].Cont;
                    aAzioni[i].Cont = "";
                    aAzioni[i].Uzeit = this.createUzeit();
                    result = await this._saveHana("/T_ACT_EL", this.compilaAzione(aAzioni[i]));
                    aAzioni[i].Cont = result.Cont;
                }

                for (var j = 0; j < aMatnr.length; j++) {
                  if (actualCont.toString() === aMatnr[j].Cont.toString()){
                    if (aMatnr[j].Create !== "X") {
                        sURL = "/" + aMatnr[j].__metadata.uri.split("/")[aMatnr[j].__metadata.uri.split("/").length - 1];
                        await this._updateHana(sURL, this.compilaMatnr(aMatnr[j]));
                    } else {
                        aMatnr[j].IndexPmo = sIndex.IndexPmo;
                        aMatnr[j].Cont = aAzioni[i].Cont;
                        await this._saveHana("/T_PMO_M", this.compilaMatnr(aMatnr[j]));
                    }
                  }
                }
                for (var k = 0; k < aServizi.length; k++) {
                  if (actualCont.toString() === aServizi[k].Cont.toString()){
                    if (aServizi[k].Create !== "X") {
                        sURL = "/" + aServizi[k].__metadata.uri.split("/")[aServizi[k].__metadata.uri.split("/").length - 1];
                        await this._updateHana(sURL, this.compilaServizi(aServizi[k]));
                    } else {
                        aServizi[k].IndexPmo = sIndex.IndexPmo;
                        aServizi[k].Cont = aAzioni[i].Cont;
                        await this._saveHana("/T_PMO_S", this.compilaServizi(aServizi[k]));
                    }
                  }
                }
            }
            if (this.selCOPY !== "X"){
              MessageBox.success("Indice modificato con successo");
            } else {
              MessageBox.success("Indice " + sIndex.IndexPmo + " creato con successo");
            }
            this.navTo("ViewPage", {ret: "X"});
            sap.ui.core.BusyIndicator.hide();
        },
        compilaIndex: function (sIndex) {
            delete sIndex.Create;
            delete sIndex.JoinPMO;
            delete sIndex.T_ACT_ELSet;
            delete sIndex.T_PMO_MSet;
            delete sIndex.T_PMO_SSet;
            //delete sIndex.Uzeit;
            delete sIndex.__metadata;

            if (sIndex.Divisioneu === undefined || sIndex.Divisioneu === null) {
                delete sIndex.Divisioneu;
            }
            if (sIndex.FineVal === undefined || sIndex.FineVal === null) {
                delete sIndex.FineVal;
            }
            if (sIndex.InizioVal === undefined || sIndex.InizioVal === null) {
                delete sIndex.InizioVal;
            }
            if (sIndex.Uzeit === undefined || sIndex.Uzeit === null) {
                delete sIndex.Uzeit;
            }
            if (sIndex.Appuntam === undefined || sIndex.Appuntam === null) {
                delete sIndex.Appuntam;
            }
            if (sIndex.Azione === undefined || sIndex.Azione === null) {
                delete sIndex.Azione;
            }
            if (sIndex.Banfn === undefined || sIndex.Banfn === null) {
                delete sIndex.Banfn;
            }
            if (sIndex.Cdl === undefined || sIndex.Cdl === null) {
                delete sIndex.Cdl;
            }
            if (sIndex.Cdl1 === undefined || sIndex.Cdl1 === null) {
                delete sIndex.Cdl1;
            }
            if (sIndex.Cdl2 === undefined || sIndex.Cdl2 === null) {
                delete sIndex.Cdl2;
            }
            if (sIndex.Cdl3 === undefined || sIndex.Cdl3 === null) {
                delete sIndex.Cdl3;
            }
            if (sIndex.Cdl4 === undefined || sIndex.Cdl4 === null) {
                delete sIndex.Cdl4;
            }
            if (sIndex.Cdl5 === undefined || sIndex.Cdl5 === null) {
                delete sIndex.Cdl5;
            }
            if (sIndex.CentroLavoro === undefined || sIndex.CentroLavoro === null) {
                delete sIndex.CentroLavoro;
            }
            if (sIndex.Ciclo === undefined || sIndex.Ciclo === null) {
                delete sIndex.Ciclo;
            }
            if (sIndex.Classe === undefined || sIndex.Classe === null) {
                delete sIndex.Classe;
            }
            if (sIndex.CodAzione === undefined || sIndex.CodAzione === null) {
                delete sIndex.CodAzione;
            }
            if (sIndex.Collective === undefined || sIndex.Collective === null) {
                delete sIndex.Collective;
            }
            if (sIndex.Criticita === undefined || sIndex.Criticita === null) {
                delete sIndex.Criticita;
            }
            if (sIndex.DataInizCiclo === undefined || sIndex.DataInizCiclo === null) {
                delete sIndex.DataInizCiclo;
            }
            if (sIndex.Datum === undefined || sIndex.Datum === null) {
                delete sIndex.Datum;
            } else {
              sIndex.Datum = new Date();
            }
            if (sIndex.Daune === undefined || sIndex.Daune === null) {
                delete sIndex.Daune;
            }
            if (sIndex.DayAdv === undefined || sIndex.DayAdv === null) {
                delete sIndex.DayAdv;
            }
            if (sIndex.DesBreve === undefined || sIndex.DesBreve === null) {
                delete sIndex.DesBreve;
            }
            if (sIndex.DesComponente === undefined || sIndex.DesComponente === null) {
                delete sIndex.DesComponente;
            }
            if (sIndex.DesEstesa === undefined || sIndex.DesEstesa === null) {
                delete sIndex.DesEstesa;
            }
            if (sIndex.Destinatario === undefined || sIndex.Destinatario === null) {
                delete sIndex.Destinatario;
            }
            if (sIndex.Determinanza === undefined || sIndex.Determinanza === null) {
                delete sIndex.Determinanza;
            }
            if (sIndex.Differibile === undefined || sIndex.Differibile === null) {
                delete sIndex.Differibile;
            }
            if (sIndex.Divisionec === undefined || sIndex.Divisionec === null) {
                delete sIndex.Divisionec;
            }
            if (sIndex.DurataCiclo === undefined || sIndex.DurataCiclo === null) {
                delete sIndex.DurataCiclo;
            }
            if (sIndex.EquipmentCompo === undefined || sIndex.EquipmentCompo === null) {
                delete sIndex.EquipmentCompo;
            }
            if (sIndex.EquipmentOdm === undefined || sIndex.EquipmentOdm === null) {
                delete sIndex.EquipmentOdm;
            }
            if (sIndex.FineCard === undefined || sIndex.FineCard === null) {
                delete sIndex.FineCard;
            }
            if (sIndex.FlagAttivo === undefined || sIndex.FlagAttivo === null) {
                delete sIndex.FlagAttivo;
            }
            if (sIndex.FlagInterc === undefined || sIndex.FlagInterc === null) {
                delete sIndex.FlagInterc;
            }
            if (sIndex.FlagMateriali === undefined || sIndex.FlagMateriali === null) {
                delete sIndex.FlagMateriali;
            }
            if (sIndex.FlagOdm === undefined || sIndex.FlagOdm === null) {
                delete sIndex.FlagOdm;
            }
            if (sIndex.FlagPrestazioni === undefined || sIndex.FlagPrestazioni === null) {
                delete sIndex.FlagPrestazioni;
            }
            if (sIndex.FlgMail === undefined || sIndex.FlgMail === null) {
                delete sIndex.FlgMail;
            }
            if (sIndex.Frequenza === undefined || sIndex.Frequenza === null) {
                delete sIndex.Frequenza;
            }
            if (sIndex.Hper === undefined || sIndex.Hper === null) {
                delete sIndex.Hper;
            }
            if (sIndex.Hper1 === undefined || sIndex.Hper1 === null) {
                delete sIndex.Hper1;
            }
            if (sIndex.Hper2 === undefined || sIndex.Hper2 === null) {
                delete sIndex.Hper2;
            }
            if (sIndex.Hper3 === undefined || sIndex.Hper3 === null) {
                delete sIndex.Hper3;
            }
            if (sIndex.Hper4 === undefined || sIndex.Hper4 === null) {
                delete sIndex.Hper4;
            }
            if (sIndex.Hper5 === undefined || sIndex.Hper5 === null) {
                delete sIndex.Hper5;
            }
            if (sIndex.Indisponibilita === undefined || sIndex.Indisponibilita === null) {
                delete sIndex.Indisponibilita;
            }
            if (sIndex.IntegTxtEsteso === undefined || sIndex.IntegTxtEsteso === null) {
                delete sIndex.IntegTxtEsteso;
            }
            if (sIndex.Lstar === undefined || sIndex.Lstar === null) {
                delete sIndex.Lstar;
            }
            if (sIndex.Lstar1 === undefined || sIndex.Lstar1 === null) {
                delete sIndex.Lstar1;
            }
            if (sIndex.Lstar2 === undefined || sIndex.Lstar2 === null) {
                delete sIndex.Lstar2;
            }
            if (sIndex.Lstar3 === undefined || sIndex.Lstar3 === null) {
                delete sIndex.Lstar3;
            }
            if (sIndex.Lstar4 === undefined || sIndex.Lstar4 === null) {
                delete sIndex.Lstar4;
            }
            if (sIndex.Lstar5 === undefined || sIndex.Lstar5 === null) {
                delete sIndex.Lstar5;
            }
            if (sIndex.Num === undefined || sIndex.Num === null) {
                delete sIndex.Num;
            }
            if (sIndex.Num1 === undefined || sIndex.Num1 === null) {
                delete sIndex.Num1;
            }
            if (sIndex.Num2 === undefined || sIndex.Num2 === null) {
                delete sIndex.Num2;
            }
            if (sIndex.Num3 === undefined || sIndex.Num3 === null) {
                delete sIndex.Num3;
            }
            if (sIndex.Num4 === undefined || sIndex.Num4 === null) {
                delete sIndex.Num4;
            }
            if (sIndex.Num5 === undefined || sIndex.Num5 === null) {
                delete sIndex.Num5;
            }
            if (sIndex.Percorso === undefined || sIndex.Percorso === null) {
                delete sIndex.Percorso;
            }
            if (sIndex.Persone === undefined || sIndex.Persone === null) {
                delete sIndex.Persone;
            }
            if (sIndex.Persone1 === undefined || sIndex.Persone1 === null) {
                delete sIndex.Persone1;
            }
            if (sIndex.Persone2 === undefined || sIndex.Persone2 === null) {
                delete sIndex.Persone2;
            }
            if (sIndex.Persone3 === undefined || sIndex.Persone3 === null) {
                delete sIndex.Persone3;
            }
            if (sIndex.Persone4 === undefined || sIndex.Persone4 === null) {
                delete sIndex.Persone4;
            }
            if (sIndex.Persone5 === undefined || sIndex.Persone5 === null) {
                delete sIndex.Persone5;
            }
            if (sIndex.Point === undefined || sIndex.Point === null) {
                delete sIndex.Point;
            }
            if (sIndex.Priorita === undefined || sIndex.Priorita === null) {
                delete sIndex.Priorita;
            }
            if (sIndex.Progres === undefined || sIndex.Progres === null) {
                delete sIndex.Progres;
            }
            if (sIndex.Scostamento === undefined || sIndex.Scostamento === null) {
                delete sIndex.Scostamento;
            }
            if (sIndex.SedeTecOdm === undefined || sIndex.SedeTecOdm === null) {
                delete sIndex.SedeTecOdm;
            }
            if (sIndex.Sistema === undefined || sIndex.Sistema === null) {
                delete sIndex.Sistema;
            }
            if (sIndex.StComponente === undefined || sIndex.StComponente === null) {
                delete sIndex.StComponente;
            }
            if (sIndex.Steus === undefined || sIndex.Steus === null) {
                delete sIndex.Steus;
            }
            if (sIndex.Steus1 === undefined || sIndex.Steus1 === null) {
                delete sIndex.Steus1;
            }
            if (sIndex.Steus2 === undefined || sIndex.Steus2 === null) {
                delete sIndex.Steus2;
            }
            if (sIndex.Steus3 === undefined || sIndex.Steus3 === null) {
                delete sIndex.Steus3;
            }
            if (sIndex.Steus4 === undefined || sIndex.Steus4 === null) {
                delete sIndex.Steus4;
            }
            if (sIndex.Steus5 === undefined || sIndex.Steus5 === null) {
                delete sIndex.Steus5;
            }
            if (sIndex.TipoAggr === undefined || sIndex.TipoAggr === null) {
                delete sIndex.TipoAggr;
            }
            if (sIndex.TipoAttivita === undefined || sIndex.TipoAttivita === null) {
                delete sIndex.TipoAttivita;
            }
            if (sIndex.TipoGestione === undefined || sIndex.TipoGestione === null) {
                delete sIndex.TipoGestione;
            }
            if (sIndex.TipoGestione1 === undefined || sIndex.TipoGestione1 === null) {
                delete sIndex.TipoGestione1;
            }
            if (sIndex.TipoGestione2 === undefined || sIndex.TipoGestione2 === null) {
                delete sIndex.TipoGestione2;
            }
            if (sIndex.TipoOrdine === undefined || sIndex.TipoOrdine === null) {
                delete sIndex.TipoOrdine;
            }
            if (sIndex.TipoPmo === undefined || sIndex.TipoPmo === null) {
                delete sIndex.TipoPmo;
            }
            if (sIndex.Toth === undefined || sIndex.Toth === null) {
                delete sIndex.Toth;
            }
            if (sIndex.Toth1 === undefined || sIndex.Toth1 === null) {
                delete sIndex.Toth1;
            }
            if (sIndex.Toth2 === undefined || sIndex.Toth2 === null) {
                delete sIndex.Toth2;
            }
            if (sIndex.Toth3 === undefined || sIndex.Toth3 === null) {
                delete sIndex.Toth3;
            }
            if (sIndex.Toth4 === undefined || sIndex.Toth4 === null) {
                delete sIndex.Toth4;
            }
            if (sIndex.Toth5 === undefined || sIndex.Toth5 === null) {
                delete sIndex.Toth5;
            }
            if (sIndex.TxtCiclo === undefined || sIndex.TxtCiclo === null) {
                delete sIndex.TxtCiclo;
            }
            if (sIndex.UltimaEsecuz === undefined || sIndex.UltimaEsecuz === null) {
                delete sIndex.UltimaEsecuz;
            }
            if (sIndex.Uname === undefined || sIndex.Uname === null) {
                delete sIndex.Uname;
            }
            if (sIndex.UnitaCiclo === undefined || sIndex.UnitaCiclo === null) {
                delete sIndex.UnitaCiclo;
            }

            return sIndex;
        },
        compilaAzione: function (sAzione) {
            delete sAzione.JoinPMO;
            //delete sAzione.Uzeit;
            delete sAzione.__metadata;
            delete sAzione.Create;

            if (sAzione.Cont === undefined || sAzione.Cont === null || sAzione.Create === "X") {
                delete sAzione.Cont;
            }
            if (sAzione.Uzeit === undefined || sAzione.Uzeit === null || sAzione.Uzeit === "X") {
              delete sAzione.Uzeit;
            }
            if (sAzione.Sistem === undefined || sAzione.Sistem === null) {
                delete sAzione.Sistem;
            }
            if (sAzione.Progres === undefined || sAzione.Progres === null) {
                delete sAzione.Progres;
            }
            if (sAzione.Classe === undefined || sAzione.Classe === null) {
                delete sAzione.Classe;
            }
            if (sAzione.DesComponente === undefined || sAzione.DesComponente === null) {
                delete sAzione.DesComponente;
            }
            if (sAzione.Tplnr === undefined || sAzione.Tplnr === null) {
                delete sAzione.Tplnr;
            }
            if (sAzione.Equipment === undefined || sAzione.Equipment === null) {
                delete sAzione.Equipment;
            }
            if (sAzione.ComponentTipo === undefined || sAzione.ComponentTipo === null) {
                delete sAzione.ComponentTipo;
            }
            if (sAzione.DesBreve === undefined || sAzione.DesBreve === null) {
                delete sAzione.DesBreve;
            }
            if (sAzione.IntegTxtEsteso === undefined || sAzione.IntegTxtEsteso === null) {
                delete sAzione.IntegTxtEsteso;
            }
            if (sAzione.FlagAttivo === undefined || sAzione.FlagAttivo === null) {
                delete sAzione.FlagAttivo;
            }
            if (sAzione.Datum === undefined || sAzione.Datum === null) {
                delete sAzione.Datum;
            }
            if (sAzione.Uname === undefined || sAzione.Uname === null) {
                delete sAzione.Uname;
            }

            return sAzione;
        },
        compilaMatnr: function (sMatnr) {
            delete sMatnr.JoinPMO;
            delete sMatnr.__metadata;
            delete sMatnr.Create;

            if (sMatnr.Matnr === undefined || sMatnr.Matnr === null) {
                delete sMatnr.Matnr;
            } else {
                sMatnr.Matnr = sMatnr.Matnr.padStart(18, "0");
            }
            if (sMatnr.Maktx === undefined || sMatnr.Maktx === null) {
                delete sMatnr.Maktx;
            }
            if (sMatnr.Menge === undefined || sMatnr.Menge === null) {
                delete sMatnr.Menge;
            }
            if (sMatnr.Meins === undefined || sMatnr.Meins === null) {
                delete sMatnr.Meins;
            }
            if (sMatnr.Lgort === undefined || sMatnr.Lgort === null) {
                delete sMatnr.Lgort;
            }
            if (sMatnr.Werks === undefined || sMatnr.Werks === null) {
                delete sMatnr.Werks;
            }
            if (sMatnr.Charg === undefined || sMatnr.Charg === null) {
                delete sMatnr.Charg;
            }
            if (sMatnr.Tbtwr === undefined || sMatnr.Tbtwr === null) {
                delete sMatnr.Tbtwr;
            }
            if (sMatnr.Waers === undefined || sMatnr.Waers === null) {
                delete sMatnr.Waers;
            }
            if (sMatnr.Ekgrp === undefined || sMatnr.Ekgrp === null) {
                delete sMatnr.Ekgrp;
            }
            if (sMatnr.Ekorg === undefined || sMatnr.Ekorg === null) {
                delete sMatnr.Ekorg;
            }
            if (sMatnr.Afnam === undefined || sMatnr.Afnam === null) {
                delete sMatnr.Afnam;
            }
            if (sMatnr.Matkl === undefined || sMatnr.Matkl === null) {
                delete sMatnr.Matkl;
            }

            return sMatnr;
        },
        compilaServizi: function (sServizi) {
            delete sServizi.JoinPMO;
            delete sServizi.__metadata;
            delete sServizi.Create;

            if (sServizi.Asnum === undefined || sServizi.Asnum === null) {
                delete sServizi.Asnum;
            }
            if (sServizi.Asktx === undefined || sServizi.Asktx === null) {
                delete sServizi.Asktx;
            }
            if (sServizi.Menge === undefined || sServizi.Menge === null) {
                delete sServizi.Menge;
            }
            if (sServizi.Meins === undefined || sServizi.Meins === null) {
                delete sServizi.Meins;
            }
            if (sServizi.Tbtwr === undefined || sServizi.Tbtwr === null) {
                delete sServizi.Tbtwr;
            }
            if (sServizi.Waers === undefined || sServizi.Waers === null) {
                delete sServizi.Waers;
            }
            if (sServizi.Ekgrp === undefined || sServizi.Ekgrp === null) {
                delete sServizi.Ekgrp;
            }
            if (sServizi.Ekorg === undefined || sServizi.Ekorg === null) {
                delete sServizi.Ekorg;
            }
            if (sServizi.Afnam === undefined || sServizi.Afnam === null) {
                delete sServizi.Afnam;
            }
            if (sServizi.Matkl === undefined || sServizi.Matkl === null) {
                delete sServizi.Matkl;
            }

            return sServizi;
        },
        onColumnAE: function () {
            this._oTPCAE.openDialog();
        },
        onCopyAE: function () {
            sap.ui.core.BusyIndicator.show();
            var sel = this.getView().byId("tAzioni").getSelectedItems();
            for (var i = 0; i < sel.length; i++) {
                var line = JSON.stringify(sel[i].getBindingContext("AzioniDetail").getObject());
                line = JSON.parse(line);
                line.Cont = "";
                line.Create = "X";
                this.getView().getModel("AzioniDetail").getData().push(line);

            }
            this.getView().byId("tAzioni").removeSelections();
            this.getView().getModel("AzioniDetail").refresh();
            sap.ui.core.BusyIndicator.hide();
        },
        onAddAE: function () {
            this.getView().getModel("AzioniDetail").getData().push(this.initAEModel());
            this.getView().getModel("AzioniDetail").refresh();
        },
        onCancelAE: function () {
            var sel = this.getView().byId("tAzioni").getSelectedItems();
            var AZIONI = this.getView().getModel("AzioniDetail").getData();
            // var deleteRecord = oEvent.getSource().getBindingContext("sSelect").getObject();
            for (var i =( sel.length - 1); i >= 0; i--) {
                var line = sel[i].getBindingContext("AzioniDetail").getObject();
                this.delAzioni.push(line);
                AZIONI.splice(Number(sel[i].getId().split("-").pop()), 1);
            }
            this.getView().getModel("AzioniDetail").refresh();
            this.getView().byId("tAzioni").removeSelections();
        },
        onConfSpostaAE: function () {
          var sel = this.getView().byId("tAzioni").getSelectedItems();
          if (sel.length === 0){
            MessageBox.warning("seleziona una riga");
          } else {
          if (!this.oSubmitDialog) {
            this.oSubmitDialog = new sap.m.Dialog({
              type: sap.m.DialogType.Message,
              title: "Conferma",
              content: [
                new sap.m.Label({
                  text: "In quale Indice vuoi spostarle?",
                  labelFor: "inSpostaAE"
                }),
                new sap.m.Input("inSpostaAE", {
                  width: "100%",
                  placeholder: "",
                  type: "Number"
                })
              ],
              beginButton: new sap.m.Button({
                type: sap.m.ButtonType.Emphasized,
                text: "Salva",
                press: function () {
                  var sText = sap.ui.getCore().byId("inSpostaAE").getValue();
                  if (sText !== ""){
                  this.onSpostaAE(sText);
                  this.oSubmitDialog.close();
                  } else {
                    MessageBox.warning("Inserire Indice");
                  }
                }.bind(this)
              }),
              endButton: new sap.m.Button({
                text: "Annulla",
                press: function () {
                  this.oSubmitDialog.close();
                }.bind(this)
              })
            });
          }
          this.oSubmitDialog.open();
        }
        },
        onSpostaAE: function (sText) {
            var sel = this.getView().byId("tAzioni").getSelectedItems();
            var AZIONI = this.getView().getModel("AzioniDetail").getData();
            // var deleteRecord = oEvent.getSource().getBindingContext("sSelect").getObject();
            for (var i =( sel.length - 1); i >= 0; i--) {
                var line = sel[i].getBindingContext("AzioniDetail").getObject();
                this.delAzioni.push(line);

                line = JSON.stringify(line);
                line = JSON.parse(line);
                line.IndexPmo = sText;
                this.spostaAzioni.push(line);

                AZIONI.splice(Number(sel[i].getId().split("-").pop()), 1);
            }
            this.getView().getModel("AzioniDetail").refresh();
            this.getView().byId("tAzioni").removeSelections();
        },
        initAEModel: function () {

            var Azioni = {
                Cont: "",
                FlagAttivo: "X",
                Datum: new Date(),
                Sistem: "",
                Progres: null,
                Classe: "",
                DesComponente: "",
                Tplnr: "",
                Equipment: "",
                DesBreve: "",
                ComponentTipo: "",
                IntegTxtEsteso: "",
                Uname: "",
                Create: "X"
            };
            return Azioni;

        },
        onColumnS: function () {
            this._oTPCS.openDialog();
        },
        onCopyS: function () {
            sap.ui.core.BusyIndicator.show();
            var sel = this.getView().byId("tServizi").getSelectedItems();
            for (var i = 0; i < sel.length; i++) {
                var line = JSON.stringify(sel[i].getBindingContext("ServiziDetail").getObject());
                line = JSON.parse(line);
                line.Create = "X";
                this.getView().getModel("ServiziDetail").getData().push(line);

            }
            this.getView().byId("tServizi").removeSelections();
            this.getView().getModel("ServiziDetail").refresh();
            sap.ui.core.BusyIndicator.hide();
        },
        onAddS: function () {
            this.getView().getModel("ServiziDetail").getData().push(this.initSModel());
            this.getView().getModel("ServiziDetail").refresh();
        },
        onCancelS: function () {
            var sel = this.getView().byId("tServizi").getSelectedItems();
            var SERVIZI = this.getView().getModel("ServiziDetail").getData();
            // var deleteRecord = oEvent.getSource().getBindingContext("sSelect").getObject();
            for (var i =( sel.length - 1); i >= 0; i--) {
                var line = sel[i].getBindingContext("ServiziDetail").getObject();
                this.delServizi.push(line);
                SERVIZI.splice(Number(sel[i].getId().split("-").pop()), 1);
            }
            this.getView().getModel("ServiziDetail").refresh();
            this.getView().byId("tServizi").removeSelections();
        },
        initSModel: function () {

            var Servizi = {
                Cont: "",
                IndexPmo: "",
                Asnum: "",
                Asktx: "",
                Menge: "",
                Meins: "",
                Tbtwr: "",
                Waers: "",
                Ekgrp: "",
                Ekorg: "",
                Afnam: "",
                Matkl: "",
                Create: "X"
            };
            return Servizi;

        },
        onColumnM: function () {
            this._oTPCM.openDialog();
        },
        onCopyM: function () {
            sap.ui.core.BusyIndicator.show();
            var sel = this.getView().byId("tMateriali").getSelectedItems();
            for (var i = 0; i < sel.length; i++) {
                var line = JSON.stringify(sel[i].getBindingContext("MatnrDetail").getObject());
                line = JSON.parse(line);
                line.Create = "X";
                this.getView().getModel("MatnrDetail").getData().push(line);

            }
            this.getView().byId("tMateriali").removeSelections();
            this.getView().getModel("MatnrDetail").refresh();
            sap.ui.core.BusyIndicator.hide();
        },
        onAddM: function () {
            this.getView().getModel("MatnrDetail").getData().push(this.initMModel());
            this.getView().getModel("MatnrDetail").refresh();
        },
        onCancelM: function () {
            var sel = this.getView().byId("tMateriali").getSelectedItems();
            var MATNR = this.getView().getModel("MatnrDetail").getData();
            // var deleteRecord = oEvent.getSource().getBindingContext("sSelect").getObject();
            for (var i =( sel.length - 1); i >= 0; i--) {
                var line = sel[i].getBindingContext("MatnrDetail").getObject();
                this.delMaterial.push(line);
                MATNR.splice(Number(sel[i].getId().split("-").pop()), 1);
            }
            this.getView().getModel("MatnrDetail").refresh();
            this.getView().byId("tMateriali").removeSelections();
        },
        initMModel: function () {

            var Materiali = {
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
                Matkl: "",
                Create: "X"
            };
            return Materiali;

        },
        onBack: function () {
          this.navTo("ViewPage", {ret: "X"});
        },
        onSuggestLgort: async function (oEvent) {
          debugger
            var sSelect = oEvent.getSource().getBindingContext("MatnrDetail").getObject();
            if (oEvent.getParameter("suggestValue").length >= 0 || (sSelect.Werks !== "" && sSelect.Werks !== undefined && sSelect.Werks !== null)) {

                var aFilter = [];
                if (sSelect.Werks !== "" && sSelect.Werks !== undefined && sSelect.Werks !== null) {
                    aFilter.push(new Filter("Werks", FilterOperator.EQ, sSelect.Werks));
                }
                if (oEvent.getParameter("suggestValue").length >= 0) {
                    aFilter.push(new Filter("Code", FilterOperator.EQ, sSelect.Lgort));
                }

                var sHelp = this.getView().getModel("sHelp").getData();
                sHelp.LGORT = await this._getTableNoError("/StorageList", aFilter);
                this.getView().getModel("sHelp").refresh();
            }
        },
        onSuggestMatnrSelect: function (oEvent) {
            var sel = this.getView().getModel("sHelp").getData().MATNR[oEvent.getSource().getSelectedItem().split("-").pop()];
            var sSelect = oEvent.getSource().getBindingContext("MatnrDetail").getObject();
            sSelect.Maktx = sel.Fieldname4;
            this.getView().getModel("MatnrDetail").refresh();
        },
        onSuggestMatnr: async function (oEvent) {
            if (oEvent.getParameter("suggestValue").length >= 7) {

                var sSelect = oEvent.getSource().getBindingContext("MatnrDetail").getObject();

                var aFilter = [];
                if (sSelect.Werks !== "" && sSelect.Werks !== undefined && sSelect.Werks !== null) {
                    aFilter.push({
                        "Shlpname": "ZPM4R_SH_MATNR",
                        "Shlpfield": "WERKS",
                        "Sign": "I",
                        "Option": "EQ",
                        "Low": sSelect.Werks
                    });
                }
                aFilter.push({
                    "Shlpname": "ZPM4R_SH_MATNR",
                    "Shlpfield": "SPRAS",
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "IT"
                });
                aFilter.push({
                    "Shlpname": "ZPM4R_SH_MATNR",
                    "Shlpfield": "MATNR",
                    "Sign": "I",
                    "Option": "CP",
                    "Low": oEvent.getParameter("suggestValue") + "*"
                });
                var sHelp = this.getView().getModel("sHelp").getData();
                sHelp.MATNR = await this.Shpl("ZPM4R_SH_MATNR", "SH", aFilter);
                this.getView().getModel("sHelp").refresh();
            }
        },
        onSuggestProgress2: async function (oEvent) {
            var sel = oEvent.getSource().getBindingContext("PianiDetail").getObject();

            var aFilters = [];
            if (sel.Divisioneu !== undefined && sel.Divisioneu !== "" && sel.Divisioneu !== null) {
                aFilters.push(new Filter("Divisioneu", FilterOperator.EQ, sel.Divisioneu));
            }
            if (sel.Sistema !== undefined && sel.Sistema !== "" && sel.Sistema !== null) {
                aFilters.push(new Filter("Sistema", FilterOperator.EQ, sel.Sistema));
            }
            var sHelp = this.getView().getModel("sHelp").getData();
            sHelp.PROGRES2 = await this._getTableNoError("/T_ACT_PROG", aFilters);
            this.getView().getModel("sHelp").refresh();
        },
        onSuggestProgress: async function (oEvent) {
          var sSelect = oEvent.getSource().getBindingContext("AzioniDetail").getObject();
            if (oEvent.getParameter("suggestValue").length >= 1 ) {

                var aFilter = [];
                if (sSelect.Sistema !== "" && sSelect.Sistema !== undefined && sSelect.Sistema !== null) {
                    aFilter.push(new Filter("Sistema", FilterOperator.EQ, sSelect.Sistema));
                }
                if (oEvent.getParameter("suggestValue").length >= 0) {
                    aFilter.push(new Filter("Progres", "CP", oEvent.getParameter("suggestValue")));
                }

                var sHelp = this.getView().getModel("sHelp").getData();
                sHelp.PROGRES = await this._getTableNoError("/T_ACT_PROG", aFilter);
                this.getView().getModel("sHelp").refresh();
            }
      },
        onSuggestAsnum: async function (oEvent) {
            if (oEvent.getParameter("suggestValue").length >= 5) {
                var aFilter = [];
                aFilter.push({
                    "Shlpname": "ZPM4R_SH_ASNUM",
                    "Shlpfield": "ASNUM",
                    "Sign": "I",
                    "Option": "CP",
                    "Low": oEvent.getParameter("suggestValue") + "*"
                });
                var sHelp = this.getView().getModel("sHelp").getData();
                sHelp.ASNUM = await this.Shpl("ZPM4R_SH_ASNUM", "SH", aFilter);
                this.getView().getModel("sHelp").refresh(true);
            }
        },
        onSuggestEquipment: async function (oEvent) {
            var sTerm = oEvent.getParameter("suggestValue");
            if (sTerm.length >= 3) {
                var aFilter = [];
                aFilter.push({
                    "Shlpname": "ZPM4R_SH_EQUI",
                    "Shlpfield": "SPRAS",
                    "Sign": "I",
                    "Option": "EQ",
                    "Low": "IT"
                });
                aFilter.push({
                    "Shlpname": "ZPM4R_SH_EQUI",
                    "Shlpfield": "EQUNR",
                    "Sign": "I",
                    "Option": "CP",
                    "Low": oEvent.getParameter("suggestValue") + "*"
                });
                var sHelp = this.getView().getModel("sHelp").getData();
                sHelp.EQUIPMENT = await this.Shpl("ZPM4R_SH_EQUI", "SH", aFilter);
                this.getView().getModel("sHelp").refresh(true);
            }
        }
    });
});
