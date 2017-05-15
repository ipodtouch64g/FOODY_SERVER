const express = require('express');
const bodyParser = require('body-parser');
const accessController = require('../middleware/access-controller.js');

const postModel = require('../model/posts.js');
const voteModel = require('../model/votes.js');

const router = express.Router();

router.use(bodyParser.json());
router.use(accessController); // Allows cross-origin HTTP requests

// List
router.get('/rests', function(req, res, next) {
    const {searchText} = req.query;
    postModel.list(searchText).then(posts => {
        res.json(posts);
    }).catch(next);
});

router.get('/posts', function(req, res, next) {
    const {r_id} = req.query;
    postModel.listPost(r_id).then(posts => {
        res.json(posts);
    }).catch(next);
});

// Create
router.post('/posts', function(req, res, next) {
    const {text,id} = req.body;
    if (!text) {
        const err = new Error('id and text are required');
        err.status = 400;
        throw err;
    }
    postModel.create(text,id).then(post => {
        res.json(post);
    }).catch(next);
});

// Vote
router.post('/posts/:id/:mood(clear|clouds|drizzle|rain|thunder|snow|windy)Votes', function(req, res, next) {
    const {id, mood} = req.params;
    if (!id || !mood) {
        const err = new Error('Post ID and mood are required');
        err.status = 400;
        throw err;
    }
    voteModel.create(id, mood).then(post => {
        res.json(post);
    }).catch(next);
});

module.exports = router;
