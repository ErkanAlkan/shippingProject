'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Swal from 'sweetalert2';


interface Vessel {
  id: string;
  imo: number;
  name: string;
  design_speed: number | null;
  max_draft_level: number;
  light_ship_weight: number | null;
  deadweight: number;
  hotel_load: number | null;
  hotel_load_type: string | null;
  tonnage_per_centimeter: number | null;
  length_of_vessel: number;
  beam_of_vessel: number;
}

interface VesselCardProps {
    vesselId: string;
  }
  

const VesselCard: React.FC<VesselCardProps> = ({ vesselId }) => {
  const [vessel, setVessel] = useState<Vessel | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVessel = async () => {
    try {
      const response = await axios.get(`/api/vessel/get-vessel/${vesselId}`);
      setVessel(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vessel:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load vessel data.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  useEffect(() => {
    fetchVessel();
  }, []);

  if (loading) {
    return <p>Loading vessel data...</p>;
  }

  if (!vessel) {
    return <p>No vessel data available.</p>;
  }

  return (

        <Row>
          <Col md={6}>
            <div className="mb-2">
              <strong>IMO:</strong> {vessel.imo}
            </div>
            <div className="mb-2">
              <strong>Name:</strong> {vessel.name}
            </div>
            <div className="mb-2">
              <strong>Design Speed (knots):</strong> {vessel.design_speed ?? 'N/A'}
            </div>
            <div className="mb-2">
              <strong>Max Draft Level (meters):</strong> {vessel.max_draft_level}
            </div>
            <div className="mb-2">
              <strong>Light Ship Weight (tons):</strong> {vessel.light_ship_weight ?? 'N/A'}
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-2">
              <strong>Deadweight (tons):</strong> {vessel.deadweight}
            </div>
            <div className="mb-2">
              <strong>Hotel Load (tons):</strong> {vessel.hotel_load ?? 'N/A'}
            </div>
            <div className="mb-2">
              <strong>Hotel Load Type:</strong> {vessel.hotel_load_type ?? 'N/A'}
            </div>
            <div className="mb-2">
              <strong>Tonnage per Centimeter:</strong> {vessel.tonnage_per_centimeter ?? 'N/A'}
            </div>
            <div className="mb-2">
              <strong>Length (meters):</strong> {vessel.length_of_vessel}
            </div>
            <div className="mb-2">
              <strong>Beam (meters):</strong> {vessel.beam_of_vessel}
            </div>
          </Col>
        </Row>
 
  );
};

export default VesselCard;
