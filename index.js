const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
app.use(cors());

const generatePDF = require("./controllers/generatePdf");

app.get("/generate-pdf", generatePDF);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
