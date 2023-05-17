
const cds = require('@sap/cds/lib')
const { Fisa } = cds.entities('eespc.app')
const { User } = cds.entities('eespc.app')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid');


module.exports = cds.service.impl(srv => {
    // srv.on([
    //     'CREATE', 'UPDATE'
    // ], 'Programare', async (req, next) => {
    //     await next();
    //     console.log(req.data);
    // });
    srv.on('getFiseOfUser', getFiseOfUser);
    srv.on('login', login);
    srv.on('register', register);
})

async function getFiseOfUser(req) {
    const tx = cds.transaction(req);

    console.log(req.data);

    const fise = await tx.read(Fisa).where({ pacient_ID: req.data.user });
    return fise;
}

async function login(req) {
    const tx = cds.transaction(req);

    // try {
    // req.data.password = CryptoJS.AES.decrypt(
    //     req.data.password,
    //     'ENCRYPTION_SECRET'
    // ).toString(CryptoJS.enc.Utf8);

    const allUser = await tx.read(User).where({ email: req.data.email });

    const user = allUser[0]

    if (user) {
        if (bcrypt.compareSync(req.data.password.toString(), user.password.toString())) {
            // if (req.data.password == user.password) {
            const token = jwt.sign(user.email, 'process.env.ACCESS_TOKEN_SECRET', {});

            return { token: token, user: user };

        } else {
            console.log("passwords do not match");
            req.error(401);
        }
    } else {
        console.log("no found user");
        req.error(400);
    }
}

async function register(req) {
    const tx = cds.transaction(req);

    // try {
    // req.body.password = CryptoJS.AES.decrypt(
    //     req.body.password,
    //     process.env.ENCRYPTION_SECRET
    // ).toString(CryptoJS.enc.Utf8);

    let userData = JSON.parse(req.data.json);

    // const userData = {
    //     firstName: req.data.firstName,
    //     lastName: req.data.lastName,
    //     email: req.data.email,
    //     password: req.data.password,
    //     confirm: req.data.confirm_password,
    //     city: req.data.city,
    //     phoneNumber: req.data.phoneNumber,
    // };

    // if (validatePhone(userData.phoneNumber) === false) {
    //     req.error(`Invalid phone number`);//.json({ error: "Invalid phone number" });
    //     return;
    // }


    if (validateEmail(userData.email) === false) {
        req.error(`Invalid email`)//.json({ error: "Invalid email" });
        return;
    }
    if (validateUser(userData) === false) {
        req.error(`Some fields are not filled in`)//.json({ error: "Some fields are not filled in" });
        return;
    }
    if (userData.confirm_password != userData.password) {
        console.log(userData.confirm_password, ">>>", userData.password)
        req.error(`Password fields don't match`)//.json({ error: "Password fields don't match" });
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
            const response = await tx.create('User', { email: userData.email, password: userData.password, userRole: "PACIENT", pacient: { ID: generatedId, email: userData.email, nume: userData.lastName, prenume: userData.lastName } })

            return { email: req.data.email, _id: generatedId }
        }
    } else {
        req.error(`An account with email ${userData.email} already exists`);
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

