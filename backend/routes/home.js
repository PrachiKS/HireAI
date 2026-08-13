import express from 'express';
import { getHomeData } from '../controllers/homeController.js'; // MUST have .js extension

const router = express.Router();

router.get('/', getHomeData);

export default router;