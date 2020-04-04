//carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const path = require("path")//carregando bootstrap
const admin = require('./routes/admin')//chamando grupo de rotas admin
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

//configurações
    //sessão
    app.use(session({
        secret: "qualquercoisa",
        resave: true,
        saveUninitialized: true,
    }))
    app.use(flash())

    //midleware
    app.use(function(req, res, next){
        //variáveis globais
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })


    //body-parser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())

    //handlebars
    app.engine('handlebars', handlebars({defaultLayout:'main'}))
    app.set('view engine', 'handlebars')

    //mongoose
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/alugueis", { useNewUrlParser: true, useUnifiedTopology: true }).then(function(){ 
        console.log("conectado ao Mongo")
    }).catch(function(err){
        console.log("Erro ao conectar "+ err)
    })

    //publi - bootstrap
    app.use(express.static(path.join(__dirname,"public")))

//rotas
//chamando rotas admin - fazendo o link
app.use('/admin', admin)

//outros
const PORT = 9800
app.listen(PORT, function(){
    console.log('Servidor rodando na porta 9800')
})