const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const info = require("./public/json/info.json");
const punctuationMarksRegex = require("./public/js/punctuationMarks");
const generateBeenlungText = (text) => {
  const filteredTextInput = text.replace(punctuationMarksRegex, "");
  const segmenterTW = new Intl.Segmenter('zh-TW', { granularity: 'word' });
  const segments = segmenterTW.segment(filteredTextInput);
  const cutList = Array.from(segments).map(item => item.segment);
  return cutList.join("...") + "...";
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index", { ...info, originText: "" });
});
app.post("/", function (req, res) {
  const { textInput } = req.body;
  const generatedText = generateBeenlungText(textInput);
  res.render("index", { ...info, generatedText, originText: textInput });
});

app.listen(port, () => {
  console.log(`Express app listening on port ${port}.`);
});
