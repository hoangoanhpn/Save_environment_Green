#include <CayenneLPP.h>
#include <DHTesp.h>
#include <Adafruit_GPS.h>
#include <HardwareSerial.h>
#include <lmic.h>
#include <hal/hal.h>
#include <SPI.h>
#include <Wire.h>
#include <math.h>
#include "SSD1306.h"
#include <Servo.h>

// LoRaWAN NwkSKey, network session key
static const PROGMEM u1_t NWKSKEY[16] ={ 0x14, 0x7C, 0x1C, 0x23, 0xA3, 0x22, 0x6B, 0x31, 0xE4, 0x59, 0x7D, 0x2D, 0x79, 0x15, 0x96, 0x6F };
// LoRaWAN AppSKey, application session key
static const u1_t PROGMEM APPSKEY[16] = { 0x43, 0x94, 0xC7, 0x33, 0xF8, 0x16, 0x1E, 0x4B, 0x9E, 0x33, 0x79, 0x0F, 0xED, 0x7E, 0xB6, 0x68 };
// LoRaWAN end-device address (DevAddr)
static const u4_t DEVADDR = { 0x26041563 };
// These callbacks are only used in over-the-air activation, so they are
// left empty here (we cannot leave them out completely unless
// DISABLE_JOIN is set in config.h, otherwise the linker will complain).
void os_getArtEui (u1_t* buf) { }
void os_getDevEui (u1_t* buf) { }
void os_getDevKey (u1_t* buf) { }

static osjob_t sendjob;
// Schedule data trasmission in every this many seconds (might become longer due to duty
// cycle limitations).
// we set 10 seconds interval
const unsigned TX_INTERVAL = 10; // Fair Use policy of TTN requires update interval of at least several min. We set update interval here of 1 min for testing

// Pin mapping according to Cytron LoRa Shield RFM
// Pin mapping according to Cytron LoRa Shield RFM
const lmic_pinmap lmic_pins = {
  .nss = 18,
  .rxtx = LMIC_UNUSED_PIN,
  .rst = 14,
  .dio = {26, 35, 34},
};

int trigger=17; 
int echo=36;  

Servo servo;
int trigger_servo= 23;
int echo_servo = 19;
int servoPin = 21;
//int done=12;
int led_green = 34;
int led_red =37;
// downlink
#define LED_1 17
#define LED_2 19

CayenneLPP lpp(15);
DHTesp dht;
SSD1306  display(0x3c, 4, 15);


void onEvent (ev_t ev) 
{
  Serial.print(os_getTime());
  Serial.print(": ");
  switch(ev) 
  {
    case EV_TXCOMPLETE:
      Serial.printf("EV_TXCOMPLETE (includes waiting for RX windows)\r\n");
      // Schedule next transmission
      os_setTimedCallback(&sendjob, os_getTime()+sec2osticks(TX_INTERVAL), do_send);
      break;  
    case EV_RXCOMPLETE:
              //------ Added ----------------
              if (LMIC.dataLen == 1) {
                uint8_t result = LMIC.frame[LMIC.dataBeg + 0];
                if (result == 0)  {
                  Serial.println("RESULT 0");
                  digitalWrite(LED_1, LOW);
                  digitalWrite(LED_2, LOW);
                }              
                if (result == 1)  {
                  Serial.println("RESULT 1");
                  digitalWrite(LED_1, HIGH);
                  digitalWrite(LED_2, LOW);                  
                } 
                if (result == 2)  {
                  Serial.println("RESULT 2");
                  digitalWrite(LED_1, LOW);
                  digitalWrite(LED_2, HIGH);                     
                } 
                if (result == 3)  {
                  Serial.println("RESULT 3");
                  digitalWrite(LED_1, HIGH);
                  digitalWrite(LED_2, HIGH);                       
                }                                             
              }
             Serial.println();
      
      break;
    default:
      Serial.printf("Unknown event\r\n");
      break;
  }
}

