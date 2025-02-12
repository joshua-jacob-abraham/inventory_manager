import "../styles/Dash.css";
import { useContext } from "react";
import Heading from "../components/Heading.jsx"
import Login from "../components/Login.jsx";
import "../styles/Home.css";
import { BrandNameContext } from "../contexts/BrandNameContext.jsx";

function Home() {
	const { brandName, setBrandName } = useContext(BrandNameContext);

  return (
		<div className="dashboard">
			<Heading name={'inventerogenesis'}/>
			<div className="signupDash">
				<Login setBrandName={brandName} />
			</div>
		</div>
  );
}

export default Home;
