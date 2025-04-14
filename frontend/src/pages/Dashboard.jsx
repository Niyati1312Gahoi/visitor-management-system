import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    checkedIn: 0,
    pending: 0,
    checkedOut: 0
  });
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, recentRes, activeRes] = await Promise.all([
          axios.get('/api/visitors/stats'),
          axios.get('/api/visitors/recent'),
          axios.get('/api/visitors/active')
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }

        if (recentRes.data.success) {
          setRecentVisitors(recentRes.data.visitors);
        }

        if (activeRes.data.success) {
          setActiveVisitors(activeRes.data.visitors);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Welcome, {user?.name}</h2>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Total Visitors</Card.Title>
              <h3>{stats.totalVisitors}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 bg-success text-white">
            <Card.Body>
              <Card.Title>Checked In</Card.Title>
              <h3>{stats.checkedIn}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 bg-warning">
            <Card.Body>
              <Card.Title>Pending</Card.Title>
              <h3>{stats.pending}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 bg-secondary text-white">
            <Card.Body>
              <Card.Title>Checked Out</Card.Title>
              <h3>{stats.checkedOut}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Recent Visitors</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Host</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVisitors.map((visitor) => (
                    <tr key={visitor._id}>
                      <td>{visitor.name}</td>
                      <td>{visitor.hostEmployee?.name}</td>
                      <td>{format(new Date(visitor.createdAt), 'MMM dd, yyyy')}</td>
                      <td>{visitor.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Active Visitors</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Host</th>
                    <th>Check-in Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeVisitors.map((visitor) => (
                    <tr key={visitor._id}>
                      <td>{visitor.name}</td>
                      <td>{visitor.hostEmployee?.name}</td>
                      <td>
                        {visitor.checkInTime 
                          ? format(new Date(visitor.checkInTime), 'HH:mm')
                          : 'Pending'}
                      </td>
                      <td>{visitor.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 