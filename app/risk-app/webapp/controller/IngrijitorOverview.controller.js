sap.ui.define([
    "riskapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "riskapp/utils/URLs"
], function (BaseController, JSONModel, URLs) {
    "use strict";

    return BaseController.extend("riskapp.controller.IngrijitorOverview", {
        onInit() {
            this.getRouter().getRoute("IngrijitorOverview").attachPatternMatched(this.initCarerPage, this);
            this.getView().setModel(new JSONModel(), "roleModel");
        },
        onItemSelect: function (oEvent) {
            let oItem = oEvent.getParameter("item");
            this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        },


        initCarerPage: function () {
            const user = JSON.parse(localStorage.getItem("userModel")).value[0].user
            const token = JSON.parse(localStorage.getItem("userModel")).value[0].token
            if (!user || user.userRole !== "Carer") {
                this.getRouter().navTo("Login");
            }

            if (!user.pacient) {
                this.getView().getModel("roleModel").setProperty("/hasPacient", false)
                return;
            }

            this.getView().getModel("roleModel").setProperty("/hasPacient", true)
            // TODO: verify if token is still valid, otherwise just redirect to login
            // TODO: if token is expired => delete data from local storage I guess
        }
    });
});
