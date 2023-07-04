



using {eespc.app as my} from '../db/schema.cds';

service Service @(path : '/app') {
    entity Programare               as projection on my.Programare;
    entity Pacient                  as projection on my.Pacient;
    entity Fisa                     as projection on my.Fisa;
    entity Boala                    as projection on my.Boala;
    entity Tratament                as projection on my.Tratament;
    entity Alergie                  as projection on my.Alergie;
    entity Doctor                   as projection on my.Doctor;
    entity Ingrijitor               as projection on my.Ingrijitor;
    entity Supraveghetor            as projection on my.Supraveghetor;
    entity MedicationAdministration as projection on my.MedicationAdministration;
    entity AlarmScenarios           as projection on my.AlarmScenarios;
    entity Alarm                    as projection on my.Alarm;
    entity MonitoredData            as projection on my.MonitoredData;
    entity User                     as projection on my.User;
    function getFiseOfUser(user : String)             returns array of String;
    function login(email : String, password : String) returns array of String;
    function register(json : String)                  returns array of String;
    action   getData(data : String, userId : String)  returns array of String;
    function sayHello()                               returns String;
}


