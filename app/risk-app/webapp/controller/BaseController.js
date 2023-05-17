sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "riskapp/utils/AjaxClient",
    "sap/ui/model/json/JSONModel",
    "riskapp/utils/URLs",
    "sap/m/MessageToast",
    "jquery.sap.global",
], function (Controller, AjaxClient, JSONModel, URLs, MessageToast, jQuery) {
    "use strict";
    return Controller.extend("riskapp.controller.BaseController", {
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        get: function (url, data) {
            var sUrl = this.createUrl(url);

            return AjaxClient.get(sUrl, data);
        },

        post: function (url, data) {
            var sUrl = this.createUrl(url);

            return AjaxClient.post(sUrl, data);
        },

        delete: function (url) {
            var sUrl = this.createUrl(url);

            return AjaxClient.delete(sUrl);
        },

        put: function (url, data) {
            var sUrl = this.createUrl(url);

            return AjaxClient.put(sUrl, data);
        },

        getInitials: function (name) {
            return name.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
        },

        createUrl: function (url) { // return this.getOwnerComponent().getManifestObject().resolveUri(url);
            return url;
        },

        messageHandler: function (messageName) {
            let msg = this.getView().getModel("i18n").getResourceBundle().getText(messageName);
            MessageToast.show(msg);
        },

        cutStringAfterChar: function (str, c) {
            let n = str.lastIndexOf(c);
            return str.substring(n + 1);
        },

        onInputChange: function (oEvent) { // function used to validate inputs on change (XML)
            let source = oEvent.getSource();
            let sValue;
            let sId = source.getId();
            let sourceId = sId.slice(sId.lastIndexOf("-") + 1);
            if (sourceId !== "eventType") {
                sValue = source.getValue();
            } else {
                sValue = "Not relevant";
            }
            let sValueState = "None";
            let bValid = this._validateInput(sValue, sId);
            let errorOrWarning = "Error";
            if (!bValid) {
                sValueState = errorOrWarning;
            }
            source.setValueState(sValueState);
        },

        _validateInput: function (sValue, sId) {
            let id = sId.slice(sId.lastIndexOf("-") + 1);
            if (sValue.trim() == "") { // if the field is empty, return false, else verify for each input type
                return false;
            }
            switch (id) {
                case "newRiskTitle":
                    return this._validateNotEmpty(sValue.trim());
                case "description":
                    return this._validateNotEmpty(sValue.trim());
                case "impactSummary":
                    return this._validateNotEmpty(sValue.trim());
                case "datePicker":
                    return this._validateNotEmpty(sValue.trim())
                case "eventType":
                    return this._validateSelect(sId);
                // case "countriesAffected":
                //     return this._validateSelect(sId);
                case "taskTypeSelect":
                    return this._validateSelect(sId);
                default:
                    return false;
            }
        },

        encryptPassword: function (password) {
            // const secret = Credentials.getEncryptionSecret();
            // const encryptedPassword = CryptoJS.AES.encrypt(
            //     password,
            //     'ENCRYPTION_SECRET'
            // ).toString();
            // return encryptedPassword;

            return password
        },


        getI18nMessage: function (sI18n, arg) {
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sMsg = oBundle.getText(sI18n, arg);
            return sMsg;
        },

        _validateNotEmpty: function (sValue) {
            if (sValue.length < 1) {
                return false;
            }
            return true;
        },

        _validateSelect: function (sId) {
            if (this.getView().byId(sId).getSelectedItem()) {
                return true;
            }
            return false;
        },

        validateInputOnSubmit: function (aInputs) { // validate inputs on pressing button
            let oView = this.getView();
            if (!Array.isArray(aInputs)) {
                let emptyArray = [];
                emptyArray.push(aInputs); // TODO: if it's not array, make it an array
                aInputs = emptyArray;
            }
            let bNoValidationError = true,
                bIsValid = true;
            for (const sId of aInputs) {
                if (sId !== "eventType") {
                    bIsValid = this._validateInput(oView.byId(sId).getValue(), sId);
                } else {
                    bIsValid = this._validateInput("Not relevant", sId); // select does not have getValue
                };
                bNoValidationError = bIsValid && bNoValidationError;
                let errorOrWarning = "Error";

                if (!bIsValid)
                    oView.byId(sId).setValueState(errorOrWarning);
                else {
                    oView.byId(sId).setValueState("None");
                }
            }
            if (bNoValidationError) {
                return true;
            } else {
                return false;
            }
        },

        completePacient: function (pacient) {
            if (pacient.cnp) {
                const firstChar = pacient.cnp[0];
                switch (firstChar) {
                    case "1": pacient.sex = "M";
                        break;
                    case "2": pacient.sex = "F";
                        break;
                    case "5": pacient.sex = "M";
                        break;
                    case "6": pacient.sex = "F";
                        break;
                    case "7": pacient.sex = "M";
                        break;
                    case "8": pacient.sex = "F";
                        break;
                    default:
                        break;
                }
                let an = pacient.cnp.substring(1, 3);
                if (firstChar == 1 || firstChar == 2) {
                    an = 19 + an;
                }
                if (firstChar == 5 || firstChar == 6) {
                    an = 20 + an;
                }

                if (firstChar == 7 || firstChar == 8) {
                    an = 20 + an;
                }
                if (firstChar == 3 || firstChar == 4) {
                    an = 18 + an;
                }

                let luna = pacient.cnp.substring(3, 5);

                switch (luna) {
                    case '01': luna = 'Jan';
                        break;
                    case '02': luna = 'Feb';
                        break;
                    case '03': luna = 'Mar';
                        break;
                    case '04': luna = 'Apr';
                        break;
                    case '05': luna = 'May';
                        break;
                    case '06': luna = 'Jun';
                        break;
                    case '07': luna = 'Jul';
                        break;
                    case '08': luna = 'Aug';
                        break;
                    case '09': luna = 'Sep';
                        break;
                    case '10': luna = 'Oct';
                        break;
                    case '11': luna = 'Nov';
                        break;
                    case '12': luna = 'Dec';
                        break;
                    default:
                        break;
                }

                let zi = pacient.cnp.substring(5, 7);

                let total = zi + " " + luna + " " + an;

                pacient.dataNasterii = total;

                let varsta = new Date().getFullYear() - an;

                pacient.varsta = varsta;
                return pacient;
            } else {
                return pacient;
            }
        },

    });
});
