<script lang="ts">
	import type { ModelMessage } from 'ai';
	import { onMount, tick } from 'svelte';
	import { getChatId } from '$lib';
	import { invalidateAll } from '$app/navigation';
	import { Disc3Icon, SendHorizontalIcon } from '@lucide/svelte';

	let stream = '';
	let input = $state('');
	let streaming = $state(false);
	let chat: ModelMessage[] = $state([]);

	let revealedLength = 0;
	let revealTimer: ReturnType<typeof setInterval> | null = null;

	function stopTimer() {
		if (!revealTimer) return;
		clearInterval(revealTimer);
		revealTimer = null;
	}

	function scrollToBottom(behavior: 'smooth' | 'instant') {
		tick().then(() => {
			const element = document.querySelector('.messages');
			element?.scrollTo({
				top: element.scrollHeight,
				behavior
			});
		});
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const prompt = input;
		const chatId = getChatId();
		input = '';
		chat = [...chat, { role: 'user', content: prompt }, { role: 'assistant', content: '' }];
		scrollToBottom('smooth');

		stream = '';
		streaming = true;
		revealedLength = 0;
		const res = await fetch('/api/chat', {
			method: 'POST',
			body: JSON.stringify({ prompt, chatId })
		});

		if (!res.ok) {
			throw new Error();
		}

		const reader = res.body?.getReader();
		if (!reader) {
			throw new Error('No readable stream in response');
		}

		const decoder = new TextDecoder();
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = decoder.decode(value, { stream: true });
			stream += chunk;

			if (!revealTimer) {
				revealTimer = setInterval(() => {
					if (revealedLength < stream.length) {
						revealedLength++;
						chat[chat.length - 1].content = stream.slice(0, revealedLength);
						scrollToBottom('instant');
					} else if (!streaming) {
						stopTimer();
					}
				}, 10);
			}
		}
		streaming = false;
		await invalidateAll();
	}

	onMount(async () => {
		const response = await fetch(`/api/chat?chatId=${getChatId()}`, { method: 'GET' });
		const data = await response.json();
		if (data.chat?.messages && Array.isArray(data.chat.messages)) {
			chat = data.chat.messages;
			scrollToBottom('instant');
		}
	});
</script>

<div class="container">
	<h1>🤖 UnoBot</h1>

	{#if chat.length}
		<div class="messages">
			{#each chat as message, index}
				<div class="message {message.role}">
					{#if streaming && !message.content.length && index === chat.length - 1}
						<Disc3Icon class="spinner" />
					{:else}
						<p>{message.content}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<form onsubmit={handleSubmit}>
		<input style:max-width={chat.length ? 'unset' : '50%'} bind:value={input} />
		<button disabled={!input.length} type="submit"
			><SendHorizontalIcon id="send-button-icon" /></button
		>
	</form>
</div>

<style>
	.container {
		flex: 1;
		padding: 2rem;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h1 {
		text-align: center;
		margin-bottom: 1rem;
	}

	.messages {
		flex: 1;
		width: 100%;
		overflow-y: auto;
		border: 1px solid #494d64;
		border-radius: 14px;
		padding: 1rem;
		margin-bottom: 1rem;
		background: #1e2030;
	}

	.message {
		width: fit-content;
		max-width: 80%;
		padding: 0.75rem;
		border-radius: 6px;
		margin-bottom: 1rem;
	}

	.message.user {
		margin-left: auto;
		background: #363a4f;
	}

	.message.assistant {
		margin-right: 2rem;
	}

	.message p {
		white-space: pre-wrap;
	}

	form {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	form > input {
		flex: 1;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	form > input:focus + button {
		border-color: #c6a0f6;
	}

	button {
		padding: 0.5em 1em;
		border-radius: 14px;
		border: 1px solid currentColor;
	}

	button:hover {
		background-color: #363a4f;
	}

	button:active {
		color: #c6a0f6;
	}

	button {
		color: #181926;
		background-color: #cad3f5;
		border-color: #cad3f5;
		border-left: 0;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	button:not(:disabled):hover {
		color: #c6a0f6;
		background-color: #363a4f;
	}

	button:not(:disabled):active {
		filter: brightness(1.2);
	}

	button:disabled {
		opacity: 0.75;
		cursor: not-allowed;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	:global(.spinner) {
		color: #cad3f5;
		display: inline-flex;
		animation: spin 3s linear infinite;
	}
</style>
