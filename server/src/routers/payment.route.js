const express = require("express");

const { RazorPaymentOrder, RazorPaymentVerify } = require("../controllers/payment.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");


const Routes = express.Router();


Routes.post("/order-verify", verifyToken, RazorPaymentOrder);

Routes.post("/payment-verify", verifyToken, RazorPaymentVerify);


module.exports = Routes
