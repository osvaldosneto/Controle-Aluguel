//toda configuração passport AULA 58
const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//model de usuarios
require('../models/Usuarios')
const Usuarios = mongoose.model("usuarios")

//configurando passport
module.exports = function(passport){
    //usando email como nome de login
    passport.use(new localStrategy({usernameField: "email", passwordField:"senha"}, (email, senha, done)=>{
        Usuarios.findOne({email: email}).then((usuarios)=>{
            if(!usuarios){
                return done(null, false, {message: "Esta conta não existe."})
            }
            //comparando valores encriptados
            bcrypt.compare(senha, usuarios.senha, (erro, batem)=>{
                if(batem){
                    return done(null, usuarios)
                } else {
                    return done(null, false, {message: "Senha incorreta."})
                }
            })
        })
    })) 

    //salvando dados do usuario na secão manter logado
    passport.serializeUser((usuarios, done)=>{
        done(null, usuarios.id)
    })
    
    passport.deserializeUser((id, done)=>{
        Usuarios.findById(id, (error, usuarios)=>{
            if(error){
                return done(error)
            } else {
                return done(null, usuarios)
            }
        })
    })
}