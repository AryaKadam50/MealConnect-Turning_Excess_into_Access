import asyncHandler from 'express-async-handler';
import Partnership from '../models/Partnership.js';

// Submit partnership application
export const submitPartnership = asyncHandler(async (req, res) => {
  const {
    businessName,
    contactPerson,
    email,
    phone,
    businessType,
    city,
    address,
    partnershipType,
    message
  } = req.body;

  // Validation
  if (!businessName || !contactPerson || !email || !phone || !businessType || 
      !city || !partnershipType || !message) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const partnership = await Partnership.create({
    businessName,
    contactPerson,
    email,
    phone,
    businessType,
    city,
    address,
    partnershipType,
    message,
    status: 'pending'
  });

  res.status(201).json(partnership);
});

// Get all partnerships (admin only)
export const getAllPartnerships = asyncHandler(async (req, res) => {
  const partnerships = await Partnership.find({})
    .populate('approvedBy', 'name email')
    .sort({ createdAt: -1 });
  res.json(partnerships);
});

// Get partnership by ID
export const getPartnershipById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const partnership = await Partnership.findById(id)
    .populate('approvedBy', 'name email');

  if (!partnership) {
    return res.status(404).json({ message: 'Partnership not found' });
  }

  res.json(partnership);
});

// Update partnership status
export const updatePartnershipStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ['pending', 'approved', 'rejected', 'active', 'inactive'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const updateData = { status };
  
  // Add notes if provided
  if (notes !== undefined) {
    updateData.notes = notes;
  }

  // If approving, set approvedBy and approvedAt
  if (status === 'approved' || status === 'active') {
    updateData.approvedBy = req.user._id;
    updateData.approvedAt = new Date();
  }

  const partnership = await Partnership.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('approvedBy', 'name email');

  if (!partnership) {
    return res.status(404).json({ message: 'Partnership not found' });
  }

  res.json(partnership);
});

// Delete partnership
export const deletePartnership = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const partnership = await Partnership.findById(id);
  if (!partnership) {
    return res.status(404).json({ message: 'Partnership not found' });
  }

  await Partnership.findByIdAndDelete(id);
  res.json({ message: 'Partnership deleted successfully' });
});

