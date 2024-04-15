//%color=#0B0B61 icon="\uf1eb" block="IoT"
namespace ESP8266 {

    serial.setRxBufferSize(128);
    serial.setTxBufferSize(128);

    // -------------- Initialization ----------------
    /**
     * Initialize the TX and RX pins for connecting the WiFi Module.
    */
    //%blockId=esp8266_initialize_wifi
    //%block="Initialize WiFi TX %tx|RX %rx|Baud rate %baudrate"
    //%baudrate.defl=BaudRate.BaudRate115200
    //% tx.fieldEditor="gridpicker" tx.fieldOptions.columns=3
    //% tx.fieldOptions.tooltips="false"
    //% rx.fieldEditor="gridpicker" rx.fieldOptions.columns=3
    //% rx.fieldOptions.tooltips="false"
    //% weight=82
    export function initializeWifi(tx: SerialPin, rx: SerialPin, baudrate: BaudRate): void {
        serial.redirect(tx, rx, baudrate);
        serial.writeString("AT+RST\r\n");
        basic.pause(3000);
    }

    // -------------- WiFi ----------------
    /**
     * Set the SSID and Password for the WiFi Module to connect.
    */
    //% blockId=esp8266_set_wifi
    //% block="Set WiFi to ssid %ssid| pwd %pwd"
    //% weight=81
    export function setWifi(ssid: string, pwd: string): void {
        serial.writeString("AT+CWMODE=1\r\n");
        basic.pause(500);
        serial.writeString("AT+CWJAP=\"" + ssid + "\",\"" + pwd + "\"\r\n");
        basic.pause(500);
    }

    // -------------- Cloud Services ----------------
    /**
     * Send single data to ThingSpeak.
    */
    //% blockId=esp8266_set_thingspeak
    //% block="Send ThingSpeak key %key| field1 %field1"
    //% text.shadowOptions.toString=true
    //% subcategory=Cloud
    //% weight=78
    export function sendThingspeak(key: string, field1: string): void {
        let message = "GET /update?api_key=" + key + "&field1=" + field1 + "\r\n\r\n";
        serial.writeString("AT+CIPMUX=0\r\n");
        basic.pause(500);
        serial.writeString("AT+CIPSTART=\"TCP\",\"api.thingspeak.com\",80\r\n");
        basic.pause(1000);
        serial.writeString("AT+CIPSEND=" + message.length + "\r\n");
        basic.pause(500);
        serial.writeString(message);
        basic.pause(1000);
        serial.writeString("AT+CIPCLOSE\r\n");
        basic.pause(1000);
    }

    /**
     * Send an array of data (aka mutiple data) to ThingSpeak.
    */
    //% blockId=esp8266_set_thingspeak_list
    //% block="Send ThingSpeak key %key| array %fields"
    //% subcategory=Cloud
    //% weight=77
    export function sendThingspeakwithArray(key: string, fields: string[]): void {
        let message2 = "GET /update?api_key=" + key + "&";
        for (let i = 0; i < fields.length; i++) {
            if (i == fields.length - 1) {
                message2 = message2 + "field" + (i + 1) + "=" + fields[i];
            } else {
                message2 = message2 + "field" + (i + 1) + "=" + fields[i] + "&";
            }
        }
        message2 = message2 + "\r\n\r\n";
        serial.writeString("AT+CIPMUX=0\r\n");
        basic.pause(500);
        serial.writeString("AT+CIPSTART=\"TCP\",\"api.thingspeak.com\",80\r\n");
        basic.pause(1000);
        serial.writeString("AT+CIPSEND=" + message2.length + "\r\n");
        basic.pause(500);
        serial.writeString(message2);
        basic.pause(3000);
        serial.writeString("AT+CIPCLOSE\r\n");
        basic.pause(1000);
    }

    /**
     * Send single data to IFTTT Event Trigger.
    */
    //% blockId=esp8266_set_ifttt
    //% block="Send IFTTT key %key|event_name %eventname|value %value"
    //% text.shadowOptions.toString=true
    //% subcategory=Cloud
    //% weight=80
    export function sendIFTTT(key: string, eventname: string, value: string): void {
        let message3 = "GET /trigger/" + eventname + "/with/key/" + key + "?value1=" + value + " HTTP/1.1\r\nHost: maker.ifttt.com\r\nConnection: close\r\n\r\n";
        serial.writeString("AT+CIPMUX=0\r\n");
        basic.pause(500)
        serial.writeString("AT+CIPSTART=\"TCP\",\"maker.ifttt.com\",80\r\n");
        basic.pause(1000);
        serial.writeString("AT+CIPSEND=" + message3.length + "\r\n");
        basic.pause(500);
        serial.writeString(message3);
        basic.pause(1000);
        serial.writeString("AT+CIPCLOSE\r\n");
        basic.pause(1000);
    }

    /**
     * Send an array of data (aka mutiple data) to IFTTT Event Trigger.
    */
    //% blockId=esp8266_set_ifttt_list
    //% block="Send IFTTT key %key|event_name %eventname|array %values"
    //% subcategory=Cloud
    //% weight=79
    export function sendIFTTTwithArray(key: string, eventname: string, values: string[]): void {
        let message4 = "GET /trigger/" + eventname + "/with/key/" + key + "?";
        for (let j = 0; j < values.length; j++) {
            if (j == values.length - 1) {
                message4 = message4 + "value" + (j + 1) + "=" + values[j];
            } else {
                message4 = message4 + "value" + (j + 1) + "=" + values[j] + "&";
            }
        }
        message4 = message4 + " HTTP/1.1\r\nHost: maker.ifttt.com\r\nConnection: close\r\n\r\n";
        serial.writeString("AT+CIPMUX=0\r\n");
        basic.pause(500);
        serial.writeString("AT+CIPSTART=\"TCP\",\"maker.ifttt.com\",80\r\n");
        basic.pause(1000);
        serial.writeString("AT+CIPSEND=" + message4.length + "\r\n");
        basic.pause(500);
        serial.writeString(message4);
        basic.pause(3000);
        serial.writeString("AT+CIPCLOSE\r\n");
        basic.pause(1000);
    }

