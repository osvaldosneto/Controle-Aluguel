const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Custos = new Schema({
    nome:{
        type: String,
        required: true
    },
    dia:{
        type: String,
        required: true
    },
    mes:{
        type: String,
        required: true
    },
    ano:{
        type: String,
        required: true
    },
    descricao:{
        type: String
    },
    valor:{
        type: String,
        //required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model('custos', Custos)