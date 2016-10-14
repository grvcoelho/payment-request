/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	var PAGARME_ENCRYPTION_KEY = 'ek_test_AbngIR4MNh9AWQVAJg8qmBs627sPC1';

	var pay = document.querySelector('#pay').addEventListener('click', onPayClicked);

	var errorHandler = function errorHandler(err) {
	  return console.error('Uh oh, something bad happened.', err);
	};

	function onPayClicked() {
	  var supportedInstruments = [{
	    supportedMethods: ['visa', 'mastercard']
	  }];

	  var details = {
	    displayItems: [{
	      label: 'Original subscription amount',
	      amount: { currency: 'BRL', value: '65.00' }
	    }, {
	      label: 'Friends and family discount',
	      amount: { currency: 'BRL', value: '-10.00' }
	    }],
	    total: {
	      label: 'Total',
	      amount: { currency: 'BRL', value: '55.00' }
	    }
	  };

	  new PaymentRequest(supportedInstruments, details).show().then(sendPaymentToServer).then(finishPayment).catch(errorHandler);
	}

	function sendPaymentToServer(payment) {
	  var payload = {
	    amount: 5500,
	    encryption_key: PAGARME_ENCRYPTION_KEY,
	    card_number: payment.details.cardNumber,
	    card_holder_name: payment.details.cardholderName,
	    card_cvv: payment.details.cardSecurityCode,
	    card_expiration_date: payment.details.expiryMonth + payment.details.expiryYear.substr(2, 2)
	  };

	  return fetch('https://api.pagar.me/1/transactions', {
	    method: 'POST',
	    headers: new Headers({
	      'Access-Control-Allow-Origin': '*',
	      'Content-Type': 'application/json'
	    }),
	    body: JSON.stringify(payload)
	  }).then(function (res) {
	    payment.complete('success');
	    return res.json();
	  }).catch(function () {
	    return payment.complete('fail');
	  });
	}

	function finishPayment(paymentObject) {
	  var pre = document.querySelector('pre');

	  pre.innerHTML = JSON.stringify(paymentObject);
	}

/***/ }
/******/ ]);