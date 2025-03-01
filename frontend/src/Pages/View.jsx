import "../styles/View.css";
import axios from "axios";
import Heading from "../components/Heading.jsx";
import React, { useState, useContext } from "react";
import ViewedItemsTable from "../components/Viewed.jsx";
import Check from "../components/Check.jsx";
import { BrandNameContext } from "../contexts/BrandNameContext.jsx";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";

function ViewStock() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dash");
  };

  const handleDoubleClick = () => {
    navigate("/home");
  };

  const { brandName } = useContext(BrandNameContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handlePrintPDF = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8000/printPDF/${brandName}`,
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
    } catch (error) {
      console.error(
        "Error printing as pdf:",
        error.response?.data || error.message
      );
      setLoading(false);
      alert("Failed to save pdf.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintExcel = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8000/printExcel/${brandName}`,
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

      const excelBlob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const excelUrl = URL.createObjectURL(excelBlob);

      const a = document.createElement("a");
      a.href = excelUrl;
      a.download = `${storeName}_${date}_${action}_stock.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(excelUrl);
    } catch (error) {
      console.error(
        "Error exporting to Excel:",
        error.response?.data || error.message
      );
      setLoading(false);
      alert("Failed to save Excel file.");
    } finally {
      setLoading(false);
    }
  };

  const handleGet = async () => {
    if (isDisabled) {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/shelf/${brandName}/${storeName}`
        );

        setSampleData(response.data.data);
        console.log(response);
        if (response.data.data.length == 0) {
          setLoading(false);
          alert(response.data.message);
        }
      } catch (error) {
        console.error(
          "Error viewing shelf:",
          error.response?.data || error.message
        );
        setLoading(false);
        alert("Failed to view shelf.");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/view_action/${brandName}/${storeName}/${date}/${action}`
        );

        setSampleData(response.data.data);
        console.log(response);
        if (response.data.data.length == 0) {
          setLoading(false);
          alert(response.data.message);
        }
      } catch (error) {
        console.error(
          "Error viewing the data:",
          error.response?.data || error.message
        );
        setLoading(false);
        alert("Failed to view the data.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="dashboard">
      <Heading
        name={brandName}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      />

      {loading && <Loading />}

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
          className="printPDF"
          onClick={handlePrintPDF}
          disabled={isDisabled}
        >
          Save as PDF
        </button>
        <button
          className="printExcel"
          onClick={handlePrintExcel}
          disabled={isDisabled}
        >
          Save as Excel
        </button>

        <div className="viewedItems">
          <ViewedItemsTable data={sampleData} isDisabled={isDisabled} />
        </div>
      </div>
    </div>
  );
}

export default ViewStock;
