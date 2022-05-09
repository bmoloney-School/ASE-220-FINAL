import express from 'express';
import fs from 'fs';
import mongo, { MongoClient } from 'mongodb';
import multer from 'multer';

const upload = multer({dest:'public/podcasts'})
const router = express.Router();

const uri = "mongodb+srv://6K9uMUAg2t6e:Ey4kype7VAYbsZG3@podscholarcluster.g5sjk.mongodb.net/podscholar?retryWrites=true&w=majority";
const client = new MongoClient(uri);



router.use('/API', async (req,res, next) => {
    // Try Not awaiting -- Should save some time if we continue with process and then wait for the promise in the end route.
    client.connect();
})

router.post('/file', upload.single('podcast') ,async (req,res) => {
    console.log(req.file?.filename)
})