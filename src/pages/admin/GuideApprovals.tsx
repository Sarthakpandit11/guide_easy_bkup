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
  Grid,
} from '@mui/material';
import { Search, Visibility, Check, Close } from '@mui/icons-material';

interface GuideApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  languages: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
}

const GuideApprovals = () => {
  const [applications, setApplications] = useState<GuideApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<GuideApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<GuideApplication | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchApplications = async () => {
      try {
        // Simulated API call
        const mockApplications: GuideApplication[] = [
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '+1234567890',
            experience: '5 years of tour guiding experience',
            languages: ['English', 'Spanish'],
            status: 'Pending',
            submittedDate: '2024-03-20',
          },
          {
            id: '2',
            name: 'Maria Garcia',
            email: 'maria.garcia@example.com',
            phone: '+1987654321',
            experience: '3 years of tour guiding experience',
            languages: ['English', 'French', 'Italian'],
            status: 'Approved',
            submittedDate: '2024-03-19',
          },
          {
            id: '3',
            name: 'David Chen',
            email: 'david.chen@example.com',
            phone: '+1122334455',
            experience: '7 years of tour guiding experience',
            languages: ['English', 'Mandarin', 'Japanese'],
            status: 'Rejected',
            submittedDate: '2024-03-18',
          },
        ];
        setApplications(mockApplications);
        setFilteredApplications(mockApplications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    // Filter applications based on search term
    if (searchTerm.trim() === '') {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(
        (app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredApplications(filtered);
    }
  }, [searchTerm, applications]);

  const handleViewApplication = (application: GuideApplication) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedApplication(null);
  };

  const handleApprove = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: 'Approved' } : app
        )
      );
      setFilteredApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: 'Approved' } : app
        )
      );
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: 'Rejected' } : app
        )
      );
      setFilteredApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: 'Rejected' } : app
        )
      );
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const getStatusColor = (status: GuideApplication['status']) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Rejected':
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
        Guide Applications
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search applications..."
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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Languages</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.name}</TableCell>
                <TableCell>{application.email}</TableCell>
                <TableCell>{application.phone}</TableCell>
                <TableCell>{application.languages.join(', ')}</TableCell>
                <TableCell>
                  <Chip
                    label={application.status}
                    color={getStatusColor(application.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{application.submittedDate}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewApplication(application)}
                  >
                    <Visibility />
                  </IconButton>
                  {application.status === 'Pending' && (
                    <>
                      <IconButton
                        color="success"
                        onClick={() => handleApprove(application.id)}
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleReject(application.id)}
                      >
                        <Close />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Application Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Name:</strong> {selectedApplication.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Email:</strong> {selectedApplication.email}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Phone:</strong> {selectedApplication.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Experience:</strong> {selectedApplication.experience}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Languages:</strong>{' '}
                    {selectedApplication.languages.join(', ')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Status:</strong>{' '}
                    <Chip
                      label={selectedApplication.status}
                      color={getStatusColor(selectedApplication.status) as any}
                      size="small"
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Submitted Date:</strong>{' '}
                    {selectedApplication.submittedDate}
                  </Typography>
                </Grid>
              </Grid>
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

export default GuideApprovals; 