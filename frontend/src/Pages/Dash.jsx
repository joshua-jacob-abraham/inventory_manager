import "../styles/Dash.css";
import {useContext} from "react";
import {BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
import Heading from "../components/Heading.jsx"
import { BrandNameContext } from "../contexts/BrandNameContext.jsx";

function Dash() {
	const navigate = useNavigate();
	const { brandName } = useContext(BrandNameContext);

	console.log('Dash Page Brand Name:', brandName);

  return (
		<div className="dashboard">
			<Heading name={brandName}/>
			<div className="accessibility">
				<button className="thebutton new" onClick={()=> navigate("/add-new")}>Add New Stock</button>
				<button className="thebutton return" onClick={()=> navigate("/add-returned")}>Add Stock Returned</button>
				<button className="thebutton view" onClick={()=> navigate("/view")}>View Saved Stock</button>
			</div>
		</div>
  );
}

export default Dash;
