const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema({
  fullName:       String,
  email:          String,
  phone:          String,
  carType:        String,
  currentAddress: String,
  occupation:     String,
  pets:           String,
  paymentMethod:  String,
  married:        String,
  brokenLease:    String,
  felony:         String,
  numMoving:      String,
  lockout:        String,
  otherApplicant: String,
  alcohol:        String,
  smoke:          String,
  moveDate:       String,
  suing:          String,
  prevLandlord:   String,
  tenancyLength:  String,
  income:         String,
  otherIncome:    String,
  idFront:        String,
  idBack:         String,
  idFrontUrl:     String,
idBackUrl:        String,

  status:         { type: String, default: "Pending" }, // Pending, Approved, Rejected
  adminNotes:     { type: String, default: "" },
  submittedAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", applicationSchema);