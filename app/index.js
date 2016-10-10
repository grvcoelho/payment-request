const PAGARME_ENCRYPTION_KEY = 'ek_test_AbngIR4MNh9AWQVAJg8qmBs627sPC1'

let pay = document
  .querySelector('#pay')
  .addEventListener('click', onPayClicked)

const errorHandler = err => console.error('Uh oh, something bad happened.', err)

function onPayClicked () {
  let supportedInstruments = [{
    supportedMethods: ['visa', 'mastercard']
  }]

  let details = {
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

  new PaymentRequest(supportedInstruments, details)
    .show()
    .then(sendPaymentToServer)
    .then(finishPayment)
    .catch(errorHandler)
}

function sendPaymentToServer (payment) {
  let payload = {
    amount: 5500,
    encryption_key: PAGARME_ENCRYPTION_KEY,
    card_number: payment.details.cardNumber,
    card_holder_name: payment.details.cardholderName,
    card_cvv: payment.details.cardSecurityCode,
    card_expiration_date: payment.details.expiryMonth + payment.details.expiryYear.substr(2, 2),
  }

  return fetch('https://api.pagar.me/1/transactions', {
    method: 'POST',
    headers: new Headers({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  })
    .then(res => {
      payment.complete('success')
      return res.json()
    })
    .catch(() => payment.complete('fail'))
}

function finishPayment (paymentObject) {
  let pre = document.querySelector('pre')

  pre.innerHTML = JSON.stringify(paymentObject)
}

