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
    Cliente.find().sort({nome:'asc'}).lean().then(function (clientes){
        Casa.find().sort({nome:'asc'}).lean().then(function (casas){
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
        Cliente.find().sort({nome:'asc'}).lean().then(function (clientes){
            Casa.find().sort({nome:'asc'}).lean().then(function (casas){
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

router.get("/reservaconfirmada", eadmin, function(req, res){
    req.flash("success_msg", "Reserva concluída com sucesso!!") //mensagem
    res.redirect("/admin/reservas")
})

router.post("/reservas/novo", eadmin, function(req, res){
    var erros = []
    var mes_ent, ano_ent, days, data_saida, data_entrada, subtotal, diaria
    var desconto = parseFloat(req.body.desconto.replace(",", ".")).toFixed(2)
    if(!fctValidaData(req.body.entrada)){
        erros.push({texto: "Data de entrada inválida."})
    }
    if(!fctValidaData(req.body.saida)){
        erros.push({texto: "Data de saida inválida."})
    }
    if(fctValidaData(req.body.entrada) && fctValidaData(req.body.saida)){
        var dia_ent = req.body.entrada.substring(0,2)
        var mes_ent = req.body.entrada.substring(3,5)
        var ano_ent = req.body.entrada.substring(6,10)
        var data_ent = new Date(ano_ent,mes_ent,dia_ent)
        data_entrada = dia_ent+"/"+mes_ent+"/"+ano_ent
        var dia_sai = req.body.saida.substring(0,2)
        var mes_sai = req.body.saida.substring(3,5)
        var ano_sai = req.body.saida.substring(6,10)
        var data_sai = new Date(ano_sai,mes_sai,dia_sai)
        data_saida = dia_sai+"/"+mes_sai+"/"+ano_sai
        var diff = Math.floor(data_sai.getTime() - data_ent.getTime());
        days = parseInt(Math.ceil(diff / (1000 * 60 * 60 * 24)));
        if(days<0){
            erros.push({texto: "Datas de entrada e saída inválidas."})
        }
    }
    if (isNaN(desconto)){
        erros.push({texto: "Desconto incorreto."})
    }

    if(erros.length > 0){
        res.render('res/reservas',{erros:erros})
    } else {
        Casa.findOne({_id: req.body.casa}).lean().then(function (casa){
            Cliente.findOne({_id: req.body.cliente}).lean().then(function(cliente){              
                diaria = parseFloat(casa.diaria).toFixed(2)
                if(req.body.hospedes <= 2){
                    subtotal = (diaria*days).toFixed(2)
                    total = (subtotal - desconto).toFixed(2)
                } else {
                    var hospedes = parseInt(req.body.hospedes) - Number(2)
                    subtotal = parseFloat((parseInt(diaria) + parseInt(casa.hospedeextra)*hospedes)*days).toFixed(2)
                    total = (subtotal - desconto).toFixed(2)
                    diaria = parseFloat(Number(diaria) + parseInt((casa.hospedeextra)*hospedes)).toFixed(2)
                }
                const novaReserva = {
                    casa: req.body.casa,
                    cliente: req.body.cliente,
                    nomeCasa: casa.nome,
                    nomeCliente: cliente.nome,
                    entrada: req.body.entrada,
                    saida: req.body.saida,
                    desconto:desconto.toString().replace(".", ","),
                    valor_diaria: diaria.toString().replace(".", ","),
                    saldo: total.toString().replace(".", ","),
                    subtotal: subtotal.toString().replace(".", ","),
                    mes: mes_ent,
                    ano: ano_ent,
                    hospedes: req.body.hospedes,
                    dias: days,
                }
                new Reserva(novaReserva).save().then(function(){
                    res.render("res/confirmareserva", {novaReserva:novaReserva})
                }).catch(function(err){
                    req.flash("error_msg", "Houve um erro ao registrar a reserva!!")
                    res.redirect("/admin/reservas")
                }) 
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
    var erros = []
    var mes_ent, ano_ent, days, data_saida, data_entrada, subtotal, diaria, total
    var desconto = parseFloat(req.body.desconto.replace(",", ".")).toFixed(2)
    if(!fctValidaData(req.body.entrada)){
        erros.push({texto: "Data de entrada inválida."})
    }
    if(!fctValidaData(req.body.saida)){
        erros.push({texto: "Data de saida inválida."})
    }
    if(fctValidaData(req.body.entrada) && fctValidaData(req.body.saida)){
        var dia_ent = req.body.entrada.substring(0,2)
        var mes_ent = req.body.entrada.substring(3,5)
        var ano_ent = req.body.entrada.substring(6,10)
        var data_ent = new Date(ano_ent,mes_ent,dia_ent)
        data_entrada = dia_ent+"/"+mes_ent+"/"+ano_ent
        var dia_sai = req.body.saida.substring(0,2)
        var mes_sai = req.body.saida.substring(3,5)
        var ano_sai = req.body.saida.substring(6,10)
        var data_sai = new Date(ano_sai,mes_sai,dia_sai)
        data_saida = dia_sai+"/"+mes_sai+"/"+ano_sai
        var diff = Math.floor(data_sai.getTime() - data_ent.getTime());
        days = parseInt(Math.ceil(diff / (1000 * 60 * 60 * 24)));
        if(days<0){
            erros.push({texto: "Datas de entrada e saída inválidas."})
        }
    }
    if (isNaN(desconto)){
        erros.push({texto: "Desconto incorreto."})
    }

    if(erros.length > 0){
        res.render('res/reservas',{erros:erros})
    }else {
        
        Reserva.findOne({_id: req.body.id}).populate('cliente').populate('casa').sort({date:'desc'}).then(function (reserva){          
            diaria = parseFloat(reserva.casa.diaria).toFixed(2)
            if(req.body.hospedes <= 2){
                subtotal = (diaria*days).toFixed(2)
                total = (subtotal - desconto).toFixed(2)
            } else {
                var hospedes = parseInt(req.body.hospedes) - Number(2)
                subtotal = (parseFloat(Number(diaria) + parseFloat(reserva.casa.hospedeextra)).toFixed(2))*days
                total = (subtotal - desconto).toFixed(2)
                diaria = parseFloat(Number(diaria) + parseFloat(reserva.casa.hospedeextra)).toFixed(2)
            }
            reserva.hospedes = req.body.hospedes,
            reserva.entrada = req.body.entrada,
            reserva.saida = req.body.saida,
            reserva.desconto = desconto.toString().replace(".", ","),
            reserva.valor_diaria = diaria.toString().replace(".", ","),
            reserva.saldo = total.toString().replace(".", ","),
            reserva.subtotal = subtotal.toString().replace(".", ","),
            reserva.mes = mes_ent,
            reserva.ano = ano_ent,
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
    var data = req.body.mes.split("/")
    if(req.body.casa == "0" && req.body.cliente == "0" && req.body.mes == 0){
        Reserva.find().populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){ 
            var retorno = calculos(reserva)
            res.render("res/pesquisa", {reserva:reserva, retorno:retorno})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    } else if(req.body.casa == "0" && req.body.cliente ==  "0" && req.body.mes != 0){
        Reserva.find({mes: data[0], ano: data[1]}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            var retorno = calculos(reserva)
            res.render("res/pesquisa", {reserva:reserva, retorno:retorno})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    } else if(req.body.casa == "0" && req.body.cliente != "0" && req.body.mes == 0){
        Reserva.find({cliente:req.body.cliente}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            var retorno = calculos(reserva)
            res.render("res/pesquisa", {reserva:reserva, retorno:retorno})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    } else if(req.body.casa != "0" && req.body.cliente == "0" && req.body.mes == 0){
        Reserva.find({casa:req.body.casa}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            var retorno = calculos(reserva)
            res.render("res/pesquisa", {reserva:reserva, retorno:retorno})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    } else if(req.body.casa != "0" && req.body.cliente == "0" && req.body.mes != 0){
        Reserva.find({casa:req.body.casa, mes: data[0], ano: data[1]}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            var retorno = calculos(reserva)
            res.render("res/pesquisa", {reserva:reserva, retorno:retorno})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    } else if(req.body.casa != "0" && req.body.cliente != "0" && req.body.mes == 0){
        Reserva.find({casa:req.body.casa, cliente: req.body.cliente}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            var retorno = calculos(reserva)
            res.render("res/pesquisa", {reserva:reserva, retorno:retorno})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    } else if(req.body.casa == "0" && req.body.cliente != "0" && req.body.mes != 0){
        var data = (req.body.mes).split("/")
        Reserva.find({mes: data[0], ano: data[1], cliente: req.body.cliente}).populate("cliente").populate('casa').sort({date:'desc'}).lean().then(function (reserva){  
            var retorno = calculos(reserva)
            res.render("res/pesquisa", {reserva:reserva, retorno:retorno})
        }).catch(function(error){
            req.flash("error_msg", "Esta reserva não existe.")
            res.redirect("/admin/reservas")
        })
    }
})

function calculos(reserva) {
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

function fctValidaData(obj){
    var data = obj;
    var dia = data.substring(0,2)
    var mes = data.substring(3,5)
    var ano = data.substring(6,10)

    var novaData = new Date(ano,(mes-1),dia);

    var mesmoDia = parseInt(dia,10) == parseInt(novaData.getDate());
    var mesmoMes = parseInt(mes,10) == parseInt(novaData.getMonth())+1;
    var mesmoAno = parseInt(ano) == parseInt(novaData.getFullYear());

    if (!((mesmoDia) && (mesmoMes) && (mesmoAno))){   
        return false;
    }  
    return true;
}

module.exports = router