<script>
import SEO from '$lib/components/SEO/index.svelte'
import Skeleton from '$lib/ui/Skeleton.svelte'

export let data //loading, err, faqs, count

let seoProps = {
	title: `Frequently Asked Questions`,
	description: `Frequently Asked Questions`
}

let show = []

function showans(i) {
	show[i] = !show[i]
}
</script>

<SEO {...seoProps} />

<section class="min-h-screen p-3 sm:p-10">
	<div class="container mx-auto w-full max-w-6xl">
		{#if data.loading}
			<div class="flex flex-col gap-5">
				{#each { length: 3 } as _}
					<Skeleton />
				{/each}
			</div>
		{:else if data.count > 0}
			<!-- Frequently Asked Questions -->

			<div>
				<h1
					class="mb-5 text-center font-serif text-2xl font-medium sm:mb-10 md:text-3xl lg:text-4xl"
				>
					Frequently Asked Questions
				</h1>

				<div class="divide-y overflow-hidden rounded-md border">
					{#each data.faqs as f, fx}
						<div class:text-primary-500="{show[fx]}">
							<button
								type="button"
								class="flex w-full cursor-pointer items-start justify-between p-4 text-left focus:outline-none sm:p-6"
								on:click="{() => showans(fx)}"
							>
								<span class="flex-1  text-base font-medium md:text-lg">{f.question}</span>

								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 transition duration-300 sm:h-6 
									{show[fx] ? 'text-primary-500 transform rotate-45 transition duration-300' : ''}"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 4v16m8-8H4"></path>
								</svg>
							</button>

							{#if show[fx]}
								<div
									class="prose animate-dropdown px-4 pb-4 text-sm text-gray-500 first-letter:uppercase sm:px-6 sm:pb-6 md:text-base"
								>
									{@html f.answer}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>
