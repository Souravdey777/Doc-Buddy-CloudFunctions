const functions = require("firebase-functions");
const vision = require("@google-cloud/vision");
const express = require("express");
const cors = require("cors")({ origin: true });
const app = express();

app.use(cors);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

/* exports.TextExtraction = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
}); */
app.post("/TextExtraction", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method !== "POST") {
    return res.status(403).send("Forbidden!");
  }
  const { imageString } = req.body;
  if (typeof imageString === "undefined" || imageString === "") {
    return res.status(400).json({ status: "failed", message: "Bad request" });
  }

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the local file
  const request = {
    image: {
      content: imageString,
    },
    features: [
      {
        type: "TEXT_DETECTION",
      },
    ],
  };

  const [result] = await client.annotateImage(request);
  const detection = result.textAnnotations[0].description.split("\n");

  return res.status(200).json({
    status: "success",
    result: detection.slice(0, -1),
  });
});

app.post("/HandWrittenTextExtraction", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method !== "POST") {
    return res.status(403).send("Forbidden!");
  }
  const { imageString } = req.body;
  if (typeof imageString === "undefined" || imageString === "") {
    return res.status(400).json({ status: "failed", message: "Bad request" });
  }

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the local file
  const request = {
    image: {
      content: imageString,
    },
    features: [
      {
        type: "DOCUMENT_TEXT_DETECTION",
      },
    ],
  };

  const [result] = await client.annotateImage(request);
  const detection = result.textAnnotations[0].description.split("\n");

  return res.status(200).json({
    status: "success",
    result: detection.slice(0, -1),
  });
});

exports.app = functions.https.onRequest(app);
