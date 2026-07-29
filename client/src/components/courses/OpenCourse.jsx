import React from 'react'
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

const OpenCourse = () => {
    const { user, loading } = useAuth();

    let navigate = useNavigate()
    const [course, setCourse] = useState({});
    let [load, setLoad] = useState(false);
    let [error, setError] = useState("");
    const location = useLocation();
    console.log(location.state);


    console.log(user);
    console.log(user?.email);



    async function singleCourseInfo(id) {
        try {
            setLoad(true);
            let courseInfo = await API.get(`/online/course/${id}`)
            setCourse(courseInfo.data.course)

        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoad(false);
        }
    }

    useEffect(() => {
        singleCourseInfo(location.state);
    }, [])


    const handlePayment = async () => {

        if (!user) {
            return navigate("/login")
        }

        try {

            const { data } = await API.post('/payment/order-verify', {
                courseId: location.state
            })

            console.log("data : ", data)

            const order = data.order;
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                name: "Flash Razorpay payment test",
                description: "Test Transaction",
                order_id: order.id,

                handler: async function (response) {
                    const paymentId = response.razorpay_payment_id;
                    const orderId = response.razorpay_order_id;
                    const signature = response.razorpay_signature;

                    const { data } = await API.post("/payment/payment-verify", {
                        paymentId,
                        orderId,
                        signature,
                        courseId: location.state
                    });

                    console.log("payment info : ",data);
                    navigate("/")

                },

                // prefill details (/login details of the user)
                prefill: {
                    name: user?.displayName,
                    email: user?.email,
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
        <>

            {

                (load || loading) ?

                    <h1>please wait, Loading...</h1>

                    :
                    < div className="course" >
                        {/* <h1>Course {course._id} </h1> */}
                        <div div div className="left" >

                            <button onClick={() => navigate(-1)}>BACK</button>

                            <h1 className="title">{course?.title}</h1>

                            <p className="desc">{course?.description}</p>

                            <div className="creator">
                                Created by <span>{course?.instructor?.name}</span>
                            </div>

                            <div className="info">
                                <span>⭐ {course?.rating?.average}</span>
                                <span>{course?.rating?.count} Reviews</span>
                                <span>{course?.language}</span>
                            </div>

                            <div className="learn-box">
                                <h2>What you'll learn</h2>

                                <div className="grid">
                                    {course?.whatYouWillLearn?.map((item, index) => (
                                        <div key={index}>✔ {item}</div>
                                    ))}
                                </div>
                            </div>

                        </div >

                        <div className="right">

                            <img
                                src={course?.thumbnail}
                                alt={course?.title}
                            />

                            <h2>₹{course?.price}</h2>

                            <button onClick={handlePayment}>
                                Buy Now
                            </button>

                            <button className="outline">
                                Add to Cart
                            </button>

                            <ul>
                                <li>✔ Lifetime Access</li>
                                <li>✔ {course?.totalLectures} Lectures</li>
                                <li>✔ {course?.totalDuration} Hours</li>
                                <li>✔ {course?.level}</li>
                            </ul>

                        </div>

                    </div >
            }
        </>
    )
}

export default OpenCourse
