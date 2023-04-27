const cv = require('opencv4nodejs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const imagePath = req.body.imagePath;
  const targetImagePath = path.join(__dirname, 'target.jpg');

  // Load images
  const targetImage = cv.imread(targetImagePath);
  const inputImage = cv.imread(imagePath);

  // Convert to grayscale
  const targetGray = targetImage.bgrToGray();
  const inputGray = inputImage.bgrToGray();

  // Detect faces
  const targetFaces = targetGray.detectMultiScale().objects;
  const inputFaces = inputGray.detectMultiScale().objects;

  // Compare faces
  const faceMatcher = new cv.FlannBasedMatcher();
  const matches = faceMatcher.match(targetFaces, inputFaces);

  // Render results
  if (matches.length > 0) {
    res.render('success');
  } else {
    res.render('failure');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
