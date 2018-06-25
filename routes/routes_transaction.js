const express = require('express')
const router = express.Router()
const model = require('../models')
const Transaction = model.Transaction
const DetailTransaction = model.DetailTransaction
const Member = model.Member
const Inventory = model.Inventory
const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.get('/',function(req,res,next){
    let user = req.session.current_user
    
    if(user){
        next()
    }else{
        res.render("home", {errors:{message:"belom login"}})
    }
} ,function(req, res){
   let user = req.session.current_user
   Transaction
   .findAll({
       include: Member,
       order:[['updatedAt','desc']]
   })
   .then(function(transactions){
       if(user.role === "admin"){
               res.render('transaction', {user,transactions})
       }else{
           res.render('transaction', {user,transactions, errors:{message:"bukan admin"}})
       }
   })
})


router.post('/', function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === "admin"){
            next()
        }else{
            res.redirect("/transaction")
        }
    }else{
        res.render("home", {errors:{message:"belom login"}})
    }
},function(req, res){
    let user = req.session.current_user
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
                                res.render('detail_transaction', {user,transaction, kategories, inventories, transaction_details})
                            })  
                        })
                    })
                })
          })
          .catch(function(err){
            console.log(err.message)
            res.send('kesalahan dalam melakukan order')
          }) 
        })
        .catch(function(err){
            Transaction
            .findAll({
                include: Member,
                order:[['updatedAt','desc']]
            })
            .then(function(transactions){
                    res.render('transaction', {user,transactions, errors:{message:"member tidak terdaftar"}})
            })
          })  
})

router.get('/:id_transaction/lihat_detail_transaction', function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === "admin"){
            next()
        }else{
            res.redirect("/transaction")
        }
    }else{
        res.render("home", {errors:{message:"belom login"}})
    }
},function(req,res){
    let user = req.session.current_user
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
                    if(req.session.errors_add_inventory){
                        let msgError = req.session.errors_add_inventory
                        delete req.session.errors_add_inventory
                        res.render('detail_transaction', {errors:{message:msgError},user,transaction, kategories, inventories, transaction_details})
                    }else{
                        res.render('detail_transaction', {user,transaction, kategories, inventories, transaction_details})

                    }
                })   
            })
            .catch(function(err){
                console.log(err)
                res.redirect(`/${req.params.id_transaction}/lihat_detail_transaction`)
                // res.send('belum pilih kategori')
            })
        })
    })
    .catch(function(err){
        console.log(err)
        res.redirect(`/${req.params.id_transaction}/lihat_detail_transaction`)
    })
})

