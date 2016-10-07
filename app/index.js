let pay = document.querySelector('#pay')
pay.addEventListener('click', startPayment)

function startPayment () {
  let supportedInstruments = [{
    supportedMethods: ['visa', 'mastercard']
  }]

  var details = {
    displayItems: [
      {
        label: "Original donation amount",
        amount: { currency: "USD", value : "85.00" } // US$65.00
      },
      {
        label: "Friends and family discount",
        amount: { currency: "USD", value : "-10.00" } // -US$10.00
      }
    ],
    total:  {
      label: "Total",
      amount: { currency: "USD", value : "95.00" } // US$55.00
    }
  }

  let request = new PaymentRequest(
    supportedInstruments,
    details
  )

  request
    .show()
    .then(paymentResponse => {
      paymentResponse.complete('success')
    })
    .catch(err => console.error('Uh oh, something bad happened', err.message))
}
