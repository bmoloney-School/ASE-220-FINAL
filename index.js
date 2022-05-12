const open = require('open');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const podcastRouter = require('./routes/podcastAPI')
const app = express()
const port = process.env.PORT || 8080

app.use(express.static('assets'))
app.use(bodyParser.json())

app.use('/api', podcastRouter.router)

app.use('/', (req, res, next) => {
    res.send('Hello world')
    next();
})





app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)
    //await open(`http://localhost:${port}`)
})
