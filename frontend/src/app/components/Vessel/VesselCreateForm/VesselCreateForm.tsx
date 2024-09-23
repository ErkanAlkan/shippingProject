'use client';

import React from 'react';
import {
  useForm,
  Controller,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const validationSchema =
  Yup.object().shape({
    imo: Yup.number().required('IMO is required'),
    name: Yup.string().required('Vessel name is required'),
    design_speed: Yup.number().nullable(),
    max_draft_level: Yup.number().required('Max draft level is required'),
    light_ship_weight: Yup.number().nullable(),
    deadweight: Yup.number().required('Deadweight is required'),
    length_of_vessel: Yup.number().required('Length of vessel is required'),
    beam_of_vessel: Yup.number().required('Beam of vessel is required'),
    hotel_load: Yup.number().nullable(),
    hotel_load_type: Yup.string().nullable(),
    tonnage_per_centimeter: Yup.number().nullable(),
  });

const VesselForm = () => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      imo: 0,
      name: '',
      design_speed: null,
      max_draft_level: 0,
      light_ship_weight: null,
      deadweight: 0,
      length_of_vessel: 0,
      beam_of_vessel: 0,
      hotel_load: null,
      hotel_load_type: '',
      tonnage_per_centimeter: null,
    },
  });

  const onSubmit = async (data: any) => {
    console.log('data:', data);
    try {
      const response = await axios.post('/api/vessel/create-vessel', { ...data });
      const vesselData = response.data;
      console.log('vesselData:', vesselData);
      Swal.fire({
        title: "Success",
        text: "Vessel is created successfully",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        router.push('/vessel');
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      })
      console.error('Error fetching route data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-light rounded shadow">
      <div className="row">
        <div className="col-md-6">
          {/* IMO Field */}
          <div className="mb-3">
            <label className="form-label">IMO</label>
            <Controller
              name="imo"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  className="form-control"
                  {...field}
                  placeholder="IMO"
                />
              )}
            />
            {errors.imo && <div className="text-danger">{errors.imo.message}</div>}
          </div>

          {/* Vessel Name Field */}
          <div className="mb-3">
            <label className="form-label">Vessel Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  className="form-control"
                  {...field}
                  placeholder="Vessel Name"
                />
              )}
            />
            {errors.name && <div className="text-danger">{errors.name.message}</div>}
          </div>

          {/* Design Speed Field */}
          <div className="mb-3">
            <label className="form-label">Design Speed (knots)</label>
            <Controller
              name="design_speed"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  className="form-control"
                  step="0.01"
                  {...field}
                  placeholder="Design Speed"
                  value={field.value ?? ''}
                />
              )}
            />
            {errors.design_speed && <div className="text-danger">{errors.design_speed.message}</div>}
          </div>

          {/* Max Draft Level Field */}
          <div className="mb-3">
            <label className="form-label">Max Draft Level (meters)</label>
            <Controller
              name="max_draft_level"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  className="form-control"
                  step="0.001"
                  {...field}
                  placeholder="Max Draft Level"
                />
              )}
            />
            {errors.max_draft_level && <div className="text-danger">{errors.max_draft_level.message}</div>}
          </div>
          {/* Hotel Load Type Field */}
          <div className="mb-3">
            <label className="form-label">Hotel Load Type</label>
            <Controller
              name="hotel_load_type"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  className="form-control"
                  {...field}
                  placeholder="Hotel Load Type"
                  value={field.value ?? ''}
                />
              )}
            />
            {errors.hotel_load_type && <div className="text-danger">{errors.hotel_load_type.message}</div>}
          </div>
          {/* Tonnage Per Centimeter Field */}
          <div className="mb-3">
            <label className="form-label">Tonnage Per Centimeter</label>
            <Controller
              name="tonnage_per_centimeter"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  className="form-control"
                  step="0.001"
                  {...field}
                  placeholder="Tonnage Per Centimeter"
                  value={field.value ?? ''}
                />
              )}
            />
            {errors.tonnage_per_centimeter && <div className="text-danger">{errors.tonnage_per_centimeter.message}</div>}
          </div>
        </div>
        
        <div className="col-md-6">
          {/* Light Ship Weight Field */}
          <div className="mb-3">
            <label className="form-label">Light Ship Weight (tons)</label>
            <Controller
              name="light_ship_weight"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  className="form-control"
                  step="0.01"
                  {...field}
                  placeholder="Light Ship Weight"
                  value={field.value ?? ''}
                />
              )}
            />
            {errors.light_ship_weight && <div className="text-danger">{errors.light_ship_weight.message}</div>}
          </div>

          {/* Deadweight Field */}
          <div className="mb-3">
            <label className="form-label">Deadweight (tons)</label>
            <Controller
              name="deadweight"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  className="form-control"
                  step="0.01"
                  {...field}
                  placeholder="Deadweight"
                />
              )}
            />
            {errors.deadweight && <div className="text-danger">{errors.deadweight.message}</div>}
          </div>

          {/* Length of Vessel Field */}
          <div className="mb-3">
            <label className="form-label">Length of Vessel (meters)</label>
            <Controller
              name="length_of_vessel"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  className="form-control"
                  step="0.001"
                  {...field}
                  placeholder="Length of Vessel"
                />
              )}
            />
            {errors.length_of_vessel && <div className="text-danger">{errors.length_of_vessel.message}</div>}
          </div>

          {/* Beam of Vessel Field */}
          <div className="mb-3">
            <label className="form-label">Beam of Vessel (meters)</label>
            <Controller
              name="beam_of_vessel"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  className="form-control"
                  step="0.001"
                  {...field}
                  placeholder="Beam of Vessel"
                />
              )}
            />
            {errors.beam_of_vessel && <div className="text-danger">{errors.beam_of_vessel.message}</div>}
          </div>

          {/* Hotel Load Field */}
          <div className="mb-3">
            <label className="form-label">Hotel Load (tons)</label>
            <Controller
              name="hotel_load"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  className="form-control"
                  step="0.01"
                  {...field}
                  placeholder="Hotel Load"
                  value={field.value ?? ''}
                />
              )}
            />
            {errors.hotel_load && <div className="text-danger">{errors.hotel_load.message}</div>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-success float-end">Save</button>
    </form>
  );
};

export default VesselForm;
