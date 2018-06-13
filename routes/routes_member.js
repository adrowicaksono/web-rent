const express = require('express');
const router = express.Router();
const model = require('../models');
const Member = model.Member


router.get('/', function(req, res){
    Member
    .findAll({
        order:[['id', 'asc']]
    })
    .then(function(members){
        res.render('member', {members})
    })
    .catch(function(err){
        res.send(err)
    })
})

router.post('/', function(req, res){
    let msgError = []
    if(!req.body.name){
        msgError.push("nama belom diisi")
    }
    if(!req.body.alamat){
        msgError.push("alamat belom diisi")
    }
    if(!req.body.no_telpon){
        msgError.push("no telpon belom diisi")
    }
    if(msgError.length > 0){
        res.render('error', {err : msgError.join(', ')})
    }
    Member
    .create({
        name : req.body.name,
        alamat : req.body.alamat,
        no_telpon : req.body.no_telpon,
        data_scan : req.body.data_scan 

    })
    .then(function(members){
        res.redirect('/member')
    })
    .catch(function(err){
        res.send(err)
    })
})

router.get('/:id/edit', function(req, res){
    Member
    .findById(req.params.id)
    .then(function(member){
        res.render('member_update',{member})
    })
})

router.post('/:id/edit', function(req,res){
    Member
    .update({
        name : req.body.name,
        alamat : req.body.alamat,
        no_telpon : req.body.no_telpon,
        data_scan : req.body.data_scan,
        updatedAt: new Date(),
      }, {
        where : {
            id : req.params.id,
        }
      })
      .then(function(){
          res.redirect('/member')
      })
      .catch(function(err){
          res.send(err)
      })
})

router.get('/:id/delete', function(req, res){
    Member
    .destroy({
        where:{id:req.params.id}
    })
    .then(function(){
        res.redirect('/member')
    })
    .catch(function(err){
        res.send(err)
    })
})


module.exports = router;