const express = require('express')
const path = require('path')
const api = require('./api')
const bodyParser = require('body-parser')

const startExpress = () => new Promise((resolve, reject) => {
    const app = express()
    const port = 5000

    app.use(express.static(path.join(__dirname, '../', 'frontend', 'build')))
    app.use(bodyParser.json())

    app.post('/api', (req, res) => {
        const endpoint = req.body.endpoint
        const args = req.body.args

        const func = api.endpointMap[endpoint]
        if (!func) {
            res.status(469).send({ error: "Invaild endpoint :'(" })
        } else {
            func(args)
                .then(
                    (result) => res.status(200).send(result),
                    (error) => {
                        console.error(error)
                        error.code ||= 500;
                        res.status(error.code).send({ error })
                    }
                )
        }
    })

    app.post('/*', (req, res) => {
        res.status(404).send({ error: 'Not found.' })
    })

    app.get('/*', (req, res) => {
        console.log(`Requested: ${req.url}`)
        res.sendFile(path.join(__dirname, '../', 'frontend', 'build', 'index.html'))
    })

    app.listen(port, () => {
        console.log(`Server is running on port ${port}!`)

        resolve(app)
    })
})

module.exports = {
    startExpress    
}