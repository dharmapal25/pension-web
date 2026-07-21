const express = require("express");

const { RazorPaymentOrder, RazorPaymentVerify } = require("../controllers/payment.controller");


const Routes = express.Router();


Routes.post("/order-verify",RazorPaymentOrder);

Routes.post("/payment-verify",RazorPaymentVerify);


module.exports = Routes