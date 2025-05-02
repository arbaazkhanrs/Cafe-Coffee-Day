from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)  

products = {
    "coffee": {"small": 10, "medium": 20, "large": 30},
    "tea": {"small": 10, "medium": 20, "large": 30},
    "coffee_maker": {"small": 250, "large": 510},
    "mugs": {"small": 150, "medium": 300, "large": 450},
}

def is_valid_phone(phone):
    pattern = re.compile(r"^(0|91)?[6-9][0-9]{9}$")
    return pattern.fullmatch(phone)

@app.route('/')
def home():
    return "Welcome to Cafe Coffee Day!"

@app.route("/menu", methods=["GET"])
def get_menu():
    return jsonify(products)

@app.route("/order", methods=["POST"])
def place_order():
    data = request.get_json()
    phone = data.get("phone")
    order = data.get("order") 

    if not is_valid_phone(phone):
        return jsonify({"error": "Invalid phone number"}), 400

    total = 0
    for category, items in order.items():
        for size, qty in items.items():
            if category in products and size in products[category]:
                total += products[category][size] * qty

    return jsonify({
        "message": "Order placed successfully! ☕🎉",
        "total_amount": total
    })

if __name__ == "__main__":
    app.run(debug=True) 
