module.exports = {
    eadmin: function(req, res, next){
       // if(req.session.passport.user !== undefined){ //permite que apenas usuários autenticados entram no sistema
        
        if(req.isAuthenticated()){ //permite que apenas usuários autenticados entram no sistema
            return next();                                
        } else {
            req.flash("error_msg", "Você deve estar logado para entrar.")
            res.redirect("/admin")
        }
    }  
}