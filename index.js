const open = require('open');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const podcastRouter = require('./routes/podcastAPI')
const userAPI = require('./routes/userAPI')
const pageRoutes = require('./routes/pageRoutes')
const app = express()
const port = process.env.PORT || 8080

app.use(express.static('assets'))
app.use(bodyParser.json())

app.use('/api', podcastRouter.router)
app.use('/api', userAPI.router)
app.use('/', pageRoutes.router)


app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)
    await open(`http://localhost:${port}`)
})
