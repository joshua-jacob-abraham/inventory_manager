import '../styles/Return.css';
import Heading from "../components/Heading.jsx"
import CheckboxSize from '../components/CheckboxSize.jsx';
import React, { useState, useContext } from 'react';
import { sampleData } from '../data/selectedData.js';
import SelectedItemsTable from '../components/SelectedReturn.jsx';
import { BrandNameContext } from "../contexts/BrandNameContext.jsx";

function ReturnStock() {
  const { brandName } = useContext(BrandNameContext);
  const sizes = ["12", "14", "16", "18", "20", "22", "24", "26", "28", "30"];

  return (
		<div className="dashboard">
			<Heading name={brandName}/>

			<div className='stock'>
        <input type='text' placeholder='Store name' className='details storeReturn'/>
        <input type='text' placeholder='Design Code Base' className='details codeReturn'/>
        <input type='date' className='dateReturn'/>

        <div className='thesizesReturn'>
          {sizes.map((size) => (
            <CheckboxSize key={size} id={`${size}inch`} label={`${size}"`} />
          ))}
        </div>

        <div className='theactionReturn'>
          <button className='action actAdd'>Add</button>
          <button className='action submitReturn'>Submit</button>
        </div>

        <div className='selectedItemsReturn'>
          <SelectedItemsTable data={sampleData}/>
        </div>

      </div>
		
    </div>
  );
}

export default ReturnStock;
