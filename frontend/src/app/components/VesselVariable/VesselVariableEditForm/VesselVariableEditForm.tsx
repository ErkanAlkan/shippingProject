'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { showLoadingAlert, showErrorAlert, showSuccessAlert } from '~/utils/sweetAlertUtils';
import * as Yup from 'yup';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const validationSchema = Yup.object().shape({
  current_vessel_speed: Yup.number().required('Current vessel speed is required'),
  current_draft_level: Yup.number().nullable(),
  fuel_usage_main_1: Yup.number().required('Fuel usage main 1 is required'),
  fuel_usage_main_1_type: Yup.string().required('Fuel usage type is required'),
  fuel_usage_main_2: Yup.number().nullable(),
  fuel_usage_main_2_type: Yup.string().nullable(),
  hotel_load: Yup.number().nullable(),
  hotel_load_type: Yup.string().nullable(),
  laden_or_ballast: Yup.string().required('Laden or Ballast is required'),
});

interface VesselVariableEditFormProps {
  vesselId: string;
  variableId: string;
  onSuccess: () => void;
}

const VesselVariableEditForm: React.FC<VesselVariableEditFormProps> = ({
  vesselId,
  variableId,
  onSuccess,
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      current_vessel_speed: 0,
      current_draft_level: null,
      fuel_usage_main_1: 0,
      fuel_usage_main_1_type: '',
      fuel_usage_main_2: null,
      fuel_usage_main_2_type: '',
      hotel_load: null,
      hotel_load_type: '',
      laden_or_ballast: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoadingAlert();
        const response = await axios.get(`${API_BASE_URL}/api/vessel-variable/get-vessel-variable/${variableId}`);
        const data = response.data;
        setValue('current_vessel_speed', data.current_vessel_speed);
        setValue('current_draft_level', data.current_draft_level);
        setValue('fuel_usage_main_1', data.fuel_usage_main_1);
        setValue('fuel_usage_main_1_type', data.fuel_usage_main_1_type);
        setValue('fuel_usage_main_2', data.fuel_usage_main_2);
        setValue('fuel_usage_main_2_type', data.fuel_usage_main_2_type);
        setValue('hotel_load', data.hotel_load);
        setValue('hotel_load_type', data.hotel_load_type);
        setValue('laden_or_ballast', data.laden_or_ballast);
        Swal.close();
      } catch (error) {
        Swal.close();
        showErrorAlert('Error fetching vessel variables');
        console.error('Error fetching vessel variables:', error);
      }
    };

    fetchData();
  }, [variableId, setValue]);

  const onSubmit = async (data: any) => {
    try {
      await axios.put(`${API_BASE_URL}/api/vessel-variable/update-vessel-variable/${variableId}`, {
        vessel: {
          connect: {
            id: vesselId,
          },
        },
        ...data,
      });

      showSuccessAlert('Vessel variables updated successfully.').then((result) => {
        if (result.isConfirmed) {
          onSuccess();
        }
      });
    } catch (error) {
      showErrorAlert('Failed to update vessel variables.');
    }
  };

  return (
    <Form
      className="variable-form"
      onSubmit={handleSubmit(onSubmit)}>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Current Vessel Speed</Form.Label>
            <Controller
              name="current_vessel_speed"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  {...field}
                  isInvalid={!!errors.current_vessel_speed}
                  placeholder="Current Speed"
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.current_vessel_speed?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Current Draft Level</Form.Label>
            <Controller
              name="current_draft_level"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  {...field}
                  isInvalid={!!errors.current_draft_level}
                  placeholder="Current Draft Level"
                  value={field.value ?? ''}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.current_draft_level?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Fuel Usage Main 1</Form.Label>
            <Controller
              name="fuel_usage_main_1"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  {...field}
                  isInvalid={!!errors.fuel_usage_main_1}
                  placeholder="Fuel Usage Main 1"
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fuel_usage_main_1?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Fuel Usage Main 1 Type</Form.Label>
            <Controller
              name="fuel_usage_main_1_type"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  {...field}
                  isInvalid={!!errors.fuel_usage_main_1_type}
                  placeholder="Fuel Usage Type"
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fuel_usage_main_1_type?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Fuel Usage Main 2</Form.Label>
            <Controller
              name="fuel_usage_main_2"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  {...field}
                  isInvalid={!!errors.fuel_usage_main_2}
                  placeholder="Fuel Usage Main 2"
                  value={field.value ?? ''}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fuel_usage_main_2?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Fuel Usage Main 2 Type</Form.Label>
            <Controller
              name="fuel_usage_main_2_type"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  {...field}
                  isInvalid={!!errors.fuel_usage_main_2_type}
                  placeholder="Fuel Usage Main 2 Type"
                  value={field.value ?? ''}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fuel_usage_main_2_type?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Hotel Load Type</Form.Label>
            <Controller
              name="hotel_load_type"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  {...field}
                  isInvalid={!!errors.hotel_load_type}
                  placeholder="Hotel Load Type"
                  value={field.value ?? ''}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.hotel_load_type?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Hotel Load</Form.Label>
            <Controller
              name="hotel_load"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  {...field}
                  isInvalid={!!errors.hotel_load}
                  placeholder="Hotel Load"
                  value={field.value ?? ''}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.hotel_load?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Laden or Ballast</Form.Label>
            <Controller
              name="laden_or_ballast"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  {...field}
                  isInvalid={!!errors.laden_or_ballast}
                  placeholder="Laden or Ballast"
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.laden_or_ballast?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}> </Col>
      </Row>
      <Button
        type="submit"
        variant="success"
        className="float-end">
        Save
      </Button>
    </Form>
  );
};

export default VesselVariableEditForm;
