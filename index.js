const open = require('open');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const podcastRouter = require('./routes/podcastAPI')
const userAPI = require('./routes/userAPI')
const app = express()
const port = process.env.PORT || 8080

const domain = process.env.domain || ('http://localhost:' + port)

app.use(express.static('assets'))
app.use(bodyParser.json())

app.use('/api', podcastRouter.router)
app.use('/api', userAPI.router)

app.use('/', (req, res, next) => {
    res.send('Application is running')
    next();
})





app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)
    //await open(`http://localhost:${port}`)
})
