import React, { useState, useEffect } from "react";
import "../styles/Checkbox.css";

const CheckboxSize = ({ id, label, onChange, reset = false  }) => {  
  const [quantity, setQuantity] = useState("");
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (e) => {
      const isChecked = e.target.checked;
      setChecked(isChecked);
  
      if (!isChecked) {
        setQuantity("");
        onChange(id, { quantity: "" });
      }
    };
  
  useEffect(() => {
    if (reset) {
      setChecked(false);
      setQuantity("");
      onChange(id, { quantity: "" });
    }
  }, [reset]);

  const handleBlur = () => {
    onChange(id, { quantity });
  };

  return (
    <div className="box">
      <div className="checkbox-wrapper-52  sizeCheck">
        <label htmlFor={id} className="item">
          <input type="checkbox" id={id} className="hidden" checked={checked} onChange={handleCheckboxChange}/>
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

      <input
        type="text"
        placeholder="Quantity"
        className="qtyInReturn"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        onBlur={handleBlur}     
        disabled={!checked}
      />
    </div>
  );
};

export default CheckboxSize;
