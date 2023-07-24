/*
Code Overview

Refer Readme: <Readme link>


*/


import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk"


const encoder = new TextEncoder()
const decoder = new TextDecoder("utf-8")

export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {

  //Decode the request body to get the question
  const question = decoder.decode(request.body)

  console.log("<------->")
  console.log("Question Received: " + question)

  // Retreive the OpenAI API Key from Spin Config
  let openai_key = spinSdk.config.get("openai_key");

  // Set the API Endpoint
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  /* NOTE:
        - This is a template to structure the API Request 
        - You may tweak the parameters as necessary by referring to the API Documentation
        - There is a system prompt included by default to limit the response to 5 words.
        - You may edit the system prompt to suit your requirement as necessary
  */
  const requestData = JSON.stringify({
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "Always restrict your answers to 5 words or less."
      },
      {
        "role": "user",
        "content": "" + question
      }
    ],
    "temperature": 1,
    "top_p": 1,
    "n": 1,
    "stream": false,
    "max_tokens": 250,
    "presence_penalty": 0,
    "frequency_penalty": 0
  });

  const options = {
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${openai_key}`
    },
    body: requestData
  };

  // Send the request and await for the response
  let response = await fetch(apiUrl, options)

  // Decode the response
  let decoded = decoder.decode(await response.arrayBuffer() || new Uint8Array())

  // Parse the reponse
  let parsed = JSON.parse(decoded)

  try {
    // Structure and return the response.
    if (parsed?.choices[0]?.message) {

      console.log("Generated Answer: " + JSON.stringify(parsed.choices[0].message.content))

      let answerJson = `{\"answer\": \"${parsed.choices[0].message.content}\"}`;

      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: answerJson
      }
    }
  }
  catch (e) {
    console.log("Something went wrong. Refer the Troubleshooting Guide.")
    console.log(e)
  }

  // A default response to return if something breaks
  return {
    status: 500,
    body: encoder.encode("Something went wrong").buffer
  }
}
