const express = require('express');
const bodyParser = require('body-parser')
const mongo = require('mongodb')
const multer = require('multer')
const upload = multer({ dest: 'public/podcasts' })

// Router Globals
const router = express.Router();
const uri = "mongodb+srv://6K9uMUAg2t6e:Ey4kype7VAYbsZG3@podscholarcluster.g5sjk.mongodb.net/podscholar?retryWrites=true&w=majority"
const client = new mongo.MongoClient(uri);

let podscholar;


/*
I can already see that there could be some issues here if two podcasts have the same name, but I wanted to 
stick as closely to the documentation provided so I i made all of the requests title based.
*/

router.use('/', async (req, res, next) => {
    console.log("Using podcastAPI for routing: ", req.url)
    try {
        await client.connect();
        podscholar = client.db('podscholar');
        next();
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error connecting to DB: ', e)
    }
})

//#region Getting Multiple Podcasts

//Retrive 10 recently uploaded podcasts from the db 
router.get('/', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    try {
        let result = await podcastCollection.find({}, { "limit": 10 }).sort(publishedDate).toArray()
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Retrieves 10 podcasts from the database based on the search keyword
router.get('/search/keyword/:keyword', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    let regex = ".*" + req.params.keyword + ".*";
    let query = {
        keywords: { $regex: regex }
    }

    try {
        let result = await podcastCollection.find(query, { "limit": 10 }).toArray()
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Retrieves 10 podcasts from the database based on the search date
router.get('/search/year/:Year', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    let regex = "^" + req.params.Year + ".*";
    let query = {
        publishedDate: { $regex: regex }
    }

    try {
        let result = await podcastCollection.find(query, { "limit": 10 }).toArray()
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

router.get('/search/author/:name', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    let userCollection = podscholar.collection('users')
    let name = req.params.name.split('+')


    try {
        let user = await userCollection.findOne({
            $or: [
                { firstName: name[0] },
                { lastName: name[0] }
            ]
        })
        let query = {
            authorId: user._id
        }

        let result = await podcastCollection.find(query, { "limit": 10 }).toArray()
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Retrieves a list of all the scientific disciplines and the total number of podcasts for each scientific discipline 
router.get('/categories', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')

    try {
        let result = await podcastCollection.distinct("category")
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Retrieves 10 recently uploaded podcasts from the database in a specific :scientific-discipline 
router.get('/categories/:scientificDiscipline', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    let discipline = req.params.scientificDiscipline.split('+').join(' ')
    let query = {
        category: discipline
    }

    try {
        let result = await podcastCollection.find(query, { "limit": 10 }).toArray()
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Retrieves 10 podcasts from the database based on the search keyword in a specific :scientific-discipline 
router.get('/categories/:scientificDiscipline/search/keyword/:keyword', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    let regex = "^" + req.params.keyword + ".*";
    let discipline = req.params.scientificDiscipline.split('+').join(' ')

    let query = {
        keywords: { $regex: regex },
        category: discipline
    }
    try {
        let result = await podcastCollection.find(query, { "limit": 10 }).toArray()
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Retrieves 10 podcasts from the database based on the search date in a specific :scientific-discipline
router.get('/categories/:scientificDiscipline/search/year/:Year', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    let regex = "^" + req.params.Year + ".*";
    let query = {
        publishedDate: { $regex: regex },
        category: req.params.scientificDiscipline
    }
    try {
        let result = await podcastCollection.find(query, { "limit": 10 }).toArray()
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Retrieves a list of tags sorted by number of podcasts and the total number of podcasts for each tag  
router.get('/keywords', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')

    try {
        let result = await podcastCollection.distinct("keywords")
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Retrieves 10 recently uploaded podcasts from the database in a specific :keyword
router.get('/keywords/:keyword', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    let regex = ".*" + req.params.keyword + ".*";
    let query = {
        keywords: { $regex: regex }
    }

    try {
        let result = await podcastCollection.find(query, { "limit": 10 }).toArray()
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Retrieves 10 podcasts from the database based on the search date in a specific :date
router.get('/keywords/:keyword/search/date/:date ', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    let regex = "^" + req.params.date + ".*";
    let query = {
        publishedDate: { $regex: regex }
    }

    try {
        let result = await podcastCollection.find(query, { "limit": 10 }).toArray()
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//#endregion

//#region Single Podcast

//Creates a new Podcast
router.post('/podcasts', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    try {
        let newPodcast = req.body;
        newPodcast.modifiedDate = new Date(Date.now()).toISOString()
        newPodcast.authorId = mongo.ObjectId(newPodcast.authorId) ?? -1;
        let result = await podcastCollection.insertOne(newPodcast);
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

router.get('/podcasts/byId/:id', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    try {

        let query = {
            _id: mongo.ObjectId(req.params.id)
        }
        let result = await podcastCollection.findOne(query);
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Retrieves a specific podcast from the database
router.get('/podcasts/:podcastTitle', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    try {
        // Change url param back into something that could match in the db.
        let title = req.params.podcastTitle.split('+').join(' ')
        let query = {
            title: title
        }
        let result = await podcastCollection.findOne(query);
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Modifies a specific podcast
router.patch('/podcasts/:podcastTitle', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    try {
        let updatedPodcast = req.body;
        let title = req.params.podcastTitle.split('+').join(' ')
        updatedPodcast.modifiedDate = new Date(Date.now()).toISOString()
        let filter = {
            title: title
        }

        let result = await podcastCollection.findOneAndReplace(filter, updatedPodcast);
        res.send(result.value)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})

//Deletes a specific podcast
router.delete('/podcasts/:podcastTitle', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    try {
        let title = req.params.podcastTitle.split('+').join(' ')
        let filter = {
            title: title
        }
        let result = await podcastCollection.deleteOne(filter);
        res.send(result.value)
    }
    catch (e) {
        console.log(e)
        res.status(400).send('Error: ' + e)
    }
    finally {

    }
})


//Likes/unlikes a specific podcast:
router.patch('/podcasts/:podcastTitle/actions/like', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    try {
        let title = req.params.podcastTitle.split('+').join(' ')
        let filter = {
            title: title
        }
        let update = {
            $push: {
                likes: req.body.userId
            }
        }

        let result = await podcastCollection.findOne(filter);
        console.log(result)
        // Determine if we are liking vs unliking -- On new podcasts we do not have a 'likes field so uses optional chaining
        if (result.likes?.includes(req.body.userId)) {
            update = {
                $pull: {
                    likes: req.body.userId
                }
            }
            await podcastCollection.updateOne(filter, update);
            result = "Removed Like";
        }
        else {
            await podcastCollection.updateOne(filter, update);
            result = "Liked"
        }
        res.send(result.value)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ' + e)
    }
    finally {

    }
})


//Retrieves all the comment to a podcast
router.get('/podcasts/:podcastTitle/comments', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts');
    let commentCollection = podscholar.collection('comments');
    try {
        let title = req.params.podcastTitle.split('+').join(' ')
        let filter = {
            title: title
        }
        let result = await podcastCollection.findOne(filter);

        filter = {
            podcastId: result._id
        }
        result = await commentCollection.findOne(filter);
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status("400").send('Error: ' + e)
    }
    finally {

    }
})


router.post('/podcasts/:podcastTitle/comments', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts');
    let commentCollection = podscholar.collection('comments');
    try {

        let commentTimestamp = new Date(Date.now()).toISOString()
        let title = req.params.podcastTitle.split('+').join(' ')
        let filter = {
            title: title
        }
        let result = await podcastCollection.findOne(filter);
        let podcastId = result._id
        filter = {
            podcastId: podcastId
        }
        result = await commentCollection.findOne(filter);
        if (result) {
            let update = {
                $push: {
                    comments: {
                        userId: req.body.userId,
                        comment: req.body.comment,
                        timestamp: commentTimestamp
                    }
                }
            }
            result = await commentCollection.updateOne(filter, update)
        }
        else {
            result = await commentCollection.insertOne({
                podcastId: podcastId,
                comments: [{
                    userId: req.body.userId,
                    comment: req.body.comment,
                    timestamp: commentTimestamp
                }]
            })
        }
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status("400").send('Error: ' + e)
    }
    finally {

    }
})


//#endregion

module.exports = { router }