const { Router } = require('express');
const postModel = require('../../models/postModel')
// const multer = require('multer');
const router = Router()

const fs = require("fs");
const formidable = require("formidable");
const path = require('path');
const ObjectId = require('mongoose').Types.ObjectId;

let directory = path.join(__dirname, "../../public/images")

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/'); // Uploads will be stored in 'uploads/' directory
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname); // Keep original file name
//     }
//   });
  
//   const upload = multer({ storage });


router.get('/', async(req, res) => {
    try {
        const posts = await postModel.find();
        if (!posts) throw new Error('no posts found');
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.get('/:username', async(req, res) => {
    const {username} = req.params;
    try {
        console.log('hi')
        const post = await postModel.find({username: username});
        console.log(post)
        if (!post) throw new Error('no posts found');
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.post('/',  async (req, res) => {
    console.log(req.body.username)
    console.log(req.body.description)
    console.log(req.body.myFile)
    const post = req.body; 
    try { 
     const newPost = new postModel(post);
     await newPost.save();
     res.status(201).json({ msg: "new post uploaded"})
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating post');
    }
  });

// like a post
router.post('/:id/like', async (req, res) => {
    try {
        const userId = req.body.UserId;
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const index = post.likes.indexOf(userId);
        if (index === -1) {
            // User has not liked the post yet
            post.likes.push(userId);
        } else {
            // User has already liked the post
            post.likes.splice(index, 1);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//adding a comment
router.post('/:id/comments', async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const { username, description } = req.body;
        if (!username || !description) {
            return res.status(400).json({ message: 'Username and description are required' });
        }

        post.comments.push({ username, description });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

//fetching a comment
router.get('/:id/comments', async(req, res) => {
    try {
        console.log('hi')
        const post = await postModel.findById(req.params.id);
        if (!post) throw new Error('no posts found');

        res.status(200).json(post.comments)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

//liking a comment
router.post('/:id/comment/like', async (req, res) => {
    try {
        const userId = req.body.UserId;
        const commentId = req.body.CommentId;
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log('post ', post)

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        console.log('comment ', comment)

        const index = comment.likes.indexOf(userId);
        console.log('index ', index)
        if (index === -1) {
            // User has not liked the post yet
            comment.likes.push(userId);
        } else {
            // User has already liked the post
            comment.likes.splice(index, 1);
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


router.put('/:id', async(req,res) => {
    const {id} = req.params;
    const {post} = req.body;
    console.log('req.params; ', req.params)
    console.log('req.body; ', post)
    try {
        const response = await postModel.findByIdAndUpdate(id, req.body);
        if(!response) throw Error('something went wrong while updating post');
        const updated =  { ...response._doc, ...req.body};
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

router.delete('/:id', async(req,res) => {
    const {id} = req.params;
    try {
        const response = await postModel.findByIdAndDelete(id);
        if(!response) throw Error('something went wrong while deleting post');
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

//deleting a comment
router.delete('/:id/comment/:commentId', async(req,res) => {
    const {id} = req.params;
    const {commentId} = req.params
    try {
        const post = await postModel.findById(id);
        if(!post) throw Error('Couldn\'t find post');

        console.log('comment id ', commentId)
        const comment = post.comments.id(commentId)

        if(!comment) throw Error('comment not found');

        post.comments.pull(commentId)
        await post.save()

        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

module.exports = router;