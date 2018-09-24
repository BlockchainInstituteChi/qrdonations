console.log('loaded ');

// index.js -> bundle.js
// var QRCode = require('qrcode')


angular.module('donationsManager', ['vcRecaptcha'])
.controller('donationsCtrl',[ '$http', '$scope', '$window', function( $http, $scope, $window ){

	$scope.server = "http://localhost:8887/";
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
			"hidden"
		];

		$scope.set = currencyList;

	};

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
					proceed (stepId)
				} else {
					console.log(result)
					$scope.errorMessage = result.error
				}
			});
		} else {
			proceed (stepId)
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

	$scope.back = function (stepId) {
		hide(stepId - 1);
		show(stepId - 2);
	}

	$scope.done = function () {
		$window.close();
	}

	function proceed (stepId) {
		hide(stepId - 1)
		show(stepId)
	}

	function hide (divId) {
		$scope.display[divId] = "hidden";
	}

	function show (divId) {
		$scope.display[divId] = "";
	}

	$scope.init();

	$scope.key = "6LfPSXEUAAAAABf03vn6PgBLvv8O9IwTqPcUuJ3J";

    $scope.checkCaptcha = function (cb) {

    	var payload = {};

		// console.log('testing captcha');
		payload.response = $scope.response
		payload.taxReceipt = $scope.taxReceipt
		payload.email = $scope.email
		var url = $scope.server + 'checkCaptcha/' + $scope.currency

	  // Load the view-data from the node.js server
	  	$http.post( url, payload)
	  		.then(function(response) { 
  			  $scope.address = response.data.address

	          console.log("response received", response);
	          initCanvas($scope.address);
	          cb(true);      	
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