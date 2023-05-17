sap.ui.define([
    "riskapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "riskapp/utils/URLs"
], function (BaseController, JSONModel, URLs) {
    "use strict";

    return BaseController.extend("riskapp.controller.PacientOverview", {
        onInit() {
            this.getRouter().getRoute("PacientOverview").attachPatternMatched(this.initPage, this);
        },


        initPage: function () {
            const user = JSON.parse(localStorage.getItem("userModel")).value[0].user
            const token = JSON.parse(localStorage.getItem("userModel")).value[0].token
            if (!user || user.userRole !== "PACIENT") //TODO; or if not carer
            {
                this.getRouter().navTo("Login");
            }

            // TODO: verify if token is still valid, otherwise just redirect to the overview of that role
        }
    });
});
