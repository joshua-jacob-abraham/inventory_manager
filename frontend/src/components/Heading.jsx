import "../styles/Heading.css";
import { useNavigate } from "react-router-dom";

function Heading({ name }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/dash");
  };

  const handleDoubleClick = () => {
    navigate("/home");
  };
  return (
    <>
      <div
        className="brand"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {name}
      </div>
    </>
  );
}

export default Heading;
