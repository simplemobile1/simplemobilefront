<style>
.frosted {
	backdrop-filter: blur(12px);
	background-color: hsla(0, 0%, 100%, 0.3);
}

.h-rem-empty {
	height: 70vh;
}
</style>

<script>
import { date, toast } from '$lib/utils'
import { del } from '$lib/utils/api'
import { goto, invalidateAll } from '$app/navigation'
import { loginUrl } from '$lib/store'
import { page } from '$app/stores'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import Pagination from '$lib/components/Pagination.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import { fetchReviews } from '$lib/services/ReviewService'

const seoProps = {
	title: 'Dashboard - Reviews ',
	description: 'My Reviews'
}

export let data

let typingTimer,
	loading = false

function callSearch(search) {
	clearTimeout(typingTimer)
	typingTimer = setTimeout(() => {
		searchData(search)
	}, 300)
}

async function searchData(search) {
	let u = new URL($page.url)
	u.searchParams.set('search', search.toString())
	goto(u.toString())
}

async function sortNow(sort) {
	let u = new URL($page.url)
	u.searchParams.set('sort', sort.toString())
	goto(u.toString())
}

async function remove(id) {
	try {
		toast('Removing the selected review please wait...', 'info')
		await del(`reviews?id=${id}&store=${$page.data.store?.id}`, $page.data.origin)
		toast('Removed the review successfully', 'success')
		// await refreshData()
		invalidateAll()
	} catch (e) {
		if (e.message === 'You must be logged in') {
			const url = '/'
			goto(`${$loginUrl}?ref=${url}`)
		}
	} finally {
		// refreshData()
		invalidateAll()
	}
}

// async function refreshData() {
// 	try {
// 		await fetchReviews({
// 			pid: data.product._id,
// 			search: data.search,
// 			sort: data.sort,
// 			currentPage: data.currentPage,
// 			origin: $page?.data?.origin,
// 			storeId: $page?.data?.store?.id
// 		})
// 	} catch (e) {
// 	} finally {
// 	}
// }
</script>

<SEO {...seoProps} />

<div class="w-full">
	{#if data.reviews?.isFetching}
		Loading....
	{:else if data.reviews?.errors}
		{data.reviews.errors}
	{:else if data.reviews?.data?.myReviews?.count}
		<header class="mb-3 flex flex-wrap items-center justify-between">
			{#if data.reviews.count > 0}
				<h1 class="mb-2 text-xl font-bold md:text-2xl ">
					Reviews

					{#if data.reviews.count}
						({data.reviews.count})
					{/if}
				</h1>

				<label class="mb-2">
					<span class="text-sm">Sort: </span>

					<select
						bind:value="{data.sort}"
						class="border-b border-gray-300 bg-transparent p-0.5 text-sm font-semibold focus:outline-none"
						on:change="{() => sortNow(data.sort)}"
					>
						<option value="-updatedAt" selected class="p-4">Whats New</option>
						<option value="name">Name ASC</option>
						<option value="-name">Name DESC</option>
						<option value="-active">Active</option>
						<option value="active">Inactive</option>
					</select>
				</label>
			{/if}
		</header>

		<div class="flex flex-col gap-2 sm:gap-4">
			{#if data.reviews?.data?.myReviews?.data}
				{#each data.reviews.data.myReviews.data as review}
					{#if review.listing}
						<div class="frosted rounded-lg border p-4 shadow-lg md:p-6">
							<div class="mb-2 flex w-full">
								<div class="mr-2 w-20 sm:mr-5 sm:w-32">
									<LazyImg
										src="{review.listing?.img}"
										alt="{review.listing?.name || ''}"
										width="128"
										class="h-full w-full object-contain object-top"
									/>
								</div>

								<div class="relative flex h-auto w-full flex-1 flex-col">
									<div class="mb-2 flex gap-2">
										<a
											href="{`/product/${review.listing?.slug}`}"
											aria-label="Click to view the product details"
											class="flex-1 font-semibold"
										>
											{review.listing?.name}
										</a>

										{#if $page?.data?.store?.isFnb && review.listing?.foodType}
											<div>
												{#if review.listing?.foodType === 'veg'}
													<img src="/product/veg.png" alt="veg" class="h-5 w-5" />
												{:else if review.listing?.foodType === 'nonveg'}
													<img src="/product/non-veg.png" alt="non veg" class="h-5 w-5" />
												{/if}
											</div>
										{/if}
									</div>

									<div class="mb-2 flex flex-row items-center">
										<div
											class="mr-2 flex items-center gap-1 rounded bg-primary-500 py-0.5 px-2 text-center text-sm font-bold text-white"
										>
											{review.rating}

											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
												></path>
											</svg>
										</div>

										<div class="text-normal flex-1 text-lg font-semibold">
											{#if review.rating === 1}
												<span class="font-semibold text-red-600"> Very Disappointed </span>
											{:else if review.rating === 2}
												<span class="font-semibold text-orange-600"> Slightly Disapponted </span>
											{:else if review.rating === 3}
												<span class="font-semibold text-green-600"> Good</span>
											{:else if review.rating === 4}
												<span class="font-semibold text-green-600"> Very Good</span>
											{:else if review.rating === 5}
												<span class="font-semibold text-green-600"> Excellent</span>
											{/if}
										</div>
									</div>

									<p class="mb-2 text-sm">
										<i>- {review.message}</i>
									</p>

									<div class="text-xs">
										<!-- <TimeAgo date="{+review.updatedAt}" /> -->

										{date(review.updatedAt)}
									</div>
								</div>
							</div>

							<div class="flex justify-end">
								<button
									class="w-9 rounded-full bg-gray-100 p-2 text-xs text-gray-500 transition duration-300 hover:bg-gray-200"
									on:click="{() => remove(review.id)}"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
											clip-rule="evenodd"></path>
									</svg>
								</button>
							</div>
						</div>
					{/if}
				{/each}
			{/if}
		</div>

		<Pagination
			count="{Math.ceil(
				data.reviews?.data?.myReviews?.count / data.reviews?.data?.myReviews?.pageSize
			)}"
			current="{+data.currentPage}"
		/>
	{:else}
		<div class="flex h-[70vh] flex-col items-center justify-center text-center">
			<img
				src="/no/online-review-animate.svg"
				alt="empty reviews"
				class="mb-5 h-60 object-contain"
			/>

			<span class="mb-3 text-xl font-medium md:text-3xl"> Empty Reviews !!</span>

			<span class="mb-5 text-sm"> We didn't find any review against your listing</span>

			<a href="/" aria-label="Click to route home" data-sveltekit-preload-data>
				<PrimaryButton class="w-40 py-2 text-sm">Shop Now</PrimaryButton>
			</a>
		</div>
	{/if}
</div>
