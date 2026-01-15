from config import db

class Year(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.Integer)
    
    def to_json(self):
        month_list = Month.query.where(Month.year == self.year).all()
        spent = earned = invested = net = 0
        for month in month_list:
            spent += month.spent
            earned += month.earned
            invested += month.invested
            net += (month.earned - month.spent)
        return {
            "id": self.id,
            "year": self.year,
            "spent": round(spent, 2),
            "earned": round(earned, 2),
            "invested": round(invested, 2),
            "net": round(net, 2),
        }
        
    def is_empty(self):
        month_list = Month.query.where(Month.year == self.year).all()
        spent = earned = invested = net = 0
        for month in month_list:
            spent += month.spent
            earned += month.earned
            invested += month.invested
            net += (month.earned - month.spent)
            
        if spent == 0 and earned == 0 and net == 0:
            return True
        return False
            

class Month(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    spent = db.Column(db.Float)
    earned = db.Column(db.Float)
    invested = db.Column(db.Float)
    notes = db.Column(db.String)
    year = db.Column(db.String)
    
    def is_empty(self):
        if self.spent == 0.0 and self.earned == 0.0 and self.invested == 0.0:
            return True
        return False
    
    def get_net(self):
        return round(self.earned - self.spent, 2)
        
    def __repr__(self):
        return f"{self.name}->spent: {self.spent}, earned: {self.earned}, invested: {self.invested}, net: {self.get_net()}"
    
    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "spent": self.spent,
            "earned": self.earned,
            "invested": self.invested,
            "notes": self.notes,
            "year": self.year,
            "net": self.get_net(),
        }

class Spending(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10))
    year = db.Column(db.Integer)
    amount = db.Column(db.Float)
    what = db.Column(db.String(10000))
    category = db.Column(db.String(10000))
    necessary = db.Column(db.String(5))

    def to_json(self):
        return {
            "id": self.id,
            "date": self.date,
            "year": self.year,
            "amount": self.amount,
            "what": self.what,
            "category": self.category,
            "necessary": self.necessary,
        }

class Income(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10))
    year = db.Column(db.Integer)
    amount = db.Column(db.Float)
    what = db.Column(db.String(10000))

    def to_json(self):
        return {
            "id": self.id,
            "date": self.date,
            "year": self.year,
            "amount": self.amount,
            "what": self.what,
        }