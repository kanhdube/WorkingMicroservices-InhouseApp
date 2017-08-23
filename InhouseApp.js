var express = require('express');
var bodyParser = require('body-parser');
var rabamqp = require('./routes/rabamqp');
var path = require('path');
var {mongoose} = require('./db/mongooseInhouse');

var {Inhouse} = require('./models/Inhouse');
var {charge} = require('./models/charge');

var app = express();
app.use('/static', express.static(path.join(__dirname, '/public')))
//app.use(express.static(__dirname+'/public'));
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
rabamqp.getrsrv('status_q',(msg) => {
    console.log("Checking msg in InhouseApp: ", rabamqp.resultrsrv);
    var folioForSrch = rabamqp.resultrsrv.folioNum;
    Inhouse.findOne({folioNum : folioForSrch}, function(err, resultRsrv){
       if (err) {return console.log("Error fetching Inhouse data for status change")}
       else {
            resultRsrv.status = rabamqp.resultrsrv.status;
            resultRsrv.save();
            }
    });
});

app.get('/inhouse',(req, res) => {
    res.sendFile(__dirname +'/public/inhouse.html');
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
     //   console.log('dire name is: ',__dirname);
     //   res.sendFile(__dirname +'/public/inhouse.html');
        res.send("Charges are saved");
     },(e)=> {
        console.log("error saving charges", e);
     });
});

app.post('/checkout',(req, res) => {
    console.log('Checkout .......');
    var folioForSrch = req.body.folioNum;
    Inhouse.findOne({folioNum : folioForSrch}, function(err, resultRsrv) {
        if(resultRsrv.status !== 'IN') {
            res.send('folio is not Inhouse as yet');
        }
        else {
            console.log('Folio is checkedout');
            resultRsrv.status = 'CO';
            resultRsrv.save();
            var rsrvStatus = {
                    folioNum: folioForSrch,
                    status: "CO"
                };
            var ForSend = JSON.stringify(rsrvStatus);
            rabamqp.sendrsrv(ForSend,'chckout_q', (err,msg)=>{
            console.log("Sent the status change to RsrvApp for Checkout", err, msg);  
            });
        }
    });
});

app.listen(8081, ()=> {
    console.log('Client started on 8081 ...');
});