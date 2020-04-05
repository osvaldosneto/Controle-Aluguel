const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Casa')
const Casa = mongoose.model('casa')
require('../models/Cliente')
const Cliente = mongoose.model('cliente')
require('../models/Reserva')
const Reserva = mongoose.model('reserva')
const {eadmin} = require("../helpers/eadmin")

//adição de rotas
router.get("/", function(req, res){
    res.render("admin/index")
})

//rotas de casas
router.get("/casas", eadmin, function(req, res){
    Casa.find().sort({date:'desc'}).lean().then(function (casa){
        res.render("admin/casas", {casa:casa})
    }).catch(function(error){
        req.flash("error_msg", "Esta hospedagem não existe.")
        res.redirect("/admin/casas")
    })
})

router.get("/casas/add", eadmin, function(req, res){
    res.render("admin/addcasa")
})

router.get("/casas/edit/:id", eadmin, function(req, res){
    Casa.findOne({_id:req.params.id}).lean().then(function(casa){
        res.render("admin/editcasa", {casa:casa})
    }).catch(function(err){
        req.flash("error_msg", "Esta hospedagem não existe.")
        res.redirect("/admin/casas")
    })
})

router.post("/casas/edit", eadmin, function(req, res){
    Casa.findOne({_id: req.body.id}).then(function(casa){
        casa.nome = req.body.nome
        casa.maxhospedes = req.body.maxhospedes
        casa.diaria = req.body.diaria
        casa.hospedeextra = req.body.hospedeextra
        casa.save().then(function(){
            req.flash("success_msg", "Hospedagem editada com sucesso!!")
            res.redirect("/admin/casas")
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao salvar edições.")
            res.redirect("/admin/casas")
        })
    }).catch(function(err){
        req.flash("error_msg", "Houve um erro ao salvar edições.")
        res.redirect("/admin/casas")
    })
})

router.post("/casas/deletar", eadmin, function(req, res){
    Casa.deleteOne({_id: req.body.id}).then(function(){
        req.flash("success_msg", "Hospedagem excluida com sucesso!!") //mensagem
        res.redirect("/admin/casas")
    }).catch(function(err){
        req.flash("error_msg", "Houve um problema ao deletar Hospedagem!!") //mensagem
        res.redirect("/admin/casas")
    })
})

router.post("/casas/nova", eadmin, function(req, res){
    const novaCasa = {
        nome: req.body.casa,
        maxhospedes: req.body.maxhospedes,
        diaria: req.body.diaria,
        hospedeextra: req.body.hospedeextra,
    }
    new Casa(novaCasa).save().then(function(){
        req.flash("success_msg", "Hospedagem registrada com sucesso!!")
        res.redirect("/admin/casas")
    }).catch(function(err){
        req.flash("error_msg", "Houve um erro ao registrar a hospedagem!!")
        res.redirect("/addcasa")
        console.log("Erro ao armazenar" + err)
    })
})

//rotas de clientes
router.get("/clientes", eadmin, function(req, res){
    res.render("admin/cliente")
})

router.get("/clientes/consulta", eadmin, function(req, res){   
    res.render("admin/consultacliente")
})

