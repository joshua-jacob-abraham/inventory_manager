import "../styles/Return.css";
import Heading from "../components/Heading.jsx";
import CheckboxSize from "../components/CheckboxSize.jsx";
import React, { useState, useContext } from "react";
import SelectedReturn from "../components/SelectedReturn.jsx";
import { BrandNameContext } from "../contexts/BrandNameContext.jsx";
import axios from "axios";

let fetchedReturnedDesigns = [];

function ReturnStock() {
  const { brandName } = useContext(BrandNameContext);
  const sizes = ["12", "14", "16", "18", "20", "22", "24", "26", "28", "30"];

  const [data, setData] = useState({
    storeName: "",
    designCode: "",
    date: "",
    returnItems: [],
    storeKey: "",
    current_designs: [],
  });

  const [resetCheck, setReset] = useState(false);

  const handleCheckboxChange = (id, values) => {
    const size = parseInt(id, 10);

    setData((prev) => {
      const existingItem = prev.returnItems.find((item) => item.size === size);
      let updatedReturnItems;

      if (existingItem) {
        updatedReturnItems = prev.returnItems.map((item) =>
          item.size === size ? { ...item, ...values } : item
        );
      } else {
        updatedReturnItems = [...prev.returnItems, { size, ...values }];
      }

      const sanitizedItems = updatedReturnItems.map((item) => ({
        ...item,
        quantity: parseInt(item.quantity, 10) || 0,
      }));

      return {
        ...prev,
        returnItems: sanitizedItems,
      };
    });
  };

  const handleAddReturnItem = async () => {
    console.log(data.returnItems);
    console.log(data.storeName);
    console.log(data.designCode);

    if (
      !data.storeName.trim() ||
      !data.designCode.trim() ||
      !data.date.trim()
    ) {
      alert("Please fill in all the fields.");
      return; // Exit the function if any of the fields are empty
    }

    document.querySelectorAll(".detail").forEach((input) => input.blur());

    console.log("Add button clicked");

    const validReturnItems = data.returnItems.filter((item) => {
      const isQuantityValid =
        item.quantity !== "" &&
        item.quantity !== 0 &&
        !isNaN(parseInt(item.quantity, 10));
      return isQuantityValid;
    });

    let newStoreKey = "";
    let updatedDesigns = [];

    for (let item of validReturnItems) {
      console.log(item);
    }

    for (let item of validReturnItems) {
      const completeDesignCode = `${data.designCode}${item.size}`;
      const payload = {
        design_code: completeDesignCode,
        size: item.size,
        quantity: parseInt(item.quantity, 10),
      };

      console.log(payload);

      try {
        const response = await axios.post(
          "http://localhost:8000/add/return",
          payload,
          {
            params: {
              store_name: data.storeName,
              date: data.date,
            },
          }
        );

        const { store_key, current_designs } = response.data;

        newStoreKey = store_key;
        updatedDesigns = current_designs;
      } catch (error) {
        console.error(
          "Error adding return item:",
          error.response?.data || error.message
        );
      }
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/view/${newStoreKey}`
      );
      fetchedReturnedDesigns = response.data.data; //Store designs from response
      console.log(fetchedReturnedDesigns);
    } catch (error) {
      console.error(
        "Error fetching stock designs:",
        error.response?.data || error.message
      );
    }

    setData({
      storeName: data.storeName,
      designCode: "",
      date: data.date,
      returnItems: validReturnItems,
      storeKey: newStoreKey,
      current_designs: updatedDesigns,
    });

    document
      .querySelectorAll('.box .checkbox-wrapper-52 input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    setReset(true);

    setTimeout(() => {
      setReset(false);
    }, 0);
  };

  const handleSubmit = async () => {
    if (fetchedReturnedDesigns.length === 0) {
      alert("Please add designs.");
      return;
    }

    const action = "return";
    let flag = 1;
    try {
      const response = await axios.post(
        `http://localhost:8000/submit/${brandName}/${action}`,
        null,
        {
          params: {
            store_name: data.storeName,
            date: data.date,
          },
        }
      );

      console.log("Submission Response:", response.data);
      alert(response.data.message || "Submission successful!");
    } catch (error) {
      console.error(
        "Error submitting data:",
        error.response?.data || error.message
      );
      if (error.response?.data?.detail?.includes("1146 (42S02)")) {
        alert(
          "Shelf hasn't been created for this store. Add stocks to the shelf first."
        );
        flag = 1;
      } else {
        alert("Failed to submit return details.");
        flag = 0;
      }
    }

    if (flag == 1) {
      setData({
        storeName: "",
        designCode: "",
        date: "",
        returnItems: [],
        storeKey: "",
        current_designs: [],
      });

      fetchedReturnedDesigns = [];

      document
        .querySelectorAll('.box .checkbox-wrapper-52 input[type="checkbox"]')
        .forEach((checkbox) => {
          checkbox.checked = false;
        });

      setReset(true);

      setTimeout(() => {
        setReset(false);
      }, 0);
    }
  };

  return (
    <div className="dashboard">
      <Heading name={brandName} />

      <div className="stock">
        <input
          type="text"
          placeholder="Store name"
          className="details storeReturn"
          value={data.storeName}
          onChange={(e) => setData({ ...data, storeName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Code Base"
          className="details codeReturn"
          value={data.designCode}
          onChange={(e) => setData({ ...data, designCode: e.target.value })}
        />
        <input
          type="date"
          className="dateReturn"
          value={data.date}
          onChange={(e) => setData({ ...data, date: e.target.value })}
        />

        <div className="thesizesReturn">
          {sizes.map((size) => (
            <CheckboxSize
              key={size}
              id={size}
              label={`${size}"`}
              reset={resetCheck}
              onChange={handleCheckboxChange}
            />
          ))}
        </div>

        <div className="theactionReturn">
          <button className="actionRet actReturn" onClick={handleAddReturnItem}>
            Add
          </button>
          <button className="actionRet submitReturn" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        <div className="selectedItemsReturn">
          <SelectedReturn data={fetchedReturnedDesigns} />
        </div>
      </div>
    </div>
  );
}

export default ReturnStock;
