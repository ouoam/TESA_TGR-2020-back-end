var mqtt   = require('mqtt');
var client = mqtt.connect('mqtt://167.99.68.69');
 
client.on('connect', function () {
    console.log("MQTT Connected.");

    setInterval(function() {
        client.publish('precamp', "Hello, We are {team}")
    }, 1000)
})
