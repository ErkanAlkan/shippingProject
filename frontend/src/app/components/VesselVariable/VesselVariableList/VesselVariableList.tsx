import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import VesselVariableEditModal from '../VesselVariableEditModal/VesselVariableEditModal';
import Swal from 'sweetalert2';
import { showSuccessAlert, showConfirmAlert, showErrorAlert, showLoadingAlert } from '~/utils/sweetAlertUtils';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const [variables, setVariables] = useState<VesselVariables[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVariableId, setSelectedVariableId] = useState<string | null>(null);

  const fetchVesselVariables = async () => {
    showLoadingAlert('Fetching vessel variables...');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vessel-variable/get-vessel-variable-list/${vesselId}`);
      setVariables(response.data);
      Swal.close();
    } catch (error) {
      console.error('Error fetching vessel variables:', error);
      showErrorAlert('Failed to fetch vessel variables');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showConfirmAlert('Are you sure?', 'Yes, delete it!');
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/api/vessel-variable/delete-vessel-variable/${id}`);
        setVariables(variables.filter((variable) => variable.id !== id));
        showSuccessAlert('Vessel variable has been deleted.');
      } catch (error) {
        console.error('Error deleting vessel variable:', error);
        showErrorAlert('Failed to delete vessel variable.');
      }
    }
  };

  const handleEdit = (id: string) => {
    setSelectedVariableId(id);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchVesselVariables();
  };

  useEffect(() => {
    fetchVesselVariables();
  }, [vesselId, refreshTrigger]);

  return (
    <>
      <Table
        bordered
        hover>
        <thead>
          <tr>
            <th></th>
            <th>
              Current Vessel Speed
              <br />
              <small>(knots)</small>
            </th>
            <th>
              Current Draft Level
              <br />
              <small>(meters)</small>
            </th>
            <th>
              Fuel Usage Main 1<br />
              <small>(tons)</small>
            </th>
            <th>Fuel Usage Main 1 Type</th>
            <th>
              Fuel Usage Main 2<br />
              <small>(tons)</small>
            </th>
            <th>Fuel Usage Main 2 Type</th>
            <th>
              Hotel Load
              <br />
              <small>(tons)</small>
            </th>
            <th>Hotel Load Type</th>
            <th>Laden or Ballast</th>
          </tr>
        </thead>
        <tbody>
          {variables.map((variable, index) => (
            <tr key={index}>
              <td>
                <Dropdown className="d-inline">
                  <Dropdown.Toggle
                    variant="link"
                    id="dropdown-basic">
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEdit(variable.id)}>Edit</Dropdown.Item>
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

      {selectedVariableId && (
        <VesselVariableEditModal
          vesselId={vesselId}
          variableId={selectedVariableId}
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};

export default VesselVariablesList;
