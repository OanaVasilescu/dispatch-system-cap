namespace eespc.app;

using {
    cuid
} from '@sap/cds/common';


entity Programare: cuid{
    title: String;
    text: String;
    startDate: DateTime;
    endDate: DateTime;
    pacient: Association to Pacient;
    type: String;
}


entity Doctor: cuid{
    nume: String; 
    prenume: String;
    pacients: Association to many Pacient on pacients.doctor = $self;
    oras: String;
    speciality: String;
}

entity Pacient : cuid {
    nume: String; 
    prenume: String;
    doctor: Association to Doctor;
    ingrijitor: Association to many Ingrijitor on ingrijitor.pacient = $self;
    monitoredData: Association to many MonitoredData on monitoredData.pacient = $self;
    oras: String;
    cnp: String;
    sex: String;
    dataNasterii: String;
    varsta: Integer;
    domiciliu: String;
    judet: String;
    strada: String;
    numar: String;
    bloc: String;
    scara: String;
    etaj: String;
    apartament: String;
    email: String;
    grupSangvin: String;
    greutate: Integer;
    inaltime: Integer;
    alergii: array of {
        alergen: String;
        tip: String
        };
    ocupatie: String;
    fise: Association to many Fisa on fise.pacient = $self;
}

entity Ingrijitor: cuid {
    nume: String; 
    prenume: String;
    pacient: Association to Pacient;
}

entity Supraveghetor: cuid{
    nume: String; 
    prenume: String;
    oras: String;
}

entity User: cuid{ 
    email: String;
    password: String; 
    jwt: String;
    userRole: UserRole;
    doctor: Composition of one Doctor;
    pacient: Composition of one Pacient;
    ingrijitor: Composition of one Ingrijitor;
    supraveghetor: Composition of one Supraveghetor;
}



entity Fisa: cuid {
    tipFise: String;
    analize: many {tip: String; text: String; rezultate: String};
    drugs: many {text:String; selected: Boolean};
    boli: many {text:String; selected: Boolean};
    diagnoze: many {text: String; tratament: many {medicament: String; modAdministrare: String; selected:Boolean}; mentiuni: String};
    pacient: Association to Pacient;
    data: DateTime;
}

entity Boala: cuid {
    nume: String;
    tratament: Association to many Tratament on tratament.boala = $self;
}

entity Tratament: cuid {
    medicament: String;
    boala: Association to Boala;
    durataTratament: String;
    pastilaDimineata: Boolean;
    pastilaSeara: Boolean;
    pastilaZiua: Boolean;
    nrPastileDeodata: Integer;
}

entity MedicationAdministration: cuid {
    tratament: Association to Tratament;
    date: String;
    persCareAdminitrat: Association to Ingrijitor;
    pacient: Association to Pacient;
}

entity Alergie: cuid {
    tip: String;
    alergen: String;
}

entity AlarmScenarios: cuid{
    name: String;
    author: Association to Doctor;
    description: String;
    severity: Severity;
    gasMin: Integer;
    gasMax: Integer;
    lightMin: Integer;
    lightMax: Integer;
    proximityMin: Integer;
    proximityMax: Integer;
    pulseMin: Integer;
    pulseMax: Integer;
    humidityMin: Integer;
    humidityMax: Integer;
    temperatureMin: Integer;
    temperatureMax: Integer;
}

entity Alarm: cuid{
    monitoredData: Association to MonitoredData;
    scenario: Association to AlarmScenarios;
    pacient: Association to Pacient
}

entity MonitoredData: cuid {
    gas: Integer;
    light: Integer;
    proximity: Integer;
    pulse: Integer;
    humidity: Integer;
    temperature: Integer;
    pacient: Association to Pacient;
}

type UserRole: String enum {
  DOCTOR; SUPRAV; PACIENT; INGRIJ; ADMIN
}

type Severity: String enum {
  CRITICAL; WARNING; INFO; 
}
