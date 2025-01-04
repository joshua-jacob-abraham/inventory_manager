import '../styles/View.css';
import Heading from "../components/Heading.jsx"
import React,{useState, useContext} from 'react';
import { sampleData } from '../data/selectedData.js';
import ViewedItemsTable from '../components/Viewed.jsx';
import Check from '../components/Check.jsx';
import { BrandNameContext } from "../contexts/BrandNameContext.jsx";

function ViewStock() {
  const { brandName } = useContext(BrandNameContext);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleCheckChange = (checked) => {
    setIsDisabled(checked);
  };

  return (
		<div className="dashboard">
			<Heading name={brandName}/>

			<div className='viewstock'>
        <input type='text' placeholder='Store name' className='details storeView'/>
        <input type='text' placeholder='New or Returned' className='details act' disabled={isDisabled}/>
        <input type='date' className='dateView' disabled={isDisabled}/>

        <Check onChange={handleCheckChange}/>

        <button className='get'>GET</button>
        <button className='printView'>Save as PDF</button>
        
        <div className='viewedItems'>
          <ViewedItemsTable data={sampleData}/>
        </div>

      </div>
    </div>
  );
}

export default ViewStock;
