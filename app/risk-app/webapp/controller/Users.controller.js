sap.ui.define([
    "riskapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "riskapp/utils/URLs",
    "riskapp/utils/Validations",
], function (BaseController, JSONModel, URLs, Validations) {
    "use strict";

    return BaseController.extend("riskapp.controller.Users", {
        onInit() {
            this.getRouter().getRoute("AdminOverview").attachPatternMatched(this.initPage, this);

            this.getView().setModel(new JSONModel());
            this.getView().setModel(new JSONModel(), "roleModel");
        },

        initPage: async function (oEvent) {
            this.getView().getModel("roleModel").setProperty("/role", "Doctor");

            // if (edit) {
            //     this.getView().getModel("editModel").setProperty("/editable", true);
            // }

            await this.getUsers();
        },


        addUser: function () {
            if (!this.oDefaultDialog) {
                this.oDefaultDialog = new sap.m.Dialog({
                    title: "Add User",
                    contentWidth: "560px",
                    contentHeight: "300px",
                    content: [
                        new sap.m.Input(
                            {
                                id: 'dialogNume',
                                placeholder: "Last name",
                                width: "517px",
                                liveChange: function () {
                                    this.notEmptyInputs()
                                }.bind(this)
                            },
                        ).addStyleClass("sapUiSmallMargin"),
                        new sap.m.Input(
                            {
                                id: 'dialogPrenume',
                                placeholder: "First name",
                                width: "517px",
                                liveChange: function () {
                                    this.notEmptyInputs()
                                }.bind(this)
                            },
                        ).addStyleClass("sapUiSmallMargin"),
                        new sap.m.Input(
                            {
                                id: 'dialogEmail',
                                placeholder: "Email",
                                width: "517px",
                                liveChange: function () {
                                    this.changeEmail()
                                }.bind(this)
                            },
                        ).addStyleClass("sapUiSmallMargin"),
                        new sap.m.Select(
                            {
                                id: 'dialogRole',
                                width: "517px",
                                forceSelection: true,
                                items: [{ key: "Doctor", text: "Doctor" }, { key: "Supervisor", text: "Supervisor" }, { key: "Pacient", text: "Pacient" }, { key: "Carer", text: "Carer" }, { key: "Admin", text: "Admin" }]
                            },
                        ).addStyleClass("sapUiSmallMargin"),

                    ],
                    beginButton: new sap.m.Button(
                        {
                            type: sap.m.ButtonType.Emphasized,
                            text: "Add user",
                            enabled: false,
                            id: "addDialogPacient",
                            press: function () {
                                this.confirmAddUser();
                                this.oDefaultDialog.close();
                            }.bind(this)
                        }
                    ),
                    endButton: new sap.m.Button(
                        {
                            text: "Close",
                            press: function () {
                                this.oDefaultDialog.close();
                                this.clearPacientDialog();
                            }.bind(this)
                        }
                    )
                });

                // to get access to the controller's model
                this.getView().addDependent(this.oDefaultDialog);
            }

            this.oDefaultDialog.open();
        },

        changeEmail: function () {
            let input = this.oDefaultDialog.getContent().find(el => el.sId == "dialogEmail").getValue()
            let cnpInput = this.oDefaultDialog.getContent().find(el => el.sId == "dialogEmail");

            let response = Validations.validateEmail(input)
            if (!response) {
                cnpInput.setValueState('Error')
                cnpInput.setValueStateText('The given email is not valid')

                this.oDefaultDialog.getBeginButton().setEnabled(false);
            } else {
                cnpInput.setValueState('None')
                this.oDefaultDialog.getBeginButton().setEnabled(true);
            }

            let dialogPrenume = this.oDefaultDialog.getContent().find(el => el.sId == "dialogPrenume");
            let dialogNume = this.oDefaultDialog.getContent().find(el => el.sId == "dialogNume");

            if (dialogPrenume.getValue() <= 0 || dialogNume.getValue() <= 0) {
                this.oDefaultDialog.getBeginButton().setEnabled(false);
            }
        },

        notEmptyInputs: function () {
            let inputdialogPrenume = this.oDefaultDialog.getContent().find(el => el.sId == "dialogPrenume").getValue()
            let dialogPrenume = this.oDefaultDialog.getContent().find(el => el.sId == "dialogPrenume");

            let inputdialogNume = this.oDefaultDialog.getContent().find(el => el.sId == "dialogNume").getValue()
            let dialogNume = this.oDefaultDialog.getContent().find(el => el.sId == "dialogNume");


            if (inputdialogNume.length <= 0) {
                dialogNume.setValueState('Error')
                dialogNume.setValueStateText("Field can't be empty")

                this.oDefaultDialog.getBeginButton().setEnabled(false);
            } else {
                dialogNume.setValueState('None');
                this.oDefaultDialog.getBeginButton().setEnabled(true);
            }


            if (inputdialogPrenume.length <= 0) {
                dialogPrenume.setValueState('Error')
                dialogPrenume.setValueStateText("Field can't be empty")

                this.oDefaultDialog.getBeginButton().setEnabled(false);
            } else {
                dialogPrenume.setValueState('None');
                this.oDefaultDialog.getBeginButton().setEnabled(true);
            };


            let dialogEmail = this.oDefaultDialog.getContent().find(el => el.sId == "dialogEmail");

            if (dialogEmail.getValueState() == 'None') {
                this.changeEmail();
            }
        },

        clearPacientDialog: function () {
            this.oDefaultDialog.getContent().find(el => el.sId == "dialogNume").setValue('');
            this.oDefaultDialog.getContent().find(el => el.sId == "dialogPrenume").setValue('');
            this.oDefaultDialog.getContent().find(el => el.sId == "dialogEmail").setValue('');
            this.oDefaultDialog.getContent().find(el => el.sId == "dialogNume").setValueState('None');
            this.oDefaultDialog.getContent().find(el => el.sId == "dialogPrenume").setValueState('None');
            this.oDefaultDialog.getContent().find(el => el.sId == "dialogEmail").setValueState('None');

            this.oDefaultDialog.getBeginButton().setEnabled(false);
        },

        confirmAddUser: async function () {
            let user = {};
            let nume = this.oDefaultDialog.getContent().find(el => el.sId == "dialogNume").getValue();
            let prenume = this.oDefaultDialog.getContent().find(el => el.sId == "dialogPrenume").getValue();
            let email = this.oDefaultDialog.getContent().find(el => el.sId == "dialogEmail").getValue();
            let role = this.oDefaultDialog.getContent().find(el => el.sId == "dialogRole").getSelectedKey();

            user.nume = nume;
            user.prenume = prenume;
            user.email = email;
            user.userRole = role;
            user.password = 'password';

            switch (role) {
                case 'Doctor':
                    user.doctor = {};
                    user.doctor.prenume = prenume;
                    user.doctor.nume = nume;
                    break;
                case 'Supervisor':
                    user.supraveghetor = {};
                    user.supraveghetor.prenume = prenume;
                    user.supraveghetor.nume = nume;
                    break;
                case 'Pacient':
                    user.pacient = {};
                    user.pacient.prenume = prenume;
                    user.pacient.nume = nume;
                    break;
                case 'Carer':
                    user.ingrijitor = {};
                    user.ingrijitor.prenume = prenume;
                    user.ingrijitor.nume = nume;
                    break;
                default:
                    break;
            }

            await this.post("/app/User", user).then(async (data) => {
                await this.getUsers();
                this.clearPacientDialog();
            }).catch((err) => {
                this.messageHandler("Error adding pacient");
                return "error";
            });
        },

        getUsers: async function () {
            await this.get(URLs.getUsersUrl()).then(async (data) => {
                await this.getView().getModel().setData(data.value);
            }).catch((err) => {
                console.log(err);
                this.messageHandler("Get users error");
            });
        }

    });
});
