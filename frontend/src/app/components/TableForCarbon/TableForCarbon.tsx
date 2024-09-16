import React from "react";
import styles from "./TableForCarbon.module.css";
import { totalmem } from "os";
import { UNABLE_TO_FIND_POSTINSTALL_TRIGGER_JSON_SCHEMA_ERROR } from "@prisma/client/scripts/postinstall.js";

interface TableProps {
  combinedContent: {
    arrivalDate: string | null;
    averageSpeed: number;
    calculatedEmission: number;
    calculatedPower: number;
    departureDate: string | null;
    secondaryPower: number;
    totalDistance: number;
    totalTime: number;
  };
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";

  const userLocale = navigator.language || "en-US"; // Use user's locale
  const date = new Date(dateString);

  const formattedDate = new Intl.DateTimeFormat(userLocale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat(userLocale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Set this to true if you want a 12-hour format with AM/PM
  }).format(date);

  return `${formattedDate}\n${formattedTime}`; // Combine date and time with a line break
};

const TableForCarbon: React.FC<TableProps> = ({ combinedContent }) => {
  return (
    <div className={styles.tableForCarbon}>
      <div className={styles.tableContainer}>
        {combinedContent ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  Speed
                  <br />
                  (knot)
                </th>
                <th>
                  Time
                  <br />
                  (days)
                </th>
                <th>
                  Distance
                  <br />
                  (nm)
                </th>
                <th>
                  Fuel
                  <br />
                  (tons)
                </th>
                <th>
                  Fuel II
                  <br />
                  (tons)
                </th>
                <th>
                  CO2
                  <br />
                  (tons)
                </th>
                <th>
                  Arrival
                </th>
                <th>
                  Departure
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{combinedContent.averageSpeed}</td>
                <td>{combinedContent.totalTime}</td>
                <td>{combinedContent.totalDistance}</td>
                <td>{combinedContent.calculatedPower}</td>
                <td>{combinedContent.secondaryPower}</td>
                <td>{combinedContent.calculatedEmission}</td>
                <td>{formatDate(combinedContent.departureDate)}</td>
                <td>{formatDate(combinedContent.arrivalDate)}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className={styles.noDataMessage}>No data available</p>
        )}
      </div>
    </div>
  );
};

export default TableForCarbon;
