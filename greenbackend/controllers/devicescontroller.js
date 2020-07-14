const Device = require("../models/Device");
const collectedData = require("../models/Collected_Data");

module.exports = {
    getDevices: async (req, res) => {
        try {
            const devices = await Device.find()
                    .lean()
                    .sort({deviceName: 1})
                    .select({_id: 1, deviceID: 1, deviceName: 1, sensors: 1});
                if (devices < 1) {
                    return res.status(200).json({
                        message: "No devices created in database"
                    });
                } else {
                    return res.status(200).json({
                        message: "Getting list of devices: ",
                        numberOfDevices: devices.length,
                        devices: devices
                    });
                }
        } catch (err) {
            console.log("Error " + err);
            res.status(400).json({
                message: err
            });
        }
    },

    postDevice: async (req, res) => {
        try {
            // async function init() {
            //     console.log("Cleaning DB");
            //     console.log("DB cleaned");
            //     const numberOfDevices = 50;
            //     console.log(`Adding ${numberOfDevices} devices to DB`);
            //     await Device.populateDBWithDummyData(numberOfDevices);
            //     console.log(`Finished populating the DB with ${numberOfDevices} devices`);
            //
            //     return true;
            // }
            // await init();
            //
            // async function dataInit() {
            //     const numberOfCollectedData = 10;
            //     console.log(`Adding ${numberOfCollectedData} data field to each device`);
            //     await collectedData.populateDeviceWithDummyData(numberOfCollectedData);
            //     console.log(`Finished populating each device with ${numberOfCollectedData} data field`);
            // }
            //
            // await dataInit();

            console.log(req.body);
            Device.findOne({deviceID: req.body.deviceID})
                .then(async (device) => {
                    if (device) {
                        return res.status(200).json({
                            type: "1",
                            message: "One device has that ID, please change your ID"
                        });
                    } else {
                        const newDevice = new Device({
                            deviceID: req.body.deviceID,
                            deviceName: req.body.deviceName
                        });
                        for (let i = 0; i < req.body.sensorCount; i++) {
                            newDevice.sensors[i] = req.body.sensors[i];
                        }
                        await Promise.all([newDevice.save()]);

                        return res.status(200).json({
                            type: "1",
                            message: "Device and data created successfully",
                        });
                    }
                });
        } catch (err) {
            console.log("Error " + err);
            res.status(400).json({
                message: err
            });
        }
    },

    getOneDevice: async (req, res) => {
        try {
            console.log(req.body);
            const getOneDevice = await Device.find({deviceID: req.params.deviceID})
                .lean();
            res.status(200).json({
                type: 1,
                device: getOneDevice
            });
        } catch (err) {
            console.log("Error " + err);
            res.status(400).json({
                message: err
            });
        }
    },

    deleteOneDevice: async (req, res) => {
        try {
            await Promise.all([Device.deleteOne({deviceID: req.params.deviceID}),
                collectedData.deleteMany({deviceID: req.params.deviceID})]);
            res.status(200).json({
                type: "success",
                message: `Successfully delete device with ID ${req.params.deviceID} and data attached`
            });
        } catch (err) {
            console.log("Error " + err);
            res.status(400).json({
                message: err
            });
        }
    },

    updateOneDevice: async (req, res) => {
        try {
            await Promise.all([Device.updateOne(
                {deviceID: req.params.deviceID},
                { $set: req.body }
            )]);
            res.status(200).json({
                type: "1",
                message: `Successfully update device with ID ${req.params.deviceID}`
            });
        } catch (err) {
            console.log("Error " + err);
            res.status(400).json({
                message: err
            });
        }
    },

    updateSensorName: async (req, res) => {
        try {
            await Promise.all([Device.updateOne({
                deviceID: req.params.deviceID,
                sensors: {$elemMatch: {sensorName: req.body.sensorName}}
            },{
                $set: {"sensors.$.sensorName": req.body.newSensorName}
            })]).then(async () => {
                await Promise.all([collectedData.updateMany({
                    deviceID: req.params.deviceID
                },{
                    $rename: {[req.body.sensorName] : req.body.newSensorName}
                })]);
            });
            return res.status(200).json({
                type: "1",
                message: "Sensor updated"
            });
        } catch (err) {
            return res.status(200).json({
                type: "0",
                error: err
            });
        }

    },

    deleteSensors: async (req, res) => {
        try {
            console.log(req.body);
            for (let i = 0; i < req.body.sensorsDeleteName.length; i++) {
                await Promise.all([Device.updateOne({
                    deviceID: req.params.deviceID,
                }, {
                    $pull: {sensors: {sensorName: req.body.sensorsDeleteName[i]}}
                })]).then(async () => {
                    await Promise.all([collectedData.updateMany({
                        deviceID: req.params.deviceID
                    }, {
                        $unset: {[req.body.sensorsDeleteName[i]] : ""}
                    })]);
                });
            }
            return res.status(200).json({
                type: "1",
                message: "Sensors deleted"
            });
        } catch (err) {
            return res.status(200).json({
                type: "0",
                error: err
            });
        }
    }
};
