import React, { useState, useEffect, useRef } from "react";
import "../styles/Checkbox.css";

const Checkbox = ({
  id,
  label,
  onChange,
  reset = false,
  customFieldDefinitions,
  onAddCustomField,
}) => {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [checked, setChecked] = useState(false);
  const [perSizeCustomFields, setPerSizeCustomFields] = useState([]);

  const [addingCustomField, setAddingCustomField] = useState(false);
  const [newFieldInput, setNewFieldInput] = useState("");

  const inputRef = useRef(null);

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);

    if (!isChecked) {
      setPrice("");
      setQuantity("");

      const clearedCustomFields = perSizeCustomFields.map((field) => ({
        ...field,
        value: "",
      }));

      setPerSizeCustomFields(clearedCustomFields);
      resetPerSizeFieldsScroll();

      onChange(id, {
        price: "",
        quantity: "",
        per_size_custom_fields: clearedCustomFields,
      });
    }
  };

  useEffect(() => {
    if (reset) {
      setChecked(false);
      setPrice("");
      setQuantity("");

      const clearedCustomFields = perSizeCustomFields.map((field) => ({
        ...field,
        value: "",
      }));

      setPerSizeCustomFields(clearedCustomFields);
      resetPerSizeFieldsScroll();

      onChange(id, {
        price: "",
        quantity: "",
        per_size_custom_fields: clearedCustomFields,
      });
    }
  }, [reset]);

  const handleBlur = () => {
    onChange(id, {
      price,
      quantity,
      per_size_custom_fields: perSizeCustomFields,
    });
  };

  const handleAddCustomField = () => {
    const fieldName = newFieldInput.trim();

    if (fieldName !== "") {
      onAddCustomField(fieldName);
    }

    setNewFieldInput("");
    setAddingCustomField(false);
  };

  const perSizeFieldsRef = useRef(null);

  const resetPerSizeFieldsScroll = () => {
    perSizeFieldsRef.current?.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="box">
      <div className="checkbox-wrapper-52  sizeCheck">
        <label htmlFor={id} className="item">
          <input
            type="checkbox"
            id={id}
            className="hidden"
            checked={checked}
            onChange={handleCheckboxChange}
          />
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

      <div
        className="perSizeFields"
        ref={perSizeFieldsRef}
        onBlur={resetPerSizeFieldsScroll}
      >
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

        {customFieldDefinitions.map((field) => {
          const existingField = perSizeCustomFields.find(
            (item) => item.name === field,
          );

          return (
            <input
              key={field}
              type="text"
              placeholder={field}
              className="detail"
              value={existingField?.value || ""}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = e.target.value;

                setPerSizeCustomFields((prev) => {
                  const existing = prev.find((item) => item.name === field);

                  if (existing) {
                    return prev.map((item) =>
                      item.name === field ? { ...item, value } : item,
                    );
                  }

                  return [...prev, { name: field, value }];
                });
              }}
              disabled={!checked}
            />
          );
        })}

        {!addingCustomField ? (
          <p
            className="detail perSizeAddField"
            onClick={() => {
              setAddingCustomField(true);

              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
          >
            +
          </p>
        ) : (
          <input
            ref={inputRef}
            type="text"
            className="detail"
            placeholder="New Field"
            value={newFieldInput}
            onChange={(e) => setNewFieldInput(e.target.value)}
            onBlur={() => {
              setNewFieldInput("");
              setAddingCustomField(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddCustomField();
              }

              if (e.key === "Escape") {
                setNewFieldInput("");
                setAddingCustomField(false);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Checkbox;
