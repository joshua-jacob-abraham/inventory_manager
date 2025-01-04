import React, { useState } from "react";
import "../styles/Check.css";

const Check = ({onChange}) => {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    onChange(isChecked);
  };
  
  return (
    <div className="box1 checkShelf">
      <div className="checkbox-wrapper-521  sizeCheck">
        <label htmlFor="shelf" className="item">
          <input type="checkbox" id="shelf" className="hidden" checked={checked} onChange={handleCheckboxChange} />
          <label htmlFor="shelf" className="cbx">
            <svg width="14px" height="12px" viewBox="0 0 14 12">
              <polyline points="1 7.6 5 11 13 1"></polyline>
            </svg>
          </label>
          <label htmlFor="shelf" className="cbx-lbl itemSize checkLabel">
            Shelf
          </label>
        </label>
      </div>
    </div>
  );
};

export default Check;
