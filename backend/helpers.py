import re
from models import Year, Month, Spending
from config import db
from constants import MONTHS
from datetime import datetime
import random 

def get_year_obj(year) -> Year:
    year_list = Year.query.where(Year.year == year).all()
    if not len(year_list):
        return create_year(year)
    return year_list[0]

def get_month_obj(year, date) -> Month:
    month_name = MONTHS[int(date.split("/")[0].lstrip('0'))]
    month_list = Month.query.filter(Month.year == year, Month.name == month_name).all()
    if not len(month_list):
        return create_month(month_name, year)
    return month_list[0]

def format_amount(amount) -> float:
    if not re.match(r'^([0-9]{1})[0-9]*([.]{1}[0-9]{1,2})?$', amount):
        return -1.0
    amount = float(amount)
    if amount < 0: 
        return -1.0

    return round(float(amount), 2)

def format_date(date) -> str:
    if len(date) < 1 or not re.match(r'[0-9]{1,2}\/[0-9]{1,2}', date):
        return ""
    
    try:
        datetime.strptime(date, "%m/%d")
    except ValueError:
        return ""
    
    if re.match(r'[0-9]{1,2}\/[0-9]{1}$', date):
        dateParts = date.split("/")
        date = dateParts[0] + "/0" + dateParts[1]
        
    if re.match(r'[0-9]{1}\/[0-9]{2}$', date):
        date = "0" + date
        
    return date

def create_month(name, year, spent=0.0, earned=0.0, invested=0.0, notes="") -> Month:
    month = Month(name=name, spent=spent, earned=earned, invested=invested, notes=notes, year=year)
    db.session.add(month)
    db.session.commit()
    return month

def create_year(year) -> Year:
    year = Year(year=year)
    db.session.add(year)
    db.session.commit()
    return year

def generate_random_id() -> int:
    return random.randint(1, 100000000000000)

def calculate_yearly_necessary(year):
    year_list = Year.query.where(Year.year == year).all()
    if not len(year_list):
        return -1
    
    spendings = Spending.query.where(Spending.year == year)
    necessary = 0.0
    for spending in spendings:
        if spending.necessary == "Yes":
            necessary += spending.amount
            
    spent = year_list[0].to_json()["spent"]
    return round(necessary / spent * 100, 2) if spent > 0.0 else 0.0