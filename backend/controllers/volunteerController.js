import asyncHandler from 'express-async-handler';
import VolunteerApplication from '../models/VolunteerApplication.js';

export const submitApplication = asyncHandler(async (req, res) => {
  const { name, email, phone, availability } = req.body;
  const verificationProofUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const app = await VolunteerApplication.create({ name, email, phone, availability, verificationProofUrl });
  res.status(201).json(app);
});

export const listApplications = asyncHandler(async (req, res) => {
  const apps = await VolunteerApplication.find({}).sort({ createdAt: -1 });
  res.json(apps);
});


