import React from 'react'
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuthUser from '../../hooks/useAuthRole';

const OpenCourse = () => {
    const { user, loading } = useAuth();

    let navigate = useNavigate()

    const [course, setCourse] = useState({});
    const [id, setId] = useState(null);
    let [load, setLoad] = useState(false);
    let [error, setError] = useState("");

    const location = useLocation();
    console.log(location.state);

    useEffect(() => {
        API.get("/auth/me", {
            withCredentials: true,
        }).then((data) => {
            setId(data.data.id)
            console.log("data : ", data.data.id)
        }).catch((err) => {
            console.log("error : ", err)

        })

    }, [])


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


            const order = data.order;
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                name: "Flash Razorpay payment test",
                description: "Test Transaction",
                order_id: order.id,

                handler: async function (response) {
                    const razorpay_payment_id = response.razorpay_payment_id;
                    const razorpay_order_id = response.razorpay_order_id;
                    const razorpay_signature = response.razorpay_signature;

                    const { data } = await API.post("/payment/payment-verify", {
                        razorpay_payment_id,
                        razorpay_order_id,
                        razorpay_signature,
                        courseId: location.state,
                        userId: id
                    });

                    // navigate("/")

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


                        </div>

                    </div >
            }
        </>
    )
}

export default OpenCourse