router.post('/:id_transaction/filter', function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === "admin"){
            next()
        }else{
            res.redirect("/transaction")
        }
    }else{
        res.render("home", {errors:{message:"belom login"}})
    }
},function(req, res){
    let user = req.session.current_user
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
                },
                order:[['jenis','asc']]
            })
            .then(function(inventories){
                DetailTransaction
                .findAll({
                    where:{TransactionId:req.params.id_transaction},
                    include:Inventory
                })
                .then(function(transaction_details){
                    res.render('detail_transaction', {user,transaction, kategories, inventories, transaction_details})
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

router.post('/:id_transaction/add_inventory', function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === "admin"){
            next()
        }else{
            res.redirect("/transaction")
        }
    }else{
        res.render("home", {errors:{message:"belom login"}})
    }
},function(req, res, next){
    let msgError = []
    if(req.body.inventory_id === "undefined"){
        msgError.push("belom pilih jenis alat")
    }
    if(!req.body.tanggal_pinjam){
        msgError.push("belom pilih tanggal pinjam")
    }
    if(!req.body.tanggal_kembali){
        msgError.push("belom pilih tanggal kembali")
    }
    if(msgError.length > 0){
        req.session.errors_add_inventory = msgError
        res.redirect(`/transaction/${req.params.id_transaction}/lihat_detail_transaction`)

    }else{
        let user = req.session.current_user
        let satuHari = 24*60*60*1000
        let tanggal_pinjam = new Date(req.body.tanggal_pinjam)
        let tanggal_kembali = new Date(req.body.tanggal_kembali)
        let tanggal_pinjam_getTime = tanggal_pinjam.getTime()
        let tanggal_kembali_getTime = tanggal_kembali.getTime()
        let durasi_sewa = Math.round(Math.abs(tanggal_pinjam.getTime() - tanggal_kembali.getTime())/satuHari)
    
        Inventory
        .findOne({
            attributes:['harga_sewa'],
            where:{id:req.body.inventory_id}
        })
        .then(function(harga){
            let total_sewa = durasi_sewa*harga.harga_sewa
            DetailTransaction
            .findAll({
                where:{
                    InventoryId:req.body.inventory_id
                }
            })
            .then(function(inventori_list){
                
                let tempInvent = []
                inventori_list.forEach(e =>{
                    let invent_pinjam = e.tanggal_pinjam.getTime()
                    let invent_kembali = e.tanggal_kembali.getTime()
                    if(invent_kembali > tanggal_pinjam_getTime){
                        if(invent_pinjam < tanggal_kembali_getTime){
                            tempInvent.push(e)
                        }
                    }
                })
    
                if(tempInvent.length > 0){
                    throw new Error('item sudah di booking ')
                }else{
                    //res.send('lanjuttt')
                    //=========================================================
                    DetailTransaction
                    .create({
                        TransactionId : req.params.id_transaction,
                        InventoryId : req.body.inventory_id,
                        tanggal_pinjam : tanggal_pinjam,
                        tanggal_kembali : tanggal_kembali,
                        harga_sewa : total_sewa
                    })
                    //========================================================
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
                                        res.render('detail_transaction', {user,transaction, kategories, inventories, transaction_details})
                                    })
                                })
                            })
                        })
                        .catch(function(err){
                            res.send(err)
                        })    
                    })
                    .catch(function(err){
                        res.send(err)
                    })
                }
            })
            .catch(function(errors){
                //res.send(errors.message)
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
                                res.render('detail_transaction', {transaction, kategories, inventories, transaction_details,errors})
                            })
                        })
                    })
                })
                .catch(function(err){
                    res.send(err)
                })
            })
        })
        .catch(function(errors){
            res.send(err.message)
    
        })
    }
    
})

router.post('/filter_by_date', function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === "admin"){
            next()
        }else{
            res.redirect("/transaction")
        }
    }else{
        res.render("home", {errors:{message:"belom login"}})
    }
},function(req,res){
    let user = req.session.current_user
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
        res.render('transaction', {user,transactions})
    })
    .catch(function(err){
        res.render('error',{err:'masukan tanggalnya bos'})
    })
})

router.post('/:id_transaction/simpan_transaksi',function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === "admin"){
            next()
        }else{
            res.redirect("/transaction")
        }
    }else{
        res.render("home", {errors:{message:"belom login"}})
    }
},function(req,res){
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

router.post('/:id_transaction/rollback_detail_transaction', function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === "admin"){
            next()
        }else{
            res.redirect("/transaction")
        }
    }else{
        res.render("home", {errors:{message:"belom login"}})
    }
},function(req, res){

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

router.get('/:id_transaction/hapus_transaction', function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === "admin"){
            next()
        }else{
            res.redirect("/transaction")
        }
    }else{
        res.render("home", {errors:{message:"belom login"}})
    }
},function(req, res){
    //tidak mau auto delete di detail transaction
    DetailTransaction
    .destroy({
        where:{
            TransactionId:req.params.id_transaction
        }
    })
    .then(function(detailTransaction){
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
})

router.post('/:id_detail_transaction/hapus_detail_transaction', function(req,res,next){
    let user = req.session.current_user
    if(user){
        if(user.role === "admin"){
            next()
        }else{
            res.redirect("/transaction")
        }
    }else{
        res.render("home", {errors:{message:"belom login"}})
    }
},function(req,res){
    res.send(req.params.id_detail_transaction)
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