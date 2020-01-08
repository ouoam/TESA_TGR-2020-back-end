const Joi = require("@hapi/joi");

const schema = Joi.object({
  DevEUI_uplink: {
    Time: Joi.string(),
    LrrRSSI: Joi.number()
      .integer()
      .required(),
    LrrLAT: Joi.number().required(),
    LrrLON: Joi.number().required(),
    payload_hex: Joi.string()
      .hex()
      .required(),
    DevEUI: Joi.string()
      .hex()
      .required()
  }
}).options({ stripUnknown: true });

console.log(
  1,
  schema.validate({
    DevEUI_uplink: {
      Time: "2020-01-07T23:25:25.495+07:00",
      DevEUI: "AA00DBCA14EF1432",
      DevAddr: "14EF1432",
      FPort: "2",
      FCntUp: "28",
      MType: "2",
      FCntDn: "27",
      payload_hex: "204e",
      mic_hex: "23efae6c",
      Lrcid: "00000231",
      LrrRSSI: "-100.000000",
      LrrSNR: "4.500000",
      SpFact: "12",
      SubBand: "G1",
      Channel: "LC1",
      DevLrrCnt: "1",
      Lrrid: "1000018F",
      Late: "0",
      LrrLAT: "19.027611",
      LrrLON: "99.891380",
      Lrrs: {
        Lrr: [
          {
            Lrrid: "1000018F",
            Chain: "0",
            LrrRSSI: "-100.000000",
            LrrSNR: "4.500000",
            LrrESP: "-101.318794"
          }
        ]
      },
      CustomerID: "1100008397",
      CustomerData: {
        alr: {
          pro: "LORA/Generic",
          ver: "1"
        }
      },
      ModelCfg: "0",
      InstantPER: "0.000000",
      MeanPER: "0.000000"
    }
  })
);
// -> { value: { username: 'abc', birth_year: 1994 } }

//console.log(2, schema.validate({}));
// -> { value: {}, error: '"username" is required' }

// Also -

async function a() {
  try {
    console.log(await schema.validateAsync({ username: "abc", birth_year: 1994 }));
  } catch (err) {}
}

a();
