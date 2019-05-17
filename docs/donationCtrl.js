// console.log('loaded ');

// index.js -> bundle.js
// var QRCode = require('qrcode')


angular.module('donationsManager', ['vcRecaptcha'])
.controller('donationsCtrl',[ '$http', '$scope', '$window', '$interval', function( $http, $scope, $window, $interval ){

	// $scope.server = "https://app.theblockchaininstitute.org/";
	$scope.server = "http://localhost:8888/";
	$scope.contactUrl = "https://theblockchaininstitute.org/contact/"

	var currencyList = [
							{
								"name":"Dollars",
							 	"code":"USD",
								"icon":"fas fa-dollar-sign"
							},{
								"name":"Bitcoin",
								"code":"BTC",
								"icon":"cc BTC"
							},{
								"name":"Ethereum",
								"code":"ETH",
								"icon":"cc ETH"
							},{
								"name":"zCash",
								"code":"ZEC",
								"icon":"cc ZEC"
							},{
								"name":"Vertcoin",
								"code":"VTC",
								"icon":"cc VTC"
							},{
								"name":"NEM",
								"code":"XEM",
								"icon":"cc XEM"
							},{
								"name":"Litecoin",
								"code":"LTC",
								"icon":"cc LTC"
							},{
								"name":"Dogecoin",
								"code":"DOGE",
								"icon":"cc DOGE"
							},{
								"name":"Ripple",
								"code":"XRP",
								"icon":"cc XRP"
							},{
								"name":"EOS",
								"code":"EOS",
								"icon":"cc EOS"
							},{
								"name":"Monero",
								"code":"XMR",
								"icon":"cc XMR"
							},{
								"name":"Dash",
								"code":"DASH",
								"icon":"cc DASH"
							},{
								"name":"Bitcoin Cash",
								"code":"BCH",
								"icon":"cc BCH"
							},{
								"name":"Tether",
								"code":"USDT",
								"icon":"cc USDT"
							},{
								"name":"Bitcoin Gold",
								"code":"BTG",
								"icon":"cc BTC"
							}

		];

	$scope.donationOptions = [ 
		{
			"id" : "1",
			"amount" : "125.00"
		},{
			"id" : "2",
			"amount" : "500.00"
		},{
			"id" : "3",
			"amount" : "1250.00"
		}
	]

	$scope.setDonationAmount = function (amount) {
		// console.log('setting donations amount to', amount)
		$scope.donationAmount = parseInt(amount, 10);;
		// console.log('set amount to ', $scope.donationAmount)
		$scope.next(1, $scope.checkAmountChoice);
	} 

	$scope.refresh = function () {
		$window.location = "/"
	}

	function toggleToCryptoMode( ) {
		$scope.isHidden.cryptoMode = ""
		$scope.isHidden.stripeMode = "hidden"
	}

	function toggleToStripeMode( ) {
		$scope.isHidden.cryptoMode = "hidden"
		$scope.isHidden.stripeMode = ""
	}

	//  
	$scope.init = function () {


		$scope.supportedCurrencies = [{
			"name":"BTC"
		},{
			"name":"ETH"
		}];
		// console.log($scope.supportedCurrencies);

		$scope.isHidden = {
			"formView" : "",
			"stripeView" : "hidden",
			"qrCodeView" : "hidden"
		};

		$scope.showTaxReceipt = ""

		$scope.copySuccessMessage = "hidden"
		$scope.selectedCurrency = "Dollars (USD)"
		$scope.taxReceipt = true;
		$scope.showEmail = "hidden"
		$scope.set = currencyList;
		$scope.mode = ""
		$scope.donationAmount = 125.00
		$scope.donorName = "Alex Morris"
		$scope.donorEmail = "alex@theblockchaininstitute.org"
		toggleToStripeMode();
	};

	$scope.navToHome = function () {
		$window.location = "https://theblockchaininstitute.org/"
	}

	$scope.navToCourses = function () {
		$window.location = "https://theblockchaininstitute.org/courses/"
	}	

	$scope.setMode = function (mode) {
		// console.log('mode', mode)
		if ( mode === "cash") {
			$scope.mode = "cash"
			// proceed(1)
			// proceed(2)
		} else if ( mode === "crypto" ) {
			$scope.mode = "crypto"
			// proceed(1)	
		} 
		
	}

	// Pagination Controls
	$scope.next = function (stepId, callBackTest) {

		// console.log('next triggered', $scope.currency, $scope.currencyChoice, $scope.mode, stepId);
		// console.log(stepId, callBackTest)
		// console.log(callBackTest)
		if (callBackTest) {
			// console.log('testing with ' + callBackTest)
			callBackTest( function(result) {
				if (true === result) {
					$scope.errorMessage = undefined;

					if (  ( $scope.currency != "USD" ) && ( stepId === 4 )  ) {
					
						show(5)
						hide(3)

					} else {

						proceed (stepId)
					
					}

				} else {
					// console.log(result)
					$scope.errorMessage = result.error
				}
			});
		} else {
			proceed (stepId)
		}

		// console.log('hidden is', $scope.display)
		checkAndHide()
		if (stepId === 4) {
			grecaptcha.reset(); 
		}
	}

	$scope.passThrough = function (callback) {
		callback(true)
	}

	$scope.acceptConditions = function (callback) {
		$scope.taxReceipt = true;
		callback(true)
	}	

	$scope.back = function (stepId) {
		// console.log('display', $scope.display, "mode:", $scope.mode, "stepId", stepId)

		if ( ( $scope.currency === "USD") && ( stepId === 7 ) ) {
			
			hide(7);
			show(4);	

		} else if ( ( stepId === 5 ) && ( $scope.currency != "USD" ) ) {
			hide(5)
			show(3)
		} else {
			show(stepId - 1)
			hide(stepId)	
		}
		checkAndHide()

	}	

	function checkAndHide () {	
		// console.log('amount is', $scope.donationAmount)

		if ( $scope.donationAmount < 50 ) { 

			$scope.showTaxReceipt = "hidden"

		} else {

			$scope.showTaxReceipt = ""

		}
		// console.log('tax receipt: ', $scope.showTaxReceipt)
	}


    $scope.checkAll = function () {
    	// console.log('check all triggered')
    	// console.log('declarations', $scope.maximumDonation, $scope.countryOfOrigin, $scope.taxReceipt )
    	if ( $scope.countryOfOrigin === true ) {
			$scope.maximumDonation = false
	    	$scope.countryOfOrigin = false

    	} else {
			$scope.maximumDonation = true
	    	$scope.countryOfOrigin = true
    	}
    	// console.log('declarations', $scope.maximumDonation, $scope.countryOfOrigin, $scope.taxReceipt )
    	
    }

	$scope.checkIdentification = function (callback) {

		if ( $scope.donorName === "" ) {
			return callback({'error':'You must enter your name to proceed.'})
		}  else if ( $scope.donorName.length < 3 ) {
			return callback({'error':'You must enter a name longer than three characters.'})

		} else if ( !($scope.donorName.split(' ').length > 1) ) {
			return callback({'error':'You must enter your first and last name separated by a space.'})

		} else if ( validateEmail($scope.donorEmail) ) {
			return callback(true)

		} else {
			return callback({'error':'You must enter a valid email address.'})
		}
		
	}

	$scope.checkDeclarations = function (callback) {
		// console.log('checking declarations')
		// Check required check boxes
		if ( $scope.maximumDonation ) {
			// console.log('max donation is good')
		} else {
			var result = {
				'error':'You are not permitted to exceed the maximum donation of $5000 per year.'
			};
			return callback(result)
		}	

		if ( $scope.countryOfOrigin ) {
			// console.log('country of origin is good')
		} else {
			var result = {
				'error':'Unfortunately we cannot accept donations from sanctioned individuals.'
			};
			return callback(result)
		}	

		// Check tax receipt info 
		if ( $scope.taxReceipt ) {
			if ( validateEmail($scope.email) ) {
				// updateWalletAddress($scope.currency);

				return callback(true)

			} else {
				var result = {
					'error':'You must enter a valid email address to receive a tax receipt.'
				};
				return callback(result)
			}
		} else {
			return callback(true)
		}	
	}

	$scope.showEmailFn = function () {
		// console.log('displaying email input', $scope.taxReceipt)
		
		if ( $scope.showEmail === "" ) {
			$scope.showEmail = "hidden"
			$scope.taxReceipt = ""
		} else {
			$scope.showEmail = ""
		}
	}

	$scope.$watch('selectedCurrency', function(){
		var split = $scope.selectedCurrency.split(' ')

		console.log(split)

		// hack fix for two letter names. need to make this better
		if ( split.length > 2 ) {
			var code = split[2].slice(0, split[1].length-1).slice(1, split[1].length-1);
			var name = split[0] + " " + split[1] 
		} else {
			var code = split[1].slice(0, split[1].length-1).slice(1, split[1].length-1);
			var name = split[0]
		}
		if (code === "BC") code = "BCH"
		if (code === "BT") code = "BTG"
		$scope.setCurrency(code, name);
	});

	$scope.setCurrency = function (code, name) {

		console.log('setCurrency', code, name)
		// if ( typeof($scope.currency) != "undefined" ) {
		// 	// Deselect previous item
		// 	document.getElementById($scope.currency + "_button").className = ((document.getElementById($scope.currency + "_button").className).split('selected')).join(' ')	
		// }

		if ( code === "USD" ) {
			$scope.setMode('cash')
			toggleToStripeMode()
		} else {
			$scope.setMode('crypto')
			toggleToCryptoMode()
		}		

		// console.log("Setting currency to " + code);
		$scope.currency = code;
		$scope.currencyName = name;
		updateSelected(code);
	}

	function updateSelected (code) {
		for ( var i = 0; i < $scope.set.length; i++ ) {
			if ( $scope.set[i].code === code ) {
				$scope.set[i].selected = "selected";
			}
		}
	}

	$scope.checkAmountChoice = function (callback) {
		// console.log($scope.donationAmount);

		if ( $scope.donationAmount > 0 ) {

			// updateWalletAddress($scope.currency);

			return callback(true)

		} else {
			var result = {
				'error':'You must choose a currency amount.'
			};
			return callback(result)
		}
	}

	$scope.checkCurrencyChoice = function (callback) {
		// console.log($scope.currency);

		if ( $scope.currency ) {

			// updateWalletAddress($scope.currency);

			return callback(true)

		} else {
			var result = {
				'error':'You must choose a currency to proceed.'
			};
			return callback(result)
		}
	}

	$scope.checkTaxReceiptChoice = function (callback) {
		// console.log($scope.taxReceipt)
		if ( $scope.taxReceipt ) {
			if ( validateEmail($scope.email) ) {
				// updateWalletAddress($scope.currency);

				return callback(true)

			} else {
				var result = {
					'error':'You must enter a valid email address to receive a tax receipt.'
				};
				return callback(result)
			}
		} else {
			return callback(true)
		}		 cryptoHandler
	}

	function toggleQRCodeReveal() {
		$scope.isHidden.qrCodeView = ""
		$scope.isHidden.formView = "hidden"
		
	}

	$scope.revealQRCode = function () {

    		$scope.checkCaptcha(function(result){
    			console.log('checkCaptcha returned')
    			// cryptoHandler(result, function(result) {
    			// 	console.log('cryptoHandler returned ', result)

    			// })
    		})
	}

	$scope.checkCountryOfOriginVerification = function (callback) {
		// console.log($scope.countryOfOrigin)
		if ( $scope.countryOfOrigin ) {
			return callback(true)
		} else {
			self.close();
		}		 
	}

	$scope.checkMaximumDonationVerification = function (callback) {
		// console.log($scope.maximumDonation)
		if ( $scope.maximumDonation ) {
			return callback(true)
		} else {
			self.close();
		}		 
	}

    // stripe will call this once it has successfully created a token for the payment details
    $scope.onToken = function(token) {
        console.log("Stripe Token: ", token);
        callStripe(token);
        $scope.token = token

        $scope.$apply();
    };

    $scope.onStripe = function(apiKey, userEmail) {
    	// console.log('donating', $scope.donationAmount)
        var handler = StripeCheckout.configure({
            key: apiKey,
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: $scope.onToken
        });

        handler.open({
            panelLabel : 'Donate',
            name : 'Blockchain Institute',
            amount : $scope.donationAmount * 100, 
            description : 'Amount in USD',
            email : userEmail,
            zipCode : true,
            allowRememberMe : false
        });
    };

    function callStripe (token) {
    	var url = $scope.server + 'ps/'
    	var payload = {
    		"stripeToken" : token,
    		"donationAmount" : $scope.donationAmount,
    		"donorName" : $scope.donorName,
    		"donorEmail" : $scope.donorEmail
    	}

    	$http.post( url, payload)
	  		.then(function(response) { 
	  		  	console.log('calling stripe server')
	  			// console.log('called server to process stripe payload ', payload, "received", response )
   	
	        }). 
	        catch(function(error) { 
	          // console.log(error);
	        }); 
    }

	$scope.checkStripe = function (callback) {

	}

	function validateEmail(email) {
		// console.log('testing email', email)
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    // console.log('re ', re)
	    // console.log('re-re', re.test(String(email).toLowerCase()))
	    return re.test(String(email).toLowerCase());
	}

	function updateWalletAddress (currencyChoice) {
		// console.log("entered updateWalletAddress");
		// Load the view-data from the node.js server
	  	$http.get( $scope.server + 'checkCaptcha/' + currencyChoice)
	  		.then(function(response) { 
	  		  $scope.address = response.address;
	  		  $scope.currencyChoice = currencyChoice
	          // console.log(response);
     	
	        }). 
	        catch(function(error) { 
	          // console.log(error);
	        }); 
	}


	$scope.done = function () {
		$window.location = "https://theblockchaininstitute.org"
	}

	function proceed (stepId) {
		// console.log('proceed triggered for step id', stepId)
		hide(stepId - 1)
		show(stepId)
		// console.log('display', $scope.display)
	}

	function hide (divId) {
		// console.log('hide triggered for div id', divId)
		$scope.display[divId] = "hidden";
		// console.log('display', $scope.display)
	}

	function show (divId) {
		// console.log('show triggered for div id', divId)
		$scope.display[divId] = "";
		// console.log('display', $scope.display)

	}

	$scope.init();

	$scope.key = "6LdlEHkUAAAAAHpHvXxmG1mbtKGq1Pz3T0CbuP2N";

    $scope.checkCaptcha = function (cb) {
    	
    	var payload = {};

    	if ( $scope.mode === "crypto" ) {
			// console.log('testing captcha');
			payload.response = $scope.response
			payload.taxReceipt = $scope.taxReceipt
			payload.email = $scope.donorEmail
			var url = $scope.server + 'checkCaptcha/' + $scope.currency
    	} else if ( $scope.mode === "cash" ) {
			payload.response = $scope.response
			payload.taxReceipt = $scope.taxReceipt
			payload.email = $scope.donorEmail
			payload.stripe = $scope.token 
			payload.amount = $scope.donationAmount   		
    		var url = $scope.server + 'checkCaptcha/USD'
    	} 



	  // Load the view-data from the node.js server
	  	$http.post( url, payload)
	  		.then(function(response) { 
	  		  	
	  			if ( $scope.mode === "crypto" ) {
	  				cryptoHandler(response.data, function(result) {
	  					cb(result)
	  				});

		    	} else if ( $scope.mode === "cash" ) {	
		    		// console.log("cash mode response received", response);	    	
					cb(true)
					// proceed(8)

		    	} 	
   	
	        }). 
	        catch(function(error) { 
	          // console.log(error);
	          cb(false);
	        }); 

    }
    $scope.backFromQR = function () {
    	$scope.isHidden.qrCodeView = "hidden"
    	$scope.isHidden.stripeView = "hidden"
    	$scope.isHidden.formView = ""
    }

    function cryptoHandler (response, cb) {
		toggleQRCodeReveal()

		console.log("crypto mode response received", response, $scope.currencyname)
		$scope.address = response.address

		console.log('scope.address is : ' , $scope.address)
		if ( typeof(response.price) === "undefined" ) {
			// console.log('response.data.price was undefined', response.price)
			var transactionuri = $scope.currencyName.toLowerCase() + ":" + response.address 
			$scope.donationAmountAlt = "-"
		} else {
			// console.log('response.data.price was defined', parseFloat(response.price), $scope.donationamount)
			var amount = ($scope.donationAmount / parseFloat(response.price))
			// console.log('amount is', amount.tofixed(18))
			

			var cleanCurrencyName = $scope.currencyName

			if (cleanCurrencyName === "Bitcoin Gold") cleanCurrencyName = "bitcoin"

			var transactionuri = cleanCurrencyName.toLowerCase() + ":" + response.address + "?amount=" + amount.toFixed(8) + "?value=" + amount.toFixed(8)
			// console.log('trans:', transactionuri)
			$scope.donationAmountAlt = amount.toFixed(8)
		}

		$scope.uri = transactionuri
		console.log('scope.uri is ', $scope.uri)
		console.log('transactionuri is ', transactionuri)
		// console.log('trans:', transactionuri)
		initCanvas(transactionuri);
		cb(true); 
		$scope.apply()


    }

    $scope.search = function ( ) {

    	// console.log('search:' + $scope.searchBarText);
  	
    	var str = $scope.searchBarText;
    	$scope.set = search( currencyList, str );

    	str = 0;

    }
	
	function search ( data, str ) {

			var set = [];

			for ( var i = 0; i < data.length; i ++ ) {
				// check to see that the first characters of the result match the stirng submitted
				// console.log(data[i].key.substring(0,str.length));

				if ( data[i].name.substring(0,str.length).toUpperCase() === str.toUpperCase() ) {

					set.push( data[i] );

				}
			}

			// console.log(set);
			return set;
		
	}

	$scope.copyAddressToClipboard = function () {
	    // console.log('copy triggered ')
	    console.log('scope.address:', $scope.address)
	    // create temp element
	    var copyElement = document.createElement("span");
	    copyElement.appendChild(document.createTextNode($scope.address));
	    copyElement.id = 'tempCopyToClipboard';
	    angular.element(document.body.append(copyElement));

	    // select the text
	    var range = document.createRange();
	    range.selectNode(copyElement);
	    window.getSelection().removeAllRanges();
	    window.getSelection().addRange(range);

	    // copy & cleanup
	    document.execCommand('copy');
	    window.getSelection().removeAllRanges();
	    copyElement.remove();

	    displayCopySuccessMessage();
	}

	function hideCopySuccessMessage () {
		// console.log('hiding copy success message')
		$scope.copySuccessMessage = "hidden";

	}


	function displayCopySuccessMessage () {
		// console.log('displaying copy success message')
		$scope.copySuccessMessage = "";
		$interval(hideCopySuccessMessage, 4000)
	}


	function initCanvas (address) {
		// console.log('init canvas:', address)
		var canvas = document.getElementById('qrCode')
		// console.log(canvas, address)
		QRCode.toCanvas(canvas, address, function (error) {
		  if (error) return console.error(error)
		  // console.log('successfully set QR Code')

		})
	}


	// Recaptcha Logic
    $scope.setResponse = function (response) {
        // console.info('Response available');
        $scope.response = response;
        // $scope.next(6, $scope.checkCaptcha)
    };
    $scope.setWidgetId = function (widgetId) {
        // console.info('Created widget ID: %s', widgetId);
        $scope.widgetId = widgetId;
    };
    $scope.cbExpiration = function() {
        // console.info('Captcha expired. Resetting response object');
        vcRecaptchaService.reload($scope.widgetId);
        $scope.response = null;
     };

}]);