<script lang="ts">
	import type { ChatMessage } from '$lib/constants';

	interface Props {
		message: ChatMessage;
	}

	let { message }: Props = $props();
</script>

<div class="flex w-full flex-col">
	<div class="flex w-full flex-row">
		{#if message.isHuman}
			<div class="flex-1"></div>
		{/if}

		<div class="flex flex-col gap-2 rounded-sm bg-neutral-200 p-4">
			<p class="">{message.text}</p>

			{#if message.links}
				<div class="w-full rounded bg-neutral-300 p-2 text-neutral-800">
					<sub class=" text-sm">
						Sources:
						<ol>
							{#each message.links as link, i}
								<li>
									<a href={link.url} target="_blank" rel="noopener noreferrer" class="p-2 before:content-['🔗'] before:mr-2">
										{link.title}
									</a>
								</li>
							{/each}
						</ol>
					</sub>
				</div>
			{/if}
		</div>

		{#if !message.isHuman}
			<div class="flex-1"></div>
		{/if}
	</div>
</div>
