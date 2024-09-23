import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

interface VesselVariables {
  id: string;
  current_vessel_speed: number;
  current_draft_level: number | null;
  fuel_usage_main_1: number;
  fuel_usage_main_1_type: string;
  fuel_usage_main_2: number | null;
  fuel_usage_main_2_type: string | null;
  hotel_load: number | null;
  hotel_load_type: string | null;
  laden_or_ballast: string;
}

interface VesselVariablesListProps {
  vesselId: string;
  refreshTrigger?: number;
}

const VesselVariablesList: React.FC<VesselVariablesListProps> = ({ vesselId, refreshTrigger }) => {
  // console.log('vesselId:', vesselId);
  const [variables, setVariables] = useState<VesselVariables[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVesselVariables = async () => {
    try {
      const response = await axios.get(`/api/vessel-variable/get-vessel-variable-list/${vesselId}`);
      setVariables(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vessel variables:', error);
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the variable.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/vessel-variable/delete-vessel-variable/${id}`);
          setVariables(variables.filter((variables) => variables.id !== id));
          Swal.fire({
            title: 'Deleted!',
            text: 'Vessel variable has been deleted.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
          });
        } catch (error) {
          console.error('Error deleting vessel variable:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete vessel variable.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
          });
        }
      }
    });
  };

  useEffect(() => {
    fetchVesselVariables();
  }, [vesselId, refreshTrigger]);

  if (loading) {
    return <p>Loading vessel variables...</p>;
  }

  return (
    <Table bordered hover>
      <thead>
        <tr>
          <th></th>
          <th>
            Current Vessel Speed<br />
            <small>(knots)</small>
          </th>
          <th>
            Current Draft Level<br />
            <small>(meters)</small>
          </th>
          <th>
            Fuel Usage Main 1<br />
            <small>(tons)</small>
          </th>
          <th>
            Fuel Usage Main 1 Type<br />
          </th>
          <th>
            Fuel Usage Main 2<br />
            <small>(tons)</small>
          </th>
          <th>
            Fuel Usage Main 2 Type<br />
          </th>
          <th>
            Hotel Load<br />
            <small>(tons)</small>
          </th>
          <th>
            Hotel Load Type<br />
          </th>
          <th>
            Laden or Ballast<br />
          </th>
        </tr>
      </thead>
      <tbody>
        {variables.map((variable, index) => (
          <tr key={index}>
            <td>
              <Dropdown className="d-inline">
                <Dropdown.Toggle variant="link" id="dropdown-basic">
                  <FontAwesomeIcon icon={faEllipsisV} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleDelete(variable.id)}>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDelete(variable.id)}>Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </td>
            <td>{variable.current_vessel_speed}</td>
            <td>{variable.current_draft_level ?? 'N/A'}</td>
            <td>{variable.fuel_usage_main_1}</td>
            <td>{variable.fuel_usage_main_1_type}</td>
            <td>{variable.fuel_usage_main_2 ?? 'N/A'}</td>
            <td>{variable.fuel_usage_main_2_type ?? 'N/A'}</td>
            <td>{variable.hotel_load ?? 'N/A'}</td>
            <td>{variable.hotel_load_type ?? 'N/A'}</td>
            <td>{variable.laden_or_ballast ?? 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
  
};

export default VesselVariablesList;
