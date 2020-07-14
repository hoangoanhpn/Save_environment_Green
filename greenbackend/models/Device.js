const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const casual = require("casual");
const randomize = require("randomatic");

const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
    deviceID: {type: String, index: true, unique: true},
    deviceName: {type: String, index: true, unique: true, sparse: true},
    lat: 0,
    lng: 0,
    type: {type: String, default: "16_MAXBOTIX_RS232"},
    lastValueTimeStamp: {type: String, default: ""},
    deviceAlertTracking: {type: Boolean, default: true},
    openData: {type: Boolean, default: false},
    push_api: {type: Boolean, default: false},
    alertType: {type: String, default: "email"},
    deviceOnAlert: {type: Boolean, default: false},
    sensorSetAlert: {type: Boolean, default: false},
    alert_recipients: [],
    network_provider: {type: String, default: "sigfox"},
    frequency: {type: String, default: "60"},
    sensors: [
    // {
    //     id: "1111",
    //     name: "temperature_air_carte",
    //     lastValue: null,
    //     currentAlertThreshold: "null<>null",
    //     sensorType: "analog",
    //     startTime: "",
    //     sensorOnAlert: "",
    //     databaseFormat: "number",
    //     driverName: "DRIVER_TD1208_TEMP",
    //     dataSize: ""
    // },
    // {
    //     id: "2222",
    //     name: "battery_carte",
    //     lastValue: null,
    //     currentAlertThreshold: "null<>null",
    //     startTime: "",
    //     sensorOnAlert: "",
    //     databaseFormat: "number",
    //     driverName: null,
    //     dataSize: ""
    // },
    // {
    //     id: "3333",
    //     name: "distance_maxbotix_[i]",
    //     sensorType: "virtual",
    //     currentAlertThreshold: "null<>null",
    //     formula: "distance_maxbotix_raw>1000 ? null : distance_maxbotix_raw-dead_zone"
    // },
    // {
    //     "id": "4444",
    //     "name": "content_level_[i]",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "distance_maxbotix_raw>1000 ? null : (tank_high-distance_maxbotix-dead_zone<0 ? 0 : tank_high-distance_maxbotix)"
    // },
    // {
    //     "id": "5555",
    //     "name": "content_volume_[i]",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "distance_maxbotix_raw>1000 ? null : content_level*(tank_total_volume/tank_high)"
    // },
    // {
    //     "id": "6666",
    //     "name": "content_volume_percentage",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "distance_maxbotix_raw>1000 ? null : content_level/tank_high*100"
    // },
    // {
    //     "id": "7777",
    //     "name": "content_level_change_[i]",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "($device.content_level.lastValue-content_level) > 0 ? ($device.content_level.lastValue-content_level): 0"
    // },
    // {
    //     "id": "8888",
    //     "name": "content_volume_change_[i]",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "content_level_change*tank_total_volume/tank_high"
    // },
    // {
    //     "id": "9999",
    //     "name": "delay_last_message",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "$device.delayLastMessage.minutes"
    // },
    // {
    //     "id": "10101010",
    //     "name": "content_volume_change_per_minute_[i]",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "content_volume_change/$device.delayLastMessage.minutes"
    // },
    // {
    //     "id": "11111111",
    //     "name": "data_array_previous_values_[im]",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "$device.content_volume_change_per_minute.data[168]"
    // },
    // {
    //     "id": "12121212",
    //     "name": "sum_previous_values_[i]",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "sum(data_array_previous_values)"
    // },
    // {
    //     "id": "13131313",
    //     "name": "mean_previous_values_[i]",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "mean(data_array_previous_values)"
    // },
    // {
    //     "id": "14141414",
    //     "name": "count_previous_values_[i]",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "function=count(data_array_previous_values)"
    // },
    // {
    //     "id": "15151515",
    //     "name": "dump_speed_[i]",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "mean_previous_values == 0 ? content_volume_change_per_minute*60*24 : (sum_previous_values+content_volume_change_per_minute)/(count_previous_values)*60*24"
    // },
    // {
    //     "id": "16161616",
    //     "name": "tank_autonomy_[i]",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "content_volume/dump_speed"
    // },
    // {
    //     "id": "17171717",
    //     "name": "tank_empty_volume_[i]",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "tank_total_volume/tank_high*distance_maxbotix"
    // },
    // {
    //     "id": "18181818",
    //     "name": "tank_possible_filling",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "tank_empty_volume > minimum_filling_volume ? tank_empty_volume : null"
    // },
    // {
    //     "id": "19191919",
    //     "name": "tank_possible_filling_prediction_in_days_[i]",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "tank_empty_volume > minimum_filling_volume ? null : (minimum_filling_volume-tank_empty_volume)/dump_speed"
    // },
    // {
    //     "id": "20202020",
    //     "name": "ranking_tank_autonomy",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "tank_autonomy<=3 ? 3 : (tank_autonomy<=7 ? 2 : (tank_empty_volume>minimum_filling_volume ? 1 : 0)) "
    // },
    // {
    //     "id": "21212121",
    //     "name": "ranking_content_volume_percentage",
    //     "sensorType": "virtual",
    //     "currentAlertThreshold": "null<>null",
    //     "formula": "content_volume_percentage<=15 ? 3 : (content_volume_percentage<=20 ? 2 : (tank_empty_volume>minimum_filling_volume ? 1 : 0)) "
    // },
    // {
    //     id: "22222222",
    //     name: "tank_autonomy_forecast_in_days_[i]",
    //     sensorType: "virtual",
    //     currentAlertThreshold: "null<>null",
    //     formula: "function=forecast(content_volume,day_empty)"
    // },
    // {
    //     id: "23232323",
    //     name: "tank_autonomy_forecast_in_hours_[i]",
    //     sensorType: "virtual",
    //     currentAlertThreshold: "null<>null",
    //     formula: "function=forecast(content_volume,hour_empty)"
    // },
    // {
    //     id: "24242424",
    //     name: "tank_autonomy_forecast_dataset_[i]",
    //     sensorType: "virtual",
    //     currentAlertThreshold: "null<>null",
    //     formula: "function=forecast(content_volume,data)"
    // },
    // {
    //     id: "25252525",
    //     name: "prediction_tank_filling_[p]",
    //     sensorType: "virtual",
    //     currentAlertThreshold: "null<>null",
    //     formula: [
    //         "tank_autonomy <= 3 ? 3 : (tank_autonomy <= 7 ? 2 : (tank_possible_filling_prediction_in_days < 1 ? 1 : 0))",
    //         "tank_autonomy <= 4 ? 3 : (tank_autonomy <= 8 ? 2 : (tank_possible_filling_prediction_in_days < 2 ? 1 : 0))",
    //         "tank_autonomy <= 5 ? 3 : (tank_autonomy <= 9 ? 2 : (tank_possible_filling_prediction_in_days < 3 ? 1 : 0))",
    //         "tank_autonomy <= 6 ? 3 : (tank_autonomy <= 10 ? 2 : (tank_possible_filling_prediction_in_days < 4 ? 1 : 0))"
    //     ]
    // }
],
    msid: {type: String, default: "7e45457e96a2f64c1621cb48db15920e"},
    meta_data: {
        content_type: {type: String, default: ""},
        zone: {type: String, default: ""},
        tank_total_volume: 0,
        tank_high: 0,
        minimum_filling_volume: 0,
        dead_zone: 0
},
    status: {type: String, default: "running"},
    adminComment: {type: String, default: ""},
    anomaly_tagging: [
    "content_volume"
],
        anomaly_configuration: {
        already_run: {type: Boolean, default: false},
        pending_candidate: [],
        std_first_derivate: 0,
        median_first_derivate: 0
},
    firstValueTimeStamp: {type: Date, default: "2017-10-16T15:09:10.000Z"},
    timezone: 0,
    smart_frequency: {
        smart_frequency_trigger: {type: String, default: ""},
        smart_frequency_type: {type: String, default: "fixed"},
        smart_frequency_criteria: {type: String, default: ""},
        smart_frequency_trigger_value: 0,
        threshold_trigger: {type: String, default: ""},
        criteria_reverse: {type: Boolean, default: true}
}
});

