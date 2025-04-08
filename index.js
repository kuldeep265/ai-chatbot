const express = require('express');
const app = express();
const training_data = require('./system');
require('dotenv').config();
app.use(express.static(__dirname+'/public'));
app.use(express.json());
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.post('/analyze',async(req,res)=>{
    const {poem} = req.body;
    const result = await model.generateContent(training_data+poem);
    const data = result.response.candidates[0].content.parts[0].text;
    console.log(data);
    if (data.includes('Invalid Poem')){
        res.status(200).json({error: "Invalid Poem"});
    }
    else{
        let fixed = data.replace(/'/g, '"');
        let jsonObject = JSON.parse(fixed.slice(7, -3));
        console.log(jsonObject);
        res.status(200).json(jsonObject);
    }
})

app.listen(3000,()=>{
    console.log("Chatbot Live at http://localhost:3000");
})