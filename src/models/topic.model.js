var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Importing just to register models
const { User } = require("./user.model")
const { Post } = require("./post.model")

var schema = new Schema(
    {
        name: {
            type: String
        },
        desc: {
            type: String
        },
        avatar: {
            type: String
        },
        owner : {
            type: Schema.Types.ObjectId,
            ref: 'user' 
        },
        posts : [
            {
                type: Schema.Types.ObjectId,
                ref: 'post' 
            }
        ],
        likes : [
            {
                type: Schema.Types.ObjectId,
                ref: 'user' 
            }
        ]
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
);

module.exports.Topic = mongoose.model('topic', schema, 'topics');