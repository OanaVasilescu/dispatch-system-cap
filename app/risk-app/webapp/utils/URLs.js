sap.ui.define([], function () {
    "use strict";
    const origin = "/app";
    const slash = "/";
    const Programare = "/Programare?&$expand=pacient";
    const pacients = "/Pacient?&$expand=fise";

    return {
        getAppointmentsUrl: function () {
            return origin + Programare;
        },
        getPacientsUrl: function () {
            return origin + pacients;
        },
        getPacientUrl: function () {
            return origin + '/Pacient';
        },
        getCarerUrl: function () {
            return origin + '/Ingrijitor';
        },
        getAlergeni: function () {
            return origin + '/Alergie';
        },
        getLogin: function () {
            return origin + '/login';
        },
        getRegister: function () {
            return origin + '/register';
        },
        getUsersUrl: function () {
            return origin + '/User?&$expand=doctor,pacient,ingrijitor,supraveghetor';
        }
    }
})
