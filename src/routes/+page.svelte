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

	const min = 1;
	const max = 5;

	const changeAmount = debounce((value) => {
		amount = ((Math.abs(value + amount) - 1) % max) + 1;
	});

	const increment = changeAmount.bind(null, 1);
	const decrement = changeAmount.bind(null, -1);

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
		<button class="button decrement" on:click={decrement} disabled={amount === min}>-</button>
		<button
			class="button roll"
			bind:this={trigger}
			on:click={() => {
				show = true;
			}}>Бросить</button
		>

		<button class="button increment" on:click={increment} disabled={amount === max}>+</button>
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
		min-height: 400px;
		padding: 2rem 0;
		flex-wrap: wrap;
	}

	.controls {
		display: flex;
		gap: 1rem;
	}

	@media (hover: none) {
		.button:hover {
			background-color: none;
			color: skyblue;
		}
	}

	.button {
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
		user-select: none;
	}

	.button:disabled {
		pointer-events: none;
		filter: grayscale(1);
	}

	.button:active {
		filter: blur(2px);
	}

	.button:hover {
		background-color: skyblue;
		color: #fff;
	}
</style>
