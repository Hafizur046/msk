const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const featuredSchema = new Schema({
    linked_id: {
        type: String,
        required: true
    },
    order:{
        type: Number,
        required: true
    }
})

const Featured = mongoose.model('featured' , featuredSchema);
module.exports = Featured;