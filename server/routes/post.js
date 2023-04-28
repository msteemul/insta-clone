const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const Post = mongoose.model("Post");


router.get('/allpost',requireLogin, (req, res) => {
    Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        console.log(err);
    })
})

router.post('/createpost',requireLogin, (req, res) => { 
    const {title, body, pic} = req.body;
    console.log(title, body, pic);
    if(!title || !body || !pic){
        return res.status(422).json({error: "Please add all the fields"})
    }
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({post: result})
    })
    .catch(err => {
        console.log(err);
    })

})

router.get('/mypost',requireLogin, (req, res) => {
    Post.find({postedBy: req.user._id})
    .populate("postedBy", "_id name")
    .then(mypost => {
        res.json({mypost})
    })
    .catch(err => {
        console.log(err);
    })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.user._id } },
      { new: true }
    )
      .then(result => {
        res.json(result);
        console.log(result);
      })
      .catch(err => {
        res.status(422).json({ error: err });
      });
  });

  router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
      .then(result => {
        res.json(result);
        console.log(result);
      })
      .catch(err => {
        res.status(422).json({ error: err });
      });
  });

  router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(
        req.body.postId,
      { $push: {comments: comment} },
      { new: true }
    ).populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .then(result => {
        res.json(result);
        console.log(result);
      })
      .catch(err => {
        res.status(422).json({ error: err });
      });
  });

 // Like a comment
router.put('/comment/like', requireLogin, (req, res) => {
  const { commentId } = req.body;
  Comment.findByIdAndUpdate(
    commentId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
  .populate("postedBy", "_id name")
  .then(result => {
    res.json(result);
    console.log(result);
  })
  .catch(err => {
    res.status(422).json({ error: err });
  });
});

// Reply to a comment
router.put('/comment/reply', requireLogin, (req, res) => {
  const { commentId, text } = req.body;
  const reply = {
    text,
    postedBy: req.user._id
  };
  Comment.findByIdAndUpdate(
    commentId,
    { $push: { replies: reply } },
    { new: true }
  )
  .populate("replies.postedBy", "_id name")
  .populate("postedBy", "_id name")
  .then(result => {
    res.json(result);
    console.log(result);
  })
  .catch(err => {
    res.status(422).json({ error: err });
  });
});

// Delete a comment
router.delete('/comment', requireLogin, (req, res) => {
  const { commentId } = req.body;
  Comment.findById(commentId)
    .populate("postedBy", "_id")
    .exec((err, comment) => {
      if (err || !comment) {
        return res.status(422).json({ error: err });
      }
      if (comment.postedBy._id.toString() === req.user._id.toString()) {
        comment.remove()
          .then(result => {
            res.json(result);
            console.log(result);
          })
          .catch(err => {
            res.status(422).json({ error: err });
          });
      }
    });
});


  router.delete('/deletepost/:postId', requireLogin, async (req, res) => {
    try {
      const post = await Post.findOne({_id:req.params.postId}).populate("postedBy", "_id")
      if(!post) {
        return res.status(422).json({error: "Post not found"})
      }
      if(post.postedBy._id.toString() !== req.user._id.toString()) {
        return res.status(401).json({error: "You are not authorized to delete this post"})
      }
      const result = await Post.deleteOne({_id: post._id})
      res.json(result)
      console.log(result)
    } catch(err) {
      console.log(err)
    }
  })

module.exports = router;