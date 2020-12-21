const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const bodyParser = require("body-parser");
const cors = require("cors");
const { response } = require("express");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', cors(), async (req, res) =>{
    res.status(200).json('server running...')
})

app.post("/stripe/charge", cors(), async (req, res) => {
  console.log("stripe-routes.js 9 | route reached", req.body);
  let { amount, id } = req.body;
  console.log("stripe-routes.js 10 | amount and id", amount, id);
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "USD",
      description: "Your Company Description",
      payment_method: id,
      confirm: true,
    });
    console.log("stripe-routes.js 19 | payment", payment);
    res.json({
      message: "Payment Successful",
      success: true,
    });
  } catch (error) {
    console.log("stripe-routes.js 17 | error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
});

app.get("/stripe", cors(), async (req, res) => {
  try{
    // const stripes = require('stripe')('pk_test_51Hx7HsKdUGp8fWpueaK23s8WR2MpgKnk2RtVoNaYdpZRmQGmXeaN26MhVnLNguyiSPKtrougJbGpxXharrbMYVzF00ydGwDOSh');
    const transactions = await stripe.issuing.transactions.list({
      limit: 30,
    });
    res.status(200).json(transactions)
  }catch(e) {
    res.status(400).json(e)
  }
})

app.listen(process.env.PORT || 3002, () => {
  console.log("Server started...");
});
