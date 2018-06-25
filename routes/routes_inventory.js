const express = require('express');
const router = express.Router();
const model = require('../models');
const Inventory = model.Inventory

router.get('/',function(req,res,next){
    let user = req.session.current_user
    if(user){
        next()
    }else{
        res.render('home', {errors:{message:"belum login"}})
    }

}, function(req, res, next){
    let user = req.session.current_user
    Inventory
    .findAll({
        order:[['id','asc']]
    })
    .then(function(inventories){
        //res.send(invetories)
        res.render('inventory', {inventories, user})
    })
    .catch(function(err){
        res.send(err)
    })
})


router.post('/',function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === "admin"){
            next()
        }else{
            res.redirect('/inventory')
        }
    }else{
        res.render('home', {errors:{message:"belom login"}})
    }
}, function(req, res){
    let user = req.session.current_user
    let msgError = []
    if(!req.body.jenis){
        msgError.push("jenis belom diisi")
    }
    if(!req.body.serial_number){
        msgError.push("serial number belom diisi")
    }
    if(!req.body.kategori){
        msgError.push("kategori belom diisi")
    }
    if(!req.body.harga_sewa){
        msgError.push("harga sewa belom diisi")
    }
    if(msgError.length > 0){
        let user = req.session.current_user
        Inventory
        .findAll({
            order:[['id','asc']]
        })
        .then(function(inventories){
            //res.send(invetories)
            res.render('inventory', {inventories, user,errors:{message:msgError.join(', ')}})
        })
        .catch(function(err){
            res.send(err)
        })
    }else{
        Inventory
        .findOne({
            where:{
                serial_number:req.body.serial_number
            }
        })
        .then(function(serial_duplicate){
            if(serial_duplicate){
                throw new Error('duplicate serial number')
            }else{
                Inventory
                .create({
                    jenis : req.body.jenis,
                    serial_number : req.body.serial_number,
                    kategori : req.body.kategori,
                    harga_sewa : req.body.harga_sewa
                })
                .then(function(inventory){
                    res.redirect('/inventory')
                })
                .catch(function(err){
                    res.send(err)
                })
            }
        })
        .catch(function(errors){
            let user = req.session.current_user
            Inventory
            .findAll({
                order:[['id','asc']]
            })
            .then(function(inventories){
                //res.send(invetories)
                res.render('inventory', {inventories,errors,user})
            })
            .catch(function(err){
                res.send(err)
            })
        })
    }
    
   
    
})

router.get('/:id/edit', function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === "admin"){
            next()
        }else{
            res.redirect("/inventory")
        }
    }else{
        res.render("home", {errors:{message:"belum login"}})
    }
},function(req, res){
    Inventory
    .findById(req.params.id)
    .then(function(inventory){
        res.render('inventory_update',{inventory})
    })
})

router.post('/:id/edit',function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === "admin"){
            next()
        }else{
            res.redirect("/inventory")
        }
    }else{
        res.render("home", {errors:{message:"belom login"}})
    }
},function(req,res){
    let user = req.session.current_user
    let msgError = []
    if(!req.body.jenis){
        msgError.push("jenis belom diisi")
    }
    if(!req.body.serial_number){
        msgError.push("serial number belom diisi")
    }
    if(!req.body.kategori){
        msgError.push("kategori belom diisi")
    }
    if(!req.body.harga_sewa){
        msgError.push("harga sewa belom diisi")
    }
    if(msgError.length > 0){
        res.redirect(`/inventory/${req.params.id}/edit`)
    }else{
        Inventory
        .update({
            jenis : req.body.jenis,
            serial_number : req.body.serial_number,
            kategori : req.body.kategori,
            harga_sewa : req.body.harga_sewa,
            updatedAt: new Date(),
          }, {
            where : {
                id : req.params.id,
                  
            }
          })
          .then(function(){
              res.redirect('/inventory')
          })
          .catch(function(err){
              res.send(err)
          })
    } 
})

router.get('/:id/delete', function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === "admin"){
            next()
        }else{
            res.redirect("/inventory")
        }
    }else{
        res.render("home", {errors:{message:"belum login"}})
    }
},function(req, res){
    Inventory
    .destroy({where:{id:req.params.id}})
    .then(function(){
        res.redirect('/inventory')
    })
    .catch(function(err){
        res.send(err)
    })
})

module.exports = router