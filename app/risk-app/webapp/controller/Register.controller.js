sap.ui.define([
    "riskapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "riskapp/utils/URLs",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "riskapp/utils/Validations"
], function (BaseController, JSONModel, URLs, MessageToast, MessageBox, Validations) {
    "use strict";

    return BaseController.extend("riskapp.controller.Refferals", {
        onInit() {
            let newUser = new JSONModel({
                county: "Alba",
            });
            this.getView().setModel(newUser, "newUser");

            let oData = {
                SelectedCounty: "UserCounty",
                CountyCollection: [
                    { StatusId: "Alba", Status: "Alba" }, { StatusId: "Arad", Status: "Arad" }, { StatusId: "Arges", Status: "Arges" }, { StatusId: "Bacau", Status: "Bacau" },
                    { StatusId: "Bihor", Status: "Bihor" }, { StatusId: "Bistrita-Nasaud", Status: "Bistrita-Nasaud" }, { StatusId: "Botosani", Status: "Botosani" }, { StatusId: "Brasov", Status: "Brasov" },
                    { StatusId: "Braila", Status: "Braila" }, { StatusId: "Bucuresti", Status: "Bucuresti" }, { StatusId: "Buzau", Status: "Buzau" }, { StatusId: "Caras-Severin", Status: "Caras-Severin" },
                    { StatusId: "Calarasi", Status: "Calarasi" }, { StatusId: "Cluj", Status: "Cluj" }, { StatusId: "Constanta", Status: "Constanta" }, { StatusId: "Covasna", Status: "Covasna" },
                    { StatusId: "Dambovita", Status: "Dambovita" }, { StatusId: "Dolj", Status: "Dolj" }, { StatusId: "Galati", Status: "Galati" }, { StatusId: "Giurgiu", Status: "Giurgiu" },
                    { StatusId: "Gorj", Status: "Gorj" }, { StatusId: "Harghita", Status: "Harghita" }, { StatusId: "Hunedoara", Status: "Hunedoara" }, { StatusId: "Ialomita", Status: "Ialomita" },
                    { StatusId: "Iasi", Status: "Iasi" }, { StatusId: "Ilfov", Status: "Ilfov" }, { StatusId: "Maramures", Status: "Maramures" }, { StatusId: "Mehedinti", Status: "Mehedinti" },
                    { StatusId: "Mures", Status: "Mures" }, { StatusId: "Neamt", Status: "Neamt" }, { StatusId: "Olt", Status: "Olt" }, { StatusId: "Prahova", Status: "Prahova" },
                    { StatusId: "Satu Mare", Status: "Satu Mare" }, { StatusId: "Salaj", Status: "Salaj" }, { StatusId: "Sibiu", Status: "Sibiu" }, { StatusId: "Suceava", Status: "Suceava" },
                    { StatusId: "Teleorman", Status: "Teleorman" }, { StatusId: "Timis", Status: "Timis" }, { StatusId: "Tulcea", Status: "Tulcea" }, { StatusId: "Vaslui", Status: "Vaslui" },
                    { StatusId: "Valcea", Status: "Valcea" }, { StatusId: "Vrancea", Status: "Vrancea" },
                ],
                Editable: true,
                Enabled: true,
            };
            let oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "SelectedModel");
        },

        onLoginHerePress: function (evt) {
            let newUser = new JSONModel();
            this.getView().setModel(newUser, "newUser");
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Login");
        },


        checkFirstName: function () {
            let userCheck = this.getView().getModel("newUser").getData();
            let firstName = userCheck.firstName;
            if (Validations.validateName(firstName)) {
                this.getView().getModel("newUser").setProperty("/firstNameState", "None");
            } else {
                this.getView().getModel("newUser").setProperty("/firstNameState", "Error");
            }
        },

        checkLastName: function () {
            let userCheck = this.getView().getModel("newUser").getData();
            let lastName = userCheck.lastName;
            if (Validations.validateName(lastName)) {
                this.getView().getModel("newUser").setProperty("/lastNameState", "None");
            } else {
                this.getView().getModel("newUser").setProperty("/lastNameState", "Error");
            }
        },

        checkPhoneNumber: function () {
            let userCheck = this.getView().getModel("newUser").getData();
            let phoneNumber = userCheck.phoneNumber;
            if (Validations.validatePhone(phoneNumber)) {
                this.getView().getModel("newUser").setProperty("/phoneNumberState", "None");
            } else {
                this.getView().getModel("newUser").setProperty("/phoneNumberState", "Error");
            }
        },

        checkEmail: function () {
            let userCheck = this.getView().getModel("newUser").getData();
            let email = userCheck.email;
            if (Validations.validateEmail(email)) {
                this.getView().getModel("newUser").setProperty("/emailState", "None");
            } else {
                this.getView().getModel("newUser").setProperty("/emailState", "Error");
            }
        },

        checkCity: function () {
            let userCheck = this.getView().getModel("newUser").getData();
            let city = userCheck.city;
            if (city) {
                this.getView().getModel("newUser").setProperty("/cityState", "None");
            } else {
                this.getView().getModel("newUser").setProperty("/cityState", "Error");
            }
        },

        checkPassword: function () {
            let userCheck = this.getView().getModel("newUser").getData();
            let password = userCheck.password;
            if (Validations.validatePassword(password)) {
                this.getView().getModel("newUser").setProperty("/passwordState", "None");
            } else {
                this.getView().getModel("newUser").setProperty("/passwordState", "Error");
            }
        },

        checkConfirmPassword: function () {
            let userCheck = this.getView().getModel("newUser").getData();
            let confirmPassword = userCheck.confirm_password;
            if (confirmPassword) {
                this.getView().getModel("newUser").setProperty("/confirmPasswordState", "None");
            } else {
                this.getView().getModel("newUser").setProperty("/confirmPasswordState", "Error");
            }
        },

        onRegister: function () {
            const oData = this.getView().getModel("newUser").oData;
            const firstName = oData.firstName;
            const lastName = oData.lastName;
            const phoneNumber = oData.phoneNumber;
            const email = oData.email;
            const password = oData.password;
            const city = oData.city;
            const confirm_password = oData.confirm_password;

            let oRouter = this.getOwnerComponent().getRouter();

            if (Validations.validateEmail(email) && Validations.validatePassword(password) && confirm_password) {
                const data = JSON.parse(JSON.stringify(oData));
                const registerData = {
                    'firstName': data.firstName,
                    'lastName': data.lastName,
                    'email': data.email,
                    'password': data.password,
                    'confirm_password': data.confirm_password
                }

                this.post(URLs.getRegister(), {json: JSON.stringify(registerData)})
                    .then((response) => {
                        debugger
                        let newUser = new JSONModel();
                        this.getView().setModel(newUser, "newUser");
                        MessageToast.show(this.getI18nMessage("WELCOME"));
                        oRouter.navTo("Login");
                    })
                    .catch((err) => {
                        debugger;
                        console.log(err);
                        if (err.responseJSON) {
                            sap.m.MessageBox.error(`${err.responseJSON.error.message}` + ".");
                        }
                    })
                this.getView().getModel("newUser").setProperty("/firstNameState", "None");
                this.getView().getModel("newUser").setProperty("/lastNameState", "None");
                this.getView().getModel("newUser").setProperty("/phoneNumberState", "None");
                this.getView().getModel("newUser").setProperty("/emailState", "None");
                this.getView().getModel("newUser").setProperty("/passwordState", "None");
                this.getView().getModel("newUser").setProperty("/cityState", "None");
                this.getView().getModel("newUser").setProperty("/confirmPasswordState", "None");
            } else {
                sap.m.MessageBox.error(this.getI18nMessage("HIGHLIGHTED_FIELDS"));
                if (!firstName || !Validations.validateName(firstName)) {
                    this.getView().getModel("newUser").setProperty("/firstNameState", "Error");
                }
                if (!lastName || !Validations.validateName(lastName)) {
                    this.getView().getModel("newUser").setProperty("/lastNameState", "Error");
                }
                if (!Validations.validatePhone(phoneNumber)) {
                    this.getView().getModel("newUser").setProperty("/phoneNumberState", "Error");
                }
                if (!Validations.validateEmail(email)) {
                    this.getView().getModel("newUser").setProperty("/emailState", "Error");
                }
                if (!password) {
                    this.getView().getModel("newUser").setProperty("/passwordState", "Error");
                }
                if (!city) {
                    this.getView().getModel("newUser").setProperty("/cityState", "Error");
                }
                if (!confirm_password) {
                    this.getView().getModel("newUser").setProperty("/confirmPasswordState", "Error");
                }
            }
        },
    });
});
