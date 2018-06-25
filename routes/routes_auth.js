const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const model = require('../models')
const Member = model.Member

router.post('/', function(req,res,next){
    if(req.session.current_user){
        let username = req.session.current_user.email
        res.render('home',{user:req.session.current_user, errors:{message:`${username} sedang login. untuk pindah akun silahkan logout dahulu`}})
        throw new Error('login redudant')
    }else{
        next()
    }
},function(req,res,next){
    
    Member
    .findOne({
        where:{
            email:req.body.email
        }
    })
    .then(function(member){
        if(member){
            let password = bcrypt.compareSync(req.body.password, member.password)
            if(password){
                req.session.current_user = member                
                next()
                res.redirect('/')
            }else{
                res.render('home',{errors:{message:"password tidak cocok"}})
                throw new error('password tidak cocok')
            }
        }else{
            res.render('home',{errors:{message:"email tidak terdaftar"}})
            throw new error('email tidak terdaftar')
        }

    })
    .catch(function(err){
        res.render('error', {err})
    })
    
})

module.exports = router