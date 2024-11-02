"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { showLoadingAlert, showSuccessAlert, showErrorAlert } from "~/utils/sweetAlertUtils";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface VesselFormData {
  imo: number;
  name: string;
  design_speed?: number | null;
  max_draft_level: number;
  light_ship_weight?: number | null;
  deadweight: number;
  length_of_vessel: number;
  beam_of_vessel: number;
  hotel_load?: number | null;
  hotel_load_type?: string | null;
  tonnage_per_centimeter?: number | null;
}

const validationSchema = Yup.object().shape({
  imo: Yup.number().required("IMO is required"),
  name: Yup.string().required("Vessel name is required"),
  design_speed: Yup.number().nullable(),
  max_draft_level: Yup.number().required("Max draft level is required"),
  light_ship_weight: Yup.number().nullable(),
  deadweight: Yup.number().required("Deadweight is required"),
  length_of_vessel: Yup.number().required("Length of vessel is required"),
  beam_of_vessel: Yup.number().required("Beam of vessel is required"),
  hotel_load: Yup.number().nullable(),
  hotel_load_type: Yup.string().nullable(),
  tonnage_per_centimeter: Yup.number().nullable(),
});

const FormInput = ({
  name,
  label,
  control,
  errors,
  type = "text",
  step,
  placeholder,
}: {
  name: keyof VesselFormData;
  label: string;
  control: any;
  errors: any;
  type?: string;
  step?: string;
  placeholder: string;
}) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          type={type}
          className="form-control"
          step={step}
          {...field}
          placeholder={placeholder}
          value={field.value ?? ""}
        />
      )}
    />
    {errors[name] && <div className="text-danger">{errors[name]?.message}</div>}
  </div>
);

const VesselEditForm = ({ vesselId }: { vesselId: string }) => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<VesselFormData>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      showLoadingAlert();
      try {
        console.log(`${API_BASE_URL}/api/vessel/get-vessel/${vesselId}`);
        const response = await axios.get(`${API_BASE_URL}/api/vessel/get-vessel/${vesselId}`, { withCredentials: true });
        const vesselData = response.data;
        Object.keys(vesselData).forEach((key) => {
          setValue(key as keyof VesselFormData, vesselData[key]);
        });
        Swal.close();
      } catch (error) {
        showErrorAlert("Error fetching vessel data");
        console.error("Error fetching vessel data:", error);
      }
    };

    fetchData();
  }, [vesselId, setValue]);

  const onSubmit = async (data: VesselFormData) => {
    showLoadingAlert();
    try {
      await axios.put(`${API_BASE_URL}/api/vessel/update-vessel/${vesselId}`, data , { withCredentials: true });
      showSuccessAlert("Vessel is updated successfully").then(() => {
        router.push("/vessel");
      });
    } catch (error) {
      showErrorAlert("Error updating vessel data");
      console.error("Error updating vessel data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-light rounded shadow">
      <div className="row">
        <div className="col-md-6">
          <FormInput
            name="imo"
            label="IMO"
            control={control}
            errors={errors}
            type="number"
            placeholder="IMO"
          />
          <FormInput
            name="name"
            label="Vessel Name"
            control={control}
            errors={errors}
            placeholder="Vessel Name"
          />
          <FormInput
            name="design_speed"
            label="Design Speed (knots)"
            control={control}
            errors={errors}
            type="number"
            step="0.01"
            placeholder="Design Speed"
          />
          <FormInput
            name="max_draft_level"
            label="Max Draft Level (meters)"
            control={control}
            errors={errors}
            type="number"
            step="0.001"
            placeholder="Max Draft Level"
          />
          <FormInput
            name="hotel_load_type"
            label="Hotel Load Type"
            control={control}
            errors={errors}
            placeholder="Hotel Load Type"
          />
          <FormInput
            name="tonnage_per_centimeter"
            label="Tonnage Per Centimeter"
            control={control}
            errors={errors}
            type="number"
            step="0.001"
            placeholder="Tonnage Per Centimeter"
          />
        </div>
        <div className="col-md-6">
          <FormInput
            name="light_ship_weight"
            label="Light Ship Weight (tons)"
            control={control}
            errors={errors}
            type="number"
            step="0.01"
            placeholder="Light Ship Weight"
          />
          <FormInput
            name="deadweight"
            label="Deadweight (tons)"
            control={control}
            errors={errors}
            type="number"
            step="0.01"
            placeholder="Deadweight"
          />
          <FormInput
            name="length_of_vessel"
            label="Length of Vessel (meters)"
            control={control}
            errors={errors}
            type="number"
            step="0.001"
            placeholder="Length of Vessel"
          />
          <FormInput
            name="beam_of_vessel"
            label="Beam of Vessel (meters)"
            control={control}
            errors={errors}
            type="number"
            step="0.001"
            placeholder="Beam of Vessel"
          />
          <FormInput
            name="hotel_load"
            label="Hotel Load (tons)"
            control={control}
            errors={errors}
            type="number"
            step="0.01"
            placeholder="Hotel Load"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-success float-end">
        Save
      </button>
    </form>
  );
};

export default VesselEditForm;