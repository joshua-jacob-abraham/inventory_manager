import React, { useState, useEffect } from "react";
import "../styles/CheckGST.css";

const CheckGST = ({onChange, checked: parentChecked }) => {
  const [checked, setChecked] = useState(false);
  
  useEffect(() => {
    setChecked(parentChecked);
  }, [parentChecked]);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    if (onChange) {
      onChange(isChecked);
    }
  };

  return (
    <div className="box1 checkGST">
      <div className="checkbox-wrapper-521  sizeCheck">
        <label htmlFor="shelf" className="item">
          <input type="checkbox" id="shelf" className="hidden" checked={checked} onChange={handleCheckboxChange} />
          <label htmlFor="shelf" className="cbx">
            <svg width="14px" height="12px" viewBox="0 0 14 12">
              <polyline points="1 7.6 5 11 13 1"></polyline>
            </svg>
          </label>
          <label htmlFor="shelf" className="cbx-lbl itemSize checkLabel">
            GST Appli.
          </label>
        </label>
      </div>
    </div>
  );
};

export default CheckGST;
