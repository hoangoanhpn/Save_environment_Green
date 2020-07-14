const express = require("express");
const router = express.Router();

const DevicesController = require("../controllers/devicescontroller");
const DataController = require("../controllers/collected_datacontrollers");
const TTNController = require("../controllers/TTNcontrollers");
const ErrorController = require("../controllers/errorcontrollers");

//const checkAuth = require("../auth/auth");

router.route("/").get(DevicesController.getDevices)
                               .post(DevicesController.postDevice);

router.route("/TTN").post(TTNController.TTNPostData);

router.route("/:deviceID").get(DevicesController.getOneDevice)
    .delete(DevicesController.deleteOneDevice)
    .put(DevicesController.updateOneDevice);

router.route("/:deviceID/sensor").put(DevicesController.updateSensorName)
    .post(DevicesController.deleteSensors);

router.route("/:deviceID/message").get(DataController.getCollectedData)
    .post(DataController.deleteData);
    // .post(DataController.createCollectedData);

router.route("/:deviceID/message/chart").get(DataController.messageChart);

router.route("/:deviceID/error").post(ErrorController.sendError);

module.exports = router;
