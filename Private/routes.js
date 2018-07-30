module.exports = function(app){

  var mail = require('./controllers/mail.js');
  app.get('/helloWorld', mail.helloWorld);
  app.get('/', mail.healthCheck);
  app.post('/checkCaptcha/', mail.checkCaptcha);

}

