const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    location: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    catagory: {
        type: String,
        required: true
    },
    iframe: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: false,
        default: Date()
    }
})

const Video = mongoose.model('video' , videoSchema);
module.exports = Video;