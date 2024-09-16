//This script is to import the given "third party routes data" to database in case of a data loss

import { PrismaClient } from '@prisma/client';
import csv from 'csv-parser';
import fs from 'fs';

const prisma = new PrismaClient();

interface ConnectorConnectorData {
  longitude: number;
  latitude: number;
  cumulative_dist: number;
  path_len: number;
  point_type: string;
  move_time: number;
  origin: string;
  destination: string;
  partial_dist: number;
}

interface OriginConnectorData {
  longitude: number;
  latitude: number;
  cumulative_dist: number;
  path_len: number;
  point_type: string;
  move_time: number;
  origin: string;
  destination: string;
  partial_dist: number;
}

interface OriginDestinationData {
  longitude: number;
  latitude: number;
  cumulative_dist: number;
  path_len: number;
  point_type: string;
  move_time: number;
  origin: string;
  destination: string;
  partial_dist: number;
}

async function processCSVAndInsertData() {
  try {
    // Clean the tables first
    await prisma.connector_connector.deleteMany();
    await prisma.origin_connector.deleteMany();
    await prisma.origin_destination.deleteMany();

    console.log('Tables cleaned successfully.');

    // Connector Connector Data
    await importCSV('./csvFiles/interconnector_distance.csv', prisma.connector_connector, {
      longitude: (data: any) => parseFloat(data.longitude),
      latitude: (data: any) => parseFloat(data.latitude),
      cumulative_dist: (data: any) => parseFloat(data.cumulative_dist),
      path_len: (data: any) => parseFloat(data.path_len),
      point_type: (data: any) => data.point_type,
      move_time: (data: any) => parseInt(data.move_time),
      origin: (data: any) => data.origin,
      destination: (data: any) => data.destination,
      partial_dist: (data: any) => parseFloat(data.partial_dist),
    });

    // Origin Connector Data
    await importCSV('./csvFiles/origin_connector_distance.csv', prisma.origin_connector, {
      longitude: (data: any) => parseFloat(data.longitude),
      latitude: (data: any) => parseFloat(data.latitude),
      cumulative_dist: (data: any) => parseFloat(data.cumulative_dist),
      path_len: (data: any) => parseFloat(data.path_len),
      point_type: (data: any) => data.point_type,
      move_time: (data: any) => parseInt(data.move_time),
      origin: (data: any) => data.portname,
      destination: (data: any) => data.connector, // Assuming connector is mapped to destination
      partial_dist: (data: any) => parseFloat(data.partial_dist),
    });

    // Origin Destination Data
    await importCSV('./csvFiles/origin_destination_direct_distance.csv', prisma.origin_destination, {
      longitude: (data: any) => parseFloat(data.longitude),
      latitude: (data: any) => parseFloat(data.latitude),
      cumulative_dist: (data: any) => parseFloat(data.cumulative_dist),
      path_len: (data: any) => parseFloat(data.path_len),
      point_type: (data: any) => data.point_type,
      move_time: (data: any) => parseInt(data.move_time),
      origin: (data: any) => data.origin_portname,
      destination: (data: any) => data.destination_portname,
      partial_dist: (data: any) => parseFloat(data.partial_dist),
    });

    console.log('All data successfully inserted!');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function importCSV(filePath: string, model: any, dataMapping: { [key: string]: (data: any) => any }) {
  const results: any[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const mappedData: any = {};
        for (const [key, value] of Object.entries(dataMapping)) {
          mappedData[key] = value(data);
        }
        results.push(mappedData);
      })
      .on('end', async () => {
        try {
          for (const record of results) {
            await model.create({
              data: record,
            });
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
  });
}

processCSVAndInsertData();
