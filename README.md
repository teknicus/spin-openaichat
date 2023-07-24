# Enhancing the JSON API with OpenAI



Generate an API key for OpenAI at [platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys) 


Instead of the preset responses from the previous example, we will generate a response using the OpenAI chat completion API by sending a request to `https://api.openai.com/v1/chat/completions`

### Running the Application with a Provided API Key
This example gets the OpenAI key from a Spin configuration variable. Pass the value of the key to Spin in an environment variable prefixed with SPIN_CONFIG. Spin's environment variable provider with parse the local process environment for these variables and expose them through the Spin config SDK.

```
$ SPIN_CONFIG_OPENAI_KEY=$YOUR_OPENAI_KEY spin build --up
Serving http://127.0.0.1:3000
Available Routes:
  magic-8-ball: http://127.0.0.1:3000/magic-8
```

Now ask your question in the body of the request:

```
$ curl -d "Will I get a pet tortoise?" http://127.0.0.1:3000/magic-8
{"answer": "Outlook is uncertain."}
```

### Note
- A system prompt has been added to restrict the response to five words or less.


### Code Overview

The HTTP request is handled by the `handleRequest` function. Following is an overview of the process flow:

- Retreive the question by decoding the response body
- Fetch the OpenAPI Key from the Spin Config [Reference](https://developer.fermyon.com/spin/dynamic-configuration#custom-config-providers)
- Structure the request to be sent to OpenAI 
- Decode the response
- Structure and return the response to the client.

Please refer to the code for the details of the implementation.

### References

- [Sending Outbound HTTP Requests](https://developer.fermyon.com/spin/javascript-components#sending-outbound-http-requests)

- [Spin Config](https://developer.fermyon.com/spin/dynamic-configuration#custom-config-providers)

- [Create chat completion](https://platform.openai.com/docs/api-reference/chat/create)
