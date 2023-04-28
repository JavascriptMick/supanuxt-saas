import { Configuration, OpenAIApi } from "openai";

const config = useRuntimeConfig();

const configuration = new Configuration({
  apiKey: config.openAIKey,
});

export const openai = new OpenAIApi(configuration);