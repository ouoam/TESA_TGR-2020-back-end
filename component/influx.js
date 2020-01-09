const EventEmitter = require("events");

const Influx = require("influx");
const geohash = require("ngeohash");

let app = {};

class influxEmitter extends EventEmitter {
  constructor() {
    super();
    this.influx = "";

    this.influx = new Influx.InfluxDB({
      host: app.env.INFLUX_SERVER,
      database: app.env.INFLUX_DB,
      port: Number(app.env.INFLUX_PORT),
      username: app.env.INFLUX_USER,
      password: app.env.INFLUX_PASS,
      schema: [
        {
          measurement: "pm25",
          fields: {
            val: Influx.FieldType.INTEGER,
            rssi: Influx.FieldType.INTEGER
          },
          tags: ["device_id", "geohash"]
        }
      ]
    });

    this.influx
      .getDatabaseNames()
      .then(names => {
        if (!names.includes("pm25_data")) {
          return this.influx.createDatabase("pm25_data");
        }
      })
      .catch(error => console.log({ error }));
  }

  writePM25(data) {
    if (this.influx != "") {
      this.influx
        .writePoints([
          {
            measurement: "pm25",
            fields: {
              val: data.value,
              rssi: data.rssi
            },
            tags: { device_id: data.device_id, geohash: geohash.encode(data.lat, data.lon) },
            timestamp: data.ts
          }
        ])
        .catch(error => {
          console.error(`Error saving data to InfluxDB! ${err.stack}`);
        });
    }
  }
}

module.exports = appIn => {
  app = appIn;
  return new influxEmitter();
};
