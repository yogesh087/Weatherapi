const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homefile = fs.readFileSync("home.html", "utf-8");
const replaceval = (tempval, orgval) => {
  const date = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];const day = days[date.getDay()];
  const datestr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const timestr = `${(date.getHours() < 10 ? '0' : '') + date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}:${(date.getSeconds() < 10 ? '0' : '') + date.getSeconds()}`;

  let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
  temperature = temperature.replace("{%location%}", orgval.name);
  temperature = temperature.replace("{%country%}", orgval.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
  temperature = temperature.replace("{%day%}", day);
  temperature = temperature.replace("{%date%}", datestr);
  temperature = temperature.replace("{%time%}", timestr);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=AJMER,India&appid=be4b38befa62b4e967bd97670c381a4e"
    )
      .on("data", (chunk) => {
        const obj = JSON.parse(chunk);
        const arrdata = [obj];

        const realtimedata = arrdata
          .map((val) => replaceval(homefile, val))
          .join(" ");
        res.write(realtimedata);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);

        res.end();
      });
  }
});
server.listen(8000);
