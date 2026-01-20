const express = require('express');
const router = express.Router();

// FIX: Increase body size limit
router.use(express.urlencoded({ 
  extended: false, 
  limit: '10mb',  // ADD THIS
  parameterLimit: 1000000  // ADD THIS
}));

router.post("/sendgrid/inbound", (req, res) => {
  const {from, to, subject, text, html, headers, spam_score, "attachment-count": attachmentCount} = req.body;
  
  // Your existing logging...
  console.log("FROM:", from);
  console.log("TO:", to);
  console.log("SUBJECT:", subject);
  console.log("TEXT:", text);
  console.log("HTML:", html);
  console.log("HEADERS:", headers);
  console.log("SPAM SCORE:", spam_score);
  console.log("ATTACHMENTS:", attachmentCount);

  res.status(200).send("OK");
});

module.exports = router;
