const razorpayInstance = require("../config/Rasorpay")

const RazorPaymentOrder = async (req, res) => {
    try {

        const { amount } = req.body

        const options = {
            amount: amount * 100, //  in paisa (₹500 = 50000)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        res.json({
            success: true,
            order
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

}

const RazorPaymentVerify = async (req, res) => {

    const { paymentId, orderId, signature } = req.body;

    // demo --- check ---
    console.log(req.body);
    res.send("Payment Successful!");

}

module.exports = { RazorPaymentOrder,RazorPaymentVerify }