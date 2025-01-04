import "../styles/Heading.css"

function Heading({name}){
  return (
    <>
      <div className="brand">
				{name}
			</div>
    </>
  );
}

export default Heading;