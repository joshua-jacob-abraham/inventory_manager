import React, { useState, useEffect } from "react";
import "../styles/Checkbox.css";

const Checkbox = ({ id, label, onChange, reset = false }) => {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);

    if (!isChecked) {
      setPrice("");
      setQuantity("");
      onChange(id, { price: "", quantity: "" });
    }
  };

  useEffect(() => {
    if (reset) {
      setChecked(false);
      setPrice("");
      setQuantity("");
      onChange(id, { price: "", quantity: "" });
    }
  }, [reset]);

  const handleBlur = () => {
    onChange(id, { price, quantity });
  };
  
  return (
    <div className="box">
      <div className="checkbox-wrapper-52  sizeCheck">
        <label htmlFor={id} className="item">
          <input type="checkbox" id={id} className="hidden" checked={checked} onChange={handleCheckboxChange} />
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
        placeholder="Price"
        className="detail"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onBlur={handleBlur}
        disabled={!checked}
      />
      <input
        type="text"
        placeholder="Quantity"
        className="detail"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        onBlur={handleBlur}     
        disabled={!checked}
      />
    </div>
  );
};

export default Checkbox;
