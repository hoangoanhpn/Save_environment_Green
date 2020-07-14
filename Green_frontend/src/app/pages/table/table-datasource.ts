
export class TableItem {
  _id: string;
  deviceID: string;
  deviceName: string;
  sensors: [
    {
      sensorName: string;
      value: number;
    }
  ]
}