from config import app, db
from models import Spending, Income, Year, Month
from flask import jsonify, request
from helpers import format_date, get_month_obj, get_year_obj, format_amount, generate_random_id, calculate_yearly_necessary
from constants import VALID_YEARS, CATEGORIES, MONTHS, COLOR_BY_MONTH, COLOR_BY_CATEGORY, COLOR_BY_YEAR
from datetime import datetime

@app.route("/months/<int:year>", methods=["GET"])
def months(year):
    months = sorted(Month.query.where(Month.year == year).all(), key=lambda item: datetime.strptime(item.name, "%B"))
    if not len(months):
        return jsonify({"months": None})
    json_months = list(map(lambda x: x.to_json(), months))
    for month in json_months:
        curr_month = str(MONTHS.index(month["name"]))
        if len(curr_month) == 1:
            curr_month = "0" + curr_month
        spendings = Spending.query.where(Spending.date.startswith(curr_month), Spending.year == year)
        necessary = 0.0
        for spending in spendings:
            if spending.necessary == "Yes":
                necessary += spending.amount
        month["necessary"] = round(necessary / month["spent"] * 100, 2) if month["spent"] > 0 else 0.0
        
    return jsonify({"months": json_months})

@app.route("/years", methods=["GET"])
def years():
    years = Year.query.order_by(db.desc(Year.year)).all()
    json_years = list(map(lambda x: x.to_json(), years))
    for year in json_years:
        year["necessary"] = calculate_yearly_necessary(year["year"])
        if year["necessary"] == -1:
            return jsonify({"message": "error: calculate_yearly_necessary failed in years"}), 400
    return jsonify({"years": json_years})

@app.route("/years_total", methods=["GET"])
def years_total():
    years = Year.query.all()
    json_years = list(map(lambda x: x.to_json(), years))
    spent = earned = invested = net = necessary = 0
    for year in json_years:
        spent += year["spent"]
        earned += year["earned"]
        invested += year["invested"]
        net += (year["earned"] - year["spent"])
        spendings = Spending.query.where(Spending.year == year["year"]).all()
        for spending in spendings:
            if spending.necessary == "Yes":
                necessary += spending.amount
    return jsonify({"years_total": {
        "spent": round(spent, 2),
        "earned": round(earned, 2),
        "invested": round(invested, 2),
        "net": round(net, 2),
        "necessary": round(necessary / spent * 100 , 2) if spent > 0 else 0.0
    }})
    
@app.route("/averages_headers", methods=["GET"])
def averages_headers():
    years = Year.query.all()
    res = sorted([str(year.year) for year in years])
    res.insert(0, "Category")
    res.append("Overall")
    
    now = datetime.now()
    if now.month == 1:
        res.remove(str(now.year))
    
    return jsonify({"headers": res})
        
@app.route("/update_transaction/<int:transaction_id>", methods=["PATCH"])
def update_transaction(transaction_id): 
    data = request.json
    date = data.get("date", "")
    date = format_date(date)
    if not date:
        return jsonify({"message": "error: Invalid Date"}), 400
    amount = str(data.get("amount", 0.0))
    amount = format_amount(amount)
    if amount < 0:
        return jsonify({"message": "error: Invalid Amount"}), 400
    what = data.get("what", "")
    category = data.get("category", "")
    necessary = data.get("necessary", "")
    year = data.get("year", 0)
    
    if date and what and amount and year and not necessary and not category:
        income = Income.query.get(transaction_id)
        if not income:
            return jsonify({"message": "income not found"}), 404
        
        original_month = get_month_obj(income.year, income.date)
        original_month.earned = round(original_month.earned - income.amount, 2)
        if original_month.is_empty():
            db.session.delete(original_month)
        original_year = get_year_obj(income.year)
        if original_year.is_empty():
            db.session.delete(original_year)
        
        income.date = date if date else spending.date
        income.amount = amount if amount else spending.amount
        income.what = what if what else spending.what
        income.year = year if year else spending.year
        
        new_month = get_month_obj(income.year, income.date)
        _ = get_year_obj(income.year)
        new_month.earned = round(new_month.earned + income.amount, 2)
                
        db.session.commit()
        return jsonify({"message": "income updated"}), 200
    elif date and what and amount and necessary and category and year:
        spending = Spending.query.get(transaction_id)
        if not spending:
            return jsonify({"message": "spending not found"}), 404

        original_month = get_month_obj(spending.year, spending.date)
        original_month.spent = round(original_month.spent - spending.amount, 2)
        if spending.category == "Investment":
            original_month.invested = round(original_month.invested - spending.amount, 2)
        if original_month.is_empty():
            db.session.delete(original_month)
        original_year = get_year_obj(spending.year)
        if original_year.is_empty():
            db.session.delete(original_year)
        
        spending.date = date if date else spending.date
        spending.amount = amount if amount else spending.amount
        spending.what = what if what else spending.what
        spending.necessary = necessary if necessary else spending.necessary
        spending.category = category if category else spending.category
        spending.year = year if year else spending.year
       
        new_month = get_month_obj(spending.year, spending.date)
        _ = get_year_obj(spending.year)
        new_month.spent = round(new_month.spent + spending.amount, 2)
        if spending.category == "Investment":
            new_month.invested = round(new_month.invested + spending.amount, 2)

        db.session.commit()
        return jsonify({"message": "spending updated"}), 200
    return jsonify({"message": "invalid request sent to update_transaction"}), 400

