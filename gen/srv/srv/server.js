const cds = require('@sap/cds/lib')

cds.on('bootstrap', async app => {
    app.use((req, res, next) => {
        const { origin } = req.headers

        // standard request
        res.setHeader('access-control-allow-origin', '*')
        res.set('access-control-allow-origin', '*')

        if (req.method === 'OPTIONS') {
            res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
            res.set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

            return res.set('access-control-allow-methods', 'GET,HEAD,PUT,PATCH,POST,DELETE').end()
        }

        next()
    })
})

cds.on('served', () => {
    const { db } = cds.services
    db.on('before', (req) => console.log(req.event, req.path))
})