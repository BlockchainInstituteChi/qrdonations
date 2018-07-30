console.log('loaded ');
// index.js -> bundle.js
// var QRCode = require('qrcode')


angular.module('mailManager', [])
.controller('mailCtrl',[ '$http', '$scope', '$window', function( $http, $scope, $window ){

	

	$scope.init = function () {
		var canvas = document.getElementById('canvas')
		var data = "0x10928naihxn1i7fh9iunjasqwdfcsa"
		console.log(canvas, data)
		QRCode.toCanvas(canvas, data, function (error) {
		  if (error) return console.error(error)
		  return console.log('success!');
		})
	};

	$scope.init();

}]);