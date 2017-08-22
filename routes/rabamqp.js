var amqp = require('amqplib/callback_api');   

function getrsrv(que, callback) {    
    amqp.connect('amqp://localhost',function(err,conn){
			conn.createChannel(function(err, ch) {
			var q = que;
			ch.assertQueue(q, {durable:false});
			console.log('Waiting for messages in queue');
			ch.consume(q, function(msg){
			var clone = msg.content;
			//var cloned = JSON.parse(clone.replace(/_/g,""));
			var cloned = JSON.parse(clone);
			//console.log(' [x] Recieved clone %s', clone);
			//console.log(' [x] Recieved cloned %s', cloned.newname);
 			//var keys = Object.keys(cloned);
			//for (var i = 0; i < keys.length; i++) {
 			//		 console.log('keys....', cloned[keys[i]]);
			//	}
		if (typeof (que) === 'rsrv_q') {
			var resultrsrv = {
				folioNum:cloned.folioNum,
      			firstName:cloned.firstName,
      			lastName:cloned.lastName,
      			address:cloned.address,
      			checkinDate:cloned.checkinDate,
      			checkoutDate:cloned.checkoutDate,
      			ratePgm:cloned.ratePgm,
      			status:cloned.status,
      			notes:cloned.notes
			}; 
		}
		else if(typeof (que) === 'status_q') {
			var resultrsrv = {
				folioNum:cloned.folioNum,
      			status:cloned.status
      			};
		}
			//console.log('resultrsrv in rabamqp: ', resultrsrv);
			exports.resultrsrv = resultrsrv;
			callback('done');
	}, {noAck:true});
		
});
//setTimeout(function() {conn.close()}, 500);
});
	}
exports.getrsrv = getrsrv;

  
