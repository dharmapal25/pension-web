import React, { useState } from "react";
import axios from "axios";
import "./CourseForm.css";
import CircularLoader from "../ui/CircularLoader";
import ErrorToast from "../ui/ErrorToast";

// These must match the backend schema enums exactly, or validation will fail
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

// Default shape of one empty lecture, used when "Add Lecture" is clicked
const emptyLecture = () => ({
  title: "",
  videoUrl: "",
  duration: "",
  isPreview: false,
  resources: "", // comma separated string in the input, converted to array on submit
});

export default function CourseForm() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: CATEGORIES[0],
    tags: "", // comma separated, split into array on submit
    level: "beginner",
    language: "English",
    price: 0,
    discount: 0,
    whatYouWillLearn: "", // comma separated, split into array on submit
  });

  // Separate state for the thumbnail file (not part of formData object)
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [lectures, setLectures] = useState([emptyLecture()]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle changes for normal course fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle thumbnail file selection + show a preview
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  // Handle changes inside one lecture card
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Basic validation for required fields
    if (!formData.title || !formData.subtitle || !formData.description) {
      setMessage({ type: "error", text: "Please fill title, subtitle and description." });
      return;
    }
    if (!thumbnailFile) {
      setMessage({ type: "error", text: "Please upload a thumbnail image." });
      return;
    }
    if (lectures.length === 0) {
      setMessage({ type: "error", text: "Add at least one lecture." });
      return;
    }
    for (const lec of lectures) {
      if (!lec.title || !lec.videoUrl || !lec.duration) {
        setMessage({ type: "error", text: "Every lecture needs a title, video URL and duration." });
        return;
      }
    }

    // Convert comma separated strings into clean arrays
    const tagsArray = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const whatYouWillLearnArray = formData.whatYouWillLearn
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const lecturesArray = lectures.map((lec) => ({
      title: lec.title,
      videoUrl: lec.videoUrl,
      duration: Number(lec.duration),
      isPreview: lec.isPreview,
      resources: lec.resources.split(",").map((r) => r.trim()).filter(Boolean),
    }));

    // Backend expects multipart/form-data because of the file upload,
    // so arrays/objects (lectures, tags, whatYouWillLearn) must be sent as JSON strings
    const form = new FormData();
    form.append("title", formData.title);
    form.append("subtitle", formData.subtitle);
    form.append("description", formData.description);
    form.append("category", formData.category);
    form.append("level", formData.level);
    form.append("language", formData.language);
    form.append("price", formData.price);
    form.append("discount", formData.discount);
    form.append("tags", JSON.stringify(tagsArray));
    form.append("whatYouWillLearn", JSON.stringify(whatYouWillLearnArray));
    form.append("lectures", JSON.stringify(lecturesArray));
    form.append("thumbnail", thumbnailFile); // actual file, field name must match multer config

    try {
      setLoading(true);
      // Backend reads the JWT from an httpOnly cookie, so we don't attach
      // an Authorization header. withCredentials makes the browser send
      // that cookie automatically with the request.
      const { data } = await axios.post(
        "http://localhost:3000/api/instructor/upload-course",
        form,
        {
          withCredentials: true,
          // Do NOT set Content-Type manually for FormData,
          // the browser sets it automatically with the correct boundary
        }
      );
      setMessage({ type: "success", text: "Course uploaded successfully!" });
      console.log("Response:", data);

      // Reset form after success
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        category: CATEGORIES[0],
        tags: "",
        level: "beginner",
        language: "English",
        price: 0,
        discount: 0,
        whatYouWillLearn: "",
      });
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setLectures([emptyLecture()]);
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Something went wrong, check the backend.",
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

        <ErrorToast message={message.type === "error" ? message.text : ""} onDismiss={() => setMessage({ type: "", text: "" })} />
        {message.text && message.type !== "error" && (
          <div className={`course-form-banner ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit} className="course-form">
          {/* Basic info */}
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

          {/* Thumbnail file upload */}
          <div className="field-group">
            <label className="field-label">Thumbnail Image *</label>
            <input type="file" accept="image/*" onChange={handleThumbnailChange} />
            {thumbnailPreview && (
              <img src={thumbnailPreview} alt="Thumbnail preview" className="thumbnail-preview" />
            )}
          </div>

          {/* Category / Level / Language */}
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

          {/* Price / Discount */}
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

          {/* Tags / What you'll learn */}
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

          {/* Lectures section */}
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
            {loading ? <CircularLoader label="Uploading course" /> : "Upload Course"}
          </button>
        </form>
      </div>
    </div>
  );
}
