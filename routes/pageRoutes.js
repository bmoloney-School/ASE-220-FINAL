const express = require('express')
const router = express.Router()
const fs = require('fs')

//app.use(express.static()) was not working for me -- and then I got it to work but was too lazy to change everything again
// Static Resources
router.get('/styles/signin', (req, res) => {
    res.setHeader('content-type', 'text/css')
    res.status(200).send(fs.readFileSync('./public/static/signin.css', 'utf-8'))
})
router.get('/styles/template', (req, res) => {
    res.setHeader('content-type', 'text/css')
    res.status(200).send(fs.readFileSync('./public/static/template.css', 'utf-8'))
})

router.get('/styles/user', (req, res) => {
    res.setHeader('content-type', 'text/css')
    res.status(200).send(fs.readFileSync('./public/static/user.css', 'utf-8'))
})

router.get('/js/shared', (req, res) => {
    res.setHeader('content-type', 'text/javascript')
    res.status(200).send(fs.readFileSync('./public/static/shared.js', 'utf-8'))
})
router.get('/assets/plus', (req, res) => {
    res.setHeader('content-type', 'png')
    res.status(200).send(fs.readFileSync('./public/static/assets/icons8-plus-48.png'))
})


//Pages
router.get('/pages/about', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/about.html', 'utf-8'))
})

router.get('/pages/rules', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/rules.html', 'utf-8'))
})

//Dynamic Pages
router.get('/', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/index.html', 'utf-8'))
})

router.get('/categories', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/categories.html', 'utf-8'))
})

//Not implemented
router.get('/keywords', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/keywords.html', 'utf-8'))
})
//Not implemented
router.get('/keywords/:tag', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/keywords.html', 'utf-8'))
})

router.get('/auth/signup', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/createAccount.html', 'utf-8'))
})

router.get('/auth/signin', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/login.html', 'utf-8'))
})
//Not implemented
router.get('/auth/reset-password', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/reset-password.html', 'utf-8'))
})

router.get('/account', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/user.html', 'utf-8'))
})
router.get('/author', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/author.html', 'utf-8'))
})

router.get('/account/edit', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/edit-account.html', 'utf-8'))
})

router.get('/podcasts/create', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/upload-podcast.html', 'utf-8'))
})

router.get('/podcasts/listen', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/listen.html', 'utf-8'))
})

router.get('/podcasts/edit', (req, res) => {
    res.status(200).send(fs.readFileSync('./public/static/edit-podcast.html', 'utf-8'))
})

// Ran out of time to actually figure out storing files
router.use(express.static('public/static/assets'));

module.exports = { router }