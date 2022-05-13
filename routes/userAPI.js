const express = require('express');
const bodyParser = require('body-parser')
const mongo = require('mongodb')
const multer = require('multer')
const upload = multer({ dest: 'public/podcasts' })
var hash = require('string-hash');

// Router Globals
const router = express.Router();
const uri = "mongodb+srv://6K9uMUAg2t6e:Ey4kype7VAYbsZG3@podscholarcluster.g5sjk.mongodb.net/podscholar?retryWrites=true&w=majority"
const client = new mongo.MongoClient(uri);

let podscholar;

router.use('/', async (req, res, next) => {
    console.log("Using UserAPI for routing: ", req.url)
    try {
        await client.connect();
        podscholar = client.db('podscholar');
        next();
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error connecting to DB: ' + e)
    }

})

// create a new account (non author)
router.post('/auth/signup', async (req, res) => {
    userCollection = podscholar.collection('users');
    try {
        let newUser = req.body;
        newUser.password = hash(newUser.password); // add some level of security
        newUser.modifiedDate = new Date(Date.now()).toISOString()
        let result = await userCollection.insertOne(newUser)
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error connecting to DB: ' + e)
    }
    finally {

    }
})

// login to an account
router.post('/auth/signin', async (req, res) => {
    userCollection = podscholar.collection('users');
    try {
        let user = req.body;
        let query = {
            email: user.email,
            password: hash(user.password)
        }

        let projection = {
            projection: {
                password: 0
            }
        }
        let result = await userCollection.findOne(query, projection)

        if (!result) {
            res.status(400);
            result = { "Error": "User Not found" };
        }
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error connecting to DB: ' + e)
    }
    finally {

    }
})


router.post('/authors', async (req, res) => {
    userCollection = podscholar.collection('users');
    try {
        let user = req.body;
        let query = {
            email: user.email,
            password: hash(user.password)
        }
        let update = {
            $set: {
                organization: req.body.organization,
                title: req.body.title,
                biography: req.body.biography,
                isAuthor: true
            }
        }

        let result = await userCollection.updateOne(query, update)

        if (!result) {
            res.status(400);
            result = { "Error": "User Not found" };
        }
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error connecting to DB: ' + e)
    }
    finally {

    }
})

router.get('/users/byId/:id', async (req, res) => {
    userCollection = podscholar.collection('users');
    try {
        let query = {
            _id: mongo.ObjectId(req.params.id)
        }

        let projection = {
            projection: {
                email: 0,
                password: 0
            }
        }
        let result = await userCollection.findOne(query, projection)

        if (!result) {
            res.status(400);
            result = { "Error": "User Not found" };
        }
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error connecting to DB: ' + e)
    }
    finally {

    }
})

// Get user Info (sans private info like email and password)
router.get('/users/:first/:last', async (req, res) => {
    userCollection = podscholar.collection('users');
    try {
        let query = {
            firstName: req.params.first,
            lastName: req.params.last
        }

        let projection = {
            projection: {
                email: 0,
                password: 0
            }
        }
        let result = await userCollection.findOne(query, projection)

        if (!result) {
            res.status(400);
            result = { "Error": "User Not found" };
        }
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error connecting to DB: ' + e)
    }
    finally {

    }
})



router.patch('/users/:first/:last/actions/follow', async (req, res) => {
    let userCollection = podscholar.collection('users')
    try {
        let query = {
            firstName: req.params.first,
            lastName: req.params.last
        }

        let result = await userCollection.findOne(query)

        let filter = {
            _id: result._id
        }
        let update = {
            $push: {
                followers: req.body.userId
            }
        }

        // Determine if we are following vs unfollowing -- On new users we do not have a follwers field so uses optional chaining
        if (result.followers?.includes(req.body.userId)) {
            update = {
                $pull: {
                    followers: req.body.userId
                }
            }
            await userCollection.updateOne(filter, update);
            result = "Unfollowed";
        }
        else {
            await userCollection.updateOne(filter, update);
            result = "Followed"
        }
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

router.get('/users/:first/:last/followers', async (req, res) => {
    let userCollection = podscholar.collection('users')
    try {
        let query = {
            firstName: req.params.first,
            lastName: req.params.last
        }

        let result = await userCollection.findOne(query)
        let followers = []

        // Probably a better way to do this
        if (result.followers) {
            for (i = 0; i < result.followers.length; i++) {
                let follower = await userCollection.findOne({
                    _id: mongo.ObjectId(result.followers[i])
                })
                followers.push({ first: follower.firstName, last: follower.lastName })
            }

        }
        res.send({ followers: followers })
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Gets Podcasts liked by a user
router.get('/users/:first/:last/likedPodcasts', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    let userCollection = podscholar.collection('users')
    try {
        let query = {
            firstName: req.params.first,
            lastName: req.params.last
        }
        let result = await userCollection.findOne(query)

        let userId = result._id.toString()

        query = {
            likes: { $in: [userId] }
        }
        result = await podcastCollection.find(query).toArray()
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Update user account (Non sensitive)
router.patch('/account', async (req, res) => {
    userCollection = podscholar.collection('users');
    try {
        let user = req.body;
        let query = {
            email: user.email,
            password: hash(user.password)
        }
        delete user.email;
        delete user.password;
        let update = {
            $set: user
        }

        let result = await userCollection.updateOne(query, update)

        if (!result) {
            res.status(400);
            result = { "Error": "User Not found" };
        }
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error connecting to DB: ' + e)
    }
    finally {

    }
})

//Update user account (Non sensitive)
router.patch('/account/:accountId', async (req, res) => {
    userCollection = podscholar.collection('users');
    try {
        let user = {}
        if (req.body.email) {
            user.email = req.body.email
        }
        if (req.body.password) {
            user.password = hash(req.body.password)
        }
        let query = {
            _id: mongo.ObjectId(req.params.accountId)
        }

        let update = {
            $set: user
        }

        let result = await userCollection.updateOne(query, update)

        if (!result) {
            res.status(400);
            result = { "Error": "User Not found" };
        }
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error connecting to DB: ' + e)
    }
    finally {

    }
})

module.exports = { router }