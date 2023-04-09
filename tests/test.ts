import { expect, test } from '@playwright/test';
import { rand } from '../src/routes/+page.svelte';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Welcome to SvelteKit' })).toBeVisible();
});

test('rand function is inclusive of start', async ({ page }) => {
	const randomNumbers = [0];
	for (let i = 0; i < 1000; i++) {
		randomNumbers.push(rand(0, 4));		
	}
	expect(randomNumbers).toContain(0);
});
