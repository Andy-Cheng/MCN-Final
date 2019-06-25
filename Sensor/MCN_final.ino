
#include <LWiFi.h>
#include <LWiFiClient.h>

#define WIFI_AP "AP name"
#define WIFI_PASSWORD "AP password"
#define WIFI_AUTH LWIFI_WPA  // choose from LWIFI_OPEN, LWIFI_WPA, or LWIFI_WEP.
#define SITE_URL "192.168.43.173"     //configure the hostname
LWiFiClient c;

//build JSON method
String buildJson(int userId, int sig) {
  String data = "{";
  data+="\n";
  data+= "\"data\": {";
  data+="\n";
  data+="\"userId\": ";
  data+=userId;
  data+= ",";
  data+="\n";
  data+="\"signal\": ";
  data+=sig;
  data+="\n";
  data+="}";
  data+="\n";
  data+="}";
  return data;
}

void setup()
{
  LWiFi.begin();
  Serial.begin(115200);

  // keep retrying until connected to AP
  Serial.println("Connecting to AP");
  while (0 == LWiFi.connect(WIFI_AP, LWiFiLoginInfo(WIFI_AUTH, WIFI_PASSWORD)))
  {
    delay(1000);
  }
  pinMode(10,INPUT);
  pinMode(11,INPUT);
}
int listening_port = 8080;
boolean disconnectedMsg = false;
int sig = 0;
void loop()
{
  // Make sure we are connected, and dump the response content to Serial
   // send HTTP request, ends with 2 CR/LF
    // keep retrying until connected to web server
  Serial.println("Connecting to WebServer");
  
  while (0 == c.connect(SITE_URL, listening_port))
  {
    Serial.println("Re-Connecting to WebSite");
    delay(1000);
  }
  
  if((digitalRead(10)==1)||(digitalRead(11)==1)){
      Serial.println("Make sure ECG sensor is well connected");
  }
  else{
      // AI is the analog pin connected to the ECG chip.
      sig = analogRead(A1);
      Serial.println(sig);
  }

  
  String PostData = buildJson(1, sig);
  Serial.println("Connected. Sending HTTP POST Request ...."); 
  c.println("POST /add/ecg HTTP/1.1");  //modify the POST path
  c.println("Host: " SITE_URL);
  c.println("Content-Type: application/json");
  c.println("Connection: close");
  c.print("Content-Length: ");
  c.println(PostData.length());
  c.println();
  c.println(PostData);  //send the HTTP POST body

  // waiting for server response
  Serial.println("waiting HTTP response:");
  while (!c.available())
  {
    delay(100);
  }
  
  while (c)
  {
    int v = c.read();
    if (v != -1)
    {
      Serial.print((char)v);
    }
    else
    {
      Serial.println("no more content, disconnect");
      c.stop();
      break;
    }
  }

  if (!disconnectedMsg)
  {
    Serial.println("disconnected by server");
    disconnectedMsg = true;
  }
  delay(500);
}

