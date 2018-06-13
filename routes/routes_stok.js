const express = require('express')
const router = express.Router()
const model = require('../models')
const Inventory = model.Inventory
const DetailTransaction = model.DetailTransaction
const Sequelize = require('sequelize')
const Op = Sequelize.Op


router.get('/', function(req, res){
    res.render('stok')
})

router.post('/', function(req,res){
    let tanggal_pinjam =new Date (req.body.tanggal_pinjam)
    let tanggal_kembali =new Date (req.body.tanggal_kembali)
    let timeStampPinjam = tanggal_pinjam.getTime()
    let timeStampKembali = tanggal_kembali.getTime()
    

    res.send(`${timeStampPinjam}, ${timeStampKembali}`)
})

module.exports = router