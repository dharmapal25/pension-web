const express = require("express");
const Routes = express.Router();

const { RazorPaymentOrder, RazorPaymentVerify } = require("../controllers/payment.controller");


// api/payment/order-verify
Routes.post("/order-verify", RazorPaymentOrder);

// api/payment/payment-verify
Routes.post("/payment-verify", RazorPaymentVerify);


module.exports = Routes
