sap.ui.define([
    "riskapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "riskapp/utils/URLs",
    "sap/ui/core/Fragment"
], function (BaseController, JSONModel, URLs, Fragment) {
    "use strict";

    return BaseController.extend("riskapp.controller.AlarmScenarios", {
        onInit() {
          let alarmModel = new JSONModel();
          this.getView().setModel(alarmModel, "alarmModel");
        },

        openScenarioDialog: function() {
            let view = this.getView();
            if (!this._lPop) {
                this._lPop = Fragment.load({
                  id: view.getId(),
                  name: "riskapp.view.fragments.AddAlarmScenario",
                  controller: this
                }).then((mPop) => {
                  this.getView().addDependent(mPop);
                  return mPop;
                });
              }
              this._lPop.then(function (mPop) {
                mPop.open();
              })
        },

        handleYesAddScenario: async function() {
          const oData = this.getView().getModel("alarmModel").getData();
          console.log(oData);

          await this.post("/app/AlarmScenarios", oData).then(async (data) => {
            this.messageHandler("Alarm scenario has been created");
          }).catch((err) => {
              this.messageHandler("uploadRiskEventError");
              return "error";
          });
        },

        handleCancelAddScenario: function() {
            this.byId("addAlarm").close();
        }
    });
});