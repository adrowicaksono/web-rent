const express = require('express')
const router = express.Router()
const model = require('../models')
const Inventory = model.Inventory
const DetailTransaction = model.DetailTransaction
const Sequelize = require('sequelize')
const Op = Sequelize.Op


router.get('/', function(req, res){
   
    Inventory
        .findAll({
            attributes:['kategori'],
            group:'kategori'})
        .then(function(kategories){
            Inventory
            .findAll({
                where:{
                    kategori : req.body.kategori
                }
            })
            .then(function(inventories){
                DetailTransaction
                .findAll({
                    include:Inventory
                })
                .then(function(transaction_details){
                    res.render('stok', {kategories, inventories, transaction_details})
                })      
            })
            .catch(function(err){
                
            })
        })
})

router.post('/filter_kategori', function(req, res){
    let msgError = []
    if(!req.body.kategori){
        msgError.push('pilih kategori dulu bang !!')
    }

    if(msgError.length > 0){
        res.render('error', {err : msgError.join(', ')})
    }

    
    Inventory
    .findAll({
        attributes:['kategori'],
        group:'kategori'})
    .then(function(kategories){
        Inventory
        .findAll({
            where:{
                kategori : req.body.kategori
            },
            order:[['jenis','asc']],
            //group:'jenis'
        })
        .then(function(inventories){
            DetailTransaction
                .findAll({
                    include:Inventory
                })
                .then(function(transaction_details){
                    res.render('stok', {kategories, inventories, transaction_details})
                })      
        })
        .catch(function(err){
            res.send(err)
        })
    })
})

router.post('/', function(req,res){
    let msgError = []
    if(!req.body.tanggal_pinjam || !req.body.tanggal_kembali ){
        msgError.push('isi tanggal dulu bang !!')
    }
    if(!req.body.jenis ){
        msgError.push('pilih jenis barang dulu bang !!')
    }
    if(msgError.length > 0){
        res.render('error', {err : msgError.join(', ')})
    }
    let filter = []
    filter.push(req.body.tanggal_pinjam)
    filter.push(req.body.tanggal_kembali)
    filter.push(req.body.jenis)
    let tanggal_pinjam =new Date (req.body.tanggal_pinjam)
    let tanggal_kembali =new Date (req.body.tanggal_kembali)
    let timeStampPinjam = tanggal_pinjam.getTime()
    let timeStampKembali = tanggal_kembali.getTime()

    Inventory
    .findAll({
        attributes:['kategori'],
        group:'kategori'})
    .then(function(kategories){
        Inventory
        .findAll({
            where:{
                jenis : req.body.jenis
            },
            order:[['jenis','asc']]
        })
        .then(function(inventories){
            DetailTransaction
                .findAll({
                    where:{
                        tanggal_pinjam:{[Op.between]:[tanggal_pinjam, tanggal_kembali]},
                    },
                    include:[{
                        model : Inventory,
                        where : {
                            jenis: req.body.jenis
                        },
                        
                    }]
                })
                .then(function(transaction_details){
                    res.render('stok', {kategories, inventories, transaction_details, search: filter})
                })      
        })
        .catch(function(err){
            res.send('belum pilih kategori')
        })
    })
    

    // res.send(req.body)
})

module.exports = router