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
      payload_hex: "204e",
      LrrRSSI: "-100.000000",
      LrrSNR: "4.500000",
      LrrLAT: "19.027611",
      LrrLON: "99.891380"
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
