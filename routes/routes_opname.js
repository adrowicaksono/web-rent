const express = require('express')
const router = express.Router()
const model = require('../models')
const DetailTransaction = model.DetailTransaction
const Transaction = model.Transaction
const Inventory = model.Inventory
const Member = model.Member


router.get('/', function(req,res,next){
    let user = req.session.current_user
    if(user){
        next()
    }else{
        res.render("home", {errors:{message:"bukan member"}})
    }
},function(req,res){
    let user = req.session.current_user
    DetailTransaction
    .findAll({
        attributes:['id','tanggal_pinjam', 'tanggal_kembali'],
        include:[{model:Inventory,attributes:['id','jenis','serial_number']},
                {model:Transaction, include:{model:Member, attributes:['name']}}],
        order:[['tanggal_pinjam','desc']]
    })
    .then(function(all_transaction_details){
        res.render('opname', {all_transaction_details,user})
    })
})

router.post('/',function(req,res,next){
    let user = req.session.current_user
    if(user){
        next()
    }else{
        res.render("home", {errors:{message:"bukan member"}})
    }
},function(req,res){
    let user = req.session.current_user
    let msgError = []
    if(!req.body.tanggal_awal || !req.body.tanggal_akhir){
        res.render('error', {err:"masukan tanggal dulu bosque"})
        throw new Error('filter opname tanggal belum diisi')
    }

    let tanggal_awal = new Date(req.body.tanggal_awal)
    let tanggal_akhir = new Date(req.body.tanggal_akhir)
    let tanggal_awal_getTime = tanggal_awal.getTime()
    let tanggal_akhir_getTime = tanggal_akhir.getTime()

    DetailTransaction
    .findAll({
        attributes:['id','tanggal_pinjam', 'tanggal_kembali'],
        include:[{model:Inventory,attributes:['id','jenis','serial_number']},
                {model:Transaction, include:{model:Member, attributes:['name']}}],
        order:[['tanggal_pinjam','desc']]
    })
    .then(function(filter_transaction_details){
        
        let exhouse = []
        
        filter_transaction_details.forEach(el =>{
            let dtl_pinjam = el.tanggal_pinjam.getTime()
            let dtl_kembali = el.tanggal_kembali.getTime()
            if(dtl_kembali > tanggal_awal_getTime){
                if(dtl_pinjam < tanggal_akhir_getTime){
                    exhouse.push(el.Inventory.id)
                }
            }
        })

        Inventory
        .findAll({
            attributes:['id','jenis','serial_number'],
            include:{
                model:DetailTransaction,
                attributes:['id','TransactionId','InventoryId','tanggal_pinjam','tanggal_kembali'],
                include:{
                    model:Transaction,
                    include:{
                        model:Member,
                        attributes:['name'],
                    },
                    attributes:['id','updatedAt'],
                },
            },
            order:[['id', 'asc']]
        })
        .then(function(inventories){
            let invent_in = []
            let invent_ex = []
            let id_exhouse = [...new Set(exhouse)] 
            
            inventories.forEach(el=>{
                if(id_exhouse.indexOf(el.id)!== -1){
                    invent_ex.push(el)
                }else{
                    invent_in.push(el)
                }
            })
            res.render('opname',{invent_in, invent_ex, tanggal_akhir, tanggal_awal,user})
        })
        //res.render('opname', {filter_transaction_details})
    })
})

router.post('/cetak_list_opname',function(req,res){
    res.send(req.body)
})


module.exports = router