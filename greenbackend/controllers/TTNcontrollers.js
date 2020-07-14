const collectedData = require("../models/Collected_Data");
const Devices = require("../models/Device");
const moment = require("moment");

module.exports = {

    TTNPostData: async (req, res) => {
        try {
            console.log(req.body);
            if (req.body.device_id == null) {
                console.log("Discard due to missing ID");
                return res.status(400).json({
                    type: "0"
                });
            } else {
                const device = await Devices.findOne({deviceID: req.body.device_id})
                    .lean()
                    .select("sensors");
                var idField = {
                    deviceID: req.body.device_id,
                    time: moment(`${req.body.time}`).format("MMMM Do YYYY, h:mm:ss a"),
                    // dateToExpired: moment(`${req.body.time}`).fromNow(),
                    created_at: req.body.time
                };
                for (let i = 0; i < device.sensors.length; i++) {
                    let max = 50;
                    let value = Object.values(req.body)[i+1];
                    if (typeof Object.values(req.body)[i+1] !== "number") {
                        break;
                    }
                    if (i+1 === 2) {
                        max = 0;
                        value = -value;
                    }
                    let newField = {
                            [device.sensors[i].sensorName]: max - value
                        };
                    idField = Object.assign(idField, newField);
                }
                const searchDevice = new collectedData(idField);
                await Promise.all([searchDevice.save()]);
                // const deleteDate = await collectedData.find().select("created_at dateToExpire").sort({
                //     created_at: -1
                // });
                // for (let i = 0; i < deleteDate.length; i++) {
                //     deleteDate[i].dateToExpired = moment(`${deleteDate[i].created_at}`).fromNow();
                //     console.log(moment(`${deleteDate[i].created_at}`).fromNow());
                //     await Promise.all([deleteDate[i].save(), collectedData.deleteMany({dateToExpired: "10 days ago"})]);
                // }
                return res.status(200).json({
                    type: "1",
                    data: searchDevice
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            });
        }
    },
};
