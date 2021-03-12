// IMPORTS
const express = require('express')
const bodyParser = require('body-parser')


// ROUTES
const usersRoute = require('./apiv1/routes/users')
const wageRoute = require('./apiv1/routes/wage')


// API VERSION(S)
const apiv1 = express()


// MAIN CODE
let normalizedPort = process.env.PORT || 3000

const main = express()

main.use(bodyParser.json())
main.use(bodyParser.urlencoded({extended: false}))


// USE ROUTES
apiv1.use('/users', usersRoute)
apiv1.use('/wage', wageRoute)

main.use('/api/v1', apiv1)


// OPEN PORT TO LISTEN
main.listen(normalizedPort, () => {
    console.log(`APIv1 is listening on port ${normalizedPort}!`)
})