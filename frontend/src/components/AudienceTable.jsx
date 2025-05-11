import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, IconButton, Stack, Tooltip, Box, TextField, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Edit, Trash2, Search, Filter, Info } from 'lucide-react';

export default function AudienceTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, customerId: null, customerName: '' });
  
  // Filter states
  const [name, setName] = useState('');
  const [spendMin, setSpendMin] = useState('');
  const [spendMax, setSpendMax] = useState('');
  const [visitsMin, setVisitsMin] = useState('');
  const [visitsMax, setVisitsMax] = useState('');

  const fetchCustomers = () => {
    setLoading(true);
    fetch('http://localhost:4000/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setFiltered(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleEdit = (id) => { alert('Edit customer: ' + id); };
  
  const handleDelete = async () => {
    if (!deleteDialog.customerId) return;
    await fetch(`http://localhost:4000/api/customers/${deleteDialog.customerId}`, { method: 'DELETE' });
    setDeleteDialog({ open: false, customerId: null, customerName: '' });
    fetchCustomers();
  };

  const handleFilter = () => {
    let result = customers;
    if (name.trim()) {
      result = result.filter(c => c.name.toLowerCase().includes(name.trim().toLowerCase()));
    }
    if (spendMin !== '') {
      result = result.filter(c => c.totalSpend >= Number(spendMin));
    }
    if (spendMax !== '') {
      result = result.filter(c => c.totalSpend <= Number(spendMax));
    }
    if (visitsMin !== '') {
      result = result.filter(c => c.visits >= Number(visitsMin));
    }
    if (visitsMax !== '') {
      result = result.filter(c => c.visits <= Number(visitsMax));
    }
    setFiltered(result);
    setShowFilters(false);
  };

  const getSpendCategory = (spend) => {
    if (spend > 15000) return { label: 'High', color: 'success' };
    if (spend > 7000) return { label: 'Medium', color: 'warning' };
    return { label: 'Low', color: 'info' };
  };

  const getVisitCategory = (visits) => {
    if (visits > 6) return { label: 'Frequent', color: 'success' };
    if (visits > 2) return { label: 'Occasional', color: 'warning' };
    return { label: 'Rare', color: 'info' };
  };

  if (loading) return <CircularProgress sx={{ mt: 8 }} />;

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 2 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a73e8' }}>
          Audience
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: '#5f6368' }}>
          View and manage all your customers in one place. Search, filter, and explore your CRM audience.
        </Typography>
      </Box>

      {/* Search and Filter Bar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
        <TextField
          placeholder="Search customers..."
          value={name}
          onChange={e => setName(e.target.value)}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: <Search size={20} color="#666" style={{ marginRight: 8 }} />,
          }}
        />
        <Button
          variant="outlined"
          startIcon={<Filter size={20} />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ minWidth: 120 }}
        >
          Filters
        </Button>
      </Box>

      {/* Filter Dialog */}
      <Dialog open={showFilters} onClose={() => setShowFilters(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Filter Customers</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Min Spend"
              type="number"
              value={spendMin}
              onChange={e => setSpendMin(e.target.value)}
              fullWidth
            />
            <TextField
              label="Max Spend"
              type="number"
              value={spendMax}
              onChange={e => setSpendMax(e.target.value)}
              fullWidth
            />
            <TextField
              label="Min Visits"
              type="number"
              value={visitsMin}
              onChange={e => setVisitsMin(e.target.value)}
              fullWidth
            />
            <TextField
              label="Max Visits"
              type="number"
              value={visitsMax}
              onChange={e => setVisitsMax(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFilters(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFilter}>Apply Filters</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, customerId: null, customerName: '' })}>
        <DialogTitle>Delete Customer</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deleteDialog.customerName}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, customerId: null, customerName: '' })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Customers Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2, maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ background: '#f6fafd' }}>
              <TableCell sx={{ fontWeight: 700, background: '#f6fafd' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700, background: '#f6fafd' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, background: '#f6fafd' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 700, background: '#f6fafd' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  Total Spend
                  <Tooltip title="Total amount spent by the customer">
                    <Info size={16} color="#666" />
                  </Tooltip>
                </Stack>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, background: '#f6fafd' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  Visits
                  <Tooltip title="Number of times the customer has visited">
                    <Info size={16} color="#666" />
                  </Tooltip>
                </Stack>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, background: '#f6fafd' }}>Last Active</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, background: '#f6fafd' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow
                key={row._id}
                hover
                sx={{ transition: 'background 0.2s', '&:hover': { background: '#e3f0fc' } }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>${row.totalSpend}</Typography>
                    <Chip
                      label={getSpendCategory(row.totalSpend).label}
                      color={getSpendCategory(row.totalSpend).color}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>{row.visits}</Typography>
                    <Chip
                      label={getVisitCategory(row.visits).label}
                      color={getVisitCategory(row.visits).color}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </TableCell>
                <TableCell>
                  {row.lastActive ? new Date(row.lastActive).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(row._id)}
                        size="small"
                      >
                        <Edit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => setDeleteDialog({ open: true, customerId: row._id, customerName: row.name })}
                        size="small"
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 