import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { submitApplication, listApplications } from '../controllers/volunteerController.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

router.post('/', upload.single('verificationProof'), submitApplication);
router.get('/', listApplications);

export default router;


