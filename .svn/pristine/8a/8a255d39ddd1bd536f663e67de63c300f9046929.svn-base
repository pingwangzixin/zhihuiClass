module.exports = function(io, streams) {

  io.on('connection', function(client) {
    // console.log('-- ' + client.id + ' joined --');
    
	client.on("padId",function(){
		client.emit('id', client.id);
		console.log('-- ' + client.id + ' joined --');
	})
    client.on('message', function (details) {
      var otherClient = io.sockets.connected[details.to];

      if (!otherClient) {
        return;
      }
      console.log("转发给某个人"+JSON.stringify(details))
        delete details.to;
        details.from = client.id;
        otherClient.emit('message', details);
    });

    client.on('readyToStream', function(options) {
      console.log('-- ' + client.id + ' is ready to stream --');

      streams.addStream(client.id, options.name);
    });

    client.on('update', function(options) {
      streams.update(client.id, options.name);
    });

    function leave() {
      console.log('-- ' + client.id + ' left --');
      streams.removeStream(client.id);
    }

    client.on('disconnect', leave);
    client.on('leave', leave);
  });
};
