const express = require("express");

const { RazorPaymentOrder, RazorPaymentVerify } = require("../controllers/payment.controller");

const Routes = express.Router();

// api/payment/order-verify
Routes.post("/order-verify", RazorPaymentOrder);

// api/payment/payment-verify
Routes.post("/payment-verify", RazorPaymentVerify);


module.exports = Routes