@app.route("/delete_spending/<int:spending_id>", methods=["DELETE"])
def delete_spending(spending_id):
    spending = Spending.query.get(spending_id)

    if not spending: 
        return jsonify({"message": "spending not found"}), 404
    
    month = get_month_obj(spending.year, spending.date)
    month.spent = round(month.spent - spending.amount, 2)
    
    if spending.category == "Investment":
        month.invested = round(month.invested - spending.amount, 2)
        
    if month.is_empty():
        db.session.delete(month)    
    
    year = get_year_obj(spending.year)
    if year.is_empty():
        db.session.delete(year)
    
    db.session.delete(spending)
    db.session.commit()

    return jsonify({"message": "spending deleted"}), 200

@app.route("/delete_income/<int:income_id>", methods=["DELETE"])
def delete_income(income_id):
    income = Income.query.get(income_id)

    if not income: 
        return jsonify({"message": "income not found"}), 404
    
    month = get_month_obj(income.year, income.date)
    month.earned = round(month.earned - income.amount, 2)
    
    if month.is_empty():
        db.session.delete(month)    
    
    year = get_year_obj(income.year)
    if year.is_empty():
        db.session.delete(year)
    
    db.session.delete(income)
    db.session.commit()

    return jsonify({"message": "income deleted"}), 200

@app.route("/delete_months", methods=["DELETE"])
def delete_months():
    months = Month.query.all()
    for month in months:
        db.session.delete(month)
    db.session.commit()
    
    return jsonify({"message": "successfully deleted months"}), 200

@app.route("/delete_years", methods=["DELETE"])
def delete_years():
    years = Year.query.all()
    for year in years:
        db.session.delete(year)
    db.session.commit()
    
    return jsonify({"message": "successfully deleted years"}), 200

@app.route("/yearly_total/<int:year>", methods=["GET"])
def yearly_total(year):
    if year not in VALID_YEARS:
        return jsonify({year: None})
    year_obj = get_year_obj(year).to_json()
    year_obj["necessary"] = calculate_yearly_necessary(year)
    if year_obj["necessary"] == -1:
        return jsonify({"message": "error: calculate_yearly_necessary failed in yearly_total"}), 400
    return jsonify({"year": year_obj})

@app.route("/add_transaction", methods=["POST"])
def add_transaction():
    date = request.json.get("date")
    what = request.json.get("what")
    amount = request.json.get("amount")
    necessary = request.json.get("necessary")
    category = request.json.get("category")
    year = request.json.get("year")
    
    amount = format_amount(amount)
    if amount < 0:
        return jsonify({"message": "error: Invalid Amount"}), 400
    
    date = format_date(date)
    if not date:
        return jsonify({"message": "error: Invalid Date"}), 400

    year = int(year)
    if year not in VALID_YEARS:
        return jsonify({"message": "error: Invalid Year"}), 400

    if date and what and amount and year and not necessary and not category:
        _ = get_year_obj(year)
        month = get_month_obj(year, date)
        new_transaction = Income(date=date, what=what, amount=amount, year=year)
        month.earned = round(month.earned + amount, 2)
    elif date and what and amount and necessary and category and year:
        _ = get_year_obj(year)
        month = get_month_obj(year, date)
        new_transaction = Spending(date=date, what=what, amount=amount, necessary=necessary, category=category, year=year)
        month.spent = round(month.spent + amount, 2)
        if category == "Investment":
            month.invested = round(month.invested + amount, 2)
    else:
        return jsonify({"message": "error: Invalid field combination"}), 400
    
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({"message": "transaction created"}), 201

@app.route("/update_month_note/<int:month_id>", methods=["PATCH"])
def update_month_note(month_id):
    note = request.json.get("note")
    month = Month.query.get(month_id)
    if not month: 
        return jsonify({"message": "month not found"}), 404

    month.notes = note
    db.session.commit()
    return jsonify({"message": "successfully added month note"}), 200

