import React from 'react';
import "../styles/Selected.css";

const SelectedItemsTable = ({ data }) => {
  return (
    <div className="selected-table-container">
      <table className="selected-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Size</th>
            <th>Price</th>
            <th>Qnty</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.design_code}>
              <td>{item.design_code}</td>
              <td>{item.size}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SelectedItemsTable;
