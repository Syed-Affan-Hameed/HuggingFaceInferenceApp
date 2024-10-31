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
            message: `Text seems to be ${textClassificationResponse[0].label}`,
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

export const translateText = async(req,res)=>{

    const {userText} = req.body;
    const defualtText =" Hi , how are you?";

    const textToTranslate =userText|| defualtText;

    try{
        const translateTextResponse = await huggingFaceClient.translation({
            model:"facebook/mbart-large-50-many-to-many-mmt",
            inputs:textToTranslate,
            parameters:{
                src_lang:"en_XX",
                tgt_lang:"fr_XX"
            }
        });

        res.status(200).json({
            success:true,
            message:"Translation Successfull",
            translatedText: translateTextResponse.translation_text
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Translation not Successfull",
            translatedText: null,
            error:error.message
        })
    }

}

export const convertTextToSpeech = async(req,res)=>{
    const {userText}= req.body;
    const defaultText=" please input the text to convert to audio.";

    try{
        const response = await huggingFaceClient.textToSpeech({
            inputs: userText || defaultText,
            model: "espnet/kan-bayashi_ljspeech_vits"
        });
        // Step 1: Get the ArrayBuffer from the response
        const arrayBuffer = await response.arrayBuffer();

        // Step 2: Convert ArrayBuffer to Node.js Buffer
        const audioBuffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type','audio/wav');
        res.setHeader('Content-Disposition', 'attachment; filename="speech.wav"');
        res.send(audioBuffer);

    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Error converting text to speech",
            errorMessage:error.message
        })
    }
}

export const colorTheImage =async(req,res)=>{
    const {userImageUrl, userDescription} = req.body;

    const defualtImageUrl = "https://plus.unsplash.com/premium_photo-1726736445473-9d36ed4bdf3d?q=80&w=1946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    // Fetching the image from url , Converting the user image to blob
    const oldImageResponse = await fetch(userImageUrl||defualtImageUrl)
    const oldImageBlob = await oldImageResponse.blob()
    try{
        const response = await huggingFaceClient.imageToImage({
            model:"ghoskno/Color-Canny-Controlnet-model",
            inputs:oldImageBlob,
            parameters: {
                prompt: userDescription,
                negative_prompt: "Black and white photo. text, bad anatomy, blurry, low quality",
                // Between 0 and 1
                strength: 0.85,
              }
        })
                // Convert blob response to buffer
                const arrayBuffer = await response.arrayBuffer();
                const imageBuffer = Buffer.from(arrayBuffer);
        
                // Set headers for image download
                res.setHeader('Content-Type', 'image/jpeg');  // or 'image/png' depending on the format
                res.setHeader('Content-Disposition', 'attachment; filename="colored_image.jpg"');
                
                // Send the image buffer
                res.send(imageBuffer);
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Error in colorTheImage method",
            errorMessage:error.message
        })
    }
}


// make an endpoint that returns best text to image models
// refer this code
// import { listModels } from "@huggingface/hub";

// const token = process.env.HF_TOKEN

// // HuggingFace.js Hub Docs: https://huggingface.co/docs/huggingface.js/hub/README

// // Challenge 1: Get Text To Image Models with inference enabled and 2000+ likes

// async function isModelInferenceEnabled(modelName) {
//     const response = await fetch(`https://api-inference.huggingface.co/status/${modelName}`)
//     const data = await response.json()
//     return data.state == "Loadable"
// }

// const models = []

// for await (const model of listModels({
//     credentials: {
//         accessToken: token
//     },
//     search: {
//         task: "text-to-image"
//     }
// })) {
//     if (model.likes < 2000) {
//         continue
//     } 
    
//     if (await isModelInferenceEnabled(model.name)) {
//         models.push(model)
//     }
// }

// /*Challenge 2: Sort models by likes and return HF URL

// Target Output:
// 9563 Likes: https://huggingface.co/runwayml/stable-diffusion-v1-5
// 6051 Likes: https://huggingface.co/CompVis/stable-diffusion-v1-4
// 3479 Likes: https://huggingface.co/WarriorMama777/OrangeMixs
// 3469 Likes: https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0
// 3302 Likes: https://huggingface.co/stabilityai/stable-diffusion-2-1

// */

// models.sort((model1, model2) => model2.likes - model1.likes)
// for (const model of models) {
//     console.log(`${model.likes} Likes: https://huggingface.co/${model.name}`)
// }

