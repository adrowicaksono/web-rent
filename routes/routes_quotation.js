const express = require('express')
const router = express.Router()
const model = require('../models')
const Transaction = model.Transaction
const Inventory = model.Inventory
const Member = model.Member
const DetailTransaction = model.DetailTransaction

router.get('/:id_transaction', function(req, res){
    Transaction
    .findOne({
        where:{id:req.params.id_transaction},
        include:Member
    })
    .then(function(transaction){
        DetailTransaction
        .findAll({
            where:{TransactionId:req.params.id_transaction},
            include:Inventory
        })
        .then(function(transaction_details){
        res.render('quotation',{transaction, transaction_details})
        }) 
    })
})



module.exports = router