const { User } = require("../models/user.model");

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

    return res.status(200).send({ data : user })
}

module.exports = {
    getByParam
}