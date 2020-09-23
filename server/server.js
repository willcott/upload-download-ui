const port = 8000;

const formidable = require("formidable");
const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

app.get("/status/:job", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  const text = fs.readFileSync(
    `${__dirname}/uploads/${req.params.job}/status.json`
  );
  res.end(text);
  return;
});

app.post("/upload/:job", function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var oldPath = files.file.path;
    var newPath = path.join(__dirname, "uploads") + "/" + req.params.job;
    var rawData = fs.readFileSync(oldPath);

    fs.mkdirSync(newPath);

    fs.writeFile(newPath + "/clip1.mp4", rawData, function (err) {
      if (err) console.log(err);
      console.log("Success");
    });

    fs.writeFile(
      newPath + "/status.json",
      JSON.stringify({ status: "Pending" }),
      function (err) {
        if (err) console.log(err);
        console.log("Success");
      }
    );

    updateStatus(newPath + "/status.json");
  });
  res.end(JSON.stringify({ message: "Upload Successful" }));
  return;
});

app.get("/download/:job", function (req, res) {
  res.setHeader("Content-Type", "video/mp4");

  const file = `${__dirname}/uploads/${req.params.job}/clip1.mp4`;

  console.log(file);
  res.download(file);
  return;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const updateStatus = (path) => {
  setTimeout(function () {
    fs.writeFile(path, JSON.stringify({ status: "Processing" }), function (
      err
    ) {
      if (err) console.log(err);
      console.log("Success");
    });
  }, 3000);
  setTimeout(function () {
    fs.writeFile(path, JSON.stringify({ status: "Ready" }), function (err) {
      if (err) console.log(err);
      console.log("Success");
    });
  }, 7000);
};
