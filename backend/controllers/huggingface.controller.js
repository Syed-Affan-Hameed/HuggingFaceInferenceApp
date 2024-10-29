import { HfInference } from '@huggingface/inference'
import dotenv from "dotenv";

dotenv.config();

const huggingFaceClient = new HfInference(process.env.HUGGINGFACE_TOKEN);


export const generateText = async (req, res) => {
    
  const { userPrompt } = req.body;
  const defaultPrompt = "The definition of machine learning inference is ";

  try {
      const textGenResponse = await huggingFaceClient.textGeneration({
          inputs: userPrompt || defaultPrompt,
          model: "HuggingFaceH4/zephyr-7b-beta"
      });
      console.log(textGenResponse);
      res.status(200).json({
        success: true,
        message: "Text generated successfully",
        data: textGenResponse
      });
  } catch (error) {
      console.error("Error generating text:", error);
      res.status(500).json({
        success: false,
        message: "Error generating text",
        error: error.message
      });
  }

};

export const  classifyText = async(req,res) =>{

    const { userPrompt } = req.body;
    const defaultPrompt = "I bought sony headphones from amazon sale, they are incredible!";
    const textToClassify = userPrompt || defaultPrompt;

    try{
        const textClassificationResponse = await huggingFaceClient.textClassification({
            model: "distilbert-base-uncased-finetuned-sst-2-english",
            inputs: textToClassify
        });
        console.log(textClassificationResponse);
        res.status(200).json({
            success: true,
            message: "Text classified successfully",
            data: textClassificationResponse
        });
    }
    catch(error){
        console.error("Error classifying text:", error);
        res.status(500).json({
            success: false,
            message: "Error classifying text",
            error: error.message
        });
    }

};

