var express = require('express');
var bodyParser = require('body-parser');
var rabamqp = require('./routes/rabamqp');

var {mongoose} = require('./db/mongooseInhouse');

var {Inhouse} = require('./models/Inhouse');
var {charge} = require('./models/charge');

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

rabamqp.getrsrv('rsrv_q', (msg) => { 
    var inhse = new Inhouse({
        folioNum:rabamqp.resultrsrv.folioNum,
        firstName:rabamqp.resultrsrv.firstName,
        lastName:rabamqp.resultrsrv.lastName,
        address:rabamqp.resultrsrv.address,
        checkinDate:rabamqp.resultrsrv.checkinDate,
        checkoutDate:rabamqp.resultrsrv.checkoutDate,
        ratePgm:rabamqp.resultrsrv.ratePgm,
        status:rabamqp.resultrsrv.status,
        notes:rabamqp.resultrsrv.notes
        });
    inhse.save().then((result) => {
        console.log("result is saved");
        },(e)=> {
        console.log("error saving reservation in inhouse", e);
        });
});
app.post('/postCharges',(req, res) => {
    var chrg = new charge({
        folioNum:req.body.folioNum,
        chargeCode:req.body.chargeCode,
        amount:req.body.amount,
        postDate:req.body.postDate,
        notes:req.body.notes
    });
    chrg.save().then((result) => {
        console.log("charges are saved");
     },(e)=> {
        console.log("error saving charges", e);
     });
});

app.listen(8081, ()=> {
    console.log('Client started on 8081 ...');
});