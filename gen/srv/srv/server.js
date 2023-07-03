const cds = require('@sap/cds/lib')

cds.on('bootstrap', async app => {
    app.use((req, res, next) => {
        const { origin } = req.headers

        // standard request
        res.setHeader('access-control-allow-origin', '*')
        res.set('access-control-allow-origin', '*')

        next()
    })
})

cds.on('served', () => {
    const { db } = cds.services
    db.on('before', (req) => console.log(req.event, req.path))
})