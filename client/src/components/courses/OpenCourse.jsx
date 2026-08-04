import React, { useEffect, useState } from "react";
import { FaCheck, FaPlayCircle, FaStar } from "react-icons/fa";
import { HiArrowLeft, HiClock, HiCollection, HiGlobeAlt } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import CircularLoader from "../ui/CircularLoader";
import ErrorToast from "../ui/ErrorToast";

const OpenCourse = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState({});
  const [id, setId] = useState(null);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/auth/me",
      { withCredentials: true }
    )
      .then((data) => setId(data.data.id))
      .catch((err) => console.log("error : ", err));
  }, []);


  async function singleCourseInfo(courseId) {
    try {
      setLoad(true);
      const courseInfo = await API.get(`/online/course/${courseId}`);
      setCourse(courseInfo.data.course);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoad(false);
    }
  }


  useEffect(() => {
    singleCourseInfo(location.state);
  }, []);


  const handlePayment = async () => {
    if (!user) return navigate("/login");

    try {
      const { data } = await API.post("/payment/order-verify", {
        courseId: location.state
      });

      const order = data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        name: "Flash Razorpay payment test",
        description: "Test Transaction",
        order_id: order.id,

        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          await API.post("/payment/payment-verify", {
            razorpay_payment_id, razorpay_order_id, razorpay_signature, courseId: location.state, userId: id
          });
        },

        prefill: {
          name: user?.displayName,
          email: user?.email,
          contact: "9999999999"
        }, theme: { color: "#6043e6" }
      };

      new Razorpay(options).open();
    } catch (error) {
      console.log(error);
    }
  };

  const learningPoints =
    course.whatYouWillLearn?.length ?
      course.whatYouWillLearn :
      ["Build practical, portfolio-ready skills", "Learn with clear, structured lessons", "Study at your own pace"];
  const originalPrice = course.discount > 0 ? Math.round(course.price / (1 - course.discount / 100)) : null;

  return <>{(load || loading) ? <CircularLoader fullPage /> : <main className="course-detail-page">
    <section className="course-detail-hero">
      <div className="course-detail-inner">
        <button
          className="course-back"
          type="button"
          onClick={() => navigate(-1)}>
          <HiArrowLeft />
          Back to courses
        </button>

        <div className="course-detail-main">
          <div className="course-detail-copy">
            <p className="course-breadcrumb">{course.category || "Course"}
              <span>{"\u2022"}</span>
              {course.level || "All levels"}
            </p>
            <h1>{course.title}</h1>
            <p className="course-subtitle">
              {course.subtitle || course.description}
            </p>

            <div className="course-creator">
              Created by
              <strong>{course.instructor?.name || "CourseBox instructor"}
              </strong>
            </div>

            <div className="course-stats">
              <span>
                <FaStar />
                {course.rating?.average || 0} ({course.rating?.count || 0} ratings)
              </span>
              <span>
                <HiClock />
                {course.totalDuration || 0} hours</span>
              <span>
                <HiGlobeAlt />
                {course.language || "English"}
              </span>
            </div>


          </div>
          <aside className="course-purchase-card">
            <div className="course-preview">
              <img src={course.thumbnail} alt={course.title} loading="lazy" />
            </div>

            <div className="course-purchase-body">
              <p className="purchase-label">Lifetime access</p>
              <div className="detail-price">
                <strong>{course.price === 0 ? "Free" : "\u20b9" + course.price}
                </strong>

                {
                  originalPrice &&
                  <span>{"\u20b9"}{originalPrice}</span>
                }
                {
                  course.discount > 0 &&
                  <em>{course.discount}% off</em>
                }
              </div>


              <button
                className="purchase-button"
                onClick={handlePayment}>{course.price === 0 ? "Enroll now" : "Buy now"}
              </button>
              <p className="purchase-note">
                30-day money-back guarantee
              </p>

              <ul>
                <li>Full lifetime access</li>
                <li>Learn on mobile and desktop</li>
                <li>Certificate of completion</li>
              </ul>

            </div>

          </aside>
        </div>
      </div>
    </section>


    <section className="course-detail-content">
      <div className="course-detail-column">
        <section className="learning-box">

          <h2>What you'll learn</h2>

          <div className="learning-grid">

            {
              learningPoints.map((point, index) => <p key={index}><FaCheck /> {point}</p>)
            }

          </div>


        </section>
        <section className="about-course">
          <h2>About this course</h2>
          <p>
            {course.description || "Course information will be available shortly."}
          </p>
        </section>


        <section className="course-includes">
          <h2>This course includes</h2>
          <div>
            <span>
              <HiCollection />
              {course.totalLectures || 0} lectures
            </span>
            <span>
              <HiClock />
              {course.totalDuration || 0} hours of content
            </span>
            <span>
              <HiGlobeAlt />
              {course.language || "English"}
            </span>
          </div>
        </section>
      </div>
    </section>
  </main>}<ErrorToast message={error} onDismiss={() => setError("")} /></>;
};

export default OpenCourse;
