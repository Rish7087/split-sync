import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUserFromCookie } from '../utils/cookieUtils'; // Utility function for fetching user

const AddExpenseModal = ({ open, onClose, refreshExpenses, expenseListId }) => { // Accept expenseListId prop
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([{ name: '', price: '' }]);
  const [note, setNote] = useState('');
  const [total, setTotal] = useState(0); // Initialize total state
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Get current user from session storage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      console.error("User not found in session storage");
    }
  }, []);

  // Fetch items for autocomplete suggestions asynchronously (optional if required)
  const fetchItemOptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://split-buddies.onrender.com/items'); // API for fetching items (optional)
      // itemOptions is not used in this example
    } catch (error) {
      console.error('Error fetching item options:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load item options on open (optional)
  useEffect(() => {
    if (open) {
      fetchItemOptions();
    }
  }, [open]);

  useEffect(() => {
    // Calculate total whenever items change
    const newTotal = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    setTotal(newTotal);
  }, [items]);

  const handleAddItem = () => {
    setItems([...items, { name: '', price: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData || !userData._id) {
      console.error("User data is not available yet");
      return;
    }

    const userId = userData._id;
    // Validate title, total, and item prices
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    if (total <= 0) {
      alert('Total must be a positive number');
      return;
    }
    if (items.some(item => !item.name.trim() || isNaN(parseFloat(item.price)) || parseFloat(item.price) <= 0)) {
      alert('All items must have a name and a positive price');
      return;
    }

    try {
      const user = getUserFromCookie('currentUser'); // Fetch current user
      const paidBy = userId; // Use user ID for "paid by"

      const expenseData = {
        title,
        total,
        paidBy,
        items: items.map((item) => ({
          name: item.name,
          price: parseFloat(item.price),
        })),
        note,
        expenseListId, // Attach expense to the current expense list
      };

      console.log('Submitting expense data:', expenseData); // Debug log

      await axios.post(`https://split-buddies.onrender.com/expenses/add`, expenseData); // Post to specific expense list
      refreshExpenses(); // Refresh the expenses to reflect changes
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Expense</DialogTitle>
      <DialogContent sx={{ color: "var(--text-color)" }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            margin="normal"
          />
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <TextField
                label="Item Name"
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Price"
                type="number"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                fullWidth
                margin="normal"
                style={{ marginLeft: '1rem' }}
                required
                inputProps={{ min: 0 }}
              />
              <Button
                type="button"
                onClick={() => handleRemoveItem(index)}
                startIcon={<DeleteIcon />}
                variant="outlined"
                color="error"
                style={{ marginLeft: '1rem' }}
              >
                Delete
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={handleAddItem}
            startIcon={<AddIcon />}
            variant="outlined"
            color="primary"
          >
            Add Another Item
          </Button>
          <TextField
            label="Note (optional)"
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            rows={3}
            margin="normal"
          />
          <div style={{ marginTop: '1rem' }}>
            <Typography variant="h6">
              Total: ₹{total.toFixed(2)}
            </Typography>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExpenseModal;
