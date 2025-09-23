#include <Wire.h>
#include <WiFi.h>
#include "Adafruit_TCS34725.h"
#include <LiquidCrystal_I2C.h>
#include <time.h>
#include "SupabaseArduino.h"

// ------------------ WiFi ------------------
const char *ssid = "as";
const char *password = "12345678";

// ------------------ Firebase ------------------
#define SUPABASE_URL "https://ixkehiylalwwjtkcdzvk.supabase.co"
#define SUPABASE_API_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4a2VoaXlsYWx3d2p0a2NkenZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MDg4MzIsImV4cCI6MjA3NDE4NDgzMn0.wwYN47eGor9YSqnbfmSYsnXHxhEMeBzAbi7wVs-zGz8"
#define TABLE_NAME "transactions"

SUPABASE supabaseClient(SUPABASE_URL, SUPABASE_API_KEY, TABLE_NAME);

String userId = "fxQNVL1gFaeGdGfWUoIi2jNoVJd2"; 

// ------------------ TCS34725 Sensors ------------------
// Debit sensor (SDA=13, SCL=14)
TwoWire I2C_debit = TwoWire(0);
Adafruit_TCS34725 debitSensor = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);

// Credit sensor (SDA=21, SCL=23)
TwoWire I2C_credit = TwoWire(1);
Adafruit_TCS34725 creditSensor = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);

// ------------------ Timezone ------------------
const char *ntpServer1 = "time.nist.gov";
const char *ntpServer2 = "in.pool.ntp.org";
const char *ntpServer3 = "pool.ntp.org";
const long gmtOffset_sec = 19800;
const int daylightOffset_sec = 0;

// ------------------ Variables ------------------
int count_100 = 0, count_200 = 0, count_500 = 0;
float total = 5000.0;
String lastNote = "None";

unsigned long lastDetectionTime = 0;
unsigned long detectionCooldown = 3000;

bool debitNotePresent = false;
bool creditNotePresent = false;

// ------------------ Helper Functions ------------------

String getTimestamp() {
  time_t now;
  struct tm timeinfo;
  time(&now);
  localtime_r(&now, &timeinfo);
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%d-%m-%Y %H:%M:%S", &timeinfo);
  return String(buffer);
}

void sendToSupabase(String type, float amount, String note) {
  // Supabase-Arduino library's insert method takes a JSON string.
  // We need to construct this string manually or using a JSON library if available.
  String jsonData = "{";
  jsonData += "\"time\": \"" + getTimestamp() + "\",";
  jsonData += "\"type\": \"" + type + "\",";
  jsonData += "\"amount\": " + String(amount) + ",";
  jsonData += "\"mode\": \"cash\",";
  jsonData += "\"userID\": \"" + userId + "\",";
  jsonData += "\"note\": \"" + note + "\"";
  jsonData += "}";

  // Using the SupabaseArduino insert method
  if (supabaseClient.insert(jsonData)) {
    Serial.println("Transaction sent to Supabase successfully");
  } else {
    Serial.println("Error sending to Supabase");
  }
}

// ---------- Debit sensor thresholds ----------
bool isNote100_debit(uint16_t r, uint16_t g, uint16_t b) {
  return (r >= 1630 && r <= 1700) && (g >= 1640 && g <= 1710) && (b >= 1290 && b <= 1380);
}
bool isNote200_debit(uint16_t r, uint16_t g, uint16_t b) {
  return (r >= 2250 && r <= 2400) && (g >= 1530 && g <= 1600) && (b >= 800 && b <= 900);
}
bool isNote500_debit(uint16_t r, uint16_t g, uint16_t b) {
  return (r >= 1500 && r <= 1580) && (g >= 1480 && g <= 1550) && (b >= 901 && b <= 1000);
}

// ---------- Credit sensor thresholds ----------
bool isNote100_credit(uint16_t r, uint16_t g, uint16_t b) {
  return (r >= 1100 && r <= 1200) && (g >= 750 && g <= 850) && (b >= 500 && b <= 600);
}
bool isNote200_credit(uint16_t r, uint16_t g, uint16_t b) {
  return (r >= 2200 && r <= 2400) && (g >= 1450 && g <= 1600 ) && (b >= 750 && b <= 850);
}
bool isNote500_credit(uint16_t r, uint16_t g, uint16_t b) {
  return (r >= 1600 && r <= 1850) && (g >= 1200 && g <= 1450) && (b >= 700 && b <= 810);
}

