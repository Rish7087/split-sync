import React, { useState } from 'react';
import axios from 'axios';
import { getUserFromCookie } from '../utils/cookieUtils'; // Importing the utility
import './AddExpenseModal.css';

const AddExpenseModal = ({ onClose, refreshExpenses }) => {
  const [title, setTitle] = useState('');
  const [total, setTotal] = useState('');
  const [items, setItems] = useState([{ name: '', price: '' }]);
  const [note, setNote] = useState('');

  // Handler to add a new item input
  const handleAddItem = () => {
    setItems([...items, { name: '', price: '' }]);
  };

  // Handler for changing item details
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = getUserFromCookie('currentUser'); // Fetch the current user
      const paidBy = user._id; // Extract the user ID (paidBy)

      const expenseData = {
        title,
        total: parseFloat(total),
        paidBy, // Set the current user as the one who paid
        items: items.map((item) => ({
          name: item.name,
          price: parseFloat(item.price),
        })), // Keep the items as an array of objects
        note,
      };

      await axios.post('http://localhost:8080/expenses/add', expenseData); // Send expense data to the backend
      refreshExpenses(); // Refresh the expense list after adding a new expense
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Expense</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Total:</label>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Items:</label>
            {items.map((item, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, 'name', e.target.value)
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, 'price', e.target.value)
                  }
                  required
                />
              </div>
            ))}
            <button type="button" onClick={handleAddItem}>
              Add Another Item
            </button>
          </div>
          <div>
            <label>Note (optional):</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
