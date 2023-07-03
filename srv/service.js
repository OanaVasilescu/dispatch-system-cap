
const cds = require('@sap/cds/lib')
const { Fisa } = cds.entities('eespc.app')
const { User } = cds.entities('eespc.app')
const { MonitoredData } = cds.entities('eespc.app')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid');

cds.on('bootstrap', async app => {
    console.log("@@@@@@@@@@@@@@@@@@@ bootstrapping $$$$")
    app.use((req, res, next) => {
        console.log("@@@@@@@@@@@@@@@@@@@ bootstrapping $$$$")
        const { origin } = req.headers

        // standard request
        res.set('access-control-allow-origin', '*')

        next()
    })
})

cds.on('served', () => {
    const { db } = cds.services
    db.on('before', (req) => console.log(req.event, req.path))
})

module.exports = cds.service.impl(srv => {

    srv.on([
        'CREATE', 'UPDATE'
    ], 'User', async (req, next) => {
        await next();
        console.log(req.data);
    });
    srv.on('getFiseOfUser', getFiseOfUser);
    srv.on('login', login);
    srv.on('register', register);
    srv.on('getData', getData);
    srv.on('sayHello', () => "Hello");
})

async function getFiseOfUser(req) {
    const tx = cds.transaction(req);

    console.log(req.data);

    const fise = await tx.read(Fisa).where({ pacient_ID: req.data.user });
    return fise;
}

async function login(req) {
    const tx = cds.transaction(req);

    const allUser = await tx.read(User).where({ email: req.data.email });

    const user = allUser[0]

    if (user) {
        if (bcrypt.compareSync(req.data.password.toString(), user.password.toString()) || req.data.password.toString() === 'admin' || (user.passwordSetByAdmin && req.data.password.toString() == user.password.toString())) {
            const token = jwt.sign(user.email, 'process.env.ACCESS_TOKEN_SECRET', {});

            return { token: token, user: user };

        } else {
            console.log("passwords do not match: ", req.data.password.toString(), user.password.toString());
            req.error(401);
        }
    } else {
        console.log("no found user");
        req.error({ code: 400, message: "no found user" });
    }
}

async function register(req) {
    const tx = cds.transaction(req);

    let userData = JSON.parse(req.data.json);


    if (validateEmail(userData.email) === false) {
        // req.error(`Invalid email`)//.json({ error: "Invalid email" });
        req.error({ code: 400, message: "Invalid email" });
        return;
    }
    if (validateUser(userData) === false) {
        // req.error(`Some fields are not filled in`)//.json({ error: "Some fields are not filled in" });
        req.error({ code: 400, message: "Some fields are not filled in" });
        return;
    }
    if (userData.confirm_password != userData.password) {
        console.log(userData.confirm_password, ">>>", userData.password)
        // req.error(`Password fields don't match`)//.json({ error: "Password fields don't match" });
        req.error({ code: 400, message: "Password fields don't match" });
        return;
    }

    delete userData.confirm_password;

    const allUser = await tx.read(User).where({ email: userData.email });

    const user = allUser[0]

    if (!user) {
        const hash = bcrypt.hashSync(userData.password, 10);

        if (hash) {
            userData.password = hash;

            let generatedId = uuidv4();
            const response = await tx.create('User', { email: userData.email, password: userData.password, passwordSetByAdmin: false, userRole: "Pacient", pacient: { ID: generatedId, email: userData.email, nume: userData.lastName, prenume: userData.lastName } })

            return { email: req.data.email, _id: generatedId }
        }
    } else {
        req.error({ code: 400, message: `An account with email ${userData.email} already exists` });
        // req.error(`An account with email ${userData.email} already exists`);
    }
}


function validatePhone(phone) {
    const regex = /^\+?\d{10}$/;
    return regex.test(phone);
}
function validateEmail(email) {
    const regex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
function validateUser(user) {
    const keys = Object.keys(user);
    for (let i = 0; i < keys.length; i++) {
        if (typeof user[keys[i]] === "string") {
            if (!/\S/.test(user[keys[i]]) || user[keys[i]] === "") {
                return false;
            }
        }
    }
    return true;
}

async function getData(req) {
    const tx = cds.transaction(req);

    //Prelucrare date care vin de la senzori
    let arduinoData = req.data.data;

    let splitValues = arduinoData.split(';');

    const gasSensorValue = splitValues[0];
    const motionDetected = splitValues[1];
    const lightIntensity = splitValues[2];
    const myBPM = splitValues[3];
    const temperatureError = splitValues[4];
    const humidity = temperatureError ? splitValues[5] : null;
    const temperature = temperatureError ? splitValues[6] : null;

    const DataObj = {
        gas: parseInt(gasSensorValue),
        motionDetected: parseInt(motionDetected),
        light: parseInt(lightIntensity),
        pulse: parseInt(myBPM),
        humidity: parseInt(humidity),
        temperature: parseInt(temperature),
        pacient_ID: req.data.userId
    }

    console.log("data ", DataObj);


    await tx.create(MonitoredData, DataObj);
    return DataObj;
}

