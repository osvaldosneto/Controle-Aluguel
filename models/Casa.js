const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Casa = new Schema({
    nome:{
        type: String,
        required: true
    },
    maxhospedes:{
        type: String,
        required: true
    },
    diaria:{
        type: String,
        required: true
    },
    hospedeextra:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model('casa', Casa)