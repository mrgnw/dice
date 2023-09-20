<script>
	// @ts-nocheck

	import stickers from '$lib/stickers';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { blur } from 'svelte/transition';
	import debounce from 'lodash/debounce';

	onMount(() => {
		import('@lottiefiles/lottie-player/dist/tgs-player.js');
	});

	let trigger;
	let show = false;
	let amount = 2;

	const handleAmountInput = debounce((e) => {
		const newAmount = e.target.value;
		amount = Math.abs((newAmount - 1) % 9) + 1;
	}, 50);

	const initPlayer = (player) => {
		const handleComplete = () => {
			player.pause();
		};

		const handlePlayerReady = () => {
			player.play();
		};

		const handleTrigger = () => {
			player.load(stickers[Math.floor(Math.random() * 6)]);
		};

		trigger.addEventListener('click', handleTrigger);
		player.addEventListener('ready', handlePlayerReady);
		player.addEventListener('complete', handleComplete);

		handleTrigger();

		return {
			destroy() {
				player.removeEventListener('complete', handleComplete);
				player.removeEventListener('ready', handlePlayerReady);
				trigger.removeEventListener('click', handleTrigger);
			}
		};
	};
</script>

<svelte:head>
	<title>Кубики онлайн</title>
</svelte:head>

<div class="container">
	<div class="dices">
		{#if show}
			{#each Array(amount) as _, index (index)}
				<tgs-player
					transition:blur|global={{ duration: 250, amount: 12 }}
					role="none"
					use:initPlayer
					animate:flip={{ duration: 250 }}
				/>
			{/each}
		{/if}
	</div>

	<div class="controls">
		<input
			class="amount"
			type="number"
			max="9"
			min="1"
			on:input={handleAmountInput}
			value={amount}
		/>
		<button
			class="roll"
			bind:this={trigger}
			on:click={() => {
				show = true;
			}}>Бросить</button
		>
	</div>
</div>

<style>
	tgs-player {
		width: 150px;
		height: 150px;
		pointer-events: none;
	}
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.dices {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 350px;
	}

	.controls {
		display: flex;
		gap: 1rem;
	}
	.roll {
		display: block;
		background: none;
		border: none;
		border: 2px skyblue solid;
		border-radius: 2px;
		padding: 0 2rem;
		cursor: pointer;
		font-size: 2rem;
		line-height: 2.5rem;
		color: skyblue;
		transition: all 0.25s ease;
	}

	.amount {
		font-size: 2rem;
		line-height: 2.5rem;
		outline: none;
		border: 2px skyblue solid;
		text-align: center;
	}

	.roll:active {
		filter: blur(2px);
	}

	.roll:hover {
		background-color: skyblue;
		color: #fff;
	}
</style>
