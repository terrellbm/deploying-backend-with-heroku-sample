const express = require('express'); // Express is a node.js framework for building servers with api endpoints. We will use this framework to build our server and then deploy our server using a service like heroku
const cors = require('cors');
const app = express();
const port = 3001;
const { Configuration, OpenAIApi } = require("openai"); // Import OpenAI
const { response } = require('express');

//API Key for OpenAI
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
app.use(express.json());
app.use(cors());

// Test API Endpoint 
app.post('/', (req, res) => {
    console.log(req.body);
    res.json({
        message: req.body
    });
});

//API Endpoint. If API request is not formatted correctly - return. Otherwise feed in request as a prompt 
app.post('/QuestionAndAnswer', async (req, res) => {
    const request = req.body.prompt;
    console.log("\nRequest received!⏹  Request is shown below 🔽");
    console.log(request);
    console.log("\n");
    if(!request)
    {
        console.log("Request is undefined. Ensure key for JSON is 'prompt'");
        res.json({
            message: "Request is undefined. Ensure key for JSON is 'prompt'"
        })
        return
    }

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "Q: " + request + "A:",
            temperature: 0,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ["Q:"],
          });

        console.log("Response from OpenAI received!✅ Response to client is shown below 🔽");
        console.log(response.data.choices[0].text);
        res.json({
            message: response.data.choices[0].text
        });
    } catch (err) {
        res.json({
            message: err.message
        })
        
    }

});



app.listen(process.env.PORT || port, async () => {
    console.log('Example app listening on http://localhost:' + port); 
});

