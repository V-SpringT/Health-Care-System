const connect = require('./DB/connect.js');
const dotenv = require('dotenv');
const ResultExam = require('./DB/ResultExam.js');
const Warning = require('./DB/Warning.js');
const Config = require('./DB/Config.js');
var http = require('http') 							
var socketio = require('socket.io')	

const PORT = 3484;
dotenv.config();
var app = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        });
        res.end();
        return;
      }
    else if (req.method === 'GET' && req.url === '/examination') {
      const results = await ResultExam.find()
      .sort({ createdAt: -1 })
      .select("-_id")
      .limit(15);
        
      console.log({results})
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({results: results}));
    }
    else if (req.method === 'POST' && req.url === '/examination/create') {
        let body = '';
    
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
    
        req.on('end', async () => {
            const parsedBody = JSON.parse(body);
            console.log({parsedBody})

            const result = new ResultExam(parsedBody)
            await result.save();
            res.writeHead(200, { 'Content-Type': 'application/json',  'Access-Control-Allow-Origin': '*',});
            res.end(JSON.stringify({ message: `Hello` }));
        });
    }
    else if(req.method === 'GET' && req.url === '/config'){
        const config = await Config.findOne({}).select("-_id")
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(config));
    }
    else if(req.method === 'POST' && req.url === '/config/create'){
        let body = '';
    
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
    
        req.on('end', async () => {
            const parsedBody = JSON.parse(body);
            await Config.updateOne({}, parsedBody)
            res.writeHead(200, { 'Content-Type': 'application/json',  'Access-Control-Allow-Origin': '*',});
            res.end(JSON.stringify({ message: `Hello` }));
        });
    }
  });
var io = socketio(app, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});		
app.listen(PORT);		


function parseCustomStringToObject(str) {
    try {
      // Xử lý chuỗi để định dạng JSON hợp lệ
      const formattedStr = str
        .replace(/;/g, ',')                     // Thay dấu `;` bằng dấu `,`
        .replace(/,}/g, '}')                    // Loại bỏ dấu phẩy cuối cùng trước `}`
        .replace(/([a-zA-Z0-9_]+):/g, '"$1":') // Thêm dấu ngoặc kép xung quanh các key
        .replace(/:([\-0-9.]+)/g, ':$1')        // Giữ nguyên giá trị số hoặc float
        .replace(/:"([\-0-9.]+)"/g, ':$1');     // Đảm bảo số không bị đóng ngoặc kép
  
      // Parse chuỗi đã format thành object
      return JSON.parse(formattedStr);
    } catch (error) {
      console.error("Error parsing string:", error);
      return null; // Trả về null nếu gặp lỗi
    }
}
  
  

let generalData = null
// Trạng thái và interval
let statuses = {
    heart: false,
    temperature: false,
    signal: false,
    exam: false,
};

let intervals = {
    heart: null,
    temperature: null,
    signal: null,
    examination: null,
};
let configCache = null; // Biến lưu trữ cấu hình

// Hàm lấy cấu hình
const getConfigData = async () => {
    const configData = await Config.findOne({});
    return configData;
};

connect().then(async () => {
    configCache = await getConfigData();
    console.log({configCache})
});