router.post("/clientes/pesquisa", eadmin, function(req, res){
    if(req.body.telefone=="55-55555-5555" && req.body.nome=="nome" && req.body.cidade=="cidade"){
        Cliente.find().lean().then(function(cliente){
            res.render("admin/pesquisaclientes", {cliente:cliente})
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao pesquisar hospede!!")
            res.redirect("/admin/clientes")
        })
    } else if (req.body.telefone!="55-55555-5555" && req.body.nome!="nome" && req.body.cidade!="cidade"){
        Cliente.find({telefone:req.body.telefone, nome:req.body.nome, cidade:req.body.cidade}).lean().then(function(cliente){
            res.render("admin/pesquisaclientes", {cliente:cliente})
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao pesquisar hospede!!")
            res.redirect("/admin/clientes")
        })
    } else if (req.body.telefone=="55-55555-5555" && req.body.nome!="nome" && req.body.cidade!="cidade"){
        Cliente.find({nome:req.body.nome, cidade:req.body.cidade}).lean().then(function(cliente){
            res.render("admin/pesquisaclientes", {cliente:cliente})
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao pesquisar hospede!!")
            res.redirect("/admin/clientes")
        })
    } else if (req.body.telefone!="55-55555-5555" && req.body.nome=="nome" && req.body.cidade!="cidade"){
        Cliente.find({telefone:req.body.telefone, cidade:req.body.cidade}).lean().then(function(cliente){
            res.render("admin/pesquisaclientes", {cliente:cliente})
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao pesquisar hospede!!")
            res.redirect("/admin/clientes")
        })
    } else if (req.body.telefone!="55-55555-5555" && req.body.nome!="nome" && req.body.cidade=="cidade"){
        Cliente.find({telefone:req.body.telefone, nome:req.body.nome}).lean().then(function(cliente){
            res.render("admin/pesquisaclientes", {cliente:cliente})
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao pesquisar hospede!!")
            res.redirect("/admin/clientes")
        })
    } else if (req.body.telefone!="55-55555-5555" && req.body.nome=="nome" && req.body.cidade=="cidade"){
        Cliente.find({telefone:req.body.telefone}).lean().then(function(cliente){
            res.render("admin/pesquisaclientes", {cliente:cliente})
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao pesquisar hospede!!")
            res.redirect("/admin/clientes")
        })
    } else if (req.body.telefone=="55-55555-5555" && req.body.nome!="nome" && req.body.cidade=="cidade"){
        Cliente.find({nome:req.body.nome}).lean().then(function(cliente){
            res.render("admin/pesquisaclientes", {cliente:cliente})
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao pesquisar hospede!!")
            res.redirect("/admin/clientes")
        })
    } else if (req.body.telefone=="55-55555-5555" && req.body.nome!="nome" && req.body.cidade=="cidade"){
        Cliente.find({nome:req.body.nome}).lean().then(function(cliente){
            res.render("admin/pesquisaclientes", {cliente:cliente})
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao pesquisar hospede!!")
            res.redirect("/admin/clientes")
        })
    } else{
        Cliente.find({cidade:req.body.cidade}).lean().then(function(cliente){
            res.render("admin/pesquisaclientes", {cliente:cliente})
            console.log("else geral")
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao pesquisar hospede!!")
            res.redirect("/admin/clientes")
        })
    }
})


router.get("/clientes/add", eadmin, function(req, res){
    res.render("admin/addcliente")
})

router.post("/clientes/novo", eadmin, function(req, res){
    Cliente.findOne({telefone: req.body.telefone}).lean().then(function(cliente){
        if(cliente){
            req.flash("error_msg", "Houve um erro, cliente ja existente.")
            res.redirect("/admin/clientes")
        } else {
            const novoCliente = {
                nome: req.body.nome,
                telefone: req.body.telefone,
                email: req.body.email,
                cidade: req.body.cidade,
                idade: req.body.idade,
                nascimento: req.body.nascimento
            }
            new Cliente(novoCliente).save().then(function(){
                req.flash("success_msg", "Cliente registrado com sucesso!!")
                res.redirect("/admin/clientes")
            }).catch(function(err){
                req.flash("error_msg", "Houve um erro ao registrar o cliente!!")
                res.redirect("/addcliente")
            })
        }
        
    }).catch(function(err){
        req.flash("error_msg", "Houve um erro ao registrar o cliente!!")
        res.redirect("/addcliente")
    })   
})

router.get("/clientes/edit/:id", eadmin, function(req, res){
    Cliente.findOne({_id:req.params.id}).lean().then(function(cliente){
        res.render("admin/editcliente", {cliente:cliente})
    }).catch(function(err){
        req.flash("error_msg", "Este cliente não existe.")
        res.redirect("/admin/clientes")
    })
})

