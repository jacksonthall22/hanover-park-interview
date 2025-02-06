import { TavilySearchResults } from '@langchain/community/tools/tavily_search'
import { AIMessage, BaseMessage } from '@langchain/core/messages'
import { Annotation, END, START, StateGraph, messagesStateReducer } from '@langchain/langgraph'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { ChatOllama } from '@langchain/ollama'
import dotenv from 'dotenv'
import tavily from '@tavily/core'

import { z } from 'zod'
import { tool } from '@langchain/core/tools'

const envFile = '.env'
dotenv.config({ path: envFile })
console.log('test:', process.env) // TODO remove

// Define the graph state type
// See here for more info: https://langchain-ai.github.io/langgraphjs/how-tos/define-state/
export const searcherStateAnnotation = Annotation.Root({
	messages: Annotation<BaseMessage[]>({
		// `messagesStateReducer` function deines how `messages` state key should be updated
		// (in this case it appends new messages to the list and overwrites messages with the same ID)
		reducer: messagesStateReducer,
	}),
})

// const searchToolPlaceholder = tool(
// 	async ({ query }: { query: string }) => {
// 		// Placeholder for the actual implementation
// 		// To install, run: npm install @tavily/core

//     const client = tavily({ apiKey: dot });

//     client.search(query, {
//         includeAnswer: "true"
//     }).then((response: unknown) => {
//         console.log(response);
//     });
// 	},
// 	{
// 		name: 'search',
// 		description:
// 			'Use to surf the web, fetch current information, check the weather, and retrieve other information.',
// 		schema: z.object({
// 			query: z.string().describe('The query to use in your search.'),
// 		}),
// 	},
// )

// Define the tools for the agent to use
const tavilySearch = new TavilySearchResults({ maxResults: 3 })
const tools = [tavilySearch]
// const tools = [searchToolPlaceholder]
const toolNode = new ToolNode(tools)

// Define the model
const model = new ChatOllama({
	model: 'llama3.2',
	temperature: 0,
}).bindTools(tools)

// Define the function that determines whether to continue or not
function routeMessage(state: typeof searcherStateAnnotation.State) {
	const messages = state.messages
	const lastMessage = messages[messages.length - 1] as AIMessage

	// If the LLM makes a tool call, then we route to the "tools" node
	if (lastMessage.tool_calls?.length) {
		return 'tools'
	}

	// Otherwise, we stop (reply to the user)
	return END
}

async function callModel(state: typeof searcherStateAnnotation.State) {
	const messages = state.messages
	const response = await model.invoke(messages)

	// We return a list because this will get added to the existing list
	return { messages: [response] }
}

// Define a new graph
const workflow = new StateGraph(searcherStateAnnotation)
	.addNode('agent', callModel)
	.addEdge(START, 'agent')
	.addNode('tools', toolNode)
	.addEdge('tools', 'agent')
	.addConditionalEdges('agent', routeMessage)

// Finally, we compile it into a LangChain Runnable
export const searcherGraph = workflow.compile()
