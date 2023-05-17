
const cds = require('@sap/cds/lib')
const { Fisa } = cds.entities('eespc.app')
const { User } = cds.entities('eespc.app')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports = cds.service.impl(srv => {
    // srv.on([
    //     'CREATE', 'UPDATE'
    // ], 'Programare', async (req, next) => {
    //     await next();
    //     console.log(req.data);
    // });
    srv.on('getFiseOfUser', getFiseOfUser);
    srv.on('login', login);
})

async function getFiseOfUser(req) {
    let db = await cds.connect.to('db')
    let tx = db.tx();

    console.log(req.data);

    const fise = await tx.read(Fisa).where({ pacient_ID: req.data.user });
    return fise;
}

async function login(req) {
    let db = await cds.connect.to('db')
    let tx = db.tx();

    // try {
    // req.data.password = CryptoJS.AES.decrypt(
    //     req.data.password,
    //     'ENCRYPTION_SECRET'
    // ).toString(CryptoJS.enc.Utf8);

    const allUser = await tx.read(User).where({ email: req.data.email });

    const user = allUser[0]

    if (user) {
        // if (bcrypt.compareSync(req.data.password, user.password)) {
        if (req.data.password == user.parola) {
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