@app.route("/recreate_totals", methods=["GET"])
def recreate_totals():
    spendings = Spending.query.all()
    for spending in spendings:
        month = get_month_obj(spending.year, spending.date)
        _ = get_year_obj(spending.year)
        month.spent = round(month.spent + spending.amount, 2)
        if spending.category == "Investment":
            month.invested = round(month.invested + spending.amount, 2)
    
    incomes = Income.query.all()
    for income in incomes:
        month = get_month_obj(income.year, income.date)
        _ = get_year_obj(income.year)
        month.earned = round(month.earned + income.amount, 2)
        
    db.session.commit()
    return jsonify({"message": "successfully recreated month objects"})      

@app.route("/category_by_year", methods=["GET"])
def category_by_year():
    years = sorted([year.year for year in Year.query.all()])
    res = []

    for category in CATEGORIES:
        curr_category = {}
        curr_category["category"] = category
        curr_category["data"] = []

        for year in years:
            year_spendings = 0.0
            spendings = Spending.query.where(Spending.year == year, Spending.category == category).all()
            for spending in spendings:
                year_spendings += spending.amount
            year_dict = {}
            year_dict["id"] = generate_random_id()
            year_dict["value"] = round(year_spendings, 2)
            if year_dict["value"] == 0.0:
                continue
            year_dict["label"] = str(year)
            year_dict["color"] = COLOR_BY_YEAR[year]
            curr_category["data"].append(year_dict)
        res.append(curr_category)
        
    return jsonify({"data": res}), 200
        
@app.route("/category_by_month/<int:year>", methods=["GET"])
def category_by_month(year):
    res = []
    now = datetime.now()
    
    if now.year == year:    
        current_month = now.month
    else:
        current_month = len(MONTHS)

    for category in CATEGORIES:
        curr_category = {}
        curr_category["category"] = category
        curr_category["data"] = []
        for i in range(1, current_month):
            curr_month = str(i)
            month_spendings = 0.0
            if len(curr_month) == 1:
                curr_month = "0" + curr_month
            spendings = Spending.query.where(Spending.year == year, Spending.category == category, Spending.date.startswith(curr_month)).all()
            for spending in spendings:
                month_spendings += spending.amount
            month_dict = {}
            month_dict["id"] = generate_random_id()
            month_dict["value"] = round(month_spendings, 2)
            if month_dict["value"] == 0.0:
                continue
            month_dict["label"] = MONTHS[i]
            month_dict["color"] = COLOR_BY_MONTH[MONTHS[i]]
            curr_category["data"].append(month_dict)
        res.append(curr_category)
            
    return jsonify({"data": res}), 200

@app.route("/month_by_category/<int:year>", methods=["GET"])
def month_by_category(year):
    res = []
    now = datetime.now()
    if year == now.year:
        current_month = now.month
    else:
        current_month = len(MONTHS)
    if current_month == 1:
        current_month_obj = {}
        current_month_obj["month"] = MONTHS[current_month]
        current_month_obj["data"] = []
        res.append(current_month_obj)
        return jsonify({"data": res})
    for i in range(1, current_month):
        current_month_obj = {}
        current_month_obj["month"] = MONTHS[i]
        current_month_obj["data"] = []
        curr_month = str(i)
        if len(curr_month) == 1:
            curr_month = "0" + curr_month
        for category in CATEGORIES:
            category_spending = 0.0
            spendings = Spending.query.where(Spending.year == year, Spending.category == category, Spending.date.startswith(curr_month)).all()
            for spending in spendings:
                category_spending += spending.amount
            current_category = {}
            current_category["id"] = generate_random_id()
            current_category["value"] = round(category_spending, 2)
            if current_category["value"] == 0.0:
                continue
            current_category["label"] = category
            current_category["color"] = COLOR_BY_CATEGORY[category]
            current_month_obj["data"].append(current_category)
        res.append(current_month_obj)
    return jsonify({"data": res}), 200
        
@app.route("/year_by_category", methods=["GET"])
def year_by_category():
    res = []
    years = sorted([year.year for year in Year.query.all()], reverse=True)
    for year in years:
        current_year = {}
        current_year["year"] = year
        current_year["data"] = []
        for category in CATEGORIES:
            spendings = Spending.query.where(Spending.year == year, Spending.category == category).all()
            category_spending = 0.0
            for spending in spendings:
                category_spending += spending.amount
            current_category = {}
            current_category["id"] = generate_random_id()
            current_category["value"] = round(category_spending, 2)
            if current_category["value"] == 0.0:
                continue
            current_category["label"] = category
            current_category["color"] = COLOR_BY_CATEGORY[category]
            current_year["data"].append(current_category)
            
        res.append(current_year)
    return jsonify({"data": res}), 200

