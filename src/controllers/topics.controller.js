const { Topic } = require("../models/topic.model");
const { User } = require("../models/user.model");

const { body, buildValidation } = require('../helpers/validation-set.helper')
const { throwError } = require('../helpers/errors.helper')

const create = async (req, res) => {
    
    let owner = await User.findById(req.body.owner)
    if(!owner) throwError(404, "Owner user not found.")
    
    let topic = new Topic(req.body)
    await topic.save()

    return res.status(200).send({message : "Topic created!"})
}

const list = async (req, res) => {
    
    let topics = await Topic.find().select({
        _id : true,
        name : true,
        desc : true,
        owner : true,
        avatar : true,
        posts: true,
        likes: true,
        postsCount: true,
        likesCount: true,
        createdAt : true,
        updatedAt : true,
    }).populate({
        path : "owner",
        select : "_id name nickName email avatar"
    })
    
    if(!topics || !Array.isArray(topics)){
        topics = []
    }

    topics = topics.map(topic => {
        topic = topic.toObject()
        delete topic.likes
        delete topic.posts
        return topic
    })

    return res.status(200).send({data : topics})
}

const remove = async (req, res) => {
    
    let topic = await Topic.findById(req.params.id)
    if(!topic) throwError(404, "Topic not found.")
    
    await topic.remove()
    return res.status(200).send({message : "Topic removed!"})
}

const edit = async (req, res) => {
    
    let topic = await Topic.findById(req.params.id)
    if(!topic) throwError(404, "Topic not found.")
    
    let editableFields = ["name", "desc", "avatar"]
    let toUpdate = false;
    let updates = {};

    for (let key in req.body) {
        if (editableFields.includes(key) && (topic[key] != req.body[key])){
            updates[key] = req.body[key];
            toUpdate = true;
        }
    }

    if(!toUpdate){
        return res.status(200).send({message : "Nothing to update."})
    }

    await Topic.updateOne({_id: req.params.id}, {$set: updates})
    return res.status(200).send({message : "Topic edited!"})
}

const like = async(req, res) => {
    
    let topic = await Topic.findById(req.params.id)
    if(!topic) throwError(404, "Topic not found.")

    let found = topic.likes.find(likeOwner => likeOwner == req.body.user)
    
    let message = "";
    let updates = {};

    if(found){
        message = "Topic unliked!";
        updates = { $pull: { likes: req.body.user }};
    }else{
        message = "Topic liked!";
        updates = { $push: { likes: req.body.user }};
    }

    await Topic.updateOne({_id : topic._id}, updates)
    return res.status(200).send({
        message : message, 
        data : { liked : !(found) }
    })
}

const getLikes = async(req, res) => {
    
    let topic = await Topic.findById(req.params.id).populate({
        path : "likes",
        select : "_id nickName name avatar"
    })
    if(!topic) throwError(404, "Topic not found.")

    return res.status(200).send({data : topic.likes})
}

module.exports = {
    create: [
        buildValidation(create, [
            body('name', `value "name" is required.`).exists(),
            body('desc', `value "desc" is required.`).exists(),
            body('owner', `value "owner" is required.`).exists(),
        ])
    ],
    list,
    remove,
    edit,
    like,
    getLikes
}