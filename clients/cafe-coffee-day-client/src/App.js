import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import coffeeImage from "./assets/cafe.png"; 
import cupImage from "./assets/coffee.png";

const App = () => {
  const [menu, setMenu] = useState({});
  const [order, setOrder] = useState({});
  const [phone, setPhone] = useState("");
  const [total, setTotal] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("https://cafe-coffee-day-4.onrender.com/menu").then((res) => {
      setMenu(res.data);
    });
  }, []);

  const handleQuantityChange = (category, size, value) => {
    setOrder((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [size]: parseInt(value) || 0,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("https://cafe-coffee-day-4.onrender.com/order", {
        phone,
        order,
      });
      setTotal(response.data.total_amount);
      setMessage(response.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="app">
      {/* Left Image */}
      <div className="image-pane">
        <img src={coffeeImage} alt="Cafe Coffee Day" />
      </div>

      {/* Right Content */}
      <div className="content-pane">
        {/* Main Content Section */}
        <div className="form-section">
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="phone-input"
          />

          <div className="menu-grid">
            {Object.keys(menu).map((category) => (
              <div key={category} className="menu-card">
                <h2>{category.replace("_", " ")}</h2>
                {Object.keys(menu[category]).map((size) => (
                  <div className="menu-item" key={size}>
                    <span>{`${size} - ₹${menu[category][size]}`}</span>
                    <input
                      type="number"
                      min="0"
                      onChange={(e) =>
                        handleQuantityChange(category, size, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button className="place-order-btn" onClick={handleSubmit}>
            Place Order
          </button>

          {/* Sidebar: Cup image, contact, confirmation */}
          <div className="right-info">
            <img src={cupImage} alt="Coffee Cup" className="cup" />
            <h1 className="brand">Cafe Coffee Day</h1>

            <div className="contact-box">
              <h3>Contact Us</h3>
              <div className="icons">
                <span>📧</span>
                <span>📞</span>
                <span>📍</span>
              </div>
            </div>

            <div className="confirmation">
              {message && <p className="text-success">{message}</p>}
              {total !== null && <p>Total Amount: ₹{total}</p>}
            </div>

            <div className="footer">
              © 2022 empireworld <b>EmpireWorld</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
