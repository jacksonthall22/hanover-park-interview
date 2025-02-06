import type { RequestHandler } from './$types'
import { agent } from '$lib/agents/agent.server'
import { AIMessage, HumanMessage, ToolMessage, type MessageContentComplex } from "@langchain/core/messages";
import { json } from '@sveltejs/kit';
import type { Link } from '$lib/constants'

export const POST: RequestHandler = async ({ request }) => {
  const { model, searchDepth, searchTopic, query } = await request.json()

  // TODO: List available agents by scanning directories
  // Now it's time to use!
  const agentFinalState = await agent.invoke(
    { messages: [new HumanMessage(query)] },
    { configurable: { thread_id: "42" } },
  );

  console.log('test: agentFinalState:', agentFinalState) // TODO remove

  const lastMsg: AIMessage = agentFinalState.messages[agentFinalState.messages.length - 1]
  const secondLastMsg = agentFinalState.messages[agentFinalState.messages.length - 2]

  const links: Link[] = []

  if (secondLastMsg instanceof ToolMessage) {
    console.log('test: secondLastMsg:', secondLastMsg)
    for (const link of JSON.parse((secondLastMsg.content as string) || '[]')) {
      console.log('test: link:', link)
      links.push({
        title: link.title,
        url: link.url,
        content: link.content,
      })
    }
  } else {
    console.warn('Second to last message is not a ToolMessage')
  }

  return json({
    content: lastMsg.content,
    links
  })
}
