 Quando é pressionado voltar ao inicio em track-order deve voltar para /encomendas

 Implementar Cartão de Crédito example: const options = {
  method: 'POST',
  headers: {accept: 'application/json', 'content-type': 'application/json'},
  body: JSON.stringify({
    payment: {
      amount: {currency: 'EUR', value: 2},
      lang: 'PT',
      minutesFormUp: 1440,
      identifier: 'Test',
      successUrl: 'https://eupago.pt',
      failUrl: 'https://eupago.pt',
      backUrl: 'https://eupago.pt'
    },
    customer: {notify: true, email: 'teste@eupago.pt'}
  })
};

fetch('https://sandbox.eupago.pt/api/v1.02/creditcard/create', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));


Implementar MB WAY example: const options = {
  method: 'POST',
  headers: {accept: 'application/json', 'content-type': 'application/json'},
  body: JSON.stringify({
    payment: {
      identifier: 'Test',
      amount: {value: 2, currency: 'EUR'},
      successUrl: 'https://eupago.pt',
      failUrl: 'https://eupago.pt',
      backUrl: 'https://eupago.pt',
      lang: 'PT'
    },
    customer: {notify: true, email: 'teste@eupago.pt'}
  })
};

fetch('https://sandbox.eupago.pt/api/v1.02/mbway/create', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));

search for eupago api documentation https://eupago.readme.io/reference/api-eupago  para fazer isto:
Webhook para atualizar status após pagamento
     - Email de confirmação de encomenda
     - Notificações de mudança de status



  melhorar ui notificação ao entrar