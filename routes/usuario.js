const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require("../models/Usuarios")
const Usuarios = mongoose.model("usuarios")
const passport = require("passport")

router.get("/registro", function(req, res){
    res.render("usuarios/registro")
})

router.post("/registro", function(req, res){
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido."})      
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido."})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null || req.body.senha<4){
        erros.push({texto: "Senha inválido."})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto:"As senhas são diferentes, tente novamente!!!"})
    }
    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    } else {
        //pesquisando se usuário ja existe
        Usuarios.findOne({email: req.body.email}).then(function(usuarios){
            if(usuarios){
                req.flash("error_msg", "Email ja cadastrado!!")
                res.redirect("/usuarios/registro")
            } else {
                const novoUsuario = new Usuarios({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                })
                //encriptando senha
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("error_msg", "Erro durante o salvamento da hash.")
                            res.redirect("/admin")
                        }
                        novoUsuario.senha = hash //hash gerada
                        novoUsuario.save().then(function(){ // salvamento usuário
                            req.flash("success_msg", "Usuário criado com sucesso.")
                            res.redirect("/admin")
                        }).catch(function(err){
                            req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente.")
                            res.redirect("/usuarios/registros")
                        })
                    })
                })              
            }
        })
    }
})

router.get("/login", function(req, res){
    res.render("usuarios/login")
})

router.get("/", function(req, res){
    res.render("admin/index")
})

router.get("/logout", function(req, res){
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso.")
    res.redirect("/admin")
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect:"/admin", //autenticação correta
        failureRedirect: "/usuarios/login", //falha na autenticação
        failureFlash: true, //habilitando msg flash
    })(req, res, next)
})

module.exports = router