const razorpayInstance = require("../config/Rasorpay");
const Course = require("../models/courses.model");
const crypto = require("crypto");
const User = require("../models/users.model");

const RazorPaymentOrder = async (req, res) => {
    try {

        // const { userId, courseId } = req.body  
        const { courseId } = req.body           // test

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(400).json({
                message: "Invalid course id"
            })
        }

        // find amount and pass
        let amount = course.price

        const options = {
            amount: amount * 100, //  in paisa (₹500 = 50000)
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        res.json({
            success: true,
            course,
            order
        })

    } catch (error) {
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


        console.log(
            userId,
            courseId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,)

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
        // const userId = req.user?._id;
        console.log("userId : ", userId)
        console.log("courseId : ", courseId)

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