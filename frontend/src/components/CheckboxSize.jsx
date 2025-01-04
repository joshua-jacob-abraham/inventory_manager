import React from "react";
import "../styles/Checkbox.css";


const CheckboxSize = ({ id, label }) => {  
  return (
    <div className="box">
      <div className="checkbox-wrapper-52  sizeCheck">
        <label htmlFor={id} className="item">
          <input type="checkbox" id={id} className="hidden"/>
          <label htmlFor={id} className="cbx">
            <svg width="14px" height="12px" viewBox="0 0 14 12">
              <polyline points="1 7.6 5 11 13 1"></polyline>
            </svg>
          </label>
          <label htmlFor={id} className="cbx-lbl itemSize">
            {label}
          </label>
        </label>
      </div>
    </div>
  );
};

export default CheckboxSize;
