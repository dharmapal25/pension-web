import React, { useState } from "react";
import axios from "axios";
import "./CourseForm.css";

// Schema ke hisaab se enums (backend ke exact same rakhe hain, warna validation error aayega)
const CATEGORIES = [
  "Web Development",
  "Data Science",
  "Programming",
  "Design",
  "Business",
  "Marketing",
  "App Development",
];
const LEVELS = ["beginner", "intermediate", "advanced"];
const LANGUAGES = ["English", "Hindi", "Spanish", "French", "German"];

// Ek empty lecture ka default shape - "Add Lecture" click hone par yehi object array me push hoga
const emptyLecture = () => ({
  title: "",
  videoUrl: "",
  duration: "",
  isPreview: false,
  resources: "", // input me comma-separated string lenge, submit ke time array me convert karenge
});

export default function CourseForm() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: CATEGORIES[0],
    tags: "", // comma separated -> submit par split hoga
    level: "beginner",
    language: "English",
    thumbnail: "",
    price: 0,
    discount: 0,
    whatYouWillLearn: "", // comma separated -> submit par split hoga
  });

  const [lectures, setLectures] = useState([emptyLecture()]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ---------- Course fields ke changes handle karna ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- Lecture ke andar ke fields change karna ----------
  const handleLectureChange = (index, field, value) => {
    setLectures((prev) =>
      prev.map((lec, i) => (i === index ? { ...lec, [field]: value } : lec))
    );
  };

  const addLecture = () => {
    setLectures((prev) => [...prev, emptyLecture()]);
  };

  const removeLecture = (index) => {
    setLectures((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Basic validation (schema ke required fields ke hisaab se)
    if (!formData.title || !formData.subtitle || !formData.description || !formData.thumbnail) {
      setMessage({ type: "error", text: "Sab required fields bharo (title, subtitle, description, thumbnail)." });
      return;
    }
    if (lectures.length === 0) {
      setMessage({ type: "error", text: "Kam se kam ek lecture add karo." });
      return;
    }
    for (const lec of lectures) {
      if (!lec.title || !lec.videoUrl || !lec.duration) {
        setMessage({ type: "error", text: "Har lecture me title, videoUrl aur duration required hai." });
        return;
      }
    }

    // Payload ko schema ke exact shape me convert karna
    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      level: formData.level,
      language: formData.language,
      thumbnail: formData.thumbnail,
      price: Number(formData.price) || 0,
      discount: Number(formData.discount) || 0,
      whatYouWillLearn: formData.whatYouWillLearn
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      lectures: lectures.map((lec) => ({
        title: lec.title,
        videoUrl: lec.videoUrl,
        duration: Number(lec.duration),
        isPreview: lec.isPreview,
        resources: lec.resources
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
      })),
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // agar JWT auth use kar rahe ho
      const { data } = await axios.post(
        "http://localhost:3000/api/instructor/upload-course",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      setMessage({ type: "success", text: "Course upload ho gaya!" });
      console.log("Response:", data);

      // Form reset
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        category: CATEGORIES[0],
        tags: "",
        level: "beginner",
        language: "English",
        thumbnail: "",
        price: 0,
        discount: 0,
        whatYouWillLearn: "",
      });
      setLectures([emptyLecture()]);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Kuch galat ho gaya, backend check karo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-form-wrapper">
      <div className="course-form-card">
        <p className="course-form-eyebrow">Instructor Studio</p>
        <h1 className="course-form-title">Upload New Course</h1>

        {message.text && (
          <div className={`course-form-banner ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit} className="course-form">
          {/* --- Basic Info --- */}
          <div className="field-group">
            <label className="field-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={120}
              placeholder="e.g. Complete MERN Stack Bootcamp"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Subtitle *</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              maxLength={200}
              placeholder="Short one-liner about the course"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Detailed course description"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Thumbnail URL *</label>
            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="Cloudinary image URL"
            />
          </div>

          {/* --- Category / Level / Language --- */}
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">Level</label>
              <select name="level" value={formData.level} onChange={handleChange}>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label className="field-label">Language</label>
              <select name="language" value={formData.language} onChange={handleChange}>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* --- Price / Discount --- */}
          <div className="field-row two">
            <div className="field-group">
              <label className="field-label">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min={0}
              />
            </div>
            <div className="field-group">
              <label className="field-label">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min={0}
                max={100}
              />
            </div>
          </div>

          {/* --- Tags / What you'll learn --- */}
          <div className="field-group">
            <label className="field-label">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="react, nodejs, mongodb"
            />
          </div>

          <div className="field-group">
            <label className="field-label">What you&apos;ll learn (comma separated)</label>
            <input
              type="text"
              name="whatYouWillLearn"
              value={formData.whatYouWillLearn}
              onChange={handleChange}
              placeholder="Build REST APIs, Deploy on Render, ..."
            />
          </div>

          {/* --- Lectures section --- */}
          <div>
            <hr className="course-form-divider" />
            <div className="lectures-header" style={{ marginTop: 20 }}>
              <h2 className="lectures-heading">Lectures</h2>
              <button type="button" onClick={addLecture} className="btn-add-lecture">
                + Add Lecture
              </button>
            </div>

            <div className="lectures-list">
              {lectures.map((lec, index) => (
                <div key={index} className="lecture-card">
                  <div className="lecture-badge">{index + 1}</div>
                  <div className="lecture-body">
                    {lectures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLecture(index)}
                        className="lecture-remove"
                      >
                        Remove
                      </button>
                    )}

                    <div className="lecture-grid">
                      <input
                        type="text"
                        placeholder="Lecture title *"
                        value={lec.title}
                        onChange={(e) => handleLectureChange(index, "title", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Video URL *"
                        value={lec.videoUrl}
                        onChange={(e) => handleLectureChange(index, "videoUrl", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Duration (minutes) *"
                        value={lec.duration}
                        onChange={(e) => handleLectureChange(index, "duration", e.target.value)}
                        min={1}
                      />
                      <input
                        type="text"
                        placeholder="Resources (comma separated URLs)"
                        value={lec.resources}
                        onChange={(e) => handleLectureChange(index, "resources", e.target.value)}
                      />
                    </div>

                    <label className="lecture-preview-toggle">
                      <input
                        type="checkbox"
                        checked={lec.isPreview}
                        onChange={(e) => handleLectureChange(index, "isPreview", e.target.checked)}
                      />
                      Free preview lecture
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? "Uploading..." : "Upload Course"}
          </button>
        </form>
      </div>
    </div>
  );
}