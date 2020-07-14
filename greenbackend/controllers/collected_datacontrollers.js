const collectedData = require("../models/Collected_Data");
const Device = require("../models/Device");

module.exports = {
    getCollectedData: async (req, res) => {
        try {
            if (Object.getOwnPropertyNames(req.query).length === 2) {
                const {page, limit} = req.query;
                const options = {
                    lean: true,
                    sort: {created_at: -1},
                    page: parseInt(page),
                    limit: parseInt(limit)
                };
                const getCollectedData = await collectedData.paginate({deviceID: req.params.deviceID}, options);
                if (getCollectedData < 1) {
                    return res.status(200).json({
                        message: "Data cannot be collected from this device"
                    });
                } else {
                    return res.status(200).json({
                        message: "Getting data from device: ",
                        numberOfData: getCollectedData.length,
                        data: getCollectedData
                    });
                }
            } else {
                const getCollectedData = await collectedData.find({deviceID: req.params.deviceID}).lean().sort({created_at: -1});
                console.log(getCollectedData);
                if (getCollectedData < 1) {
                    return res.status(200).json({
                        message: "Data cannot be collected from this device"
                    });
                } else {
                    return res.status(200).json({
                        message: "Getting data from device: ",
                        numberOfData: getCollectedData.length,
                        data: getCollectedData
                    });
                }
            }
        } catch (err) {
            console.log("Error " + err);
            res.status(400).json({
                message: err
            });
        }
    },

    messageChart: async (req, res) => {
      try {
          var sensorObject = {};
          const sensorChart = await Device
              .findOne({
              deviceID: req.params.deviceID
          })
              .lean()
              .select('sensors');
          const messageChart = await collectedData.find({
                deviceID: req.params.deviceID
          })
              .lean()
              .sort({
                  created_at: 1
              });
          for (let i = 0; i < sensorChart.sensors.length; i++) {
              let newObject = {
                  [sensorChart.sensors[i].sensorName]: []
              };
              sensorObject = await Object.assign(sensorObject, newObject);
          }
          for (let j = 0; j < Object.keys(sensorObject).length; j++) {
              for (let n = 0; n < messageChart.length; n++) {
                  let dataChart = [messageChart[n].time, messageChart[n][Object.keys(sensorObject)[j]]];
                  Object.values(sensorObject)[j] = await Object.values(sensorObject)[j].push(dataChart);
              }
          }
          sensorObject = await Object.assign({
              type: '1',
              statusCode: 200
          }, sensorObject);
          return res.status(200).json(sensorObject);
      } catch (err) {
        return res.status(400).json({
            statusCode: 400,
            error: err
        });
      }
    },

    deleteData: async (req, res) => {
        try {
            console.log(req.body);
            for (let i = 0; i < req.body.dataDeleteID.length; i++) {
                console.log(req.body.dataDeleteID[i]);
                await Promise.all([collectedData.deleteOne({
                    deviceID: req.params.deviceID,
                    _id: req.body.dataDeleteID[i]
                })]);
            }
            console.log("code is here");
            return res.status(200).json({
                type: "1",
                message: "Data deleted"
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                type: "0",
                error: err
            });
        }
    }
};
