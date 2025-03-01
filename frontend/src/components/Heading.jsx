import "../styles/Heading.css";

function Heading({ name, onClick, onDoubleClick}) {
  return (
    <>
      <div
        className="brand"
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        {name}
      </div>
    </>
  );
}

export default Heading;
