const { User } = require("../models/user.model");
const { Topic } = require("../models/topic.model");

// const { body, buildValidation } = require('../helpers/validation-set.helper')
const { throwError } = require('../helpers/errors.helper')

const getByParam = async (req, res) => {
    
    let query = {}
    if (req.params.search && req.params.search.match(/^[0-9a-fA-F]{24}$/)) {
        query = {_id : req.params.search}
    }else{
        query = { nickName : req.params.search }
    }

    let user = await User.findOne(query).select("_id nickName email name avatar createdAt birthDay")
    if(!user) throwError(404, "User user not found.")
   
    let topics = await Topic.find({owner : user._id})
    .limit(5)
    .sort({ createdAt: -1 })
    .select({
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

    let userData = user.toObject()
    userData.lastTopics = topics || []

    return res.status(200).send({ data : userData })
}

module.exports = {
    getByParam
}