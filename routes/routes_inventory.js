const express = require('express');
const router = express.Router();
const model = require('../models');
const Inventory = model.Inventory

router.get('/', function(req, res){
    Inventory
    .findAll()
    .then(function(inventories){
        //res.send(invetories)
        res.render('inventory', {inventories})
    })
    .catch(function(err){
        res.send(err)
    })
})


router.post('/', function(req, res){
    Inventory
    .create({
        jenis : req.body.jenis,
        serial_number : req.body.serial_number,
        kategori : req.body.kategori
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
    .then(function(invenetory){
        res.render('inventory_update',{inventory})
    })
})
module.exports = router