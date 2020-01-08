const Joi = require("@hapi/joi");

const schema = Joi.object({
  DevEUI_uplink: {
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

module.exports = schema;
