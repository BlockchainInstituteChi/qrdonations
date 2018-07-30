console.log('loaded ');
// index.js -> bundle.js
// var QRCode = require('qrcode')


angular.module('donationsManager', ['vcRecaptcha'])
.controller('donationsCtrl',[ '$http', '$scope', '$window', function( $http, $scope, $window ){

	

	$scope.init = function () {
		var canvas = document.getElementById('qrCode')
		var data = "0x10928naihxn1i7fh9iunjasqwdfcsa"
		console.log(canvas, data)
		QRCode.toCanvas(canvas, data, function (error) {
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