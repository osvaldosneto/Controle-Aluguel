const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Custos")
const Custos = mongoose.model("custos")
require('../models/Casa')
const Casa = mongoose.model('casa')
require('../models/Cliente')
const Cliente = mongoose.model('cliente')
require('../models/Reserva')
const Reserva = mongoose.model('reserva')
const {eadmin} = require("../helpers/eadmin")

//adição de rotas
router.get("/", eadmin, function(req, res){
    res.render("custos/index")
})

router.get("/addcustos", eadmin, function(req, res){
    res.render("custos/addcustos")
})

router.get("/relatorio", eadmin, function(req, res){
    res.render("custos/relatorio")
})

router.post("/relatorio", eadmin, function(req, res){
    var data = req.body.mes.split("/")
    
    if( (isNaN(data[0])) || (isNaN(data[1])) ){
        req.flash("error_msg", "Preenchimento da data incorreto.")
        res.redirect("/custos/addcustos")
    } else {
        Reserva.find({mes:data[0], ano:data[1]}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            var retorno = calculosReserva(reserva)
            Custos.find({mes:data[0], ano:data[1]}).sort({date:'desc'}).lean().then(function (custos){
                var retornoCusto = calculosCustos(custos)
                var lucro = calculoslucro(retorno.soma, retornoCusto)
                res.render("custos/resultadorelatorio", {custos:custos, reserva:reserva, lucro:lucro, retorno:retorno, retornoCusto:retornoCusto})
            }).catch(function(error){
                req.flash("error_msg", "Este custo não existe.")
                res.redirect("/custos")
            })   
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    }
})

router.post("/confirmacusto", eadmin, function(req, res){
    var data = req.body.dia.split("/")
    const novoCusto = {
        nome: req.body.nome,
        dia:req.body.dia,
        mes: data[1],
        ano: data[2],
        descricao: req.body.descricao,
        valor: req.body.valor
    }
    new Custos(novoCusto).save().then(function(){
        req.flash("success_msg", "Custo registrado com sucesso!!")
        res.redirect("/custos")
    }).catch(function(err){
        req.flash("error_msg", "Houve um erro ao registrar a reserva!!")
        res.redirect("/custos/addcustos")
    })
})

router.post("/confirma", eadmin, function(req, res){
    var data = req.body.data.split("/")
    var valor = parseFloat(req.body.valor.replace(",", ".")).toFixed(2)
    var valor_s = valor.toString().replace(".", ",")
    if( (isNaN(data[0])) || (isNaN(data[1])) || (isNaN(data[2])) ){
        req.flash("error_msg", "Preenchimento da data incorreto.")
        res.redirect("/custos/addcustos")
    }
    if (isNaN(valor)){
        req.flash("error_msg", "Preenchimento do valor incorreto.")
        res.redirect("/custos/addcustos")
    } else {
        const novoCusto = {
            nome: req.body.tipo,
            dia:req.body.data,
            mes: data[1],
            ano: data[2],
            descricao: req.body.descricao,
            valor: valor_s
        }
        res.render("custos/confirma", {novoCusto : novoCusto})
    }
})

router.get("/consulta", eadmin, function(req, res){
    res.render("custos/pesquisa")
})

router.get("/edit/:id", function(req, res){
    Custos.findOne({_id:req.params.id}).lean().then(function(custos){
        res.render("custos/edit", {custos:custos})
    }).catch(function(err){
        req.flash("error_msg", "Houve um problema ao editar o custo!!") //mensagem
        res.redirect("/custos")
    })
})

router.post("/deletar", eadmin, function(req, res){
    Custos.deleteOne({_id: req.body.id}).then(function(){
        req.flash("success_msg", "Custo excluido com sucesso!!") //mensagem
        res.redirect("/custos")
    }).catch(function(err){
        req.flash("error_msg", "Houve um problema ao deletar o custo!!") //mensagem
        res.redirect("/custos")
    })
})

router.post("/pesquisa", eadmin, function(req, res){
    var data = req.body.data.split("/")
    if(req.body.tipo == "" && req.body.data == ""){
        Custos.find().sort({date:'desc'}).lean().then(function (custos){  
            res.render("custos/resultadopesquisa", {custos:custos})
        }).catch(function(error){
            req.flash("error_msg", "Este custo não existe.")
            res.redirect("/custos")
        })
    } else if ( req.body.tipo != "" && req.body.data == "" ){
        Custos.find({nome:req.body.tipo}).sort({date:'desc'}).lean().then(function (custos){  
            res.render("custos/resultadopesquisa", {custos:custos})
        }).catch(function(error){
            req.flash("error_msg", "Este custo não existe.")
            res.redirect("/custos")
        })
    } else if ( req.body.tipo == "" && req.body.data != "" ){
        Custos.find({mes:data[0], ano:data[1]}).sort({date:'desc'}).lean().then(function (custos){  
            res.render("custos/resultadopesquisa", {custos:custos})
        }).catch(function(error){
            req.flash("error_msg", "Este custo não existe.")
            res.redirect("/custos")
        })
    } else if ( req.body.tipo != "" && req.body.data != "" ){
        Custos.find({nome:req.body.tipo, mes:data[0], ano:data[1]}).sort({date:'desc'}).lean().then(function (custos){  
            res.render("custos/resultadopesquisa", {custos:custos})
        }).catch(function(error){
            req.flash("error_msg", "Este custo não existe.")
            res.redirect("/custos")
        })
    } else {
        req.flash("error_msg", "Este custo não existe.")
        res.redirect("/custos")
    }   
})

function calculosReserva(reserva) {
    var soma = Number(0)
    var dias = Number(0)
    var subtotal = Number(0)
    var desconto = Number(0)
    var retorno = []
    for(let i=0; i<reserva.length; i++){
        var aux1 = parseFloat(reserva[i].saldo.replace(",", ".")).toFixed(2)
        var aux2 = parseFloat(reserva[i].desconto.replace(",", ".")).toFixed(2)
        var aux3 = parseFloat(reserva[i].subtotal.replace(",", ".")).toFixed(2)
        dias = dias + parseInt(reserva[i].dias)
        soma = soma + Number(aux1)
        desconto = desconto + Number(aux2)
        subtotal = subtotal + Number(aux3)
    }
    desconto = desconto.toFixed(2).toString().replace(".", ",")
    soma = soma.toFixed(2).toString().replace(".", ",")
    subtotal = subtotal.toFixed(2).toString().replace(".", ",")
    var retorno = {
        desconto : desconto,
        soma : soma,
        dias : dias,
        subtotal : subtotal,
    }
    return retorno
}

function calculosCustos(custos){
    var totalcustos = 0
    for(let i=0; i<custos.length; i++){
        totalcustos = Number(totalcustos) + Number(parseFloat((custos[i].valor).replace(",", ".")).toFixed(2))
    }
    totalcustos = totalcustos.toString().replace(".", ",")
    return totalcustos
}

function calculoslucro(receita, custo){
    var re = parseFloat(receita.replace(",", ".")).toFixed(2)
    var cus = parseFloat(custo.replace(",", ".")).toFixed(2)
    var retorno = Number(re) - Number(cus)
    retorno = retorno.toFixed(2).toString().replace(".", ",")
    return retorno
}

module.exports = router