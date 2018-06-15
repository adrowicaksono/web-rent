const express = require('express')
const router = express.Router()
const model = require('../models')
const Inventory = model.Inventory

router.get('/', function(req,res){
    res.render('import')
})

router.post('/', function(req,res){
    res.send(req.body)
})

module.exports = router