void do_send(osjob_t* j)
{
  
  // Check if there is not a current TX/RX job running
  if (LMIC.opmode & OP_TXRXPEND) 
  {
    Serial.printf("OP_TXRXPEND, not sending\r\n");
  } 
  else
  if (!(LMIC.opmode & OP_TXRXPEND)) 
  {
    /*TempAndHumidity newValues = dht.getTempAndHumidity();
    
    lpp.reset();
    lpp.addTemperature(1, newValues.temperature);
    lpp.addRelativeHumidity(2, newValues.humidity);
    
    Serial.printf("Temperature : %.2f, Humidity : %.2f\r\n", newValues.temperature, newValues.humidity);

    display.drawString(0, 0, "Temperature: ");
    display.drawString(90, 0, String(newValues.temperature));
    display.drawString(0, 20, "Humidity  : ");
    display.drawString(90,20, String(newValues.humidity));
    display.display();    

*/
// byte dữ liệu 
// coi cấu hình call back  ttn 
    uint8_t buff[2];
    buff[0]= getdistance();
    buff[1]= getdistance_servo();
    display.drawString(0, 0, "Distance 1: ");
    display.drawString(90, 0, String(getdistance()));
     display.drawString(0, 10, "Distance servo: ");
    display.drawString(90, 10, String(getdistance_servo()));
   display.display();    
       
       
/*#if 0    
    // Now for GPS
    if (GPS.fix)
    {
      float lat = GPS.latitudeDegrees;
      float lon = GPS.longitudeDegrees;
      float alt = GPS.geoidheight;
      Serial.printf("GPS lat = %.2f, lon = %.2f, alt = %.2f\n", lat, lon, alt);
      lpp.addGPS(3, lat, lon, alt);
    }*/
//#endif
    // Prepare upstream data transmission at the next possible time.
    LMIC_setTxData2(1, buff, sizeof(buff), 0);
     //LMIC_setTxData2(1, lpp.getBuffer(), lpp.getSize(), 0);   
    Serial.printf("Packet queued\r\n");
  }
  // Next TX is scheduled after TX_COMPLETE event.
}

