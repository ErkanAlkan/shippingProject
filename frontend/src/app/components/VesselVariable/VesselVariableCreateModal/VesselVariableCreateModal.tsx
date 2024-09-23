'use client';

import React from 'react';
import { Modal } from 'react-bootstrap';
import VesselVariableForm from '~/app/components/VesselVariable/VesselVariableForm/VesselVariableForm';

interface VesselVariableCreateModalProps {
  vesselId: string;
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const VesselVariableCreateModal: React.FC<VesselVariableCreateModalProps> = ({ vesselId, show, onHide, onSuccess }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Vessel Variable</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <VesselVariableForm vesselId={vesselId} onSuccess={onSuccess} />
      </Modal.Body>
    </Modal>
  );
};

export default VesselVariableCreateModal;
