sap.ui.define([], function (oValue) {
    return {
        validateName: function (oValue) {
            let nameCheck = /(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/;
            return nameCheck.test(oValue);
        },

        validatePhone: function (oValue) {
            let phoneCheck = /(^\+?\d{10}$)/;
            return phoneCheck.test(oValue);
        },

        validateEmail: function (oValue) {
            let emailCheck =
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailCheck.test(oValue);
        },

        validatePassword: function (oValue) {
            let passwordCheck =
                /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*])(?=.*[a-zA-Z]).{8,16}$/;
            return passwordCheck.test(oValue);
        },
    };
});