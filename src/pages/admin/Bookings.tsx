import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Search, Visibility, Edit, Delete } from '@mui/icons-material';

interface Booking {
  id: string;
  touristName: string;
  guideName: string;
  tourName: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  amount: number;
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchBookings = async () => {
      try {
        // Simulated API call
        const mockBookings: Booking[] = [
          {
            id: '1',
            touristName: 'John Doe',
            guideName: 'Jane Smith',
            tourName: 'City Tour',
            date: '2024-03-25',
            status: 'Confirmed',
            amount: 150,
          },
          {
            id: '2',
            touristName: 'Alice Johnson',
            guideName: 'Mike Wilson',
            tourName: 'Mountain Hike',
            date: '2024-03-26',
            status: 'Pending',
            amount: 200,
          },
          {
            id: '3',
            touristName: 'Bob Brown',
            guideName: 'Sarah Davis',
            tourName: 'Beach Day',
            date: '2024-03-20',
            status: 'Completed',
            amount: 180,
          },
          {
            id: '4',
            touristName: 'Carol White',
            guideName: 'Tom Harris',
            tourName: 'Historical Tour',
            date: '2024-03-22',
            status: 'Cancelled',
            amount: 120,
          },
        ];
        setBookings(mockBookings);
        setFilteredBookings(mockBookings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    // Filter bookings based on search term
    if (searchTerm.trim() === '') {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(
        (booking) =>
          booking.touristName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.guideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.tourName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
  }, [searchTerm, bookings]);

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Confirmed':
        return 'info';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bookings Management
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tourist</TableCell>
              <TableCell>Guide</TableCell>
              <TableCell>Tour</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.touristName}</TableCell>
                <TableCell>{booking.guideName}</TableCell>
                <TableCell>{booking.tourName}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>${booking.amount}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewBooking(booking)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Booking Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Tourist:</strong> {selectedBooking.touristName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Guide:</strong> {selectedBooking.guideName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Tour:</strong> {selectedBooking.tourName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Date:</strong> {selectedBooking.date}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Status:</strong>{' '}
                <Chip
                  label={selectedBooking.status}
                  color={getStatusColor(selectedBooking.status) as any}
                  size="small"
                />
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Amount:</strong> ${selectedBooking.amount}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bookings; 