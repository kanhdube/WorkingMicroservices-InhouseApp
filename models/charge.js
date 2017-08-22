var mongooseInhouse = require('mongoose');
var charge = mongooseInhouse.model('charge',{
    folioNum:{
        type: Number,
        required:true
    },
    chargeCode:{
        type: String,
        required:true,
        trim:true
    },
    amount:{
        type: String,
        trim:true
    },
    postDate:{
        type: String,
        trim:true
    },
    notes:{
        type: String,
        trim:true
    }
});
module.exports = {charge}