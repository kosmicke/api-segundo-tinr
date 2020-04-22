var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema(
    {
        nickName: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        status : {
            type: Number
        },
        name : {
            type: String
        },
        birthDay : {
            type : Date
        },
        avatar: {
            type: String
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
);

module.exports.User = mongoose.model('user', schema, 'users');