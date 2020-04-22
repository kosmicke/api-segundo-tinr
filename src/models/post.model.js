var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Importing just to register models
const { User } = require("./user.model")
const { Topic } = require("./topic.model")

var schema = new Schema(
    {
        title: {
            type: String
        },
        body: {
            type: String
        },
        owner : {
            type: Schema.Types.ObjectId,
            ref: 'user' 
        },
        topic : {
            type: Schema.Types.ObjectId,
            ref: 'topic' 
        },
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

module.exports.Post = mongoose.model('post', schema, 'posts');