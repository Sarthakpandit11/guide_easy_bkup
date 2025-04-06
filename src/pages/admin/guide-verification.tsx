import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';

interface Guide {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  profilePhoto?: string;
  idPhoto?: string;
  languages: string[];
  experience: string;
  areas: string[];
  description: string;
}

const GuideVerification: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/guides');
      if (!response.ok) {
        throw new Error('Failed to fetch guides');
      }
      const data = await response.json();
      setGuides(data);
    } catch (error) {
      toast.error('Error fetching guides');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInfo = (guide: Guide) => {
    setSelectedGuide(guide);
    setDialogOpen(true);
  };

  const handleAction = async (guideId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/guides/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guideId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} guide`);
      }

      toast.success(`Guide ${action}d successfully`);
      fetchGuides();
    } catch (error) {
      toast.error(`Error ${action}ing guide`);
      console.error('Error:', error);
    }
  };

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || guide.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Guide Verification
      </Typography>

      <Box mb={3} display="flex" gap={2}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          select
          label="Status"
          variant="outlined"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          SelectProps={{
            native: true,
          }}
        >
          <option value="all">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGuides.map((guide) => (
              <TableRow key={guide.id}>
                <TableCell>{guide.name}</TableCell>
                <TableCell>{guide.email}</TableCell>
                <TableCell>{guide.phone}</TableCell>
                <TableCell>{guide.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewInfo(guide)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  {guide.status === 'Pending' && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleAction(guide.id, 'approve')}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleAction(guide.id, 'reject')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedGuide && (
          <>
            <DialogTitle>Guide Information</DialogTitle>
            <DialogContent>
              <Box mb={2}>
                <Typography variant="h6">Personal Information</Typography>
                <Typography>Name: {selectedGuide.name}</Typography>
                <Typography>Email: {selectedGuide.email}</Typography>
                <Typography>Phone: {selectedGuide.phone}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="h6">Languages</Typography>
                <Typography>{selectedGuide.languages.join(', ')}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="h6">Experience</Typography>
                <Typography>{selectedGuide.experience}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="h6">Areas</Typography>
                <Typography>{selectedGuide.areas.join(', ')}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="h6">Description</Typography>
                <Typography>{selectedGuide.description}</Typography>
              </Box>
              {selectedGuide.profilePhoto && (
                <Box mb={2}>
                  <Typography variant="h6">Profile Photo</Typography>
                  <img
                    src={selectedGuide.profilePhoto}
                    alt="Profile"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </Box>
              )}
              {selectedGuide.idPhoto && (
                <Box mb={2}>
                  <Typography variant="h6">ID Photo</Typography>
                  <img
                    src={selectedGuide.idPhoto}
                    alt="ID"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default GuideVerification; 