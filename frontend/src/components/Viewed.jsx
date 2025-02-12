import React from 'react';
import "../styles/Selected.css";

const ViewedItemsTable = ({ data, isDisabled }) => {
  return (
    <div className="selected-table-container">
      <table className="selected-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Size</th>
            <th>Price</th>
            <th>Qnty</th>
            {!isDisabled && (
              <>
                <th>GST Rate</th>
                <th>Taxable Amount</th>
                <th>Tax Amount</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.design_code}>
              <td>{item.design_code}</td>
              <td>{item.size}</td>
              <td>{item.sp_per_item}</td>
              <td>{item.qty}</td>
              {!isDisabled && (
                <>
                  <td>{item.gst_rate}%</td>
                  <td>{item.taxable_amount}</td>
                  <td>{item.tax_amount}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewedItemsTable;
