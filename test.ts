// tests go here; this will not be compiled when this package is used as an extension.
ESP8266.onMQTTReceived(function (topic, receivedMessage) {
    if (topic == "test") {
        if (receivedMessage == "on") {
            basic.showIcon(IconNames.SmallHeart)
        } else if (receivedMessage == "off") {
            basic.showIcon(IconNames.Meh)
        } else if (receivedMessage == "1234") {
            basic.showIcon(IconNames.StickFigure)
        } else if (receivedMessage == "1234aaa") {
            basic.showIcon(IconNames.Pitchfork)
        }
    }
})
input.onButtonPressed(Button.A, function () {
    ESP8266.mqttpub("test", "test")
})
ESP8266.onWifiConnected(function () {
    basic.showIcon(IconNames.Yes)
    flag = true
})
ESP8266.onMQTTDisonnected(function () {
    basic.showIcon(IconNames.Sad)
    flag = true
})
ESP8266.onMQTTConnected(function () {
    basic.showIcon(IconNames.Happy)
    basic.pause(1000)
    ESP8266.mqttsub("microbit", 1)
})
ESP8266.onWifiDisconnected(function () {
    basic.showIcon(IconNames.No)
})
let flag = false
ESP8266.initializeWifi(SerialPin.P1, SerialPin.P2, BaudRate.BaudRate115200)
ESP8266.setWifi("", "")
ESP8266.setMQTT(
    "broker.hivemq.com",
    1883,
    "stem@eClass",
    "",
    ""
)
basic.forever(function () {
    if (flag) {
        ESP8266.connectmqtt()
        flag = false
    }
})
