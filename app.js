const port = 3000;
const express = require('express');
const app = express()
//const session = require('express-session');
const bodyParser = require('body-parser')
let inventory = require('./routes/routes_inventory.js')
let member = require('./routes/routes_member.js')
let transaction = require('./routes/routes_transaction.js')
let stok = require('./routes/routes_stok.js')
let opname = require('./routes/routes_opname.js')
let quotation = require('./routes/routes_quotation.js')
app.locals.formatUang = require('./helpers/formatCurrency.js')
app.locals.formatTanggal = require('./helpers/formatTanggal.js')
app.locals.terbilang = require('./helpers/terbilang.js')

app.use(bodyParser.urlencoded({extended:false}))



//setup ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('home')
})

app.use('/member',member)

app.use('/inventory', inventory)

app.use('/transaction', transaction)

app.use('/lihat_stok', stok)

app.use('/stock_opname', opname)

app.use('/quotation', quotation)

app.listen(port,console.log('listening on port 3000')) 