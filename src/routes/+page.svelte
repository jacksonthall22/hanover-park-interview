<script lang="ts">
	import '../app.css';

	import MessageBox from './MessageBox.svelte';

	import Triangle from 'lucide-svelte/icons/triangle';
	import Bot from 'lucide-svelte/icons/bot';
	import SquareTerminal from 'lucide-svelte/icons/square-terminal';
	import CodeXML from 'lucide-svelte/icons/code-xml';
	import Settings2 from 'lucide-svelte/icons/settings-2';
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import Book from 'lucide-svelte/icons/book';
	import SquareUser from 'lucide-svelte/icons/square-user';
	import Settings from 'lucide-svelte/icons/settings';
	import Rabbit from 'lucide-svelte/icons/rabbit';
	import Bird from 'lucide-svelte/icons/bird';
	import Turtle from 'lucide-svelte/icons/turtle';
	import Share from 'lucide-svelte/icons/share';
	import Paperclip from 'lucide-svelte/icons/paperclip';
	import Mic from 'lucide-svelte/icons/mic';
	import CornerDownLeft from 'lucide-svelte/icons/corner-down-left';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	import type { ChatMessage } from '$lib/constants';
	import { ToolMessage } from '@langchain/core/messages';
	import type { Link } from '$lib/constants';

	let model = $state('chatgpt-4o');
	let searchDepth = $state('basic');
	let searchTopic = $state('general');
	let query = $state('');
	$inspect(query);

	let messages: ChatMessage[] = $state([
		{
			isHuman: false,
			text: 'Hey, how can I help you today?'
		}
	]);
	$inspect(messages);

	const onsubmit = async () => {
		messages.push({
			isHuman: true,
			text: query
		});

		const res = await fetch('/api/agent', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: model,
				searchDepth: searchDepth,
				searchTopic: searchTopic,
				query: query
			})
		});

		console.log('test: got response:', res);

		const data = await res.json();
    
    console.log('test: got response data:', data);

		messages.push({
			isHuman: false,
			text: data.content,
			links: data.links
		});
	};
</script>

