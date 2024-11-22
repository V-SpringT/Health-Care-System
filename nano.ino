#include <SoftwareSerial.h>

// Định nghĩa chân kết nối với ESP8266
const int PIN_RX = 5;     // D5 Arduino -> TX ESP8266
const int PIN_TX = 6;     // D6 Arduino -> RX ESP8266

// Định nghĩa chân analog cho các cảm biến
const int FLEX_1 = A0;    // Cảm biến uốn 1
const int FLEX_2 = A1;    // Cảm biến uốn 2
const int FLEX_3 = A2;    // Cảm biến uốn 3
const int FLEX_4 = A3;    // Cảm biến uốn 4
const int ECG_PIN = A4;   // AD8232 ECG
const int ADXL_X = A5;    // ADXL335 trục X
const int ADXL_Y = A6;    // ADXL335 trục Y
const int TEMP_PIN = A7;  // LM35 nhiệt độ

// Chân điều khiển AD8232
const int LO_PLUS = 4;    // Chân LO+ của AD8232
const int LO_MINUS = 5;   // Chân LO- của AD8232

// Khởi tạo giao tiếp Serial với ESP8266
SoftwareSerial espSerial(PIN_RX, PIN_TX); // RX, TX

// Biến lưu dữ liệu cảm biến
int flexValues[4];    // Mảng lưu giá trị 4 cảm biến uốn
int ecgValue = 80;         // Giá trị ECG
int accelX, accelY;   // Giá trị gia tốc X,Y
float temperature;    // Nhiệt độ

bool read = true;
int length = 200;
byte buffer[200];
int indexBuffer = 0;

const int threshold = 500;     // Ngưỡng phát hiện đỉnh
unsigned long lastPeakTime = 0; // Thời gian đỉnh trước đó
unsigned long currentTime = 0; // Thời gian hiện tại

void setup() {
  // Khởi tạo Serial để debug
  Serial.begin(9600);
  
  // Khởi tạo giao tiếp với ESP8266
  espSerial.begin(9600);
  
  // Cấu hình chân AD8232
  pinMode(LO_PLUS, INPUT);
  pinMode(LO_MINUS, INPUT);

  Serial.println("setup");
}

void loop() { 

  // do nhip tim
  int value = analogRead(ECG_PIN);  // Đọc tín hiệu ECG
  currentTime = millis();         // Thời gian hiện tại

  // Phát hiện đỉnh
  if (value > threshold && (currentTime - lastPeakTime > 300)) { // Debounce 300ms
    unsigned long RR = currentTime - lastPeakTime;  // Tính khoảng RR
    lastPeakTime = currentTime;                     // Cập nhật thời gian đỉnh mới

    // Tính nhịp tim (BPM)
    ecgValue = 60000 / RR;
  }

  if(read){
    // Đọc giá trị từ các cảm biến uốn
    for(int i = 0; i < 4; i++) {
      flexValues[i] = analogRead(FLEX_1 + i);
    }
    
    // Đọc giá trị ECG nếu điện cực được kết nối đúng
    // if((digitalRead(LO_PLUS) == 1) || (digitalRead(LO_MINUS) == 1)) {
    //   ecgValue = -1;  // Đánh dấu lỗi kết nối
    // } else {
    //   ecgValue = analogRead(ECG_PIN);
    // }
    // ecgValue = analogRead(ECG_PIN);
    
    // Đọc giá trị gia tốc
    accelX = analogRead(ADXL_X);
    accelY = analogRead(ADXL_Y);
    
    // Đọc và chuyển đổi giá trị nhiệt độ
    int tempReading = analogRead(TEMP_PIN);
    temperature = (tempReading * 5.0 * 100.0) / 1024.0; // Chuyển đổi sang độ C
    
    String data = "#{Flex1:" + String(flexValues[0]) + "," +
                  "Flex2:" + String(flexValues[1]) + "," +
                  "Flex3:" + String(flexValues[2]) + "," +
                  "Flex4:" + String(flexValues[3]) + "," +
                  "Ecg:" + String(ecgValue) + "," +
                  "AdxlX:" + String(accelX) + "," +
                  "AdxlY:" + String(accelY) + "," +
                  "Temp:" + String(temperature) + ",}$";

    
    length = data.length();
    Serial.println(data);
    Serial.println(length);
    data.getBytes(buffer, length + 1);
    read = false;
  }

  if (espSerial.available() >= 2) {
    // Đọc 2 byte từ serial vào mảng buffer
    byte bufferFree[2];
    bufferFree[0] = espSerial.read();
    bufferFree[1] = espSerial.read();

    // Kích thước mỗi cụm
    int blockSize  = (bufferFree[0] << 8) | bufferFree[1];  // Shift byte cao sang trái 8 bit và kết hợp với byte thấp
    Serial.print("kich thuoc buffer trong: ");
    Serial.println(blockSize);
    int chunkSize = min(blockSize, length - indexBuffer); // Kích thước cụm hiện tại
    if(chunkSize > 0){       // Gửi cụm dữ liệu
      espSerial.write(buffer + indexBuffer, chunkSize);
      Serial.println(chunkSize);
      indexBuffer += chunkSize;
      if(indexBuffer >= length){
        read = true;
        indexBuffer = 0;
      }
    }
  }
  delay(1);
}