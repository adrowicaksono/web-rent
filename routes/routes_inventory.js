const express = require('express');
const router = express.Router();
const model = require('../models');
const Inventory = model.Inventory

router.get('/', function(req, res){
    Inventory
    .findAll({
        order:[['id','asc']]
    })
    .then(function(inventories){
        //res.send(invetories)
        res.render('inventory', {inventories})
    })
    .catch(function(err){
        res.send(err)
    })
})


router.post('/', function(req, res){
    let msgError = []
    if(!req.body.jenis){
        msgError.push("jenis belom diisi")
    }
    if(!req.body.serial_number){
        msgError.push("serial number belom diisi")
    }
    if(!req.body.kategori){
        msgError.push("kategori telpon belom diisi")
    }
    if(!req.body.harga_sewa){
        msgError.push("harga sewa telpon belom diisi")
    }
    if(msgError.length > 0){
        res.render('error', {err : msgError.join(', ')})
    }
    
    Member
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
})

router.get('/:id/edit', function(req, res){
    Inventory
    .findById(req.params.id)
    .then(function(inventory){
        res.render('inventory_update',{inventory})
    })
})

router.post('/:id/edit', function(req,res){
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
})

router.get('/:id/delete', function(req, res){
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