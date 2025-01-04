import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";
import { BrandNameContext } from "../contexts/BrandNameContext.jsx";

const Login = () => {
  const { brandName, setBrandName } = useContext(BrandNameContext);
  const navigate = useNavigate();
  
  const handleInputChange = (e) => {
    setBrandName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedBrandName = brandName.trim();
    if (trimmedBrandName) {
      setBrandName(trimmedBrandName);
      console.log("Updated Brand Name:", trimmedBrandName);
    }
    console.log("Form submitted");

    navigate('/dash');
  };

  return (
    <div className="loginDash">
      <h1>Brand Name</h1>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <input
            type="text"
            id="brandName"
            name="brandName"
            className="formDat"
            onBlur={handleInputChange}
            autoComplete='off'
            required
          />
        </div>

        <div className="submitSection">
          <button type="submit" className="submitbutton">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
