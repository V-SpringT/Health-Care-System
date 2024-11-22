#include <ESP8266WiFi.h>
#include <SocketIOClient.h>
#include <SoftwareSerial.h>

const int ESP_RX = 14;     // D6 
const int ESP_TX = 12;     // D5
 
// Khai báo cổng UART phụ
SoftwareSerial espSerial(ESP_RX, ESP_TX); //rx, tx 

SocketIOClient client;
const char* ssid = "hahaha";          //Tên mạng Wifi mà Socket server của bạn đang kết nối
const char* password = "98765432";  //Pass mạng wifi ahihi, anh em rãnh thì share pass cho mình với.

char host[] = "192.168.183.44";  //Địa chỉ IP dịch vụ, hãy thay đổi nó theo địa chỉ IP Socket server của bạn.
int port = 3484;                  //Cổng dịch vụ socket server do chúng ta tạo!
 
//từ khóa extern: dùng để #include các biến toàn cục ở một số thư viện khác. Trong thư viện SocketIOClient có hai biến toàn cục
// mà chúng ta cần quan tâm đó là
// RID: Tên hàm (tên sự kiện
// Rfull: Danh sách biến (được đóng gói lại là chuối JSON)
extern String RID;
extern String Rfull;

// bien luu dữ liệu
String bufferStr = "";

// flag gui du lieu
bool send = false;

//Một số biến dùng cho việc tạo một task
unsigned long previousMillis = 0;
long interval = 1000;
 
void setup()
{
  Serial.begin(9600);
  espSerial.begin(9600);

  //Việc đầu tiên cần làm là kết nối vào mạng Wifi
  Serial.print("Ket noi vao mang: ");
  Serial.println(ssid);

  //Kết nối vào mạng Wifi
  WiFi.begin(ssid, password);

  //Chờ đến khi đã được kết nối
  // while (WiFi.status() != WL_CONNECTED) { //Thoát ra khỏi vòng 
  //     delay(500);
  //     Serial.print('.');
  // }
  Serial.println();

  Serial.println(F("Da ket noi WiFi"));
  Serial.println(F("Di chi IP cua ESP8266 (Socket Client ESP8266): "));
  Serial.println(WiFi.localIP());

  if (!client.connect(host, port)) {
      Serial.println(F("Ket noi den socket server that bai!"));
      return;
  }

  //Khi đã kết nối thành công
  if (client.connected()) {
      //Thì gửi sự kiện ("connection") đến Socket server ahihi.
      client.send("connection", "message", "Connected !!!!");
      Serial.println("connection socket ss");
  }
}
 
void loop()
{
  //Kết nối lại!
  while (!client.connected()) {
    client.reconnect(host, port);
  }
  //tạo một task cứ sau "interval" giây thì chạy lệnh:

  if (millis() - previousMillis > interval && send && client.connected()) {
    //lệnh:
    previousMillis = millis();
    client.send("atime", "message", bufferStr);
    Serial.println(bufferStr);
    bufferStr = "";
    send = false;
  }

  // nhan du lieu tu nano
  if(!send){
    // gui phan hoi so byte co the nhan duoc của buffer cho bên gửi
    int sizeBufferFree = 64 -  espSerial.available();
    Serial.println(sizeBufferFree);
    byte buffer[2];
    buffer[1] = sizeBufferFree & 0xFF;    // Lấy byte thấp
    buffer[0] = (sizeBufferFree >> 8) & 0xFF;  // Lấy byte cao

    espSerial.write(buffer, 2);  // Gửi 2 byte qua UART
    
    while (espSerial.available()) {
      // Serial.println("den day roi hihi");

      char c = espSerial.read(); // Đọc từng ký tự
      if (c == '#') {
        bufferStr = ""; // Bắt đầu gói dữ liệu mới
      } else if (c == '$') {
        // Gói dữ liệu hoàn chỉnh
        send = true;
      } else {
        bufferStr += c; // Ghép ký tự vào bộ đệm
      }
    }
  }

  // Khi bắt được bất kỳ sự kiện nào thì chúng ta có hai tham số:
  //  +RID: Tên sự kiện
  //  +RFull: Danh sách tham số được nén thành chuỗi JSON!
  if (client.monitor()) {
    Serial.println(RID);
    Serial.println(Rfull);
  }

  delay(500);
}