const model = {
  pm25: require("./../model/pm25"),
  track: require("./../model/track")
};

let app = {};

async function cleansing() {
  var client = app.mongo.client;

  if (client && !client.isConnected()) {
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
              let sensorVal = Number.parseInt(value.value.DevEUI_uplink.payload_hex.substring(2, 4), 16);
              let device_id = Number.parseInt(value.value.DevEUI_uplink.payload_hex.substring(0, 2), 16);

              if (device_id == element.sensor_id && sensorVal != 191) {
                let diff_time = Math.abs(element.ts - value.value.DevEUI_uplink.Time);
                if (diff_time < 1000 * 60 * 3) {
                  let data2 = {
                    ts: element.ts,
                    device_id: Number(element.sensor_id),
                    lat: value.value.DevEUI_uplink.LrrLAT,
                    lon: value.value.DevEUI_uplink.LrrLON,
                    rssi: value.value.DevEUI_uplink.LrrRSSI,
                    value: sensorVal
                  };
                  db.collection("pm25_data" + app.env.MONGO_COLL).insertOne(data2, function(err, res) {
                    if (err) throw err;
                    // console.log("Add success. PM25", new Date());
                  });

                  app.influx.writePM25(data2);
                } else {
                  console.log("Data invalid time. time is diff more than 3 min", new Date());
                }
              } else {
                console.log("Data error not own device id or sensor error.", new Date());
              }
            } else {
              // console.log("Data validation error.");
            }
          } else if (element.sensor_type == "track") {
            let value = model.track.validate(element.data);
            if (!value.error) {
              let data2 = {
                ts: element.ts,
                sensor_id: `tgr${element.sensor_id}`,
                rssi: value.value.rssi,
                mac_addr: value.value.mac_addr,
                timestamp: value.value.timestamp,
                event_code: value.value.event_code
              };
              db.collection("track_data" + app.env.MONGO_COLL).insertOne(data2, function(err, res) {
                if (err) throw err;
                // console.log("Add success. track", new Date());
              });
            } else {
              // console.log("Data validation error.");
            }
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
