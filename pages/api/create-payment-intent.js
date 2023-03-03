// This is your test secret API key.
const axios = require('axios');

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

export default async function handler(req, res) {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const order = (await axios.request({
    method: 'POST',
    url: `https://api.exactpaysandbox.com/account/${process.env.P2_ACCOUNT_ID}/orders`,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: process.env.APPLICATION_TOKEN
    },
    data: {
      amount: calculateOrderAmount(items),
      reference: {referenceNo: "sample for demo"}
    }
  })).data
  res.send({
    token : order.accessToken.token,
    orderId : order.id
  });
};