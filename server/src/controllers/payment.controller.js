const razorpayInstance = require("../config/Rasorpay");
const Course = require("../models/courses.model");
const crypto = require("crypto");
const User = require("../models/users.model");

const RazorPaymentOrder = async (req, res) => {
    try {

        const { userId, courseId } = req.body


        const course = await Course.findById(courseId);

        // find amount and pass

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
    try {
        const {
            userId,
            courseId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // Verify Signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        // Course Id Push
        await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    boughtCourses: courseId,
                },
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Payment Successful",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = { RazorPaymentOrder, RazorPaymentVerify }