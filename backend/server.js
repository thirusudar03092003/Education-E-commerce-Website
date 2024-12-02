const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Sample course data
const courses = [
    { id: 1, name: 'Introduction to Python Programming', instructor: 'Dr. Smith', description: 'Learn Python basics.', price: 49.99, category: 'Programming' },
    { id: 2, name: 'Advanced Machine Learning', instructor: 'Prof. Johnson', description: 'Deep dive into machine learning algorithms.', price: 79.99, category: 'Data Science' },
    { id: 3, name: 'Web Development Bootcamp', instructor: 'Sarah Wilson', description: 'Become a full-stack web developer.', price: 59.99, category: 'Web Development' },
    { id: 4, name: 'Data Analysis with R', instructor: 'John Doe', description: 'Analyze data with R programming.', price: 39.99, category: 'Data Science' },
    { id: 5, name: 'UX/UI Design Fundamentals', instructor: 'Jane Smith', description: 'Learn the basics of UX/UI design.', price: 49.99, category: 'Design' },
    { id: 6, name: 'Digital Marketing 101', instructor: 'Emily Johnson', description: 'Learn digital marketing strategies.', price: 29.99, category: 'Business' },
    { id: 7, name: 'Java Programming for Beginners', instructor: 'Mark Wilson', description: 'Master the basics of Java programming.', price: 44.99, category: 'Programming' },
    { id: 8, name: 'React and Redux Crash Course', instructor: 'Angela Lee', description: 'Build modern web apps with React and Redux.', price: 59.99, category: 'Web Development' }
  ];
  

const categories = ['Programming', 'Data Science', 'Web Development', 'Business', 'Design'];

app.get('/', (req, res) => {
  res.send('Backend is working');
});

app.get('/api/courses', (req, res) => {
    const { query, category } = req.query;
    let filteredCourses = courses;
  
    // Apply search query filter only if query is non-empty
    if (query && query.trim()) {
      filteredCourses = filteredCourses.filter(course =>
        course.name.toLowerCase().includes(query.toLowerCase()) ||
        course.instructor.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    // Apply category filter only if category is non-empty
    if (category && category.trim()) {
      filteredCourses = filteredCourses.filter(course => course.category === category);
    }
  
    res.json({
      status: 'success',
      total: filteredCourses.length,
      data: filteredCourses,
      categories
    });
  });
  
  // New route to fetch matched courses
  app.get('/api/match-courses', (req, res) => {
    const { courseId, query } = req.query;
  
    const course = courses.find(c => c.id === parseInt(courseId));
    if (!course) return res.status(404).json({ message: "Course not found" });
  
    // Start by finding courses with the same category
    const matchedCourses = courses.filter(c => {
      return (
        c.category === course.category || // Same category
        c.name.toLowerCase().includes(query.toLowerCase()) || // Matches the search term in name
        c.description.toLowerCase().includes(query.toLowerCase()) // Matches the search term in description
      );
    }).filter(c => c.id !== parseInt(courseId)); // Exclude the current course
  
    res.json({
      status: 'success',
      total: matchedCourses.length,
      data: matchedCourses
    });
  });
  
  

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
