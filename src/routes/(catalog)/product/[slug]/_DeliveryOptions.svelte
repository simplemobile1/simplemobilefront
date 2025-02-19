<script>
import { applyAction, enhance } from '$app/forms'
import { toast } from '$lib/utils'
import dayjs from 'dayjs'
import productCod from '$lib/assets/product/cod.png'
import productDelivery from '$lib/assets/product/delivery.png'
import productOppositeArrows from '$lib/assets/product/opposite-arrows.png'
import Skeleton from '$lib/ui/Skeleton.svelte'

export let product, deliveryDetails

// let deliveryDetails = $page.data.zip || {}
let pincode = deliveryDetails?.pincode ?? null
let loading = false
let disabled = false

if (pincode && pincode.toString().length === 6) {
	disabled = true
}

function changePincode() {
	pincode = null
	disabled = false
	deliveryDetails = null
}
</script>

<div class="mb-4">
	<form
		action="/server/verify-zip"
		method="POST"
		use:enhance="{() => {
			return async ({ result }) => {
				// console.log('bounceItemFromTop', result)
				if (!result.pincode) {
					toast('Please enter valid pincode', 'error')
					return (deliveryDetails = null)
				}
				deliveryDetails = result
				await applyAction(result)
				disabled = true
			}
		}}"
		class="relative w-full max-w-sm overflow-hidden rounded-md border
        {disabled ? 'border-gray-300' : ''}
		{pincode && pincode.toString().length === 6 ? 'border-primary-500' : 'border-gray-300'}"
	>
		<input
			type="tel"
			name="zip"
			bind:value="{pincode}"
			maxlength="6"
			placeholder="Enter pincode"
			disabled="{disabled}"
			class="w-full rounded-md bg-transparent py-3 px-4 pr-24 text-sm font-semibold placeholder:font-normal focus:outline-none disabled:bg-gray-100"
		/>

		{#if !deliveryDetails}
			<button
				type="submit"
				class="absolute inset-y-0 right-0 z-10 flex w-20 items-center justify-center text-right text-sm font-bold
				{pincode && pincode.toString().length === 6 ? 'text-primary-500' : 'text-gray-300'}"
			>
				{#if loading}
					<div
						class="absolute inset-0 flex cursor-not-allowed items-center justify-center bg-black bg-opacity-70"
					>
						<svg
							class="mx-auto h-4 w-4 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</div>
				{/if}

				<span> Check </span>
			</button>
		{:else}
			<button
				type="button"
				class="absolute inset-y-0 right-0 z-10 flex w-20 items-center justify-center text-right text-sm font-bold text-primary-500"
				on:click="{changePincode}"
			>
				{#if loading}
					<div
						class="absolute inset-0 flex cursor-not-allowed items-center justify-center bg-black bg-opacity-70"
					>
						<svg
							class="mx-auto h-4 w-4 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</div>
				{/if}

				<span> Change </span>
			</button>
		{/if}
	</form>

	{#if loading}
		<ul class="mt-4 flex flex-col gap-4">
			{#each { length: 2 } as _}
				<li>
					<Skeleton extraSmall />
				</li>
			{/each}
		</ul>
	{:else if deliveryDetails?.pincode}
		<ul class="mt-4 flex flex-col gap-2">
			<li class="flex items-center gap-4">
				<div class="flex h-auto w-8 items-center justify-end overflow-hidden">
					<img src="{productDelivery}" alt="" class="h-full w-full object-contain object-center" />
				</div>

				<span>
					Get it by {dayjs().add(deliveryDetails?.deliveryDays, 'day').format('dddd, MMM D, YYYY')}
				</span>
			</li>

			<li class="flex items-center gap-4">
				<div class="flex h-auto w-8 items-center justify-end overflow-hidden">
					<img src="{productCod}" alt="" class="h-full w-full object-contain object-center" />
				</div>

				<span>
					{#if deliveryDetails?.hasCOD}
						Pay on delivery available
					{:else}
						Pay on delivery not available
					{/if}
				</span>
			</li>

			{#if product.replaceAllowed || product.returnAllowed}
				<li class="flex items-center gap-4">
					<div class="flex h-auto w-8 items-center justify-end overflow-hidden">
						<img
							src="{productOppositeArrows}"
							alt=""
							class="h-full w-full object-contain object-center"
						/>
					</div>

					<div>
						{#if product.replaceAllowed && product.returnAllowed}
							{#if product.returnValidityInDays === product.replaceValidityInDays}
								Easy {product.returnValidityInDays} days return & exchange available
							{:else}
								Easy {product.returnValidityInDays} days return & {product.replaceValidityInDays}
								days exchange available
							{/if}
						{/if}

						{#if product.returnAllowed && product.returnValidityInDays > 0 && !product.replaceAllowed}
							Easy {product.returnValidityInDays} days return available
						{/if}

						{#if product.replaceAllowed && product.replaceValidityInDays > 0 && !product.returnAllowed}
							Easy {product.replaceValidityInDays} days exchange available
						{/if}
					</div>
				</li>
			{/if}
		</ul>
	{:else if !deliveryDetails?.pincode}
		<div class="mt-2">
			<p class="text-xs text-gray-500">
				Please enter PIN code to check delivery time & Pay on Delivery Availability
			</p>

			<ul class="mt-4 ml-4 flex list-disc flex-col gap-1 text-sm">
				<li>Shipping fee: 30₪</li>
				<!-- <li>Easy 30 days returns and exchanges</li>
				<li>Try & Buy might be available</li> -->
			</ul>
		</div>
	{/if}
</div>
