<script lang="ts">
	import Button from './Button.svelte';
	import Cart from './Cart.svelte';
	import Input from './Input.svelte';
	import Register from './Register.svelte';

	type Customer = {
		items: number;
	};

	export function rand(start: number, end: number) {
		return Math.ceil(Math.random() * (end - start)) + start;
	}

	let lines: Customer[][] = [];

	for (let i = 0; i < 6; i++) {
		const line = [];
		const maxNumberOfCustomers = 5;
		const maxNumberOfItems = 20;
		for (let j = 0; j < rand(0, maxNumberOfCustomers); j++) {
			line.push({ items: rand(1, maxNumberOfItems) });
		}
		lines.push(line);
	}

	setInterval(() => {
		// each cachier scans one item
		const updatedLines = [];
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const currentCustomer = line[0];
			if (currentCustomer) {
				const updatedItems = currentCustomer.items - 1;
				if (updatedItems === 0) {
					updatedLines.push(line.slice(1));
				} else {
					const updatedCustomer = { items: currentCustomer.items - 1 };
					const updatedLine = [updatedCustomer, ...line.slice(1)];
					updatedLines.push(updatedLine);
				}
			} else {
				updatedLines.push(line); // empty line
			}
		}
		lines = updatedLines;
	}, 2000);

	function getShortestLineIndex() {
		let min, i_min;
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const totalItems = line.reduce((total, { items }) => total + items, 0);
			if (min === undefined || totalItems < min) {
				min = totalItems;
				i_min = i;
			}
		}
		return i_min || 0;
	}

	let newCustomerItems: string;

	function handleCheckout(): void {
		const numberOfItems = parseInt(newCustomerItems);
		if (isNaN(numberOfItems)) {
			alert('Please enter a valid number of items.');
		} else {
			const i_shortest = getShortestLineIndex();
			// console.log(`shortest line is ${i_shortest}`);
			lines = [
				...lines.slice(0, i_shortest),
				[...lines[i_shortest], { items: numberOfItems }],
				...lines.slice(i_shortest + 1)
			];
			newCustomerItems = '';
		}
	}
</script>

<div class="p-10">
	<form on:submit|preventDefault={handleCheckout} class="grid grid-cols-2 gap-2 mb-10">
		<Input placeholder="How many items?" bind:value={newCustomerItems} />
		<Button>Checkout</Button>
	</form>

	<ul class="flex justify-between">
		{#each lines as line, i}
			<li class="grow">
				<div class="flex flex-col items-center">
					Register {i}
					<Register />
				</div>
				<ul class="flex flex-col items-center">
					{#each line as customer}
						<li>
							<Cart items={customer.items} />
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</div>
