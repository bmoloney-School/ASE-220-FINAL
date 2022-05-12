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
        let result = await podcastCollection.find({}, { "limit": 10 }).toArray()
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ', e)
    }
    finally {
        client.close();
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
        res.status(500).send('Error: ', e)
    }
    finally {
        client.close();
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
        res.status(500).send('Error: ', e)
    }
    finally {
        client.close();
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
        res.status(500).send('Error: ', e)
    }
    finally {
        client.close();
    }
})

//Retrieves 10 recently uploaded podcasts from the database in a specific :scientific-discipline 
router.get('/categories/:scientific-discipline', async (req, res) => {
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
        res.status(500).send('Error: ', e)
    }
    finally {
        client.close();
    }
})

//Retrieves 10 podcasts from the database based on the search keyword in a specific :scientific-discipline 
router.get('/categories/:scientific-discipline/search/keyword/:keyword', async (req, res) => {

})

//Retrieves 10 podcasts from the database based on the search date in a specific :scientific-discipline
router.get('/categories/:scientific-discipline/search/date/:date', async (req, res) => {

})

//Retrieves a list of tags sorted by number of podcasts and the total number of podcasts for each tag  
router.get('/keywords', async (req, res) => {

})

//Retrieves 10 recently uploaded podcasts from the database in a specific :keyword
router.get('/keywords/:keyword', async (req, res) => {

})

//Retrieves 10 podcasts from the database based on the search date in a specific :date
router.get('/keywords/:keyword/search/date/:date ', async (req, res) => {

})

//#endregion

//#region Single Podcast

//Creates a new Podcast
router.post('/podcasts', async (req, res) => {
    let podcastCollection = podscholar.collection('podcasts')
    try {
        let newPodcast = req.body;
        newPodcast.modifiedDate = new Date(Date.now()).toISOString()

        let result = await podcastCollection.insertOne(newPodcast);
        res.send(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ', e)
    }
    finally {
        client.close();
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
        res.status(500).send('Error: ', e)
    }
    finally {
        client.close();
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
        res.status(500).send('Error: ', e)
    }
    finally {
        client.close();
    }
})

//Modifies a specific podcast
router.delete('/podcasts/:podcast-title', async (req, res) => {

})

//Subscribes/unsubscribe to a specific podcast -- Not sure how this differs from a like 
//system since you would not have a series of podcasts about a single paper. If anything, this should be implemented as a 'subscribe to an author' feature. 
router.patch('/podcasts/:podcast-title/actions/subscribe', async (req, res) => {

})

//Likes/unlikes a specific podcast: NOTE: CURRENTLY JUST LIKES -- FIX THIS
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
        let result = await podcastCollection.updateOne(filter, update);
        res.send(result.value)
    }
    catch (e) {
        console.log(e)
        res.status(500).send('Error: ', e)
    }
    finally {
        client.close();
    }
})

//Retrieves all the comment to a podcast
router.get('/podcasts/:podcast-title/comments', async (req, res) => {

})

//#endregion

module.exports = { router }