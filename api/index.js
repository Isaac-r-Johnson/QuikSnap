// Imports
require("dotenv").config();
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require('cloudinary').v2;
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fs = require('fs');
const crypto = require('crypto');


// System
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
cloudinary.config({
    secure: true
});


// DB Setup
mongoose.connect(process.env.DB_APIKEY);
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    pic: String,
    follows: [String],
    key: String
});
const postSchema = new mongoose.Schema({
    poster: {username: String, pic: String},
    location: String,
    title: String,
    description: String,
    pic: String,
    key: String,
    likeCount: Number,
    dislikeCount: Number
})
const User = new mongoose.model('User', userSchema);
const Post = new mongoose.model('Post', postSchema);


// Functions
const uploadImage = async (fileBuffer) => {
    try {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: "QuikSnap" }, (error, result) => {
                if (error) {
                    console.error('Error uploading image to Cloudinary:', error);
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }).end(fileBuffer);
        });
    } catch (error) {
        console.error('Error in uploadImage:', error);
        throw error;
    }
};


// Get Requests
app.get("/", async (req, res) => {
    try{
        res.sendStatus(200);
    } catch (err) {
        console.log("Get '/' Error: " + err);
    }
});

app.get('/users', async (req, res) => {
    try {
        const tempUsers = await User.find();
        const users = []
        tempUsers.forEach(user => {
            users.push({username: user.username, pic: user.pic});
        });
        console.log("Sent Users");
        res.send(users);
    }
    catch (err){
        console.log(err);
        res.send("ERROR");
    }
});


// Post Requests
app.post('/signup', upload.single('pic'), async (req, res) => {
    try {
        if (!req.file) {
            console.log("No File!");
        }
        const {username, password} = req.body;
        const checkUser = await User.findOne({username: username});
        if (!checkUser){
            const picUrl = await uploadImage(req.file.buffer);
            const key = crypto.randomBytes(20).toString('base64');
            User.insertMany([{
                username: username,
                password: password,
                pic: picUrl,
                key: key
            }]);
            console.log("Signup Made");
            res.send("OK");
        }
        else {
            console.log("Username Taken")
            res.send("TAKEN");
        }
    } catch (err){
        res.send("ERROR");
        throw err;
    }
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.findOne({username: username, password: password});
        if (user){
            res.send('OK');
        }
        else{
            console.log('NO');
            res.send("NO");
        }
    } catch (err){
        res.send("ERROR");
        console.log(err);
    }
});

app.post('/post', upload.single('postImage'), async (req, res) => {
    try {
        const picUrl = await uploadImage(req.file.buffer);
        const {postTitle, postDes, username, password, location} = req.body;
        const key = crypto.randomBytes(20).toString('base64');
        const user = await User.findOne({username: username, password: password});
        Post.insertMany([{
            poster: {username: user.username, pic: user.pic},
            location: location,
            title: postTitle,
            description: postDes,
            pic: picUrl,
            key: key,
            likeCount: 0,
            dislikeCount: 0
        }]);
        console.log("Post Uploaded!");
        res.send("OK");
    } catch (err){
        console.log(err);
        res.send("ERROR");
    }
});

app.post('/follows', async (req, res) => {
    try{
        const username = req.body.accountUsername;
        const user = await User.findOne({username: username});
        res.send(user.follows);
    } catch (err){
        console.log("Follows Error: " + err);
        res.send("ERROR");
    }
});

app.post('/follow', async (req, res) => {
    const {accountUsername, usernameToFollow} = req.body;
    try{
       const userToFollow = await User.findOne({username: usernameToFollow});
       const follow = userToFollow.username;
       await User.findOneAndUpdate({username: accountUsername}, {$push:{follows:follow}});
       res.send("OK");
    } catch (err){
        console.log("Following Error: " + err);
        res.send("ERROR");
    }
});

app.post('/unfollow', async (req, res) => {
    const {accountUsername, usernameToUnFollow} = req.body;
    try{
       const userToFollow = await User.findOne({username: usernameToUnFollow});
       const follow = userToFollow.username;
       await User.findOneAndUpdate({username: accountUsername}, {$pull:{follows:follow}});
       res.send("OK");
    } catch (err){
        console.log("Following Error: " + err);
        res.send("ERROR");
    }
});

app.post('/posts', async (req, res) => {
    try {
        const {follows, accountName} = req.body;
        const posts = await Post.find();
        const postsToSend = [];
        if (follows){
            await posts.forEach(post => {
                follows.forEach(follow => {
                    if (post.poster.username === follow){
                        postsToSend.push(post);
                    }
                });
                if (post.poster.username === accountName){
                    postsToSend.push(post);
                }
            });
        }
        console.log("Sent Posts");
        res.send(postsToSend);
    }
    catch (err){
        console.log(err);
        res.send("ERROR");
    }
});

// Start
app.listen(process.env.PORT, () => {
    console.log("QuikSnap server is running on port " + process.env.PORT + "...");
});