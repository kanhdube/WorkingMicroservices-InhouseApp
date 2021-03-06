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
			console.log(' [x] Recieved clone %s', clone);
			console.log(' [x] Recieved cloned %s', cloned.folioNum);
 			//var keys = Object.keys(cloned);
			//for (var i = 0; i < keys.length; i++) {
 			//		 console.log('keys....', cloned[keys[i]]);
			//	}
			if (que == 'rsrv_q') {
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
		else if(que == 'status_q') {
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

function sendrsrv(rsrv,que,callback) {    
  amqp.connect('amqp://localhost',function(err,conn) {
	if (err) { console.log('error:', err) }
	else {
		console.log('Connection to RabbitMq is successful');
		conn.createChannel(function(err, ch){
			if(err) { callback(err); }
			else { callback(undefined, 'done');}
			var q = que;
			ch.assertQueue(q,{durable:false});
			ch.sendToQueue(q, new Buffer(rsrv));
			});
	}
	//setTimeout(function() {conn.close(); process.exit(0)}, 500);
  });
}

exports.sendrsrv = sendrsrv;
exports.getrsrv = getrsrv;

  
