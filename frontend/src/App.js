import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [matchedCourses, setMatchedCourses] = useState([]);

  // Fetch courses from the backend API
  const fetchCourses = (query = '', category = '') => {
    const url = `http://localhost:5000/api/courses?query=${query}&category=${category}`;
    axios.get(url)
      .then(response => {
        setCourses(response.data.data);
        setCategories(response.data.categories);
      })
      .catch(error => {
        console.error("Error fetching courses:", error);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle search query
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    fetchCourses(e.target.value, selectedCategory);
    fetchMatchedCourses(e.target.value);  // Fetch matched courses based on the search query
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    fetchCourses(searchQuery, e.target.value);
  };

  // Fetch matched courses for a selected course
  const fetchMatchedCourses = (query) => {
    const url = `http://localhost:5000/api/courses?query=${query}`;
    axios.get(url)
      .then(response => {
        setMatchedCourses(response.data.data.filter(course => course.category === 'Programming')); // Filter for Programming courses
      })
      .catch(error => {
        console.error("Error fetching matched courses:", error);
      });
  };

  // Add course to cart
  const addToCart = (course) => {
    setCart([...cart, course]);
    alert(`${course.name} added to cart!`);
  };

  // Remove course from cart
  const removeFromCart = (courseId) => {
    setCart(cart.filter(item => item.id !== courseId));
  };

  // Handle checkout (this can be expanded later with actual checkout logic)
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
    } else {
      alert("Proceeding to checkout...");
    }
  };

  return (
    <div className="container">
      <h1>Educational E-Commerce Site</h1>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <select onChange={handleCategoryChange} value={selectedCategory}>
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="course-list">
        {courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.name}</h3>
              <p>{course.instructor}</p>
              <p>{course.description}</p>
              <p>${course.price}</p>
              <button onClick={() => addToCart(course)}>Buy Now</button>
              <button onClick={() => fetchMatchedCourses(course.name)}>View Similar Courses</button>
            </div>
          ))
        ) : (
          <p>No courses found.</p>
        )}
      </div>

      {/* Matched Courses Section */}
      {matchedCourses.length > 0 && (
        <div className="matched-courses-section">
          <h2>Recommended Courses</h2>
          <div className="matched-courses-list">
            {matchedCourses.map(course => (
              <div key={course.id} className="matched-course-card">
                <h4>{course.name}</h4>
                <p>{course.instructor}</p>
                <p>{course.description}</p>
                <p>${course.price}</p>
                <button onClick={() => addToCart(course)}>Buy Now</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Section */}
      <div className="cart-section">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>No courses in your cart.</p>
        ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <button className="checkout" onClick={handleCheckout}>Proceed to Checkout</button>
        )}
      </div>
    </div>
  );
};

export default App;
