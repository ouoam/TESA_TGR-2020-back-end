const model = {
  pm25: require("./../model/pm25"),
  track: require("./../model/track")
};

let app = {};

async function cleansing() {
  var client = app.mongo.client;

  if (!client.isConnected()) {
    return;
  }

  try {
    const db = app.mongo.dbo;
    let collection = db.collection("raw_data" + app.env.MONGO_COLL);
    let query = { cleaned: { $ne: true } };
    await collection
      .find(query)
      .sort({ _id: 1 })
      .limit(1000)
      .toArray(function(err, result) {
        if (err) throw err;

        result.forEach(element => {
          if (element.sensor_type == "pm25") {
            let value = model.pm25.validate(element.data);
            if (!value.error) {
              let sensorVal = value.value.DevEUI_uplink.payload_hex;
              let data2 = {
                id: element.sensor_id,
                ts: element.ts,
                device_id: `tgr${element.sensor_id}`,
                location: {
                  lat: value.value.DevEUI_uplink.LrrLAT,
                  lon: value.value.DevEUI_uplink.LrrLON
                },
                rssi: value.value.DevEUI_uplink.LrrRSSI,
                value: sensorVal
              };
              db.collection("pm25_data" + app.env.MONGO_COLL).insertOne(data2, function(err, res) {
                if (err) throw err;
                console.log("Add success. PM25", new Date());
              });
            } else {
              console.log("Data validation error.");
            }
            isCleaned = true;
          } else if (element.sensor_type == "track") {
            let value = model.track.validate(element.data);
            if (!value.error) {
              let data2 = {
                id: element.sensor_id,
                ts: element.ts,
                sensor_id: `tgr${element.sensor_id}`,
                rssi: value.value.rssi,
                mac_addr: value.value.mac_addr
              };
              db.collection("track_data" + app.env.MONGO_COLL).insertOne(data2, function(err, res) {
                if (err) throw err;
                console.log("Add success. track", new Date());
              });
            } else {
              console.log("Data validation error.");
            }
            isCleaned = true;
          }

          collection.updateOne({ _id: element._id }, { $set: { cleaned: true } });
        });
      });
  } catch (err) {
    console.log(err);
  }
}

setInterval(cleansing, 1000);

module.exports = function(appIn) {
  app = appIn;
  return null;
};
