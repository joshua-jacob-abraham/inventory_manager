import "../styles/View.css";
import axios from "axios";
import Heading from "../components/Heading.jsx";
import React, { useState, useContext } from "react";
import ViewedItemsTable from "../components/Viewed.jsx";
import Check from "../components/Check.jsx";
import { BrandNameContext } from "../contexts/BrandNameContext.jsx";

function ViewStock() {
  const { brandName } = useContext(BrandNameContext);
  const [isDisabled, setIsDisabled] = useState(false);

  const [storeName, setStoreName] = useState("");
  const [action, setAction] = useState("");
  const [date, setDate] = useState("");
  const [sampleData, setSampleData] = useState([]);

  const handleCheckChange = (checked) => {
    setIsDisabled(checked);
    if (!checked) {
      setSampleData([]);
    }
  };

  const handlePrint = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/print/${brandName}`,
        null,
        {
          params: {
            store_name: storeName,
            date: date,
            action: action,
          },
          responseType: "blob",
        }
      );

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      const pdfUrl = URL.createObjectURL(pdfBlob);

      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `${storeName}_${date}_${action}_stock.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(pdfUrl);
      // alert(response.data.message || "Saved as pdf!");
    } catch (error) {
      console.error(
        "Error printing as pdf:",
        error.response?.data || error.message
      );
      alert("Failed to save pdf.");
    }
  };

  const handleGet = async () => {
    if (isDisabled) {
      try {
        const response = await axios.get(
          `http://localhost:8000/shelf/${brandName}/${storeName}`
        );

        setSampleData(response.data.data);
        console.log(response);
        if (response.data.data.length == 0) {
          alert(response.data.message);
        }
      } catch (error) {
        console.error(
          "Error viewing shelf:",
          error.response?.data || error.message
        );
        alert("Failed to view shelf.");
      }
    } else {
      try {
        const response = await axios.get(
          `http://localhost:8000/view_action/${brandName}/${storeName}/${date}/${action}`
        );

        setSampleData(response.data.data);
        console.log(response);
        if (response.data.data.length == 0) {
          alert(response.data.message);
        }
      } catch (error) {
        console.error(
          "Error viewing the data:",
          error.response?.data || error.message
        );
        alert("Failed to view the data.");
      }
    }
  };

  return (
    <div className="dashboard">
      <Heading name={brandName} />

      <div className="viewstock">
        <input
          type="text"
          placeholder="Store name"
          className="details storeView"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
        />
        <input
          type="text"
          placeholder="new or return or sales"
          className="details act"
          disabled={isDisabled}
          value={action}
          onChange={(e) => setAction(e.target.value)}
        />
        <input
          type="date"
          className="dateView"
          disabled={isDisabled}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Check onChange={handleCheckChange} />

        <button className="get" onClick={handleGet}>
          GET
        </button>
        <button
          className="printView"
          onClick={handlePrint}
          disabled={isDisabled}
        >
          Save as PDF
        </button>

        <div className="viewedItems">
          <ViewedItemsTable data={sampleData} isDisabled={isDisabled} />
        </div>
      </div>
    </div>
  );
}

export default ViewStock;
