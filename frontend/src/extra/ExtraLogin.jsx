import React, { useState } from 'react';
import "../styles/Login.css"

const ExtraLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'brandName') {
      setBrandName(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      console.log('Sign Up Data:', formData);
    } else {
      console.log('Login Data:', { email: formData.email, password: formData.password });
    }
  };

  return (
    <div className="loginDash">
      <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>

      <form onSubmit={handleSubmit} className="form">
        {isSignUp && (
          <div className="form-group">
            <input
              type="text"
              id="brandName"
              name="brandName"
              className='formDat'
              value={formData.brandName}
              onChange={handleInputChange}
              placeholder="Brand name"
            />
          </div>
        )}

        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            className='formDat'
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            className='formDat'
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
          />
        </div>

        {isSignUp && (
          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className='formDat'
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
              required
            />
          </div>
        )}
      </form>

      <div className='submitSection'>
        <button type="submit" className="submitbutton">
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>

        <p>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default ExtraLogin;