@app.route("/category_averages", methods=["GET"])
def category_averages():
    years = sorted([year.year for year in Year.query.all()])
    now = datetime.now()
    current_year = now.year
    res = [{"id": generate_random_id(), "data": []} for i in range(len(CATEGORIES))]
    
    for index, category in enumerate(CATEGORIES):
        total_months = 0
        res[index]["data"].append({"value": category, "id": generate_random_id()})
        cat_total = 0
        for year in years:
            if year < current_year:
                total_months += 12
                spendings = Spending.query.where(Spending.year == year, Spending.category == category).all()
                spending_total = 0
                for spending in spendings:
                    spending_total += spending.amount
                    cat_total += spending.amount
                res[index]["data"].append({"value": round(spending_total / 12, 2), "id": generate_random_id()})    
            elif year == current_year:
                current_month = now.month
                if current_month == 1:
                    continue
                total_months += current_month - 1
                spending_total = 0
                for i in range(1, current_month):
                    curr_month = str(i)
                    if len(curr_month) == 1:
                        curr_month = "0" + curr_month
                    spendings = Spending.query.where(Spending.year == year, Spending.category == category, Spending.date.startswith(curr_month)).all()
                    for spending in spendings:
                        spending_total += spending.amount
                        cat_total += spending.amount
                res[index]["data"].append({"value": round(spending_total / (current_month - 1), 2), "id": generate_random_id()}) 
            else:
                res[index]["data"].append({"value": 0.0, "id": generate_random_id()})

        res[index]["data"].append({"value": round(cat_total / total_months, 2), "id": generate_random_id()})                    
                
        
    return jsonify({"averages": res}), 200

@app.route("/incomes/<string:year>/<string:month>/<string:minPrice>/<string:maxPrice>", methods=["GET"])
def incomes(year, month, minPrice, maxPrice):
    try:
        minPrice = float(minPrice)
    except ValueError:
        return jsonify({"message": "invalid minPrice value for incomes"}), 400
    try:
        maxPrice = float(maxPrice)
    except ValueError:
        return jsonify({"message": "invalid maxPrice value for incomes"}), 400

    incomes = Income.query.order_by(db.desc(Income.year), db.desc(Income.date))
    if year != "ALL":
        incomes = incomes.where(Income.year == year)
    if month != "ALL":
        try:
            month_num = str(MONTHS.index(month))
        except ValueError:
            return jsonify({"message": "error getting month index for incomes"}), 400
        if len(month_num) == 1:
            month_num = "0" + month_num
        incomes = incomes.where(Income.date.startswith(month_num))
    if minPrice or maxPrice:
        if minPrice < 0 or minPrice > maxPrice:
            return jsonify({"message": "invalid price range for incomes"}), 400
        incomes = incomes.where(Income.amount <= maxPrice, Income.amount >= minPrice)

    res = {}
    res["res"] = [item.to_json() for item in incomes.all()]
    
    total_income = 0.0
    for item in res["res"]:
        total_income += item["amount"]
    res["total_income"] = round(total_income, 2)
    res["num_items"] = len(res["res"])
    res["average"] = round(res["total_income"] / res["num_items"] , 2) if res["num_items"] else 0
    
    return jsonify(res), 200
@app.route("/spendings/<string:year>/<string:month>/<string:category>/<string:necessary>/<string:minPrice>/<string:maxPrice>", methods=['GET'])
def spendings(year, month, category, necessary, minPrice, maxPrice):
    try:
        minPrice = float(minPrice)
    except ValueError:
        return jsonify({"message": "invalid minPrice value for spendings"}), 400
    try:
        maxPrice = float(maxPrice)
    except ValueError:
        return jsonify({"message": "invalid maxPrice value for spendings"}), 400

    spendings = Spending.query.order_by(db.desc(Spending.year), db.desc(Spending.date))
    if year != "ALL":
        spendings = spendings.where(Spending.year == year)
    if month != "ALL":
        try:
            month_num = str(MONTHS.index(month))
        except ValueError:
            return jsonify({"message": "error getting month index for spendings"}), 400
        if len(month_num) == 1:
            month_num = "0" + month_num
        spendings = spendings.where(Spending.date.startswith(month_num))
    if necessary != "ALL":
        spendings = spendings.where(Spending.necessary == necessary)
    if minPrice or maxPrice:
        if minPrice < 0 or minPrice > maxPrice:
            return jsonify({"message": "invalid price range for spendings"}), 400
        spendings = spendings.where(Spending.amount <= maxPrice, Spending.amount >= minPrice)
        
    result = []

    if category == "ALL":
        result = spendings.all()
    else:
        categories = category.split(",")
        result = [spending for spending in spendings.all() if spending.category in categories]
        
    res = {}
    res["res"] = [item.to_json() for item in result]
    
    total_spending = 0.0
    for item in res["res"]:
        total_spending += item["amount"]
    res["total_spending"] = round(total_spending, 2)
    res["num_items"] = len(res["res"])
    res["average"] = round(res["total_spending"] / res["num_items"] , 2) if res["num_items"] else 0

    return jsonify(res), 200
    

if __name__=="__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)