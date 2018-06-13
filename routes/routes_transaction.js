const express = require('express')
const router = express.Router()
const model = require('../models')
const Transaction = model.Transaction
const DetailTransaction = model.DetailTransaction
const Member = model.Member
const Inventory = model.Inventory
const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.get('/', function(req, res){
   Transaction
   .findAll({
       include: Member,
       order:[['updatedAt','desc']]
   })
   .then(function(transactions){
       res.render('transaction', {transactions})
   })
})


router.post('/', function(req, res){
    let memberId = req.body.MemberId 
        Member
        .findById(memberId)
        .then(function(member){
          Transaction
          .create({
              MemberId : member.id
          })
          .then(function(transaction){
                Transaction
                .findOne({
                    where :{id:transaction.id},
                    include:Member
                })
                .then(function(transaction){
                    Inventory
                    .findAll({
                        attributes:['kategori'],
                        group:'kategori'})
                    .then(function(kategories){
                        Inventory
                        .findAll()
                        .then(function(inventories){
                            DetailTransaction
                            .findAll({
                                where:{TransactionId:req.params.id_transaction},
                                include:Inventory
                            })
                            .then(function(transaction_details){
                                res.render('detail_transaction', {transaction, kategories, inventories, transaction_details})
                            })  
                        })
                    })
                })
          })
          .catch(function(err){
              res.send('member id salah')
          }) 
        })
        .catch(function(err){
           res.send('Member tidak terdaftar')
        })  
})

router.get('/:id_transaction/lihat_detail_transaction', function(req,res){
    Transaction
    .findOne({
        where :{id:req.params.id_transaction},
        include:Member
    })
    .then(function(transaction){
        Inventory
        .findAll({
            attributes:['kategori'],
            group:'kategori'})
        .then(function(kategories){
            Inventory
            .findAll()
            .then(function(inventories){
                DetailTransaction
                .findAll({
                    where:{TransactionId:req.params.id_transaction},
                    include:Inventory
                })
                .then(function(transaction_details){
                    res.render('detail_transaction', {transaction, kategories, inventories, transaction_details})
                })   
            })
            .catch(function(err){
                res.send('belum pilih kategori')
            })
        })
    })
    .catch(function(err){
        res.send(err)
    })
})

router.post('/:id_transaction/filter', function(req, res){
    Transaction
    .findOne({
        where :{id:req.params.id_transaction},
        include:Member
    })
    .then(function(transaction){
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
                    where:{TransactionId:req.params.id_transaction},
                    include:Inventory
                })
                .then(function(transaction_details){
                    res.render('detail_transaction', {transaction, kategories, inventories, transaction_details})
                })   
            })
            .catch(function(err){
                res.send('belum pilih kategori')
            })
        })
    })
    .catch(function(err){
        res.send(err)
    })
})

router.post('/:id_transaction/add_inventory', function(req, res){
    let satuHari = 24*60*60*1000
    let tanggal_pinjam = new Date(req.body.tanggal_pinjam)
    let tanggal_kembali = new Date(req.body.tanggal_kembali)
    let durasi_sewa = Math.round(Math.abs(tanggal_pinjam.getTime() - tanggal_kembali.getTime())/satuHari)

    Inventory
    .findOne({
        attributes:['harga_sewa'],
        where:{id:req.body.inventory_id}
    })
    .then(function(harga){
        let total_sewa = durasi_sewa*harga.harga_sewa
        DetailTransaction
        .create({
            TransactionId : req.params.id_transaction,
            InventoryId : req.body.inventory_id,
            tanggal_pinjam : tanggal_pinjam,
            tanggal_kembali : tanggal_kembali,
            harga_sewa : total_sewa
        })
        .then(function(detail_transaction){
            Transaction
            .findOne({
                where :{id:req.params.id_transaction},
                include:Member
            })
            .then(function(transaction){
                Inventory
                .findAll({
                    attributes:['kategori'],
                    group:'kategori'})
                .then(function(kategories){
                    Inventory
                    .findAll({
                    })
                    .then(function(inventories){
                        DetailTransaction
                        .findAll({
                            where:{TransactionId:req.params.id_transaction},
                            include:Inventory
                        })
                        .then(function(transaction_details){
                            res.render('detail_transaction', {transaction, kategories, inventories, transaction_details})
                        })
                    })
                })
            })
            .catch(function(err){
                res.send(err)
            })
            //-------------------------------    
        })
        .catch(function(err){
            res.send(err)
        })
    })
    .catch(function(err){
        res.send(err)
    })
    
})

router.post('/filter_by_date', function(req,res){
    let startDate = new Date(req.body.startDate)
    let endDate = new Date(req.body.endDate)
    
    Transaction
    .findAll({
        where:{
            createdAt:{
                [Op.between] : [startDate,endDate]
            }
        },
        include: Member,
        order : [['createdAt', 'asc']]
    })
    .then(function(transactions){
        res.render('transaction', {transactions})
    })
    .catch(function(err){
        res.render('error',{err:'masukan tanggalnya bos'})
    })
})

router.post('/:id_transaction/simpan_transaksi',function(req,res){
    //update total transaksi
    DetailTransaction
    .findAll({
        where:{TransactionId:req.params.id_transaction}
    })
    .then(function(transaction){
        let total_sewa = 0
        transaction.forEach(element => {
            total_sewa += element.harga_sewa
        });
        
        Transaction
        .update({
            total_harga_transaction : total_sewa
        },{
            where:{id:req.params.id_transaction}
        })
        .then(function(transaction){
            res.redirect('/transaction')
        })
        .catch(function(err){
            res.send(err)
        })
    })
    .catch(function(err){
        res.send(err)
    })
})

router.post('/:id_transaction/rollback_detail_transaction', function(req, res){

    DetailTransaction
    .destroy({
        where:{TransactionId:req.params.id_transaction}
    })
    .then(function(details){
        Transaction
        .update({
            total_harga_transaction : 0
        },{
            where:{id:req.params.id_transaction}
        })
        .then(function(transaction){
            res.redirect('/transaction')
        })
    })
    .catch(function(err){
        res.send(err)
    })
})

router.get('/:id_transaction/hapus_transaction', function(req, res){
    
    Transaction
    .destroy({
        where:{
            id:req.params.id_transaction
        }
    })
    .then(function(transaction){
        res.redirect('/transaction')
    })
})

router.get('/surat_jalan/:id_transaction', function(req, res){
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
        res.render('surat_jalan',{transaction, transaction_details})
        }) 
    })
})

module.exports = router