const PAGARME_ENCRYPTION_KEY = 'ek_test_m33wJhYA1QbnDbFCB759pvd6rGjs30'

let amount = 0
const pay = document
  .querySelector('#pay')
  .addEventListener('click', onPayClicked)

const slider = document
	.querySelector('[type="range"]')
   
slider.addEventListener('input', (event) => onSlide(event.target.value))

onSlide(slider.value)

const errorHandler = err => console.error('Uh oh, something bad happened.', err)

function onSlide (input) {
  amount = input
  document.querySelector('.total-value').textContent = formatCurrency(input) + 'R$'
}

function formatCurrency (number) {
	return number.toString().split('').map((value, index, arr) => {
	  return index === (arr.length - 2)? ',' + value : value
  }).reverse().map((value, index, n) => {
    if (index === 5) {
      value = value + '.'
	}
	
    return value
  }).reverse().join('')
}

function onPayClicked () {
  const supportedInstruments = [{
    supportedMethods: ['visa', 'mastercard']
  }]

  const details = {
    displayItems: [
      {
        label: 'Amount',
        amount: { currency: 'BRL', value : amount }
      },
      {
        label: 'Discount',
        amount: { currency: 'BRL', value : '-10.00' }
      }
    ],
    total:  {
      label: 'Total',
      amount: { currency: 'BRL', value : amount }
    },
	shippingOptions: []
  }

  console.log(amount)

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
	  customerData: "false", amount: amount, createToken: true, interestRate: 10, paymentMethods: 'credit_card'
  }

  checkout.open(params)
}

function paymentRequest (payment) {
  console.log(amount)
  let payload = {
    amount: amount,
    encryption_key: PAGARME_ENCRYPTION_KEY,
    card_number: payment.details.cardNumber,
    card_holder_name: payment.details.cardholderName,
    card_cvv: payment.details.cardSecurityCode,
    card_expiration_date: payment.details.expiryMonth + payment.details.expiryYear.substr(2, 2),
    metadata: payment.details.billingAddress
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

