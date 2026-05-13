const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Application = require("../models/Application");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: "djrentals-ids", allowed_formats: ["jpg","jpeg","png","pdf"] }
});

const upload = multer({ storage: storage });
const uploadFields = upload.fields([
  { name: "fileUploadFront", maxCount: 1 },
  { name: "fileUploadBack", maxCount: 1 }
]);

async function saveApplication(req, res) {
  try {
    const appData = { ...req.body };

    if (req.files?.fileUploadFront?.[0]) {
      appData.idFrontUrl = req.files.fileUploadFront[0].path;
    }
    if (req.files?.fileUploadBack?.[0]) {
      appData.idBackUrl = req.files.fileUploadBack[0].path;
    }

    const application = new Application(appData);
    await application.save();
    console.log(">>> Saved:", appData.fullName);
    res.json({ success: true, refId: application._id });
  } catch (err) {
    console.error("Save error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

router.get(["/", "/applications"], async (req, res) => {
  try {
    const applications = await Application.find().sort({ submittedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/submit", uploadFields, saveApplication);
router.post("/apply", uploadFields, saveApplication);

router.patch("/:id/status", async (req, res) => {
  try {
    await Application.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;