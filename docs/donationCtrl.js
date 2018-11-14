console.log('loaded ');

// index.js -> bundle.js
// var QRCode = require('qrcode')


angular.module('donationsManager', ['vcRecaptcha'])
.controller('donationsCtrl',[ '$http', '$scope', '$window', function( $http, $scope, $window ){

	$scope.server = "https://app.theblockchaininstitute.org/";
	$scope.contactUrl = "https://theblockchaininstitute.org/contact/"

	var currencyList = [
							{
								"name":"Bitcoin",
								"code":"BTC",
								"icon":"BTC"
							},{
								"name":"Ethereum",
								"code":"ETH",
								"icon":"ETH"
							},{
								"name":"zCash",
								"code":"ZEC",
								"icon":"ZEC"
							},{
								"name":"Vertcoin",
								"code":"VTC",
								"icon":"VTC"
							},{
								"name":"NEM",
								"code":"XEM",
								"icon":"XEM"
							},{
								"name":"Litecoin",
								"code":"LTC",
								"icon":"LTC"
							},{
								"name":"Dogecoin",
								"code":"DOGE",
								"icon":"DOGE"
							},{
								"name":"Ripple",
								"code":"XRP",
								"icon":"XRP"
							},{
								"name":"EOS",
								"code":"EOS",
								"icon":"EOS"
							},{
								"name":"Monero",
								"code":"XMR",
								"icon":"XMR"
							},{
								"name":"Dash",
								"code":"DASH",
								"icon":"DASH"
							},{
								"name":"Bitcoin Cash",
								"code":"BCH",
								"icon":"BCH"
							},{
								"name":"Stellar",
								"code":"XLM",
								"icon":"XLM"
							},{
								"name":"Tether",
								"code":"USDT",
								"icon":"USDT"
							},{
								"name":"Cardano",
								"code":"ADA",
								"icon":"ADA"
							}
		];

	//  
	$scope.init = function () {


		$scope.supportedCurrencies = [{
			"name":"BTC"
		},{
			"name":"ETH"
		}];
		console.log($scope.supportedCurrencies);

		$scope.display = [
			"",
			"hidden",
			"hidden",
			"hidden",
			"hidden",
			"hidden",
			"hidden",
			"hidden",
			"hidden",
			"hidden",
			"hidden",
			"hidden"
		];

		$scope.set = currencyList;
		$scope.mode = ""
		$scope.donationAmount = 100.00
	};


	$scope.setMode = function (mode) {
		console.log('mode', mode)
		if ( mode === "cash") {
			$scope.mode = "cash"
			proceed(1)
			proceed(2)
		} else if ( mode === "crypto" ) {
			$scope.mode = "crypto"
			proceed(1)	
		} 
		
	}

	// Pagination Controls
	$scope.next = function (stepId, callBackTest) {
		console.log('next triggered');
		// console.log(stepId, callBackTest)
		// console.log(callBackTest)
		if (callBackTest) {
			// console.log('testing with ' + callBackTest)
			callBackTest( function(result) {
				if (true === result) {
					$scope.errorMessage = undefined;

					if ( ( stepId === 5 ) && ( $scope.mode === "crypto" ) ) {
						hide(4)
						show(6)
					} else {
						proceed (stepId)
					}

				} else {
					console.log(result)
					$scope.errorMessage = result.error
				}
			});
		} else {
			proceed (stepId)
		}

	}

	$scope.back = function (stepId) {
		console.log('display', $scope.display, "mode:", $scope.mode, "stepId", stepId)
		if ( ( $scope.mode === "cash") && ( stepId === 3 ) ) {
			
			hide(2);
			show(0);			
		} else if ( ( stepId === 7 ) && ( $scope.mode === "crypto" ) ) {
			hide(6)
			show(4)
		} else {
			hide(stepId - 1);
			show(stepId - 2);			
		}

	}	

	$scope.setCurrency = function (code) {
		console.log("Setting currency to " + code);
		$scope.currency = code;
		updateSelected(code);
	}

	function updateSelected (code) {
		for ( var i = 0; i < $scope.set.length; i++ ) {
			if ( $scope.set[i].code === code ) {
				$scope.set[i].selected = "selected";
			}
		}
	}

	$scope.checkCurrencyChoice = function (callback) {
		console.log($scope.currency);

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
		console.log($scope.taxReceipt)
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

	$scope.checkCountryOfOriginVerification = function (callback) {
		console.log($scope.countryOfOrigin)
		if ( $scope.countryOfOrigin ) {
			return callback(true)
		} else {
			self.close();
		}		 
	}

	$scope.checkMaximumDonationVerification = function (callback) {
		console.log($scope.maximumDonation)
		if ( $scope.maximumDonation ) {
			return callback(true)
		} else {
			self.close();
		}		 
	}

    // stripe will call this once it has successfully created a token for the payment details
    $scope.onToken = function(token) {
        console.log(token);
        $scope.token = token
        hide(5)
        show(6)
        $scope.$apply();
    };

    $scope.onStripe = function(apiKey, userEmail) {
    	console.log('donating', $scope.donationAmount)
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

	$scope.checkStripe = function (callback) {

	}


	function validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(String(email).toLowerCase());
	}

	function updateWalletAddress (currencyChoice) {
		console.log("entered updateWalletAddress");
		// Load the view-data from the node.js server
	  	$http.get( $scope.server + 'checkCaptcha/' + currencyChoice)
	  		.then(function(response) { 
	  		  $scope.address = response.address;
	  		  $scope.currencyChoice = currencyChoice
	          console.log(response);
     	
	        }). 
	        catch(function(error) { 
	          console.log(error);
	        }); 
	}


	$scope.done = function () {
		$window.location = "https://theblockchaininstitute.org"
	}

	function proceed (stepId) {
		console.log('proceed triggered for step id', stepId)
		hide(stepId - 1)
		show(stepId)
		console.log('display', $scope.display)
	}

	function hide (divId) {
		console.log('hide triggered for div id', divId)
		$scope.display[divId] = "hidden";
		console.log('display', $scope.display)
	}

	function show (divId) {
		console.log('show triggered for div id', divId)
		$scope.display[divId] = "";
		console.log('display', $scope.display)
	}

	$scope.init();

	$scope.key = "6LdlEHkUAAAAAHpHvXxmG1mbtKGq1Pz3T0CbuP2N";

    $scope.checkCaptcha = function (cb) {
    	
    	var payload = {};

    	if ( $scope.mode === "crypto" ) {
			// console.log('testing captcha');
			payload.response = $scope.response
			payload.taxReceipt = $scope.taxReceipt
			payload.email = $scope.email
			var url = $scope.server + 'checkCaptcha/' + $scope.currency
    	} else if ( $scope.mode === "cash" ) {
			payload.response = $scope.response
			payload.taxReceipt = $scope.taxReceipt
			payload.email = $scope.email
			payload.stripe = $scope.token 
			payload.amount = $scope.donationAmount   		
    		var url = $scope.server + 'checkCaptcha/USD'
    	} 



	  // Load the view-data from the node.js server
	  	$http.post( url, payload)
	  		.then(function(response) { 
	  		  	
	  			if ( $scope.mode === "crypto" ) {
					$scope.address = response.data.address
		        	console.log("crypto mode response received", response);
		        	initCanvas($scope.address);
		        	cb(true);   
		    	} else if ( $scope.mode === "cash" ) {	
		    		console.log("cash mode response received", response);	    	
					cb(true)
					proceed(8)
		    	} 	
   	
	        }). 
	        catch(function(error) { 
	          // console.log(error);
	          cb(false);
	        }); 

    }

    $scope.search = function ( ) {

    	console.log('search:' + $scope.searchBarText);
  	
    	var str = $scope.searchBarText;
    	$scope.set = search( currencyList, str );

    	str = 0;

    };
	
	function search ( data, str ) {

			var set = [];

			for ( var i = 0; i < data.length; i ++ ) {
				// check to see that the first characters of the result match the stirng submitted
				//console.log(data[i].key.substring(0,str.length));

				if ( data[i].name.substring(0,str.length).toUpperCase() === str.toUpperCase() ) {

					set.push( data[i] );

				}
			}

			console.log(set);
			return set;
		
	}




	function initCanvas (address) {

		var canvas = document.getElementById('qrCode')
		console.log(canvas, address)
		QRCode.toCanvas(canvas, address, function (error) {
		  if (error) return console.error(error)
		  console.log('successfully set QR Code')

		})
	}

	// Recaptcha Logic
    $scope.setResponse = function (response) {
        console.info('Response available');
        $scope.response = response;
    };
    $scope.setWidgetId = function (widgetId) {
        console.info('Created widget ID: %s', widgetId);
        $scope.widgetId = widgetId;
    };
    $scope.cbExpiration = function() {
        console.info('Captcha expired. Resetting response object');
        vcRecaptchaService.reload($scope.widgetId);
        $scope.response = null;
     };

}]);