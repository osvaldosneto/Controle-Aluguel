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
    var soma = 0
    var desconto = 0
    var dias = 0
    var subtotal = 0
    var totalcustos = 0
    if( (isNaN(data[0])) || (isNaN(data[1])) ){
        req.flash("error_msg", "Preenchimento da data incorreto.")
        res.redirect("/custos/addcustos")
    } else {
        Reserva.find({mes:data[0], ano:data[1]}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            for(let i=0; i<reserva.length; i++){
                var aux1 = parseFloat(reserva[i].saldo.replace(",", ".")).toFixed(2)
                var aux2 = parseFloat(reserva[i].desconto.replace(",", ".")).toFixed(2)
                var aux3 = parseFloat(reserva[i].subtotal.replace(",", ".")).toFixed(2)
                dias = dias + parseInt(reserva[i].dias)
                soma = Number(soma) + Number(aux1)
                desconto = Number(desconto) + Number(aux2)
                subtotal = Number(subtotal) + Number(aux3)
            }
            
            Custos.find({mes:data[0], ano:data[1]}).sort({date:'desc'}).lean().then(function (custos){
                for(let i=0; i<custos.length; i++){
                    var aux = parseFloat((custos[i].valor).replace(",", ".")).toFixed(2)
                    totalcustos = Number(totalcustos) + Number(aux)
                }
                desconto = desconto.toString().replace(".", ",")
                soma = soma.toString().replace(".", ",")
                subtotal = subtotal.toString().replace(".", ",")
                totalcustos = totalcustos.toString().replace(".", ",")
                res.render("custos/resultadorelatorio", {custos:custos, reserva:reserva, soma:soma, totalcustos:totalcustos, desconto:desconto, subtotal:subtotal})
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

module.exports = router