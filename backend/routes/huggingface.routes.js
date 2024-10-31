import express from "express";
import { generateText, classifyText , translateText, convertTextToSpeech,colorTheImage} from "../controllers/huggingface.controller.js";

const router = express.Router();

router.post("/generateText", generateText);
router.post("/translateText", translateText);
router.post("/classifyText", classifyText);
router.post("/convertTextToSpeech",convertTextToSpeech);
router.post("/colorTheImage",colorTheImage);

export default router;

