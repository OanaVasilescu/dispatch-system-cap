sap.ui.define([
    "riskapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "riskapp/utils/URLs",
    "sap/ui/core/Fragment"
], function (BaseController, JSONModel, URLs, Fragment) {
    "use strict";

    return BaseController.extend("riskapp.controller.AlarmScenarios", {
        onInit() {
        },

        openScenarioDialog: function () {
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

        handleCancelAddScenario: function () {
            this.byId("addAlarm").close();
        }
    });
});