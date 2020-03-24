module.exports = function(app, streams) {

  app.use('/stearm', function(req, res) {
      var streamList = streams.getStreams();
      // JSON exploit to clone streamList.public
      var data = (JSON.parse(JSON.stringify(streamList)));

      res.status(200).json(data);
  });
}
