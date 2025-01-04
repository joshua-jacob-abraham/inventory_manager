from crud import *
from models import StockItem,ReturnedItem
import mysql.connector as ms
from datetime import datetime
from fastapi import HTTPException
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors
import re

temp_stock_data = {}

def is_valid_name(name: str) -> bool:
    return re.match("^[A-Za-z0-9_]+$", name) is not None

def add_design_temp(store_key : str, stock_item : StockItem):
    if store_key not in temp_stock_data:
        temp_stock_data[store_key] = []
    temp_stock_data[store_key].append(stock_item)
    return temp_stock_data[store_key]

def submit_new_stock(store_name : str, store_key: str, table_name: str, connection):
    if store_key not in temp_stock_data or not temp_stock_data[store_key]:
        raise ValueError("No designs to submit.")

    cursor = connection.cursor()

    create_table(cursor, table_name)

    for stock_item in temp_stock_data[store_key]:
        insert_item(cursor, table_name, stock_item)

    connection.commit()
    cursor.close()
    
    update_store(store_name,store_key,True,connection)
    
    del temp_stock_data[store_key]

#store name as table name
#status 1 for new stock, 0 for returned.
def update_store(store_name : str, store_key : str, status : bool, connection):
    cursor = connection.cursor()
    create_table(cursor,store_name)
    connection.commit()

    if(status):
        for stock_item in temp_stock_data[store_key]:
            insert_item(cursor,store_name,stock_item)
            connection.commit()
    else:
        for returned_item in temp_stock_data[store_key]:
            # if(returned_item.quantity == 1):
            #     cursor.execute(
            #         f"""
            #         DELETE FROM {store_name} WHERE design_code = {stock_item.design_code}"""
            #     )
            #     connection.commit()
            # else:
            cursor.execute(
                f"""
                UPDATE {store_name} SET qty = qty - {returned_item.quantity} WHERE design_code = %s""",(returned_item.design_code,)
            )
            connection.commit()

        cursor.execute(
            f"""DELETE FROM {store_name} WHERE qty = 0"""
        )

        connection.commit()
    cursor.close()

#view shelf
def from_shelf(store_name : str,connection):
    cursor = connection.cursor(dictionary = True)
    
    try:
        cursor.execute(f"""SELECT item,design_code, sp_per_item, qty, size FROM {store_name}""")
        shelf = cursor.fetchall()
        return shelf
    except ms.errors.ProgrammingError as e:
        raise Exception(f"Error fetching data: {e}")
    except Exception as e:
        raise Exception(f"Unexpected error: {e}")
    finally:
        cursor.close()

#view action on a date
def lookup(store_name : str, date : str, action : str, connection):
    cursor = connection.cursor(dictionary = True)
    
    date_obj = datetime.strptime(date,"%Y-%m-%d")
    formatted_date = date_obj.strftime("%d_%b_%Y")
    
    the_table = ""
    if action == "new":
        the_table = f"{store_name}_{formatted_date}_new_stock"
    elif action == "return":
        the_table = f"{store_name}_{formatted_date}_return_stock"    

    try:
        cursor.execute(f"""SELECT * FROM {the_table}""")
        shelf = cursor.fetchall()
        return shelf
    except ms.errors.ProgrammingError as e:
        if e.errno == 1146:
            return None
        raise Exception(f"Error fetching data: {e}")
    except Exception as e:
        raise Exception(f"Unexpected error: {e}")
    finally:
        cursor.close()

#return logic
def add_design_temp_return(store_key : str, returned_item : ReturnedItem):
    if store_key not in temp_stock_data:
        temp_stock_data[store_key] = []
    temp_stock_data[store_key].append(returned_item)
    return temp_stock_data[store_key]

def submit_returned_stock(store_name : str, store_key: str, table_name: str, date : str, connection):
    if store_key not in temp_stock_data or not temp_stock_data[store_key]:
        raise ValueError("No designs to submit.")

    cursor = connection.cursor()

    create_table(cursor, table_name)
    new_store_key = f"{store_name}"
    for returned_item in temp_stock_data[store_key]:
        insert_into_returned(cursor, table_name, new_store_key, returned_item)

    connection.commit()
    cursor.close()
    
    update_store(store_name,store_key,False,connection)
    
    del temp_stock_data[store_key]

#remove from temp
def remove_from_temp(store_key : str, code : str):
    index = -1
    flag = 0

    if store_key not in temp_stock_data or not temp_stock_data[store_key]:
        raise HTTPException(status_code=404, detail="Temp list is empty")

    for item in temp_stock_data[store_key]:
        index = index + 1
        if item.design_code == code:
            break
    else:
        flag = 1
        raise ValueError(f"Design code '{code}' not found for store key '{store_key}'.")
    
    if flag == 0:
        del temp_stock_data[store_key][index]
    return temp_stock_data[store_key]    

#pdf
from reportlab.lib.pagesizes import letter, landscape

def generate_pdf(store_name: str, date: str, action: str, stock_data: list) -> str:
    date_obj = datetime.strptime(date, "%Y-%m-%d")
    formatted_date = date_obj.strftime("%d_%b_%Y")
    
    file_name = f"{store_name.capitalize()}_{formatted_date}_{action.capitalize()}_Stock.pdf"
    file_path = f"../../pdfs/{file_name}"

    margin_top = 36
    margin_bottom = 36
    margin_left = 36
    margin_right = 36

    page_width,page_height = landscape(letter)
    available_width = page_width - margin_left - margin_right

    pdf = SimpleDocTemplate(
        file_path, 
        pagesize=landscape(letter),
        rightMargin=margin_right,
        leftMargin=margin_left,
        topMargin=margin_top,
        bottomMargin=margin_bottom
    )

    heading_style = ParagraphStyle(
        name="Heading1",
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        alignment=1,
        textColor="black",
        spaceAfter=10,
    )
    subheading_style = ParagraphStyle(
        name="Heading2",
        fontSize=14,
        fontName="Helvetica",
        leading=18,
        alignment=1,
        textColor="darkgray",
        spaceAfter=20,
    )

    main_heading = Paragraph("MOMSNFAIRIES", heading_style)
    sub_heading = Paragraph(f"{store_name.capitalize()} | {formatted_date} | {action.capitalize()}_Stock", subheading_style)

    # Table data
    table_data = [["Item", "Design Code", "Price", "GST Rate", "HSNCODE", "TAXABLE", "TAX", "Quantity", "Size"]]

    for item in stock_data:
        table_data.append([
            item["ITEM"],
            item["DESIGN_CODE"],
            f"{item['SP_PER_ITEM']:.2f}",
            item["GST_RATE"],
            item.get("HSNCODE", "62092000"), 
            f"{item['TAXABLE_AMOUNT_PER_ITEM']:.2f}",
            f"{item['TAX_AMOUNT_PER_ITEM']:.2f}",
            item["QTY"],
            item["SIZE"]
        ])

    num_columns = len(table_data[0])
    colWidths = [available_width / num_columns] * num_columns

    table = Table(table_data, colWidths=colWidths)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    # Build the PDF
    pdf.build([main_heading, sub_heading, Spacer(1, 20), table])
    
    return file_path
