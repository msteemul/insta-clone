const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get('/user/:id', requireLogin, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id}).select("-password");
        const posts = await Post.find({postedBy: req.params.id}).populate("postedBy", "_id name");
        res.json({user, posts});
    } catch(err) {
        return res.status(404).json({error: "User not found"})
    }
});


module.exports = router;