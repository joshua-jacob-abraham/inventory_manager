import "../styles/Heading.css";
import { useNavigate } from "react-router-dom";

function Heading({ name }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/dash");
  };
  return (
    <>
      <div className="brand" onClick={handleClick}>
        {name}
      </div>
    </>
  );
}

export default Heading;
