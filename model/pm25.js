const Joi = require("@hapi/joi");

const schema = Joi.object({
  DevEUI_uplink: Joi.object({
    LrrRSSI: Joi.number()
      .integer()
      .required(),
    LrrLAT: Joi.number().required(),
    LrrLON: Joi.number().required(),
    payload_hex: Joi.string()
      .hex()
      .min(4)
      .max(4)
      .required(),
    DevEUI: Joi.string()
      .hex()
      .required(),
    Time: Joi.date().required()
  }).required()
}).options({ stripUnknown: true });

module.exports = schema;
