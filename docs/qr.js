function setCanvas () {

	var add = "bitcoin:37cQwB4jdcaYGLHbRZWk2s7pZFhSYUnzUv?amount="
	var ad2 = "bitcoin:37cQwB4jdcaYGLHbRZWk2s7pZFhSYUnzUv?amount=125&message=hi"
	console.log(add)

	var amount = 0.064584207907655816

	var transactionURI = add + amount.toFixed(8)

	initCanvas(transactionURI)
}

function initCanvas (address) {
	// var address = QRCode.makeCode(addr)
	var canvas = document.getElementById('qrCode')
	console.log(canvas, address)
	QRCode.toCanvas(canvas, address, function (error) {
	  if (error) return console.error(error)
	  console.log('successfully set QR Code')
	})
}