router.post("/clientes/deletar", eadmin, function(req, res){
    Cliente.deleteOne({_id: req.body.id}).then(function(){
        req.flash("success_msg", "Cliente excluido com sucesso!!") //mensagem
        res.redirect("/admin/clientes")
    }).catch(function(err){
        req.flash("error_msg", "Houve um problema ao deletar o cliente!!") //mensagem
        res.redirect("/admin/clientes")
    })
})

router.post("/clientes/edit", eadmin, function(req, res){
    Cliente.findOne({_id: req.body.id}).then(function(cliente){
        cliente.nome = req.body.nome,
        cliente.telefone = req.body.telefone,
        cliente.email = req.body.email,
        cliente.cidade = req.body.cidade,
        cliente.nascimento = req.body.nascimento,
        cliente.save().then(function(){
            req.flash("success_msg", "Cliente editada com sucesso!!")
            res.redirect("/admin/clientes")
        }).catch(function(err){
            req.flash("error_msg", "Houve um erro ao salvar edições do cliente.")
            res.redirect("/admin/clientes")
        })
    }).catch(function(err){
        req.flash("error_msg", "Houve um erro ao salvar edições.")
        res.redirect("/admin/clientes")
    })
})

//rotas de reservas
router.get("/reservas", eadmin, function(req, res){
    res.render("res/reservas")
})

router.get("/reservas/add", eadmin, function(req, res){
    Cliente.find().sort({date:'desc'}).lean().then(function (clientes){
        Casa.find().sort({date:'desc'}).lean().then(function (casas){
            res.render("res/addreservas", {casas:casas, clientes:clientes})
        }).catch(function(error){
            req.flash("error_msg", "Esta hospedagem não existe.")
            res.redirect("/admin/reservas/consulta")
        })
    }).catch(function(error){
        req.flash("error_msg", "Este cliente não existe.")
        res.redirect("/admin/reservas/consulta")
    })
})

router.get("/reservas/consulta", eadmin, function(req, res){
    Reserva.find().populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){         
        Cliente.find().sort({date:'desc'}).lean().then(function (clientes){
            Casa.find().sort({date:'desc'}).lean().then(function (casas){
                res.render("res/consulta", {reserva:reserva, clientes:clientes, casas:casas})
            }).catch(function(error){
                req.flash("error_msg", "Esta hospedagem não existe.")
                res.redirect("/admin/reservas/consulta")
            })
        }).catch(function(error){
            req.flash("error_msg", "Este cliente não existe.")
            res.redirect("/admin/reservas/consulta")
        })        
    }).catch(function(error){
        req.flash("error_msg", "Este cliente não existe.")
        res.redirect("/admin/reservas")
    })
})

router.get("/reservas/novo", eadmin, function(req, res){
    res.redirect("/admin/reservas/consulta")
})

router.post("/reservas/novo", eadmin, function(req, res){
    var subtotal = ""
    var total = ""
    if(req.body.saida < req.body.entrada){
        req.flash("error_msg", "Preenchimento de datas incorreto, verifique check in ou check out.")
        res.redirect("/admin/reservas/add") 
    } else {
        const now = new Date(req.body.entrada); // Data de hoje
        const past = new Date(req.body.saida); // Outra data no passado
        const diff = Math.abs(now.getTime() - past.getTime()); // Subtrai uma data pela outra
        var days = parseInt(Math.ceil(diff / (1000 * 60 * 60 * 24))); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo).

        Casa.findOne({_id: req.body.casa}).lean().then(function (casa){
            Cliente.findOne({_id: req.body.cliente}).lean().then(function(cliente){        
                if(req.body.hospedes <= 2){
                    var diaria = parseInt(casa.diaria)
                    var desconto = parseInt(req.body.desconto)
                    subtotal = diaria
                    total = (subtotal*days) - desconto            
                } else {
                    var hospedeextra = parseInt(casa.hospedeextra)
                    var hospedes = parseInt(req.body.hospedes) - Number(2)
                    var diaria = parseInt(casa.diaria)
                    var desconto = parseInt(req.body.desconto)
                    subtotal = (diaria + (hospedeextra*hospedes))
                    total = (subtotal*days) - desconto
                }
                const novaReserva = {
                    casa: req.body.casa,
                    cliente: req.body.cliente,
                    nomeCasa: casa.nome,
                    nomeCliente: cliente.nome,
                    entrada: req.body.entrada,
                    saida: req.body.saida,
                    desconto:req.body.desconto,
                    valor_diaria: subtotal,
                    saldo: total,
                    mes: now.getMonth(),
                    ano: now.getFullYear(),
                    hospedes: req.body.hospedes,
                    dias: days
                }     
                res.render("res/confirmareserva", {novaReserva:novaReserva})
            }).catch(function(error){
                req.flash("error_msg", "Este cliente não existe.")
                res.redirect("/admin/reservas")
            })
        }).catch(function(error){
            req.flash("error_msg", "Esta hospedagem não existe.")
            res.redirect("/admin/reservas")
        })
    }
})