    /** Convert a number to a string. */
    //%blockId=make_string
    //%block="number to string %target"
    //%weight=0
    export function make_string(target: number): string {
        return target.toString();
    }

    // -------------- Event ----------------
    type EvtAct = () => void;
    type EvtMsg = (topic: string, data: string) => void;

    let wificonnected: EvtAct = null;
    let wifidisconnected: EvtAct = null;
    let mqttconnected: EvtAct = null;
    let mqttdisconncted: EvtAct = null;
    let mqttmsg: EvtMsg = null;

    let actSuccess = false;

    serial.onDataReceived("\n", function () {
       let msg_str = serial.readString();
       let msg_size = msg_str.length;
       let serial_msg: string = msg_str + "";

       if (serial_msg.indexOf("WIFI CONNECTED", 0) != -1) {
           if (wificonnected) wificonnected();
       }
       if (serial_msg.indexOf("WIFI DISCONNECT", 0) != -1) {
           if (wifidisconnected) wifidisconnected();
       }
       if (serial_msg.indexOf("+MQTTCONNECTED", 0) != -1) {
           if (mqttconnected) mqttconnected();
       }
       if (serial_msg.indexOf("+MQTTDISCONNECTED", 0) != -1) {
           if (mqttdisconncted) mqttdisconncted();
       }
       if (serial_msg.indexOf("OK", 0) != -1) {
           if (actSuccess) actSuccess = true;
       }
       if (serial_msg.indexOf("+MQTTSUBRECV:", 0) != -1) {
           let cammaPos = [];
           for (let i=0; i<serial_msg.length; i++) {
               if (serial_msg[i] == ",") {
                   cammaPos.push(i);
               }
           }
           let mqttTopic = serial_msg.substr(cammaPos[0] + 2, cammaPos[1] - cammaPos[0] - 3);
           let mqttMessage = serial_msg.substr(cammaPos[2] + 1, serial_msg.length - cammaPos[2] - 3);
           if (mqttmsg) mqttmsg(mqttTopic, mqttMessage);
       }
    })

    //% block="On WiFi connected"
    //% subcategory=Event
    //% weight=13
    export function onWifiConnected(body: () => void) {
        wificonnected = body;
    }

    //% block="On WiFi disconnected"
    //% subcategory=Event
    //% weight=12
    export function onWifiDisconnected(body: () => void) {
        wifidisconnected = body;
    }

    //% block="MQTT server connected"
    //% subcategory=Event
    //% weight=11
    export function onMQTTConnected(body: () => void) {
        mqttconnected = body;
    }

    //% block="MQTT server disconnected"
    //% subcategory=Event
    //% weight=10
    export function onMQTTDisonnected(body: () => void) {
        mqttdisconncted = body;
    }

    // -------------- MQTT ----------------
    
    let mqttClientID = "";
    let mqttClientName = "";
    let mqttClientPWD = "";

    let mqttServerIP = "";
    let mqttServerPort = 1883;

    function mqttCongif(): void {
        serial.writeString("AT+MQTTCLEAN=0\r\n");
        basic.pause(500);
        serial.writeString("AT+MQTTUSERCFG=0,1,\"" + mqttClientID + "\",\"" + mqttClientName + "\",\"" + mqttClientPWD + "\",0,0,\"\"\r\n");
        basic.pause(1000);
    }
    function mqttConServer(): void{
        serial.writeString("AT+MQTTCONN=0,\"" + mqttServerIP + "\"," + mqttServerPort + ",0\r\n");
        basic.pause(5000);
    }

    //% block="Setting MQTT server %server|Port %port|ID %id|Username %user|Password %password"
    //% blockExternalInputs=true
    //% subcategory=MQTT
    //% weight=24
    export function setMQTT(server: string, port: number, id: string, user: string, password: string): void {
        basic.pause(5000);
        
        mqttServerIP = server;
        mqttServerPort = port;

        mqttClientID = id;
        mqttClientName = user;
        mqttClientPWD = password;
    }

    //% block="Connect MQTT server"
    //% subcategory=MQTT
    //% weight=23
    export function connectmqtt(): void {
        mqttCongif();
        mqttConServer();
    }

    //% block="Subscribe MQTT topic %topic|QoS %qos"
    //% qos.defl=1 qos.min=0 qos.max=2
    //% subcategory=MQTT
    //% weight=22
    export function mqttsub(topic: string, qos: number): void {
        basic.pause(1000);
        serial.writeString("AT+MQTTSUB=0,\"" + topic + "\"," + qos + "\r\n");
        basic.pause(500);
    }

    //% block="Publish message to topic %topic|msg %qos"
    //% subcategory=MQTT
    //% weight=21
    export function mqttpub(topic: string, msg: string): void {
        basic.pause(1000);
        serial.writeString("AT+MQTTPUB=0,\"" + topic + "\",\"" + msg + "\",1,0\r\n");
        basic.pause(500);
    }

    //% block="On MQTT received"
    //% draggableParameters
    //% subcategory=MQTT
    //% weight=20
    export function onMQTTReceived(body: (topic: string, receivedMessage: string) => void): void {
        mqttmsg = body;
    }
}
