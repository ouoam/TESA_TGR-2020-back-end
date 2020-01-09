const Joi = require("@hapi/joi");

const schema = Joi.object({
  mac_addr: Joi.string().pattern(new RegExp("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$")),
  rssi: Joi.number().required()
}).options({ stripUnknown: true });

module.exports = schema;
