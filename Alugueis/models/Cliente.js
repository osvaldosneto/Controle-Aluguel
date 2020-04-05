const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Cliente = new Schema({
    nome:{
        type: String,
        required: true
    },
    telefone:{
        type: String,
        required: true
    },
    email:{
        type: String,
    },
    cidade:{
        type: String,
    },
    nascimento:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model('cliente', Cliente)