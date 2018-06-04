const port = 3000;
const express = require('express');
const app = express()
//const session = require('express-session');
const bodyParser = require('body-parser')
let inventory = require('./routes/routes_inventory.js')
let member = require('./routes/routes_member.js')

// app.locals.formatUang = require('./helpers/formatCurrency')
// app.locals.yetPurchase = require('./helpers/yetPurchase')

app.use(bodyParser.urlencoded({extended:false}))



//setup ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.send('haiii dari home')
})

app.use('/member',member)

app.use('/inventory', inventory)


app.listen(port,console.log('listening on port 3000')) 