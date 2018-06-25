const express = require('express');
const router = express.Router();
const model = require('../models');
const Member = model.Member


router.get('/',function(req, res, next){
    let user = req.session.current_user
    if(user){
        next()
    }else{
        res.render('home', {errors:{message:"belom login"}})
    }    
},function(req, res, next){
    let user = req.session.current_user
        Member
        .findAll({
            order:[['id', 'asc']]
        })
        .then(function(members){
            res.render('member', {members,user})
        })
        .catch(function(err){
            res.send(err)
        })
})

router.post('/',function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === 'admin'){
            next()
        }else{
            res.redirect('/member')
        }
    }else{
        res.render('home',{errors:{message:'belom login'}})
    }
},function(req, res){
        let msgError = []
            if(!req.body.name){
                msgError.push("nama belom diisi")
            }
            if(!req.body.email){
                msgError.push("email belom diisi")
            }
            if(!req.body.password){
                msgError.push("password belom diisi")
            }
            if(!req.body.alamat){
                msgError.push("alamat belom diisi")
            }
            if(!req.body.no_telpon){
                msgError.push("no telpon belom diisi")
            }
            if(msgError.length > 0){
                let user = req.session.current_user
                Member
                .findAll({
                    order:[['id', 'asc']]
                })
                .then(function(members){
                    res.render('member', {members, user, errors:{message:msgError.join(', ')}})
                    throw new Error('data tidak lengkap')
                })
                .catch(function(err){
                    console.log(err.message)
                })
            }else{              
                Member
                .create({
                    name : req.body.name,
                    alamat : req.body.alamat,
                    no_telpon : req.body.no_telpon,
                    data_scan : req.body.data_scan,
                    email : req.body.email,
                    password: req.body.password,
                    role : req.body.role,
                })
                .then(function(members){
                    res.redirect('/member')
                })
                .catch(function(err){
                    res.send(err.message)
                })
            }
})

router.get('/:id/edit', function(req, res,next){
    if(req.session.current_user){
        if(req.session.current_user.role === 'admin'){
            next()
        }else{
            res.redirect('/member')
        }
    }else{  
        res.render('home', {errors:{message:"belom login"}})
    }
},function(req, res){
    if(req.session.current_user){
        Member
        .findById(req.params.id)
        .then(function(member){
            res.render('member_update',{member})
        })
    }else{
        res.render('home', {errors:{message:"belom login"}}) 
    }
})

router.post('/:id/edit',function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === 'admin'){
            next()
        }else{
            res.redirect('/member')
        }
    }else{
        res.render('home', {errors:{message:"belom login"}})
    }
},function(req,res){
    let msgError = []
        if(!req.body.name){
            msgError.push("nama belom diisi")
        }
        if(!req.body.alamat){
            msgError.push("alamat belom diisi")
        }
        if(!req.body.no_telpon){
            msgError.push("no telpon belom diisi")
        }
        if(!req.body.email){
            msgError.push("email belom diisi")
        }
        if(msgError.length > 0){
            res.redirect(`/member/${req.params.id}/edit`)
        }else{
            Member
            .findOne({where:{id:req.params.id}})
            .then(function(member){
                if(member.email === req.body.email){
                    Member
                    .update({
                        name : req.body.name,
                        alamat : req.body.alamat,
                        no_telpon : req.body.no_telpon,
                        data_scan : req.body.data_scan,
                        role : req.body.role,
                      }, {
                        where : {
                            id : req.params.id,
                        }
                      })
                      .then(function(){
                          res.redirect('/member')
                      })
                      .catch(function(err){
                          res.send(err.message)
                      })
                }else{
                    Member
                    .update({
                        name : req.body.name,
                        alamat : req.body.alamat,
                        no_telpon : req.body.no_telpon,
                        data_scan : req.body.data_scan,
                        email : req.body.email,
                        role : req.body.role,
                      }, {
                        where : {
                            id : req.params.id,
                        }
                      })
                      .then(function(){
                          res.redirect('/member')
                      })
                      .catch(function(err){
                          res.send(err.message)
                      })
                }
            })

        }
})

router.get('/:id/delete',function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role ==='admin'){
            next()
        }else{
            res.redirect('/member')
        }
    }else{
        res.render('home', {errors:{message:'belum login'}})
    }
}, function(req, res){
        Member
        .destroy({
            where:{id:req.params.id}
        })
        .then(function(){
            res.redirect('/member')
        })
        .catch(function(err){
            res.send(err)
        })
})


module.exports = router;