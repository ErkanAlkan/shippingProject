'use client';

import React from 'react';
import { Modal } from 'react-bootstrap';
import VesselVariableEditForm from '../VesselVariableEditForm/VesselVariableEditForm';

interface VesselVariableEditModalProps {
  vesselId: string;
  variableId: string;
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const VesselVariableEditModal: React.FC<VesselVariableEditModalProps> = ({
  vesselId,
  variableId,
  show,
  onHide,
  onSuccess,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Vessel Variable</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <VesselVariableEditForm
          vesselId={vesselId}
          variableId={variableId}
          onSuccess={onSuccess}
        />
      </Modal.Body>
    </Modal>
  );
};

export default VesselVariableEditModal;