<div class="grid h-screen w-full pl-[53px]">
	<aside class="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
		<div class="border-b p-2">
			<Button variant="outline" size="icon" aria-label="Home">
				<Triangle class="size-5 fill-foreground" />
			</Button>
		</div>
		<nav class="grid gap-1 p-2">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						variant="ghost"
						size="icon"
						class="rounded-lg bg-muted"
						aria-label="Playground"
						builders={[builder]}
					>
						<SquareTerminal class="size-5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="right" sideOffset={5}>Playgrond</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						variant="ghost"
						size="icon"
						class="rounded-lg"
						aria-label="Models"
						builders={[builder]}
					>
						<Bot class="size-5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="right" sideOffset={5}>Models</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						variant="ghost"
						size="icon"
						class="rounded-lg"
						aria-label="API"
						builders={[builder]}
					>
						<CodeXML class="size-5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="right" sideOffset={5}>API</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						variant="ghost"
						size="icon"
						class="rounded-lg"
						aria-label="Documentation"
						builders={[builder]}
					>
						<Book class="size-5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="right" sideOffset={5}>Documentation</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						variant="ghost"
						size="icon"
						class="rounded-lg"
						aria-label="Settings"
						builders={[builder]}
					>
						<Settings2 class="size-5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="right" sideOffset={5}>Settings</Tooltip.Content>
			</Tooltip.Root>
		</nav>
		<nav class="mt-auto grid gap-1 p-2">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						variant="ghost"
						size="icon"
						class="mt-auto rounded-lg"
						aria-label="Help"
						builders={[builder]}
					>
						<LifeBuoy class="size-5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="right" sideOffset={5}>Help</Tooltip.Content>
			</Tooltip.Root>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						variant="ghost"
						size="icon"
						class="mt-auto rounded-lg"
						aria-label="Account"
						builders={[builder]}
					>
						<SquareUser class="size-5" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="right" sideOffset={5}>Account</Tooltip.Content>
			</Tooltip.Root>
		</nav>
	</aside>
	<div class="flex flex-col">
		<header class="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
			<h1 class="text-xl font-semibold">Playground</h1>
			<Drawer.Root>
				<Drawer.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" size="icon" class="md:hidden">
						<Settings class="size-4" />
						<span class="sr-only">Settings</span>
					</Button>
				</Drawer.Trigger>
				<Drawer.Content class="max-h-[80vh]">
					<Drawer.Header>
						<Drawer.Title>Configuration</Drawer.Title>
						<Drawer.Description>
							Configure the settings for the model and messages.
						</Drawer.Description>
					</Drawer.Header>
					<form class="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
						<fieldset class="grid gap-6 rounded-lg border p-4">
							<legend class="-ml-1 px-1 text-sm font-medium"> Settings </legend>
							<div class="grid gap-3">
								<Label for="model">Model</Label>
								<Select.Root>
									<Select.Trigger id="model" class="items-start [&_[data-description]]:hidden">
										<Select.Value placeholder="Select a model" />
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="chatgpt-4o" label="ChatGPT 4o">
											<div class="flex items-start gap-3 text-muted-foreground">
												<Rabbit class="size-5" />
												<div class="grid gap-0.5">
													<p>
														OpenAI
														<span class="font-medium text-foreground"> ChatGPT 4o </span>
													</p>
												</div>
											</div>
										</Select.Item>
										<Select.Item value="llama-32" label="Llama 3.2">
											<div class="flex items-start gap-3 text-muted-foreground">
												<Bird class="size-5" />
												<div class="grid gap-0.5">
													<p>
														Ollama
														<span class="font-medium text-foreground"> Llama 3.2 </span>
													</p>
												</div>
											</div>
										</Select.Item>
									</Select.Content>
								</Select.Root>
							</div>

							<div class="grid gap-3">
								<Label for="search-depth">Search Depth</Label>
								<Select.Root>
									<Select.Trigger
										id="search-depth"
										class="items-start [&_[data-description]]:hidden"
									>
										<Select.Value placeholder="Choose a search depth" />
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="basic" label="Basic">
											<div class="flex items-start gap-3 text-muted-foreground">
												<Rabbit class="size-5" />
												<div class="grid gap-0.5">
													<p>
														<span class="font-medium text-foreground"> Basic </span>
													</p>
												</div>
											</div>
										</Select.Item>
										<Select.Item value="advanced" label="Advanced">
											<div class="flex items-start gap-3 text-muted-foreground">
												<Bird class="size-5" />
												<div class="grid gap-0.5">
													<p>
														<span class="font-medium text-foreground"> Advanced </span>
													</p>
												</div>
											</div>
										</Select.Item>
									</Select.Content>
								</Select.Root>
							</div>

							<div class="grid gap-3">
								<Label for="search-topic">Search Topic</Label>
								<Select.Root>
									<Select.Trigger
										id="search-topic"
										class="items-start [&_[data-description]]:hidden"
									>
										<Select.Value placeholder="general" />
									</Select.Trigger>
									<Select.Content>
										<Select.Item value="general" label="General">
											<div class="flex items-start gap-3 text-muted-foreground">
												<Rabbit class="size-5" />
												<div class="grid gap-0.5">
													<p>
														<span class="font-medium text-foreground"> General </span>
													</p>
												</div>
											</div>
										</Select.Item>
										<Select.Item value="news" label="News">
											<div class="flex items-start gap-3 text-muted-foreground">
												<Bird class="size-5" />
												<div class="grid gap-0.5">
													<p>
														<span class="font-medium text-foreground"> News </span>
													</p>
												</div>
											</div>
										</Select.Item>
									</Select.Content>
								</Select.Root>
							</div>
						</fieldset>
					</form>
				</Drawer.Content>
			</Drawer.Root>
			<Button variant="outline" size="sm" class="ml-auto gap-1.5 text-sm">
				<Share class="size-3.5" />
				Share
			</Button>
		</header>
		<main class="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
			<div class="relative hidden flex-col items-start gap-8 md:flex">
				<form class="grid w-full items-start gap-6">
					<fieldset class="grid gap-6 rounded-lg border p-4">
						<legend class="-ml-1 px-1 text-sm font-medium"> Settings </legend>
						<div class="grid gap-3">
							<Label for="model">Model</Label>
							<Select.Root>
								<Select.Trigger id="model" class="items-start [&_[data-description]]:hidden">
									<Select.Value placeholder="Select a model" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="chatgpt-4o">
										<div class="flex items-start gap-3 text-muted-foreground">
											<Rabbit class="size-5" />
											<div class="grid gap-0.5">
												<p>
													OpenAI
													<span class="font-medium text-foreground"> ChatGPT 4o </span>
												</p>
											</div>
										</div>
									</Select.Item>
									<Select.Item value="ollama-32">
										<div class="flex items-start gap-3 text-muted-foreground">
											<Bird class="size-5" />
											<div class="grid gap-0.5">
												<p>
													Ollama
													<span class="font-medium text-foreground"> Llama 3.2 </span>
												</p>
											</div>
										</div>
									</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>

						<div class="grid gap-3">
							<Label for="search-depth">Search Depth</Label>
							<Select.Root>
								<Select.Trigger id="search-depth" class="items-start [&_[data-description]]:hidden">
									<Select.Value placeholder="Choose a search depth" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="basic" label="Basic">
										<div class="flex items-start gap-3 text-muted-foreground">
											<Rabbit class="size-5" />
											<div class="grid gap-0.5">
												<p>
													<span class="font-medium text-foreground"> Basic </span>
												</p>
											</div>
										</div>
									</Select.Item>
									<Select.Item value="advanced" label="Advanced">
										<div class="flex items-start gap-3 text-muted-foreground">
											<Bird class="size-5" />
											<div class="grid gap-0.5">
												<p>
													<span class="font-medium text-foreground"> Advanced </span>
												</p>
											</div>
										</div>
									</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>

						<div class="grid gap-3">
							<Label for="search-topic">Search Topic</Label>
							<Select.Root>
								<Select.Trigger id="search-topic" class="items-start [&_[data-description]]:hidden">
									<Select.Value placeholder="Choose a search topic" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="general" label="General">
										<div class="flex items-start gap-3 text-muted-foreground">
											<Rabbit class="size-5" />
											<div class="grid gap-0.5">
												<p>
													<span class="font-medium text-foreground"> General </span>
												</p>
											</div>
										</div>
									</Select.Item>
									<Select.Item value="news" label="News">
										<div class="flex items-start gap-3 text-muted-foreground">
											<Bird class="size-5" />
											<div class="grid gap-0.5">
												<p>
													<span class="font-medium text-foreground"> News </span>
												</p>
											</div>
										</div>
									</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>
					</fieldset>

					<!-- <fieldset class="grid gap-6 rounded-lg border p-4">
						<legend class="-ml-1 px-1 text-sm font-medium"> Messages </legend>
						<div class="grid gap-3">
							<Label for="role">Role</Label>
							<Select.Root selected={{ value: 'system', label: 'system' }}>
								<Select.Trigger>
									<Select.Value placeholder="Select a role" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="system">System</Select.Item>
									<Select.Item value="user">User</Select.Item>
									<Select.Item value="assistant">Assistant</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>
						<div class="grid gap-3">
							<Label for="content">Content</Label>
							<Textarea id="content" placeholder="You are a..." class="min-h-[9.5rem]" />
						</div>
					</fieldset> -->
				</form>
			</div>
			<div
				class="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2"
			>
				<Badge variant="outline" class="absolute right-3 top-3">Output</Badge>
				<div class="flex-1">
					<div class="flex h-full w-full flex-col justify-start">
						<MessageBox {messages} />
					</div>
				</div>
				<form
					class="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
					onsubmit={async () => await onsubmit()}
				>
					<Label for="message" class="sr-only">Message</Label>
					<Textarea
						id="message"
						placeholder="Type your message here..."
						class="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
						bind:value={query}
					/>
					<div class="flex items-center p-3 pt-0">
						<Tooltip.Root>
							<Tooltip.Trigger asChild let:builder>
								<Button variant="ghost" size="icon" builders={[builder]}>
									<Paperclip class="size-4" />
									<span class="sr-only">Attach file</span>
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content side="top">Attach File</Tooltip.Content>
						</Tooltip.Root>
						<Tooltip.Root>
							<Tooltip.Trigger asChild let:builder>
								<Button variant="ghost" size="icon" builders={[builder]}>
									<Mic class="size-4" />
									<span class="sr-only">Use Microphone</span>
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content side="top">Use Microphone</Tooltip.Content>
						</Tooltip.Root>
						<Button type="submit" size="sm" class="ml-auto gap-1.5">
							Send Message
							<CornerDownLeft class="size-3.5" />
						</Button>
					</div>
				</form>
			</div>
		</main>
	</div>
</div>
