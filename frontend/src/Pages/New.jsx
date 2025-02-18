import "../styles/New.css";
import React, { useState, useContext } from "react";
import Heading from "../components/Heading.jsx";
import Checkbox from "../components/Checkbox.jsx";
import SelectedItemsTable from "../components/Selected.jsx";
import axios from "axios";
import CheckGST from "../components/CheckGST.jsx";
import { BrandNameContext } from "../contexts/BrandNameContext.jsx";

let fetchedDesigns = [];

function NewStock() {
  const { brandName } = useContext(BrandNameContext);

  const sizes = ["12", "14", "16", "18", "20", "22", "24", "26", "28", "30"];

  const [data, setData] = useState({
    storeName: "",
    designCode: "",
    item: "",
    date: "",
    stockItems: [],
    storeKey: "",
    current_designs: [],
    gstApplicable: false,
  });

  const [resetCheck, setReset] = useState(false);

  const recalculateGST = (stockItems, gstApplicable) => {
    return stockItems.map((item) => {
      const gst_rate = gstApplicable ? (item.price < 1000 ? 5 : 12) : 0;

      const taxable_amount =
        gst_rate > 0 ? item.price / (1 + gst_rate / 100) : item.price;
      const tax_amount = item.price - taxable_amount;

      return {
        ...item,
        gst_rate,
        gst_applicable: gstApplicable,
        taxable_amount: parseFloat(taxable_amount.toFixed(2)),
        tax_amount: parseFloat(tax_amount.toFixed(2)),
      };
    });
  };

  const handleCheckboxChange = (id, values) => {
    const size = parseInt(id, 10);

    setData((prev) => {
      const existingItem = prev.stockItems.find((item) => item.size === size);
      let updatedStockItems;

      if (existingItem) {
        updatedStockItems = prev.stockItems.map((item) =>
          item.size === size ? { ...item, ...values } : item
        );
      } else {
        updatedStockItems = [...prev.stockItems, { size, ...values }];
      }

      const sanitizedItems = updatedStockItems.map((item) => ({
        ...item,
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity, 10) || 0,
      }));

      // Recalculate GST after adding/updating stock item
      return {
        ...prev,
        stockItems: recalculateGST(sanitizedItems, prev.gstApplicable),
      };
    });
  };

  const updateGSTForStockItems = (isGSTApplicable) => {
    setData((prev) => ({
      ...prev,
      gstApplicable: isGSTApplicable,
      stockItems: recalculateGST(prev.stockItems, isGSTApplicable),
    }));
  };

  const handleAddStockItem = async () => {
    if (
      !data.storeName.trim() ||
      !data.designCode.trim() ||
      !data.date.trim() ||
      !data.item.trim()
    ) {
      alert("Please fill in all the fields.");
      return; // Exit the function if any of the fields are empty
    }

    document.querySelectorAll(".detail").forEach((input) => input.blur());

    console.log("Add button clicked");

    const validStockItems = data.stockItems.filter((item) => {
      const isPriceValid =
        item.price !== "" && item.price !== 0 && !isNaN(parseFloat(item.price));
      const isQuantityValid =
        item.quantity !== "" &&
        item.quantity !== 0 &&
        !isNaN(parseInt(item.quantity, 10));
      return isPriceValid && isQuantityValid;
    });

    let newStoreKey = "";
    let updatedDesigns = [];

    for (let item of validStockItems) {
      console.log(item);
    }

    for (let item of validStockItems) {
      const completeDesignCode = `${data.designCode}${item.size}`;
      const payload = {
        item: data.item,
        design_code: completeDesignCode,
        size: item.size,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity, 10),
        gst_applicable: item.gst_applicable || false,
        gst_rate: item.gst_rate || 0,
        hsn_code: item.hsn_code || "62092000",
        taxable_amount: item.taxable_amount || null,
        tax_amount: item.tax_amount || 0,
      };

      console.log(payload);

      try {
        const response = await axios.post(
          "http://localhost:8000/add/new",
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
          "Error adding stock item:",
          error.response?.data || error.message
        );
      }
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/view/${newStoreKey}`
      );
      fetchedDesigns = response.data.data; //Store designs from response
    } catch (error) {
      console.error(
        "Error fetching stock designs:",
        error.response?.data || error.message
      );
    }

    setData({
      storeName: data.storeName,
      designCode: "",
      item: "",
      date: data.date,
      stockItems: validStockItems,
      storeKey: newStoreKey,
      current_designs: updatedDesigns,
      gstApplicable: data.gstApplicable,
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
    if (fetchedDesigns.length === 0) {
      alert("Please add designs.");
      return;
    }

    const action = "new";

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
      alert("Failed to submit stock details.");
    }

    setData({
      storeName: "",
      designCode: "",
      item: "",
      date: "",
      stockItems: [],
      storeKey: "",
      current_designs: [],
      gstApplicable: false,
    });

    fetchedDesigns = [];

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

  return (
    <div className="dashboard">
      <Heading name={brandName} />

      <div className="newstock">
        <input
          type="text"
          placeholder="Store name"
          className="details store"
          value={data.storeName}
          onChange={(e) => setData({ ...data, storeName: e.target.value })}
        />

        <input
          type="text"
          placeholder="Design Code Base"
          className="details code"
          value={data.designCode}
          onChange={(e) => setData({ ...data, designCode: e.target.value })}
        />

        <input
          type="text"
          placeholder="Item"
          className="details itemtype"
          value={data.item}
          onChange={(e) => setData({ ...data, item: e.target.value })}
        />

        <input
          type="date"
          className="date"
          value={data.date}
          onChange={(e) => setData({ ...data, date: e.target.value })}
        />

        <CheckGST
          checked={data.gstApplicable}
          onChange={(isChecked) => updateGSTForStockItems(isChecked)}
        />

        <div className="thesizes">
          {sizes.map((size) => (
            <Checkbox
              key={size}
              id={size}
              label={`${size}"`}
              reset={resetCheck}
              onChange={handleCheckboxChange}
            />
          ))}

          <div className="theaction">
            <button className="action actAdd" onClick={handleAddStockItem}>
              Add
            </button>

            <button className="action actSubmit" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>

        <div className="selectedItems">
          <SelectedItemsTable data={fetchedDesigns} />
        </div>
      </div>
    </div>
  );
}

export default NewStock;