router.post("/reservas/confirma", eadmin, function(req, res){
    const novaReserva = {
        casa: req.body.casa,
        cliente: req.body.cliente,
        entrada: req.body.entrada,
        saida: req.body.saida,
        desconto:req.body.desconto,
        valor_diaria: req.body.diaria,
        saldo: req.body.saldo,
        mes: req.body.mes,
        ano: req.body.ano,
        hospedes: req.body.hospedes,
        dias: req.body.dias
    }
    new Reserva(novaReserva).save().then(function(){
        req.flash("success_msg", "Reserva registrada com sucesso!!")
        res.redirect("/admin/reservas")
    }).catch(function(err){
        req.flash("error_msg", "Houve um erro ao registrar a reserva!!")
        res.redirect("/admin/reservas")
    })
})

router.post("/reservas/deletar", eadmin, function(req, res){
    Reserva.deleteOne({_id: req.body.id}).then(function(){
        req.flash("success_msg", "Reserva excluida com sucesso!!") //mensagem
        res.redirect("/admin/reservas/consulta")
    }).catch(function(err){
        req.flash("error_msg", "Houve um problema ao deletar a reserva!!") //mensagem
        res.redirect("/admin/reservas")
    })
})

router.get("/reservas/edit/:id", eadmin, function(req, res){
    Reserva.findOne({_id:req.params.id}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            res.render("res/editreservas", {reserva:reserva })
    }).catch(function(error){
        req.flash("error_msg", "Esta reserva não existe.")
        res.redirect("/admin/reservas")
    })
})

