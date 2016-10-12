const PAGARME_ENCRYPTION_KEY = 'ek_test_m33wJhYA1QbnDbFCB759pvd6rGjs30'

let pay = document
  .querySelector('#pay')
  .addEventListener('click', onPayClicked)

const errorHandler = err => console.error('Uh oh, something bad happened.', err)

function onPayClicked () {
  const supportedInstruments = [{
    supportedMethods: ['visa', 'mastercard']
  }]

  const details = {
    displayItems: [
      {
        label: 'Original subscription amount',
        amount: { currency: 'BRL', value : '65.00' }
      },
      {
        label: 'Friends and family discount',
        amount: { currency: 'BRL', value : '-10.00' }
      }
    ],
    total:  {
      label: 'Total',
      amount: { currency: 'BRL', value : '55.00' }
    }
  }

  if ('PaymentRequest' in window) {
    return new PaymentRequest(supportedInstruments, details)
      .show()
	  .then(paymentRequest)
      .then(finishPayment)
      .catch(errorHandler)
  }

  const checkout = new PagarMeCheckout.Checkout({
    encryption_key: PAGARME_ENCRYPTION_KEY,
    success: payment => sendFromPagarMeCheckout(payment)
  })

  const params = {
    customerData: "false", amount: "10000", createToken: true, interestRate: 10, paymentMethods: 'credit_card'
  }

  checkout.open(params)
}

function paymentRequest (payment) {
  let payload = {
    amount: 5500,
    encryption_key: PAGARME_ENCRYPTION_KEY,
    card_number: payment.details.cardNumber,
    card_holder_name: payment.details.cardholderName,
    card_cvv: payment.details.cardSecurityCode,
    card_expiration_date: payment.details.expiryMonth + payment.details.expiryYear.substr(2, 2),
  }

  return sendPayment(payload)
	.then((response) => {
		payment.complete('success')

		return response
	})
}

function sendFromPaymentRequestAPI (payment) {
  return sendPayment(payload)
	.then((response)=> {
	  payment.complete('success')

	  return response
	})
	.catch((cat) => {
	  console.log('Failed PaymentRequestAPI', cat)
	  payment.complete('fail')
	})
}

function sendFromPagarMeCheckout (payload) {
  return finishPayment(payload)
}

function sendPayment (payload) {
  return fetch('https://api.pagar.me/1/transactions', {
    method: 'POST',
    headers: new Headers({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  })
  .then(res => {
    return res.json()
  })
}

function finishPayment (paymentObject) {
  let pre = document.querySelector('pre')

  pre.innerHTML = JSON.stringify(paymentObject, 0, 2, 0)
}

