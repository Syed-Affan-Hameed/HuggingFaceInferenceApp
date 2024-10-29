import express from "express";
import { generateText, classifyText } from "../controllers/huggingface.controller.js";

const router = express.Router();

router.post("/generateText", generateText);
// router.post("/translateText", translateText);
router.post("/classifyText", classifyText);

export default router;

