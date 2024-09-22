import React from "react";
import styles from "./TableForCarbon.module.css";

interface TableProps {
  combinedContent: {
    speed: number;
    totalTime: number;
    totalDistance: number;
    calculatedPower: number;
    secondaryPower: number;
    calculatedEmission: number;
    arrivalDate: string | null;
    departureDate: string | null;
  }[];
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const userLocale = navigator.language || "en-US";
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat(userLocale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat(userLocale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return `${formattedDate} ${formattedTime}`;
};

const TableForCarbon: React.FC<TableProps> = ({ combinedContent }) => {
  return (
    <div className={styles.tableForCarbon}>
      <div className={styles.tableContainer}>
        {combinedContent && combinedContent.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Speed (knot)</th>
                <th>Time (days)</th>
                <th>Distance (nm)</th>
                <th>Fuel (tons)</th>
                <th>Fuel II (tons)</th>
                <th>CO2 (tons)</th>
                <th>Departure</th>
                <th>Arrival</th>
              </tr>
            </thead>
            <tbody>
              {combinedContent.map((row, index) => (
                <tr key={index}>
                  <td>{row.speed}</td>
                  <td>{row.totalTime}</td>
                  <td>{row.totalDistance}</td>
                  <td>{row.calculatedPower}</td>
                  <td>{row.secondaryPower}</td>
                  <td>{row.calculatedEmission}</td>
                  <td>{formatDate(row.departureDate)}</td>
                  <td>{formatDate(row.arrivalDate)}</td>
                </tr>
              ))}
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
