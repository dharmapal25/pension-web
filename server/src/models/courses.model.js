// const mongoose = require("mongoose");

// const MONGO_URI = process.env.MONGO_URI;

const dummyCourses = [
  {
    title: "Complete Web Development Bootcamp",
    description: "HTML, CSS, JS, React aur Node.js seekho zero se hero tak.",
    thumbnail: "https://picsum.photos/seed/webdev/400/250",
    price: 499,
    category: "Web Development",
    instructor: { name: "Rahul Sharma", bio: "Full-stack developer, 6 yrs experience" },
    sections: [
      {
        title: "Introduction",
        lectures: [
          { title: "Course Overview", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: 5 },
          { title: "Setting Up Environment", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: 10 },
        ],
      },
      {
        title: "HTML Basics",
        lectures: [
          { title: "HTML Tags", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: 15 },
        ],
      },
    ],
    reviews: [
      { userId: "demoUser1", rating: 5, comment: "Bahut accha course hai!" },
    ],
  },
  {
    title: "DSA Masterclass",
    description: "Data Structures aur Algorithms interview-ready banane ke liye.",
    thumbnail: "https://picsum.photos/seed/dsa/400/250",
    price: 0,
    category: "Programming",
    instructor: { name: "Priya Verma", bio: "Ex-Google SDE, DSA mentor" },
    sections: [
      {
        title: "Arrays",
        lectures: [
          { title: "Array Basics", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: 12 },
          { title: "Two Pointer Technique", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: 20 },
        ],
      },
    ],
    reviews: [],
  },
  {
    title: "React + Node.js Full Stack Project",
    description: "Ek real-world MERN project banao end to end.",
    thumbnail: "https://picsum.photos/seed/mern/400/250",
    price: 799,
    category: "Web Development",
    instructor: { name: "Aman Gupta", bio: "MERN stack instructor" },
    sections: [
      {
        title: "Backend Setup",
        lectures: [
          { title: "Express Server Setup", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: 18 },
        ],
      },
    ],
    reviews: [{ userId: "demoUser2", rating: 4, comment: "Good but pacing thodi fast hai." }],
  },
  {
    title: "Python for Beginners",
    description: "Python programming basics se advanced tak.",
    thumbnail: "https://picsum.photos/seed/python/400/250",
    price: 299,
    category: "Programming",
    instructor: { name: "Sneha Reddy", bio: "Python developer & educator" },
    sections: [
      {
        title: "Getting Started",
        lectures: [
          { title: "Installing Python", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: 8 },
        ],
      },
    ],
    reviews: [],
  },
];

module.exports = {dummyCourses}