// Khởi tạo interval
const  startInterval = async (event, io)=> {
    if (intervals[event] || !statuses[event]) return;
    console.log({generalData})
    const intervalTime = { heart: 5000, temperature: 6000, signal: 3000, examination: 5000 };

    intervals[event] = setInterval(async () => {
        let payload = null;
        console.log({generalData})
        if(generalData){
            if (event === 'examination') {
                if(configCache && generalData.Ecg && generalData.Temp){
                    payload = {
                        heart: generalData.Ecg,
                        temperature: generalData.Temp,
                    };
                }
            } else {
                console.log({start: generalData.Ecg, end: configCache.heartMax, en: configCache.heartMin})
                if(event === 'heart' && configCache  && generalData && (generalData.Ecg > configCache.heartMax)){
                    payload = {
                        title: `Heart Rate Warning`,
                        message: `Nhịp tim vượt ngưỡng an toàn ${generalData.Ecg}`,
                        type: `Heart Rate`,
                    };
                }
                else if(event === 'temperature' && configCache  && generalData && (generalData.Temp > configCache.temperatureMax || generalData.Temp < configCache.temperatureMin)){
                    payload = {
                        title: `Temperature Warning`,
                        message: `Nhiệt độ vượt ngưỡng an toàn ${generalData.Temp}`,
                        type: `Temperature`,
                    };
                }
                else if(event === 'signal' && configCache  && generalData && generalData.Flex1 && generalData.Flex1 < 180){
                    payload = {
                        title: `I Need Help!`,
                        message: `${configCache.flex1}`,
                        type: `Signal`,
                    };
                }else if(event === 'signal' && configCache  && generalData && generalData.Flex2 && generalData.Flex2 < 180){
                    payload = {
                        title: `I Need Help!`,
                        message: `${configCache.flex2}`,
                        type: `Signal`,
                    };
                }else if(event === 'signal' && configCache  && generalData && generalData.Flex3 && generalData.Flex3 < 130){
                    payload = {
                        title: `I Need Help!`,
                        message: `${configCache.flex3}`,
                        type: `Signal`,
                    };
                }else if(event === 'signal' && configCache  && generalData && generalData.Flex4 && generalData.Flex4 < 180){
                    payload = {
                        title: `I Need Help!`,
                        message: `${configCache.flex4}`,
                        type: `Signal`,
                    };
                }
            }
            console.log({payload})
            if(event == 'heart' && payload) {
                io.sockets.emit(event, payload);
                if(statuses['heart']){
                    const warningObj =  {
                        title: payload.title,
                        message: payload.message,
                        type: "Heart Rate"
                    }
                    const warning = new Warning(warningObj)
                    await warning.save();
                }
            }else if(event == 'temperature' && payload){
                io.sockets.emit(event, payload);   
                if(statuses['temperature']){
                    const warningObj =  {
                        title: payload.title,
                        message: payload.message,
                        type: "Temperature"
                    }
                    const warning = new Warning(warningObj)
                    await warning.save();        
                }
            }else if(event == 'signal' && payload){
                io.sockets.emit(event, payload);
                if(statuses["signal"]){
                    const warningObj =  {
                        title: payload.title,
                        message: payload.message,
                        type: "Signal"
                    }
                    const warning = new Warning(warningObj)
                    await warning.save();
                }   
            }else{
                if(payload) io.sockets.emit(event, payload);
            }
        }
    }, intervalTime[event]);
}

// Dừng interval
function stopInterval(event) {
    if (intervals[event]) {
        clearInterval(intervals[event]);
        intervals[event] = null;
    }
}

io.on('connection', async (socket) => {
    console.log("Client đã kết nối");
    // Nhận trạng thái cập nhật từ client
    socket.on('updateStatus', (data) => {
        console.log("Nhận trạng thái cập nhật:", data);

        Object.keys(data).forEach(event => {
            if (statuses[event] !== data[event]) {
                statuses[event] = data[event];
                if (data[event]) startInterval(event, io);
                else stopInterval(event);
            }
        });
    });

    socket.on("atime",(data)=>{
        console.log({data})
        const dataObj = parseCustomStringToObject(data.message)
        generalData = dataObj
    })
    // Dừng tất cả intervals khi client ngắt kết nối
    socket.on('disconnect', () => {
        console.log("Client đã ngắt kết nối");
        Object.keys(statuses).forEach(event => stopInterval(event));
    });

    // Khởi tạo interval nếu trạng thái ban đầu là true
    Object.keys(statuses).forEach(event => {
        if (statuses[event]) startInterval(event, io);
    });
});