void setup() 
{
  Serial.begin(115200);
  //gpsSerial.begin(115200, SERIAL_8N1, SERIAL1_RXPIN, SERIAL1_TXPIN);
  Serial.printf("Starting...\r\n");
  pinMode(led_red, OUTPUT);
  pinMode(led_green, OUTPUT);    
  pinMode(16,OUTPUT);
  digitalWrite(16, LOW); // set GPIO16 low to reset OLED
  delay(50);
  digitalWrite(16, HIGH);
  display.init();
  display.setFont(ArialMT_Plain_10);

  /////////////////////////////////////////////////////////////////////////////////////
   //Thiết lập chân trig là đầu ra
   pinMode(trigger, OUTPUT); 
//    pinMode(done, OUTPUT);
    pinMode(echo, INPUT); 

  //Thiết lập chân trig là đầu ra
   pinMode(trigger_servo, OUTPUT); 
//    pinMode(done, OUTPUT);
    pinMode(echo_servo, INPUT); 
    servo.attach(servoPin);
    servo.write(0);         //close cap on power on
    delay(1000); // delay 1s
    servo.detach();
///////////// DOWNLINK ////////////////////////
    pinMode(LED_1, OUTPUT);
    pinMode(LED_2, OUTPUT);
  
  
  //dht.setup(dhtPin, DHTesp::DHT11);
/*  
#if 0
  // 9600 NMEA is the default baud rate for Adafruit MTK GPS's- some use 4800
  GPS.begin(9600);
  
  // uncomment this line to turn on RMC (recommended minimum) and GGA (fix data) including altitude
  GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);
  // uncomment this line to turn on only the "minimum recommended" data
  //GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCONLY);
  // For parsing data, we don't suggest using anything but either RMC only or RMC+GGA since
  // the parser doesn't care about other sentences at this time
  
  // Set the update rate
  GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ);   // 1 Hz update rate
  // For the parsing code to work nicely and have time to sort thru the data, and
  // print it out we don't suggest using anything higher than 1 Hz

  // Request updates on antenna status, comment out to keep quiet
  GPS.sendCommand(PGCMD_ANTENNA);*/
//#endif
  
  // LMIC init
  os_init();
  // Reset the MAC state. Session and pending data transfers will be discarded.
  LMIC_reset();
  // Set static session parameters. Instead of dynamically establishing a session
  // by joining the network, precomputed session parameters are be provided.
  uint8_t appskey[sizeof(APPSKEY)];
  uint8_t nwkskey[sizeof(NWKSKEY)];
  memcpy_P(appskey, APPSKEY, sizeof(APPSKEY));
  memcpy_P(nwkskey, NWKSKEY, sizeof(NWKSKEY));
  LMIC_setSession (0x1, DEVADDR, nwkskey, appskey);

    #if defined(CFG_eu868)
    // Set up the channels used by the Things Network, which corresponds
    // to the defaults of most gateways. Without this, only three base
    // channels from the LoRaWAN specification are used, which certainly
    // works, so it is good for debugging, but can overload those
    // frequencies, so be sure to configure the full frequency range of
    // your network here (unless your network autoconfigures them).
    // Setting up channels should happen after LMIC_setSession, as that
    // configures the minimal channel set.
    LMIC_setupChannel(0, 433175000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
    /*LMIC_setupChannel(1, 433375000, DR_RANGE_MAP(DR_SF12, DR_SF7B), BAND_CENTI);      // g-band
    LMIC_setupChannel(2, 433575000,   DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
    LMIC_setupChannel(3,433775000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
    LMIC_setupChannel(4,433975000, DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
    LMIC_setupChannel(5,  434175000,  DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
    LMIC_setupChannel(6, 434375000,  DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
    LMIC_setupChannel(7, 434575000,  DR_RANGE_MAP(DR_SF12, DR_SF7),  BAND_CENTI);      // g-band
    LMIC_setupChannel(8,   434775000 ,  DR_RANGE_MAP(DR_FSK,  DR_FSK),  BAND_MILLI);      // g2-band*/
    // TTN defines an additional channel at 869.525Mhz using SF9 for class B
    // devices' ping slots. LMIC does not have an easy way to define set this
    // frequency and support for class B is spotty and untested, so this
    // frequency is not configured here.
    #elif defined(CFG_us915)
    // NA-US channels 0-71 are configured automatically
    // but only one group of 8 should (a subband) should be active
    // TTN recommends the second sub band, 1 in a zero based count.
    // https://github.com/TheThingsNetwork/gateway-conf/blob/master/US-global_conf.json
    LMIC_selectSubBand(1);
    #endif

    // Disable link check validation
    LMIC_setLinkCheckMode(0);

    // TTN uses SF9 for its RX2 window.
    LMIC.dn2Dr = DR_SF9;

    // Set data rate and transmit power for uplink
    LMIC_setDrTxpow(DR_SF7,14);
  Serial.printf("LMIC setup done!\r\n");
  // Start job
  do_send(&sendjob);
}
int distance;
int distance_servo;
void loop() 
{
  close_open();
  getdistance();
  getdistance_servo();
  /*if ( distance >30)
  {
       digitalWrite(led_green, HIGH);  
  }
  if (  distance >0 && distance< 10)
  {
    digitalWrite(led_green, LOW);
    digitalWrite(led_red, HIGH);    
    }
    /////////////////////////

     if ( distance_1>30)
  {
    Serial.print("xanh");
        
       Serial.print("xanh sang");
  }
  if (  distance_1 >0 && distance_1< 10)
  {
    digitalWrite(led_green, LOW);
    digitalWrite(led_red, HIGH);    
    } */
 os_runloop_once();
    #ifdef SEND_BY_BUTTON
      if (digitalRead(0) == LOW) {
        while (digitalRead(0) == LOW) ;
        do_send(&sendjob);
      }
    #endif
}
uint8_t getdistance(){
  long duration=0; 
  uint8_t distance=0; 
  digitalWrite(trigger, LOW); 
  delay(5); 
  digitalWrite(trigger, HIGH); 
  delay(10);
  digitalWrite(trigger, LOW);
  duration = pulseIn(echo, HIGH); 
  distance = (duration/2) * 0.03432; 
  if (distance >= 500 || distance <= 0) 
  {
    Serial.println("nope");  digitalWrite(led_green, HIGH);
  }
  else 
  {
    Serial.print(distance); 
    Serial.println(" cm"); 
  }
  return distance;
}

 long duration_servo;
 //uint8_t distance_1;
uint8_t getdistance_servo(){
  
  digitalWrite(trigger_servo, LOW); 
  delay(5); 
  digitalWrite(trigger_servo, HIGH); 
  delay(10);
  digitalWrite(trigger_servo, LOW);
  duration_servo = pulseIn(echo_servo, HIGH); 
  distance_servo = (duration_servo/2) * 0.03432; 
  if (distance_servo >= 500 || distance_servo <= 0) 
  {
    Serial.println("nope"); 
  }
  else 
  {
    Serial.print(distance_servo); 
    Serial.println(" cm"); 
  }
  return distance_servo;
}

void close_open() 
{
   //lấy giá trị khoảng cách 
  getdistance_servo();

  Serial.print("Khoang cach cua sensor: ");
  Serial.println(distance_servo);
  
  // nếu có vật có khoảng cách từ 0 đến 30cm thì servo bắt đầu chạy
   if ( distance_servo < 30 && distance_servo > 0 ) {

    servo.attach(servoPin);
    delay(1);
    servo.write(180);    //servo quay 180 (mở nắp thùng)
    delay(3000);       //giữ trạng thái 5 mở nắp 5s
    servo.write(0);    //servo trở về trạng thái cũ ( đóng nắp)
    delay(1000);
    servo.detach();    //kết thúc hoạt động
    }
}
