from pydantic import BaseModel
from typing import Optional
from datetime import date

#define schemas for data transfer(how data should be structured.)

class StockItem(BaseModel):
    item : str
    design_code : str
    size : int
    price : float
    quantity : int
    gst_applicable : bool
    gst_rate: Optional[int] = None
    hsn_code: Optional[str] = "62092000"
    taxable_amount: Optional[float] = None
    tax_amount: Optional[float] = None

    def calculate_gst(self):
        if self.price >= 1000:
            self.gst_rate = 12
        else:
            self.gst_rate = 5

    def calculate_tax(self):
        self.calculate_gst()
        self.taxable_amount = round(self.price * (100 / (100 + self.gst_rate)), 2)
        self.tax_amount = round(self.price - self.taxable_amount, 2)     

    def to_dict(self):
        return {
            'item' : self.item,
            'design_code': self.design_code,
            'size': self.size,
            'price': self.price,
            'quantity': self.quantity,
            'gst_applicable' : self.gst_applicable,
            'gst_rate': self.gst_rate,
            'hsn_code': self.hsn_code,
            'taxable_amount': self.taxable_amount,
            'tax_amount': self.tax_amount,
        }

class ReturnedItem(BaseModel):
    design_code : str
    size : int
    quantity : int