DeviceSchema.plugin(mongoosePaginate);
DeviceSchema.index({deviceID: 1}, {unique: true, sparse: true});

const Devices = mongoose.model("Devices", DeviceSchema);

Devices.populateDBWithDummyData = function (numberOfDevices) {
        const docs = [...new Array(numberOfDevices)].map(_ => ({
            deviceID: randomize("A0", 6),
            deviceName: casual.full_name,
            lat: casual.latitude,
            lng: casual.longitude,
            deviceAlertTracking: casual.boolean,
            openData: casual.boolean,
            push_api: casual.boolean,
            deviceOnAlert: casual.boolean,
            sensorSetAlert: casual.boolean,
            frequency: casual.double(100, 500000),
            meta_data: {
                tank_total_volume: casual.double(100, 500000),
                tank_high: casual.double(100, 500000),
                minimum_filling_volume: casual.double(100, 500000),
                dead_zone: casual.double(100, 500000)
            },
            anomaly_configuration: {
                already_run: casual.boolean,
                std_first_derivate: casual.double(100, 500000),
                median_first_derivate: casual.double(100, 500000)
            },
            firstValueTimeStamp: new Date (casual.date("YYYY-MM-DD")),
            timezone: casual.double(100, 500000),
            smart_frequency: {
                smart_frequency_trigger_value: casual.double(100, 500000),
                criteria_reverse: casual.boolean
            }
        }));
        return Promise.all([Devices.insertMany(docs)]);
};

module.exports = Devices;

