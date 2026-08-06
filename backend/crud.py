import json

from models import StockItem, ReturnedItem

def create_table(cursor, table_name: str):
    cursor.execute(
        f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            ID INT AUTO_INCREMENT PRIMARY KEY,

            ITEM VARCHAR(20),
            DESIGN_CODE VARCHAR(20) NOT NULL UNIQUE,
            SP_PER_ITEM INT,
            GST_RATE INT,
            HSN_CODE VARCHAR(10) DEFAULT '62092000',
            TAXABLE_AMOUNT_PER_ITEM FLOAT,
            TAX_AMOUNT_PER_ITEM FLOAT,
            QTY INT,
            SIZE VARCHAR(4),
            CUSTOM_FIELDS JSON,
            PER_SIZE_CUSTOM_FIELDS JSON
        )
        """
    )

def insert_item(cursor, table_name: str, stock_item: StockItem):
    custom_fields = None
    if stock_item.custom_fields:
        custom_fields = json.dumps(stock_item.custom_fields)

    per_size_custom_fields = None
    if stock_item.per_size_custom_fields:
        per_size_custom_fields = json.dumps(
            stock_item.per_size_custom_fields
        )

    # Check whether this design already exists
    cursor.execute(
        f"""
        SELECT qty
        FROM {table_name}
        WHERE design_code = %s
        """,
        (stock_item.design_code,)
    )

    result = cursor.fetchone()

    if result:
        # Design already exists -> increase quantity
        new_qty = result[0] + stock_item.quantity

        cursor.execute(
            f"""
            UPDATE {table_name}
            SET qty = %s
            WHERE design_code = %s
            """,
            (
                new_qty,
                stock_item.design_code
            )
        )

    else:
        # Design doesn't exist -> insert new row
        cursor.execute(
            f"""
            INSERT INTO {table_name}
            (
                item,
                design_code,
                sp_per_item,
                gst_rate,
                hsn_code,
                taxable_amount_per_item,
                tax_amount_per_item,
                qty,
                size,
                custom_fields,
                per_size_custom_fields
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                stock_item.item,
                stock_item.design_code,
                stock_item.price,
                stock_item.gst_rate,
                stock_item.hsn_code,
                stock_item.taxable_amount,
                stock_item.tax_amount,
                stock_item.quantity,
                stock_item.size,
                custom_fields,
                per_size_custom_fields
            )
        )

def insert_into_returned(cursor,table_name : str,store_key : str, returned_item : ReturnedItem):
    cursor.execute(
        f"""
        INSERT INTO {table_name} (item,design_code, sp_per_item, gst_rate, hsn_code, taxable_amount_per_item, tax_amount_per_item, qty, size)
        SELECT item,design_code, sp_per_item, gst_rate, hsn_code, taxable_amount_per_item, tax_amount_per_item, %s, size
        FROM {store_key} WHERE design_code = %s""",(returned_item.quantity, returned_item.design_code)
    )

def insert_into_records(cursor, storeName : str, action : str, date : str):
     cursor.execute(
            f"""
            INSERT INTO records (date,store,action) VALUES (%s, %s, %s)""", (date, storeName, action)
     )
