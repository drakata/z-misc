const express = require("express");
const os = require("os");

const app = express();

//ibm
const { IamTokenManager } = require("ibm-watson/auth");
app.enable("trust proxy");
app.set("view engine", "jsx");
app.engine("jsx", require("express-react-views").createEngine());

// Only loaded when running in Bluemix
if (process.env.VCAP_APPLICATION) {
  require("./security")(app);
}

const serviceUrl = process.env.SPEECH_TO_TEXT_URL;

const tokenManager = new IamTokenManager({
  apikey: process.env.SPEECH_TO_TEXT_IAM_APIKEY || "<iam_apikey>"
});

app.get("/api/v1/credentials", async (req, res, next) => {
  try {
    const accessToken = await tokenManager.getToken();
    res.json({
      accessToken,
      serviceUrl
    });
  } catch (err) {
    next(err);
  }
});

app.use(express.static("dist"));
app.get("/api/getUsername", (req, res) =>
  res.send({ username: os.userInfo().username })
);

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
