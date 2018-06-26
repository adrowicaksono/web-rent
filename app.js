//require
const port = process.env.PORT || 4000;
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser')

//path
let inventory = require('./routes/routes_inventory.js')
let member = require('./routes/routes_member.js')
let transaction = require('./routes/routes_transaction.js')
let stok = require('./routes/routes_stok.js')
let opname = require('./routes/routes_opname.js')
let quotation = require('./routes/routes_quotation.js')
let imports = require('./routes/routes_import.js')
let auth = require('./routes/routes_auth.js')

//helper
app.locals.formatUang = require('./helpers/formatCurrency.js')
app.locals.formatTanggal = require('./helpers/formatTanggal.js')
app.locals.terbilang = require('./helpers/terbilang.js')

app.use(bodyParser.urlencoded({extended:false}))

app.use(session({
    secret:'0912uk!&#s82b!@#',
    cookie:{}
}))

//setup ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res, next){
    res.render('home', {user:req.session.current_user})
})

app.get('/logout', function(req, res){
    req.session.current_user = undefined
    res.redirect('/')
})

app.use('/member',member)

app.use('/inventory', inventory)

app.use('/transaction', transaction)

app.use('/lihat_stok', stok)

app.use('/stock_opname', opname)

app.use('/quotation', quotation)

app.use('/import', imports)

app.use('/auth', auth)



app.listen(port,console.log('listening on port 4000')) 
//Error: The module '/app/node_modules/bcrypt/lib/binding/bcrypt_lib.node'