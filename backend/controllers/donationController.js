import asyncHandler from 'express-async-handler';
import Donation from '../models/Donation.js';

// Submit a donation
export const submitDonation = asyncHandler(async (req, res) => {
  const {
    donorName,
    donorEmail,
    donorPhone,
    panCard,
    amount,
    paymentMethod,
    transactionId,
    notes
  } = req.body;

  // Validation
  if (!donorName || !donorEmail || !donorPhone || !amount || !paymentMethod) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: 'Donation amount must be greater than 0' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(donorEmail)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const donation = await Donation.create({
    donorName,
    donorEmail,
    donorPhone,
    panCard,
    amount,
    paymentMethod,
    transactionId,
    notes,
    paymentStatus: 'completed', // Assuming payment is successful when submitted
    status: 'active'
  });

  res.status(201).json(donation);
});

// Get all donations (admin only)
export const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({})
    .sort({ createdAt: -1 });
  res.json(donations);
});

// Get donation by ID
export const getDonationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const donation = await Donation.findById(id);

  if (!donation) {
    return res.status(404).json({ message: 'Donation not found' });
  }

  res.json(donation);
});

// Update donation status
export const updateDonationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentStatus, status, notes } = req.body;

  const updateData = {};

  if (paymentStatus) {
    const validPaymentStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }
    updateData.paymentStatus = paymentStatus;
  }

  if (status) {
    const validStatuses = ['active', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    updateData.status = status;
  }

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  const donation = await Donation.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!donation) {
    return res.status(404).json({ message: 'Donation not found' });
  }

  res.json(donation);
});

// Delete donation
export const deleteDonation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const donation = await Donation.findById(id);
  if (!donation) {
    return res.status(404).json({ message: 'Donation not found' });
  }

  await Donation.findByIdAndDelete(id);
  res.json({ message: 'Donation deleted successfully' });
});

