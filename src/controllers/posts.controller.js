const { Topic } = require("../models/topic.model");
const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");

const { body, buildValidation } = require('../helpers/validation-set.helper')
const { throwError } = require('../helpers/errors.helper')

const create = async (req, res) => {
    
    let owner = await User.findById(req.body.owner)
    if(!owner) throwError(404, "Owner user not found.")

    let topic = await Topic.findById(req.body.topic)
    if(!topic) throwError(404, "Topic not found.")
    
    let post = new Post(req.body)
    await post.save()

    return res.status(200).send({message : "Post created!"})
}

const list = async (req, res) => {

    let query = req.quey || {}
    
    let posts = await Post.find(query).select({
        _id : true,
        title : true,
        body : true,
        owner : true,
        topic : true,
        likes: true,
        likesCount: true,
        createdAt : true,
        updatedAt : true,
    }).populate({
        path : "owner",
        select : "_id name nickName email avatar"
    })
    
    if(!posts || !Array.isArray(posts)){
        posts = []
    }

    posts = posts.map(topic => {
        topic = topic.toObject()
        delete topic.likes
        return topic
    })

    return res.status(200).send({data : posts})
}

const remove = async (req, res) => {
    
    let post = await Post.findById(req.params.id)
    if(!post) throwError(404, "Post not found.")
    
    await post.remove()
    return res.status(200).send({message : "Post removed!"})
}

const edit = async (req, res) => {
    
    let post = await Post.findById(req.params.id)
    if(!post) throwError(404, "Post not found.")
    
    let editableFields = ["title", "body"]
    let toUpdate = false;
    let updates = {}; 

    for (let key in req.body) {
        if (editableFields.includes(key) && (post[key] != req.body[key])){
            updates[key] = req.body[key];
            toUpdate = true;
        }
    }

    if(!toUpdate){
        return res.status(200).send({message : "Nothing to edit."})
    }

    await Post.updateOne({_id: req.params.id}, {$set: updates})
    return res.status(200).send({message : "Post edited!"})
}

const like = async(req, res) => {
    
    let post = await Post.findById(req.params.id)
    if(!post) throwError(404, "Post not found.")

    let found = post.likes.find(likeOwner => likeOwner == req.body.user)
    
    let message = "";
    let updates = {};

    if(found){
        message = "Post unliked!";
        updates = { $pull: { likes: req.body.user }};
    }else{
        message = "Post liked!";
        updates = { $push: { likes: req.body.user }};
    }

    await Post.updateOne({_id : post._id}, updates)
    return res.status(200).send({
        message : message, 
        data : { liked : !(found) }
    })
}

const getLikes = async(req, res) => {
    
    let post = await Post.findById(req.params.id).populate({
        path : "likes",
        select : "_id nickName name avatar"
    })
    if(!post) throwError(404, "Post not found.")

    return res.status(200).send({data : post.likes})
}

module.exports = {
    create: [
        buildValidation(create, [
            body('title', `value "title" is required.`).exists(),
            body('body', `value "body" is required.`).exists(),
            body('owner', `value "owner" is required.`).exists(),
            body('topic', `value "topic" is required.`).exists(),
        ])
    ],
    list,
    remove,
    edit,
    like,
    getLikes
}