const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Reserva = new Schema({
    casa:{
        type: Schema.Types.ObjectId,
        ref: "casa",
        required: true
    },
    hospedes:{
        type: String,
        required: true
    },
    cliente:{
        type: Schema.Types.ObjectId,
        ref: "cliente",
        required: true
    },
    entrada:{
        type: String,
        required: true
    },
    saida:{
        type: String,
        required: true
    },
    desconto:{
        type: String,
        require: true
    },
    valor_diaria:{
        type: String,
        require: true
    },
    saldo:{
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
    date:{
        type: Date,
        default: Date.now()
    },
    dias:{
        type: String,
        required:true
    }
})

mongoose.model('reserva', Reserva)