// ------------------ LCD Update ------------------
void updateLCD() {
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Bal: Rs "); lcd.print(total,0);
  lcd.setCursor(0,1);
  lcd.print("100:" + String(count_100) + " 200:" + String(count_200) + " 500:" + String(count_500));
}

// ------------------ Setup ------------------
void setup() {
  Serial.begin(115200);
  Serial.println("\nStarting Smart Currency Counter...");

  // LCD Init
  lcd.begin();
  lcd.backlight();
  lcd.setCursor(0,0); lcd.print("Initializing...");

  // Sensors Init
  I2C_debit.begin(13,14);
  I2C_credit.begin(21,23);

  if (!debitSensor.begin(TCS34725_ADDRESS, &I2C_debit)) Serial.println("Debit sensor failed!");
  else Serial.println("Debit sensor ready");

  if (!creditSensor.begin(TCS34725_ADDRESS, &I2C_credit)) Serial.println("Credit sensor failed!");
  else Serial.println("Credit sensor ready");

  // WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while(WiFi.status()!=WL_CONNECTED){ delay(500); Serial.print("."); }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer1, ntpServer2, ntpServer3);

  // Supabase Init
  supabaseClient.begin();

  lcd.clear();
  lcd.setCursor(0,0); lcd.print("Ready!");
  lcd.setCursor(0,1); lcd.print("Bal: Rs " + String(total,0));
}

// ------------------ Loop ------------------
void loop() {
  unsigned long currentMillis = millis();
  if(currentMillis - lastDetectionTime < detectionCooldown) return;

  uint16_t r1,g1,b1,c1,r2,g2,b2,c2;
  debitSensor.getRawData(&r1,&g1,&b1,&c1);
  creditSensor.getRawData(&r2,&g2,&b2,&c2);

  Serial.printf("\nDebit: R=%d G=%d B=%d | Credit: R=%d G=%d B=%d\n", r1,g1,b1,r2,g2,b2);

  // Debit detection
  if(!debitNotePresent){
    if(isNote100_debit(r1,g1,b1) && total>=100){ count_100++; total-=100; lastNote="100 Debited"; sendToSupabase("debit",100,lastNote); debitNotePresent=true; }
    else if(isNote200_debit(r1,g1,b1) && total>=200){ count_200++; total-=200; lastNote="200 Debited"; sendToSupabase("debit",200,lastNote); debitNotePresent=true; }
    else if(isNote500_debit(r1,g1,b1) && total>=500){ count_500++; total-=500; lastNote="500 Debited"; sendToSupabase("debit",500,lastNote); debitNotePresent=true; }
  }

  // Credit detection
  if(!creditNotePresent){
    if(isNote100_credit(r2,g2,b2)){ total+=100; lastNote="100 Credited"; sendToSupabase("credit",100,lastNote); creditNotePresent=true; }
    else if(isNote200_credit(r2,g2,b2)){ total+=200; lastNote="200 Credited"; sendToSupabase("credit",200,lastNote); creditNotePresent=true; }
    else if(isNote500_credit(r2,g2,b2)){ total+=500; lastNote="500 Credited"; sendToSupabase("credit",500,lastNote); creditNotePresent=true; }
  }

  // Reset note presence
  if(!(isNote100_debit(r1,g1,b1)||isNote200_debit(r1,g1,b1)||isNote500_debit(r1,g1,b1))) debitNotePresent=false;
  if(!(isNote100_credit(r2,g2,b2)||isNote200_credit(r2,g2,b2)||isNote500_credit(r2,g2,b2))) creditNotePresent=false;

  lastDetectionTime=currentMillis;

  Serial.printf("Balance: Rs %.2f | 100:%d 200:%d 500:%d\n", total,count_100,count_200,count_500);

  updateLCD(); // Display balance + counts
  delay(10);
}