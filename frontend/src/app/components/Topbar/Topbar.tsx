import React, { useEffect } from "react";
import { useForm, Controller, Control } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import styles from "./Topbar.module.css";
import AutoComplete from "../AutoComplete/AutoComplete";
import { useRouteContext } from "~/app/context/RouteContext";

axios.defaults.baseURL = "http://localhost:4000";

interface TopBarFormData {
  originPort: string;
  middlePoint1?: string;
  middlePoint2?: string;
  destinationPort: string;
}

const portOptions = [
  "Camden",
  "Convent",
  "Dongjiakou",
  "Hedland",
  "Kamsar",
  "Monfalcone",
  "Paradip",
  "PDM",
  "Qinhuangdao",
  "San Lorenzo",
];

const middlePointOptions = ["panama", "suez", "capetown"];

const validationSchema = Yup.object().shape({
  originPort: Yup.string()
    .required("Origin Port is required")
    .oneOf(portOptions, "Select a valid port"),
  middlePoint1: Yup.string().oneOf(
    ["", ...middlePointOptions],
    "Select a valid middle"
  ),
  middlePoint2: Yup.string().oneOf(
    ["", ...middlePointOptions],
    "Select a valid middle"
  ),
  destinationPort: Yup.string()
    .required("Destination Port is required")
    .oneOf(portOptions, "Select a valid port")
    .test("not-same-as-origin", "Same as origin port", function (value) {
      const { originPort } = this.parent;
      return originPort !== value;
    }),
});

const Topbar = () => {
  const { globalRouteData, setGlobalRouteData } = useRouteContext();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TopBarFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      originPort: "",
      middlePoint1: "",
      middlePoint2: "",
      destinationPort: "",
    },
  });

  useEffect(() => {
    if (globalRouteData.length > 0) {
      const firstPoint = globalRouteData[0];
      const lastPoint = globalRouteData[globalRouteData.length - 1];
  
      setValue("originPort", firstPoint.origin || "");
      setValue("destinationPort", lastPoint.destination || "");
  
      const middlePoints = globalRouteData.slice(1, globalRouteData.length - 1);
      let middlePoint1 = "";
      let middlePoint2 = "";
  
      for (const point of middlePoints) {
        if (middlePointOptions.includes(point.origin) || middlePointOptions.includes(point.destination)) {
          const matchedPoint = middlePointOptions.includes(point.origin)
            ? point.origin
            : point.destination;
  
          if (!middlePoint1) {
            middlePoint1 = matchedPoint;
            setValue("middlePoint1", matchedPoint); 
          } else if (!middlePoint2 && matchedPoint !== middlePoint1) {
            middlePoint2 = matchedPoint;
            setValue("middlePoint2", matchedPoint); 
            break;
          }
        }
      }
    }
  }, [globalRouteData, setValue]);

  const onSubmit = async (data: TopBarFormData) => {
    try {
      const response = await axios.post("/api/ship/get-route", {
        origin: data.originPort,
        destination: data.destinationPort,
        middlePoints: [data.middlePoint1, data.middlePoint2].filter(Boolean),
      });

      const routeData = response.data;
      setGlobalRouteData(routeData);
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  const renderInput = (name: keyof TopBarFormData, label: string, options: string[]) => {
    const placeholder = name === "originPort" || name === "destinationPort" ? "Select Port" : "Select Point";
  
    return (
      <div className={styles.inputContainer}>
        <div className={styles.formGroup}>
          <label className={styles.label}>{label}</label>
          <div className={styles.inputField}>
            <Controller
              name={name}
              control={control as Control<TopBarFormData>}
              render={({ field }) => (
                <AutoComplete
                  {...field}
                  control={control as Control<TopBarFormData>}
                  placeholder={placeholder}
                  options={options}
                />
              )}
            />
            {errors[name] && (
              <span className={styles.error}>{errors[name]?.message}</span>
            )}
          </div>
        </div>
      </div>
    );
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.topbar}>
      <div className={styles.row}>
        {renderInput("originPort", "Origin Port", portOptions)}
        {renderInput("destinationPort", "Destination Port", portOptions)}
      </div>
      <div className={styles.row}>
        {renderInput("middlePoint1", "Middle Point 1", middlePointOptions)}
        {renderInput("middlePoint2", "Middle Point 2", middlePointOptions)}
      </div>
      <button type="submit" className={styles.submitButton}>
        Run
      </button>
    </form>
  );
};

export default Topbar;
