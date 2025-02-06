<script lang='ts'>
  import Message from './Message.svelte'
  import type { ChatMessage } from '$lib/constants'

  interface Props {
    messages: ChatMessage[];
  }
  let { messages }: Props = $props()
</script>

<section class='flex flex-col gap-2 pt-6'>
  {#each messages as message}
    <Message {message} />
  {/each}
</section>