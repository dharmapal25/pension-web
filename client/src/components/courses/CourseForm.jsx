import React, { useState } from 'react';

const CourseForm = () => {
  // 1. Course Form Main State
  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    description: '',
    instructor: '',
    category: '',
    tags: '', // Comma separated string
    level: 'Beginner',
    language: 'Hindi',
    price: '',
    discount: '',
    rating: 0,
    whatYouWillLearn: '', // Comma separated string
  });

  // 2. Separate State for Thumbnail File & Preview
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // 3. Dynamic Lectures List State
  const [lectures, setLectures] = useState([
    { title: '', videoUrl: '', duration: '', isPreview: false, resources: '' }
  ]);

  const [loading, setLoading] = useState(false);

  // --- Handlers --- //

  // Input change handler for regular course fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  // Thumbnail change & instant local preview handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file)); // Local preview key
    }
  };

  // Lecture fields change handler
  const handleLectureChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedLectures = [...lectures];
    updatedLectures[index][name] = type === 'checkbox' ? checked : value;
    setLectures(updatedLectures);
  };

  // Add new lecture field
  const addLecture = () => {
    setLectures((prev) => [
      ...prev,
      { title: '', videoUrl: '', duration: '', isPreview: false, resources: '' }
    ]);
  };

  // Remove lecture field
  const removeLecture = (index) => {
    const updatedLectures = lectures.filter((_, i) => i !== index);
    setLectures(updatedLectures);
  };

  // Calculate totals automatically
  const totalLecturesCount = lectures.length;
  const calculatedTotalDuration = lectures.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);

  // --- Submit Handler --- //
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail) {
      alert('Please select a course thumbnail!');
      return;
    }

    setLoading(true);

    try {
      // Create FormData Object for multipart upload
      const formData = new FormData();

      // Append text inputs
      Object.keys(courseData).forEach((key) => {
        if (key === 'tags') {
          // String ko array bana kar JSON.stringify karke bhejenge
          const tagsArray = courseData.tags.split(',').map((tag) => tag.trim());
          formData.append('tags', JSON.stringify(tagsArray));
        } else if (key === 'whatYouWillLearn') {
          const learnArray = courseData.whatYouWillLearn.split(',').map((item) => item.trim());
          formData.append('whatYouWillLearn', JSON.stringify(learnArray));
        } else {
          formData.append(key, courseData[key]);
        }
      });

      // Append Thumbnail File (Crucial: key name matches multer 'thumbnail')
      formData.append('thumbnail', thumbnail);

      // Append Complex Arrays (Lectures array as JSON String)
      formData.append('lectures', JSON.stringify(lectures));
      formData.append('totalLectures', totalLecturesCount);
      formData.append('totalDuration', calculatedTotalDuration);

      // Send Request to Backend
      const response = await fetch('http://localhost:3000/api/instructor/upload-course', {
        method: 'POST',
        body: formData, // Don't set Content-Type header; browser does it automatically with boundary
      });

      const data = await response.json();

      if (data.success) {
        alert('Course created successfully!');
        // Reset form or redirect
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('Failed to submit course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Create New Course</h2>

      <form onSubmit={handleSubmit}>
        {/* --- Course Basic Info --- */}
        <h3>Basic Details</h3>
        <input type="text" name="title" placeholder="Course Title" value={courseData.title} onChange={handleChange} required style={inputStyle} />
        <input type="text" name="subtitle" placeholder="Course Subtitle" value={courseData.subtitle} onChange={handleChange} style={inputStyle} />
        <textarea name="description" placeholder="Description" value={courseData.description} onChange={handleChange} rows="4" style={inputStyle} />
        
        <input type="text" name="instructor" placeholder="Instructor Name / ID" value={courseData.instructor} onChange={handleChange} required style={inputStyle} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" name="category" placeholder="Category (e.g. Web Dev)" value={courseData.category} onChange={handleChange} style={inputStyle} />
          <select name="level" value={courseData.level} onChange={handleChange} style={inputStyle}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <input type="text" name="language" placeholder="Language" value={courseData.language} onChange={handleChange} style={inputStyle} />
        </div>

        {/* --- Pricing & Rating --- */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="number" name="price" placeholder="Price (₹)" value={courseData.price} onChange={handleChange} required style={inputStyle} />
          <input type="number" name="discount" placeholder="Discount (%)" value={courseData.discount} onChange={handleChange} style={inputStyle} />
          <input type="number" name="rating" placeholder="Rating (0-5)" step="0.1" value={courseData.rating} onChange={handleChange} style={inputStyle} />
        </div>

        {/* --- Tags & Learning Outcomes --- */}
        <input type="text" name="tags" placeholder="Tags (comma separated e.g. react, node, mern)" value={courseData.tags} onChange={handleChange} style={inputStyle} />
        <textarea name="whatYouWillLearn" placeholder="What You Will Learn (comma separated points)" value={courseData.whatYouWillLearn} onChange={handleChange} rows="3" style={inputStyle} />

        {/* --- Thumbnail File Input --- */}
        <h3>Course Thumbnail</h3>
        <input type="file" accept="image/*" onChange={handleImageChange} required style={inputStyle} />
        {previewUrl && (
          <div style={{ margin: '10px 0' }}>
            <img src={previewUrl} alt="Thumbnail Preview" style={{ width: '200px', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
          </div>
        )}

        {/* --- Dynamic Lectures List --- */}
        <h3>Lectures ({totalLecturesCount} Total | {calculatedTotalDuration} mins)</h3>
        {lectures.map((lecture, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '6px', background: '#f9f9f9' }}>
            <h4>Lecture #{index + 1}</h4>
            <input type="text" name="title" placeholder="Lecture Title" value={lecture.title} onChange={(e) => handleLectureChange(index, e)} required style={inputStyle} />
            <input type="text" name="videoUrl" placeholder="Video URL / Link" value={lecture.videoUrl} onChange={(e) => handleLectureChange(index, e)} required style={inputStyle} />
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="number" name="duration" placeholder="Duration (mins)" value={lecture.duration} onChange={(e) => handleLectureChange(index, e)} style={inputStyle} />
              <input type="text" name="resources" placeholder="Resource Link / PDF" value={lecture.resources} onChange={(e) => handleLectureChange(index, e)} style={inputStyle} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', whitespace: 'nowrap' }}>
                <input type="checkbox" name="isPreview" checked={lecture.isPreview} onChange={(e) => handleLectureChange(index, e)} />
                Free Preview
              </label>
            </div>

            {lectures.length > 1 && (
              <button type="button" onClick={() => removeLecture(index)} style={{ background: '#ff4d4d', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px', marginTop: '5px' }}>
                Remove Lecture
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addLecture} style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px', marginBottom: '20px' }}>
          + Add Lecture
        </button>

        {/* --- Submit Button --- */}
        <div>
          <button type="submit" disabled={loading} style={{ width: '100%', background: '#007bff', color: '#fff', border: 'none', padding: '12px', fontSize: '16px', cursor: 'pointer', borderRadius: '4px' }}>
            {loading ? 'Uploading Course...' : 'Submit Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Quick basic inline styling helper
const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  boxSizing: 'border-box'
};

export default CourseForm;