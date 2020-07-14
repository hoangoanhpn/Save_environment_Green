
export class EditItem {
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
