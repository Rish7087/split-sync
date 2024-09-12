import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUserFromCookie } from '../utils/cookieUtils'; // Utility function for fetching user

const AddExpenseModal = ({ open, onClose, refreshExpenses }) => {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([{ name: '', price: '' }]);
  const [note, setNote] = useState('');
  const [total, setTotal] = useState(0); // Initialize total state
  const [loading, setLoading] = useState(false);

  // Fetch items for autocomplete suggestions asynchronously
  const fetchItemOptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/items'); // Update to correct API for fetching items
      // Note: itemOptions is no longer used in this simplified version
    } catch (error) {
      console.error('Error fetching item options:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load item options on open
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
      const user = getUserFromCookie('currentUser');
      const paidBy = user._id;

      const expenseData = {
        title,
        total,
        paidBy,
        items: items.map((item) => ({
          name: item.name,
          price: parseFloat(item.price),
        })),
        note,
      };

      console.log('Submitting expense data:', expenseData); // Debug log

      await axios.post('http://localhost:8080/expenses/add', expenseData);
      refreshExpenses();
      onClose();
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
