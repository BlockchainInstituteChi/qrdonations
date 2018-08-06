console.log('loaded ');
// index.js -> bundle.js
// var QRCode = require('qrcode')


angular.module('donationsManager', ['vcRecaptcha'])
.controller('donationsCtrl',[ '$http', '$scope', '$window', function( $http, $scope, $window ){

	$scope.server = "http://localhost:8889/";

	//  
	$scope.init = function () {

		var canvas = document.getElementById('qrCode')
		$scope.data = "xxxxxxxx"
		console.log(canvas, $scope.data)
		QRCode.toCanvas(canvas, $scope.data, function (error) {
		  if (error) return console.error(error)
		  return console.log('success!');
		})

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
			callBackTest( stepId, function(result, stepId) {
				if (true === result.success) {
					proceed (stepId)
				} else {
					$scope.error = result.error
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

	$scope.checkCurrencyChoice = function (stepId, callback) {
		console.log($scope.currency);

		if ( $scope.currency ) {
			var result = {
				'success':true
			};

			updateWalletAddress($scope.currency);

			return callback(result, stepId)

		} else {
			var result = {
				'errr':'No currency choice selected.'
			};

			return callback(result, stepId)
		}
	}

	function updateWalletAddress (currencyChoice) {
		console.log("entered updateWalletAddress");
		// Load the view-data from the node.js server
	  	$http.get( $scope.server + '/getRandomAddress' + currencyChoice)
	  		.then(function(response) { 
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

	$scope.key = "6Lef510UAAAAAHytDRJTVDGAUA_aMPaAnDDCkxV_";

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