module.exports = function(app){

  var donations = require('./controllers/donations.js');
  app.get('/helloWorld', donations.helloWorld);
  app.post('/checkCaptcha/', donations.checkCaptcha);

}

