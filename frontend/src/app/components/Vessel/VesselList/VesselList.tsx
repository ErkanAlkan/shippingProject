"use client";

import { faChevronDown, faChevronRight, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import VesselVariableList from "~/app/components/VesselVariable/VesselVariableList/VesselVariableList";
import styles from "./VesselList.module.css";
import Link from "next/link";
import VesselVariableCreateModal from "../../VesselVariable/VesselVariableCreateModal/VesselVariableCreateModal";
import {
  showLoadingAlert,
  showErrorAlert,
  showSuccessAlert,
  showConfirmAlert,
} from "../../../../utils/sweetAlertUtils";

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

const VesselList: React.FC = () => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [expandedVesselId, setExpandedVesselId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchVessels = async () => {
    showLoadingAlert("Fetching vessel data, please wait.");
    try {
      const response = await axios.get("/api/vessel/get-vessel-list");
      setVessels(response.data);
      Swal.close();
    } catch (error) {
      console.error("Error fetching vessels:", error);
      showErrorAlert("Failed to load vessel data.");
    }
  };

  useEffect(() => {
    fetchVessels();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await showConfirmAlert("Are you sure? This will permanently delete the vessel.");

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/vessel/delete-vessel/${id}`);
        setVessels(vessels.filter((vessel) => vessel.id !== id));
        showSuccessAlert("Vessel has been deleted.");
      } catch (error) {
        console.error("Error deleting vessel:", error);
        showErrorAlert("Failed to delete vessel.");
      }
    }
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const handleSuccess = () => {
    handleModalClose();
    setRefreshTrigger((prev) => prev + 1);
  };

  const toggleRow = (id: string) => {
    setExpandedVesselId(expandedVesselId === id ? null : id);
  };

  return (
    <div className="p-4 bg-light rounded shadow">
      <Table bordered hover className={styles.vesselTable}>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>
              IMO
              <br />
            </th>
            <th>
              Name
              <br />
              <small> </small>
            </th>
            <th>
              Design Speed
              <br />
              <small>(knots)</small>
            </th>
            <th>
              Max Draft Level
              <br />
              <small>(meters)</small>
            </th>
            <th>
              Light Ship Weight
              <br />
              <small>(tons)</small>
            </th>
            <th>
              Deadweight
              <br />
              <small>(tons)</small>
            </th>
            <th>
              Hotel Load
              <br />
              <small>(tons)</small>
            </th>
            <th>
              Hotel Load Type
              <br />
            </th>
            <th>
              Tonnage
              <br />
              <small>(per Cm)</small>
            </th>
            <th>
              Length
              <br />
              <small>(meters)</small>
            </th>
            <th>
              Beam
              <br />
              <small>(meters)</small>
            </th>
          </tr>
        </thead>
        <tbody>
          {vessels.map((vessel) => (
            <React.Fragment key={vessel.id}>
              <tr>
                <td>
                  <Button variant="link" onClick={() => toggleRow(vessel.id)}>
                    <FontAwesomeIcon icon={expandedVesselId === vessel.id ? faChevronDown : faChevronRight} />
                  </Button>
                </td>
                <td>
                  <Dropdown className="d-inline">
                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          handleModalShow();
                          setExpandedVesselId(vessel.id);
                        }}
                      >
                        Add Vessel Variable
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} href={`/vessel/vesselCard/${vessel.id}`}>
                        Card
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} href={`/vessel/vesselEdit/${vessel.id}`}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDelete(vessel.id)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td>{vessel.imo}</td>
                <td>{vessel.name}</td>
                <td>{vessel.design_speed ?? "N/A"}</td>
                <td>{vessel.max_draft_level}</td>
                <td>{vessel.light_ship_weight ?? "N/A"}</td>
                <td>{vessel.deadweight}</td>
                <td>{vessel.hotel_load ?? "N/A"}</td>
                <td>{vessel.hotel_load_type ?? "N/A"}</td>
                <td>{vessel.tonnage_per_centimeter ?? "N/A"}</td>
                <td>{vessel.length_of_vessel}</td>
                <td>{vessel.beam_of_vessel}</td>
              </tr>
              {expandedVesselId === vessel.id && (
                <tr>
                  <td className="ps-5" colSpan={13}>
                    <VesselVariableList vesselId={vessel.id} refreshTrigger={refreshTrigger} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      <VesselVariableCreateModal
        vesselId={expandedVesselId!}
        show={showModal}
        onHide={handleModalClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default VesselList;
