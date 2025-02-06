// agent.ts

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
// import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import dotenv from 'dotenv';
import { ChatOllama } from "@langchain/ollama";


dotenv.config({ path: '.env' });

// Define the tools for the agent to use
const agentTools = [new TavilySearchResults({ maxResults: 3 })];
const agentModel = new ChatOllama({
  model: 'llama3.2',
  temperature: 0,
});

// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();
export const agent = createReactAgent({
  llm: agentModel,
  tools: agentTools,
  checkpointSaver: agentCheckpointer,
});
