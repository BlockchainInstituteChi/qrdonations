console.log('loaded ');
// index.js -> bundle.js
// var QRCode = require('qrcode')


angular.module('donationsManager', ['vcRecaptcha'])
.controller('donationsCtrl',[ '$http', '$scope', '$window', function( $http, $scope, $window ){

	$scope.server = "http://localhost:8887/";

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
		// console.log("Setting currency to " + code);
		$scope.currency = code;
	}

	$scope.checkCurrencyChoice = function (callback) {
		console.log($scope.currency);

		if ( $scope.currency ) {

			// updateWalletAddress($scope.currency);

			return callback(true)

		} else {
			var result = {
				'error':'No currency choice selected.'
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
					'error':'You must enter an email address to receive a tax receipt.'
				};
				return callback(result)
			}
		} else {
			return callback(true)
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