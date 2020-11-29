const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const info = require("./public/json/info.json");
const nodejieba = require("nodejieba");
nodejieba["DEFAULT_DICT"] = "./dict/jieba.dict.utf8";
nodejieba["DEFAULT_HMM_DICT"] = "./dict/hmm_model.utf8";
nodejieba["DEFAULT_USER_DICT"] = "./dict/user.dict.utf8";
nodejieba["DEFAULT_IDF_DICT"] = "./dict/idf.utf8";
nodejieba["DEFAULT_STOP_WORD_DICT"] = "./dict/stop_words.utf8";
const punctuationMarksRegex = require("./public/js/punctuationMarks");

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
  const filteredTextInput = textInput.replace(punctuationMarksRegex, "");
  const cutList = nodejieba.cut(filteredTextInput.trim());
  const generatedText = cutList.join("...") + "...";
  res.render("index", { ...info, generatedText, originText: textInput });
});

app.listen(port, () => {
  console.log(`Express app listening on port ${port}.`);
});
