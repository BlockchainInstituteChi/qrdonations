
var sgMail = require('@sendgrid/mail');
var rp = require('request-promise');

var mc_api_key = "596f8c03d72dd2f8558b6fbddffe3368-us18";

var MailChimpApi = require('mailchimp-api-v3');
var mailChimp = new MailChimpApi(mc_api_key);

exports.helloWorld = function (req, res) {
	return res.status(200).send("Hi!")
}

exports.healthCheck = function (req, res) {
	return res.status(200);
}

exports.checkCaptcha = function (req, res) {
    var response = req.body.response
    console.log(req.body);
    console.log("recaptcha response", response)

	    rp({
	        uri: 'https://recaptcha.google.com/recaptcha/api/siteverify',
	        method: 'POST',
	        formData: {
	            secret: '6Lef510UAAAAACOoGmTQWtzXB3Zuoc6-Dbu1LgN-',
	            response: response
	        },
	        json: true
	    }).then(result => {
	    	// return { error : NOT_AUTHENTICATED };
	        console.log("recaptcha result", result)
	        if (result.success) {
	        	console.log('success: true')
	            sendMail(req.body, res);	        	


	        } else {
	        	console.log('success: false')
	            return res.status(200).send("Recaptcha verification failed. Are you a robot?")
	        }

	    }).catch(reason => {
	        console.log("Recaptcha request failure", reason)
	        return ("Recaptcha request failed.")
	    })

}

exports.subscribe = function (req, res) {
	console.log(req.body.email);
	if ("undefined" != typeof(req.body.email)){
		var body_data = {
		    "email_address": req.body.email,
		    "status": "subscribed",
		};

		var call = {
			"method":"post",
			"path":"/lists/d50da5888a/members/",
			"path_params":"",
			"body":body_data,
			"query":""
		};

		callMailChimp(call, function(result){

			console.log(result);
			if ( null === result ) {
				// mailchimp signup success
				return res.status(200).send('signup success');
			} else {
				// mailchimp signup success
				return res.status(200).send('error');
			}
		});

	} else {
		return res.status(200).send('body.email is undefined');
	}


}

function callMailChimp (call, callback) {
	// mailchimp.request({
	//   method : 'get|post|put|patch|delete',
	//   path : 'path for the call, see mailchimp documentation for possible calls',
	//   path_params : {
	//     //path parameters, see mailchimp documentation for each call
	//   },
	//   body : {
	//     //body parameters, see mailchimp documentation for each call
	//   },
	//   query : {
	//     //query string parameters, see mailchimp documentation for each call
	//   }
	// }, callback)
	mailChimp.request({
	  method : call.method,
	  path : call.path,
	  path_params : call.path_params,
	  body : call.body,
	  query : call.query
	}, callback)
}

function sendMail (payload, res) {
	console.log('sending payload', payload);

	sgMail.setApiKey('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');

	var message = payload.name + "(" + payload.email + ")" + " sent you a new message: " + payload.comment;

	var subject = "New Message From " + payload.name + "(" + payload.email + ")";

	const msg = {
		  to: 'info@theblockchaininstitute.org',
		  from: 'info@theblockchaininstitute.org',
		  subject: subject,
		  text: message
	};

	sgMail.send(msg);
	
	return res.status(200).send("You're good to go, human.")
}
