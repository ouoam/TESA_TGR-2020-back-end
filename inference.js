const tf = require("@tensorflow/tfjs");

async function predict(data) {
  const model = await tf.loadLayersModel("http://localhost/model/model.json");
  const ytensor = model.predict(tf.tensor([data])).flatten();
  const ypred = await ytensor.array();
  return ypred;
}

module.exports = predict;