router.post("/reservas/edit", eadmin, function(req, res){
    if(req.body.saida < req.body.entrada){
        req.flash("error_msg", "Preenchimento de datas incorreto, verifique check in ou check out.")
        res.redirect("/admin/reservas/add") 
    } else {
        Reserva.findOne({_id: req.body.id}).populate('cliente').populate('casa').sort({date:'desc'}).then(function (reserva){
            var subtotal = ""
            var total = ""
            const now = new Date(req.body.entrada); // Data de hoje
            const past = new Date(req.body.saida); // Outra data no passado
            const diff = Math.abs(now.getTime() - past.getTime()); // Subtrai uma data pela outra
            var days = parseInt(Math.ceil(diff / (1000 * 60 * 60 * 24))); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo).
            
            if(req.body.hospedes <= 2){
                var diaria = parseInt(reserva.casa.diaria)
                var desconto = parseInt(req.body.desconto)
                subtotal = diaria
                total = (subtotal*days) - desconto            
            } else {
                var hospedeextra = parseInt(reserva.casa.hospedeextra)
                var hospedes = parseInt(req.body.hospedes) - Number(2)
                var diaria = parseInt(reserva.casa.diaria)
                var desconto = parseInt(req.body.desconto)
                subtotal = (diaria + (hospedeextra*hospedes))
                total = (subtotal*days) - desconto
            }
            reserva.hospedes = req.body.hospedes,
            reserva.entrada = req.body.entrada,
            reserva.saida = req.body.saida,
            reserva.desconto = req.body.desconto,
            reserva.valor_diaria = subtotal,
            reserva.saldo = total,
            reserva.mes = now.getMonth(),
            reserva.ano = now.getFullYear(),
            reserva.dias = days,
            reserva.save().then(function(){
                req.flash("success_msg", "Reserva editada com sucesso!!")
                res.redirect("/admin/reservas") 
            }).catch(function(err){
                req.flash("error_msg", "Houve um erro ao salvar edições.")
                res.redirect("/admin/reservas")
            })
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    }
})

router.post("/reservas/pesquisa", eadmin, function(req, res){
    var mes = Number(req.body.mes)
    var soma = Number(0)
    var dias = Number(0)
    if(req.body.casa == "0" && req.body.cliente == "0" && req.body.mes == 0){
        Reserva.find().populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){ 
            for(let i=0; i<reserva.length; i++){
                dias = dias + parseInt(reserva[i].dias)
                soma = soma + parseInt(reserva[i].saldo)
            } 
            res.render("res/pesquisa", {reserva:reserva, soma:soma, dias:dias})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    } else if(req.body.casa == "0" && req.body.cliente ==  "0" && req.body.mes != 0){
        var mes = Number(req.body.mes)-1
        Reserva.find({mes: mes, ano:req.body.ano}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            for(let i=0; i<reserva.length; i++){
                dias = dias + parseInt(reserva[i].dias)
                soma = soma + parseInt(reserva[i].saldo)
            } 
            res.render("res/pesquisa", {reserva:reserva, soma:soma, dias:dias})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    } else if(req.body.casa == "0" && req.body.cliente != "0" && req.body.mes == 0){
        Reserva.find({cliente:req.body.cliente}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            for(let i=0; i<reserva.length; i++){
                dias = dias + parseInt(reserva[i].dias)
                soma = soma + parseInt(reserva[i].saldo)
            } 
            res.render("res/pesquisa", {reserva:reserva, soma:soma, dias:dias})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    } else if(req.body.casa != "0" && req.body.cliente == "0" && req.body.mes == 0){
        Reserva.find({casa:req.body.casa}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            for(let i=0; i<reserva.length; i++){
                dias = dias + parseInt(reserva[i].dias)
                soma = soma + parseInt(reserva[i].saldo)
            } 
            res.render("res/pesquisa", {reserva:reserva, soma:soma, dias:dias})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    } else if(req.body.casa != "0" && req.body.cliente == "0" && req.body.mes != 0){
        var mes = Number(req.body.mes)-1
        Reserva.find({casa:req.body.casa, mes: mes, ano:req.body.ano}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            for(let i=0; i<reserva.length; i++){
                dias = dias + parseInt(reserva[i].dias)
                soma = soma + parseInt(reserva[i].saldo)
            } 
            res.render("res/pesquisa", {reserva:reserva, soma:soma, dias:dias})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    } else if(req.body.casa != "0" && req.body.cliente != "0" && req.body.mes == 0){
        Reserva.find({casa:req.body.casa, cliente: req.body.cliente}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            for(let i=0; i<reserva.length; i++){
                dias = dias + parseInt(reserva[i].dias)
                soma = soma + parseInt(reserva[i].saldo)
            } 
            res.render("res/pesquisa", {reserva:reserva, soma:soma, dias:dias})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    } else if(req.body.casa == "0" && req.body.cliente != "0" && req.body.mes != 0){
        var mes = Number(req.body.mes)-1
        Reserva.find({mes:mes, ano: req.body.ano, cliente: req.body.cliente}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            for(let i=0; i<reserva.length; i++){
                dias = dias + parseInt(reserva[i].dias)
                soma = soma + parseInt(reserva[i].saldo)
            } 
            res.render("res/pesquisa", {reserva:reserva, soma:soma, dias:dias})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    }
})

module.exports = router