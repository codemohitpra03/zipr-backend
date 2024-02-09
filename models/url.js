const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user schema
        ref: 'UserModal', // Name of the referenced model (assuming it's 'User')
        required: true
    },
    shortId:{
        type: String,
        required: true,
        unique: true
    },
    redirectUrl:{
        type: String,
        required: true
    },
    visitHistory:[
        {
            timestamp:{
                type: Date,
            },
            ipAddress: {
                type: String 
            }
        }
    ]
    
    
},{timestamps:true});

const URL = mongoose.model('urls',urlSchema);

module.exports = URL;