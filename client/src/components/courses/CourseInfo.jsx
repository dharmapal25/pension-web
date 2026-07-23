import React from 'react'
import API from '../../services/api'

const CourseInfo = () => {

    let amount = 50;

    const handlePayment = async () => {

        try {

            const { data } = await API.post('/api/payment/order-verify', {
                amount
            })

            const order = data.order;
            const options = {
                key: "rzp_test_Rp4UfVRvSGNvh0",
                amount: order.amount,
                name: "Flash Razorpay payment test",
                description: "Test Transaction",
                order_id: order.id,

                handler: async function (response) {
                    const paymentId = response.razorpay_payment_id;
                    const orderId = response.razorpay_order_id;
                    const signature = response.razorpay_signature;

                    const { data } = await API.post("/api/payment/payment-verify", {
                        paymentId, orderId, signature
                    });

                    alert(data.msg);
                },

                // prefill details (/login details of the user)
                prefill: {
                    name: 'Flash',
                    email: 'flash@example.com',
                    contact: '9999999999',
                },
                theme: { color: '#3399cc' },
            };

            const rzp = new Razorpay(options);
            rzp.open();
        }

        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="course">

            {/* Left Side */}
            <div className="left">
                <p className="breadcrumb">Business &gt; Business Analytics &gt; SQL</p>
                <h1 className="title"> The Complete SQL Bootcamp (30 Hours): Go from Zero to Hero </h1>
                <p className="desc"> The only SQL course with animations, projects and practice to master SQL from beginner to advanced. </p>

                <div className="creator">
                    Created by <span>Flash Academy</span>
                </div>

                <div className="info">
                    <span>⭐ 4.7</span>
                    <span>63,348 Students</span>
                    <span>English</span>
                </div>

                <div className="learn-box">
                    <h2>What you'll learn</h2>

                    <div className="grid">

                        <div>✔ Learn SQL Basics</div>
                        <div>✔ SELECT Queries</div>

                        <div>✔ WHERE Clause</div>
                        <div>✔ GROUP BY</div>

                        <div>✔ JOINS</div>
                        <div>✔ Aggregate Functions</div>

                        <div>✔ Window Functions</div>
                        <div>✔ Real Projects</div>

                    </div>

                </div>

            </div>

            {/* Right Side */}

            <div className="right">
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800" alt="" />

                <h2>₹469</h2>
                <button onClick={handlePayment}>Buy Now</button>
                <button className="outline">Add to Cart</button>

                <ul>
                    <li>✔ Lifetime Access</li>
                    <li>✔ Certificate</li>
                    <li>✔ Downloadable Resources</li>
                    <li>✔ Full HD Videos</li>
                </ul>

            </div>
        </div>
    )
}

export default CourseInfo
