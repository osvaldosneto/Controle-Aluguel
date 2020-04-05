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
const usuarios = require("./routes/usuario")
const passport = require("passport")
require("./config/auth")(passport)

//configurações
    //sessão
    app.use(session({
        secret: "qualquercoisa",
        resave: true,
        saveUninitialized: true,
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())

    //midleware
    app.use(function(req, res, next){
        //variáveis globais
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null;
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
    mongoose.connect("mongodb+srv://osvaldosn:rafavedi23@cluster0-8hl8n.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }).then(function(){ 
        console.log("conectado ao Mongo")
    }).catch(function(err){
        console.log("Erro ao conectar "+ err)
    })

    //publi - bootstrap
    app.use(express.static(path.join(__dirname,"public")))

//rotas
//chamando rotas admin - fazendo o link
app.use('/admin', admin)
app.use('/usuarios', usuarios)

//outros
const PORT = process.env.PORT || 9700
app.listen(PORT, function(){ 
    console.log('Servidor rodando na porta ' + PORT)
})