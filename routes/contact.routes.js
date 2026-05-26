import express from 'express';
import { createContact, getContacts, updateContact } from '../controllers/contact.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', createContact);
router.get('/', protect, adminOnly, getContacts);
router.patch('/:id', protect, adminOnly, updateContact);

export default router;
