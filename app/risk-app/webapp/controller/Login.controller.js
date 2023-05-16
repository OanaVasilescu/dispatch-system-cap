sap.ui.define([
    "riskapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "riskapp/utils/URLs"
], function (BaseController, JSONModel, URLs) {
    "use strict";

    return BaseController.extend("riskapp.controller.Login", {
        onInit() {
            let newUser = new JSONModel();
            this.getView().setModel(newUser, "newUser");
        },

        onRegisterHerePress: function (evt) {
            let newUser = new JSONModel();
            this.getView().setModel(newUser, "newUser");
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Register");
        },



        checkEmail: function () {
            let userCheck = this.getView().getModel("newUser").getData();
            let email = userCheck.email;
            if (Validations.validateEmail(email)) {
                this.getView().getModel("newUser").setProperty("/emailState", "None");
            } else {
                this.getView()
                    .getModel("newUser")
                    .setProperty("/emailState", "Error");
            }
        },

        checkPassword: function () {
            let userCheck = this.getView().getModel("newUser").getData();
            let password = userCheck.password;
            if (password) {
                this.getView()
                    .getModel("newUser")
                    .setProperty("/passwordState", "None");
            } else {
                this.getView()
                    .getModel("newUser")
                    .setProperty("/passwordState", "Error");
            }
        },

        onLogin: function () {
            const data = this.getView().getModel("newUser").oData;
            const email = data.email;
            const password = data.password;
            if (Validations.validateEmail(email) && password) {

                const dataI = JSON.parse(JSON.stringify(data));
                dataI.password = this.encryptPassword(data.password);

                this.post("http://localhost:3000/login", dataI)
                    .then((response) => {
                        let newUser = new JSONModel();
                        this.getView().setModel(newUser, "newUser");
                        MessageToast.show(this.getI18nMessage("LOGIN_SUCCESSFUL"));
                        document.cookie = `token=${response.accessToken}`;
                        document.cookie = `id=${response.user._id}`;
                        let oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("LandingPage");

                        this.getView().getModel("newUser").setProperty("/emailState", "None");
                        this.getView()
                            .getModel("newUser")
                            .setProperty("/passwordState", "None");

                    })
                    .catch((err) => {
                        MessageBox.error(this.getI18nMessage("EMAIL_PASSWORD_ERROR"),
                            {
                                title: this.getI18nMessage("LOGIN_FAILED"),
                                onClose: null,
                                styleClass: "",
                                actions: sap.m.MessageBox.Action.OK,
                                emphasizedAction: null,
                                initialFocus: null,
                                textDirection: sap.ui.core.TextDirection.Inherit,
                            }
                        );
                    });

            } else {
                sap.m.MessageBox.error(this.getI18nMessage("HIGHLIGHTED_FIELDS"), {
                    title: this.getI18nMessage("LOGIN_FAILED"),
                    onClose: null,
                    styleClass: "",
                    actions: sap.m.MessageBox.Action.OK,
                    emphasizedAction: null,
                    initialFocus: null,
                    textDirection: sap.ui.core.TextDirection.Inherit,
                });
                if (!Validations.validateEmail(email)) {
                    this.getView()
                        .getModel("newUser")
                        .setProperty("/emailState", "Error");
                }
                if (!password) {
                    this.getView()
                        .getModel("newUser")
                        .setProperty("/passwordState", "Error");
                }
            }
        },
    });
});
