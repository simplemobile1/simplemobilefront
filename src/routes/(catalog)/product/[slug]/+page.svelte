<style>
.frosted-black {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 0%, 0.8);
}
.frosted-blur {
	backdrop-filter: blur(12px);
}
.shake-animation {
	animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
	transform: translate3d(0, 0, 0);
	backface-visibility: hidden;
	border: 1px solid red;
}

@keyframes shake {
	10%,
	90% {
		transform: translate3d(-1px, 0, 0);
	}

	20%,
	80% {
		transform: translate3d(2px, 0, 0);
	}

	30%,
	50%,
	70% {
		transform: translate3d(-4px, 0, 0);
	}

	40%,
	60% {
		transform: translate3d(4px, 0, 0);
	}
}

@media only screen and (max-width: 768px) {
	.box-shadow {
		box-shadow: 0px -4px 10px rgba(50, 50, 50, 0.2);
	}
}
</style>

<script lang="ts">
import { applyAction, enhance } from '$app/forms'
import { checkhWishlist } from '$lib/services/WishlistService'
import { createEventDispatcher, onMount } from 'svelte'
import { date, currency, delay, toast } from '$lib/utils'
import { fetchProductReviews } from '$lib/services/ReviewService'
import { fetchRelatedProducts } from '$lib/services/ProductService'
import { fireGTagEvent } from '$lib/utils/gTag'
import { fly, slide, fade } from 'svelte/transition'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { post } from '$lib/utils/api'
import { toggleWishlistService } from '$lib/services/WishlistService'
import AnimatedCartItem from '$lib/components/AnimatedCartItem.svelte'
import Breadcrumb from '$lib/components/Breadcrumb.svelte'
import Checkbox from '$lib/ui/Checkbox.svelte'
import CheckboxOfMultiProducts from '$lib/ui/CheckboxOfMultiProducts.svelte'
import DeliveryOptions from './_DeliveryOptions.svelte'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import FrequentlyBoughtProduct from './_FrequentlyBoughtProduct.svelte'
import Gallery from '$lib/components/Product/Gallery.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import ProductNav from '$lib/ProductNav.svelte'
import productNonVeg from '$lib/assets/product/non-veg.png'
import productVeg from '$lib/assets/product/veg.png'
import Radio from '$lib/ui/Radio.svelte'
import RadioColor from '$lib/ui/RadioColor.svelte'
import RadioSize from '$lib/ui/RadioSize.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import SimilarProducts from '$lib/components/Product/SimilarProducts.svelte'
import SocialSharingButtons from '$lib/components/SocialSharingButtons.svelte'
import Textarea from '$lib/ui/Textarea.svelte'
import Textbox from '$lib/ui/Textbox.svelte'
import viewport from '$lib/actions/useViewPort'
import WhiteButton from '$lib/ui/WhiteButton.svelte'
import Product from '$lib/components/SEO/Product.svelte'

export let data

// console.log('zzzzzzzzzzzzzzzzzz', data)

let seoProps = {
	brand: `${$page?.data?.store?.websiteName}`,
	breadcrumbs: data.product?.categoryPool,
	caption: `${$page?.data?.store?.websiteName}`,
	category: data.product?.category?.name,
	contentUrl: data.product?.img || $page?.data?.store?.logo,
	createdAt: `${data.product?.createdAt || '_'}`,
	email: `${$page?.data?.store?.email}`,
	id: $page?.url?.href,
	image: `${data.product?.img}`,
	logo: $page?.data?.store?.logo,
	openingHours: ['Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 10:00-20:00'],
	popularity: data.product?.popularity,
	price: data.product?.price,
	priceRange: `${data.product?.price}-${data.product?.mrp}`,
	ratingCount: 1,
	ratingValue: +data.product?.ratings + 1,
	sku: data.product?.sku,
	timeToRead: 0,
	updatedAt: `${data.product?.updatedAt || '_'}`,
	metadescription: data.product?.metaDescription,
	canonical: `${$page?.url.href}`,
	datePublished: `${data.product?.publishedAt || '_'}`,
	description: ` ${data.product?.description}`,
	dnsPrefetch: `//cdn.jsdelivr.net`,
	featuredImage: {
		url: `${data.product?.img}`,
		width: 675,
		height: 380,
		caption: data.product?.name
	},
	keywords: data.product?.keywords,
	lastUpdated: `${data.product?.updatedAt || '_'}`,
	msapplicationTileImage: `${data.product?.img}`,
	ogImage: { url: $page?.data?.store?.logo, width: 128, height: 56 },
	ogImageSecureUrl: `${$page?.data?.store?.logo}`,
	ogImageType: 'image/jpeg',
	ogSiteName: `${$page.data.origin}/sitemap/sitemap.xml`,
	productAvailability: `${data.product?.stock}`,
	productBrand: `${data.product?.brandName || `${$page?.data?.store?.websiteName}`}`,
	productName: `${data.product?.name}`,
	productPriceAmount: `${data.product?.price}`,
	productPriceCurrency: `${$page?.data?.store?.currencyCode}`,
	slug: `${data.product?.slug}`,
	title: `${data.product?.name}`,
	twitterImage: { url: `${data.product?.img}` }
}
let selectedImgIndex
let wishlisted = false
let productReview = {}
let loading = false
let bounceItemFromTop = false
let showEditor = false
let cartButtonText = 'Add to Bag'
let sizes = ['100x200', '200x400', '400x800']
let selectedSize
let moreOptions = [
	{ type: 'checkbox', title: 'Add Flexible Glass Screen Guard ₹29.00' },
	{ type: 'checkbox', title: 'Add Same Design Key Chain ₹29.00' },
	{ type: 'checkbox', title: 'Add Same Design Phone Grip ₹49.00' }
]
let showReviewsCount = 1
let isLastReview = false
let shake = false
let selectedOptions = []
let showPhotosModal = false
let loadingForWishlist = false
let isWislisted = false
let customizedImg
let showUserInputForm = false
let y
let showStickyCartButton = true
let screenWidth
let selectedLinkiedProducts = []
let selectedOptions1 = []
let relatedProducts = []

$: if (y > 500) {
	showUserInputForm = true
}

if (data.product?.size?.name === 'One Size') {
	selectedSize = 'One Size'
}

onMount(async () => {
	screenWidth = screen.width
	try {
		isWislisted = await checkhWishlist({
			pid: data.product._id,
			vid: data.product._id,
			origin: $page?.data?.origin,
			storeId: $page?.data?.store?.id
		})

		/*relatedProducts = await fetchRelatedProducts({
			pid: data.product._id,
			categorySlug: data.product.category?.slug,
			origin: $page?.data?.origin,
			storeId: $page?.data?.store?.id
		})*/

	} catch (e) {
	} finally {
	}
	data.product.specifications = [{
		"name": "Data",
		"value": `${data.product.data} GB` 
	},{
		"name": "Valid for",
		"value":data.product.goodFor
	}]
	if(data.product.calls > 0){
		data.product.specifications.push({
		"name": "Calls",
		"value": `${data.product.calls} Minutes` 
	})
	}
	if(data.product.sms > 0){
		data.product.specifications.push({
		"name": "SMS",
		"value": `${data.product.sms} SMS` 
	})
	}
	data = data
})

function handleShowReviewsCount(showReviewsCount) {
	if (showReviewsCount >= productReview?.data?.count) {
		return (isLastReview = true)
	}
}

function selectSize(s) {
	selectedSize = s.name
}

function handleSelectedLinkiedProducts(e) {
	selectedLinkiedProducts = e.detail
}

function cartButtonEnterViewport() {
	if (y > 0) {
		showStickyCartButton = false
	} else {
		showStickyCartButton = true
	}
}

function cartButtonExitViewport() {
	if (y < 400) {
		showStickyCartButton = true
	} else {
		showStickyCartButton = false
	}
}

$: {
	const o1 = []
	for (const i in selectedOptions) {
		if (Array.isArray(selectedOptions[i])) o1.push({ option: i, values: o[i] })
		else o1.push({ option: i, values: [selectedOptions[i]] })
	}

	selectedOptions1 = o1
}

async function toggleWishlisted(id) {
	if (!$page.data.me) {
		goto(`${$page.data?.loginUrl || '/auth/login'}?ref=/my/wishlist/add/${id}`)
	}

	try {
		loadingForWishlist = true
		isWislisted = await toggleWishlistService({
			pid: id,
			vid: id,
			storeId: $page.data.store?.id,
			origin: $page.data.origin
		})
	} catch (e) {
	} finally {
		loadingForWishlist = false
	}
}

function scrollTo(elementId) {
	let element
	if (elementId.detail) {
		element = document.getElementById(elementId.detail)
	} else {
		element = document.getElementById(elementId)
	}
	window.scroll({
		behavior: 'smooth',
		left: 0,
		top: element.offsetTop - 100
	})
}

function handleGallery(index) {
	selectedImgIndex = index
	showPhotosModal = true
}

function handleMobileCanvas() {
	if (screenWidth < 640 && showEditor === false) {
		showEditor = true
	}
}
</script>

<SEO {...seoProps} />

<svelte:window bind:scrollY="{y}" />

<svelte:head>
	<title>{data.product?.name}</title>
</svelte:head>

<ProductNav me="{$page?.data?.me}" cart="{$page?.data?.cart}" store="{$page?.data?.store}">
	<h1 class="w-28 truncate font-semibold capitalize leading-4">
		{data.product?.brandName || `${$page?.data?.store?.websiteName}`}
	</h1>
</ProductNav>

<div class="mb-20 min-h-screen sm:mb-0 md:p-10">
	<div class="md:container md:mx-auto">
		<div class="mb-5 flex flex-wrap items-start justify-between gap-4 px-4 pt-4 md:px-0 md:pt-0">
			<!-- Breadcrumb -->

			<Breadcrumb
				categoryPool="{new Array({"name": data.product?.main.data.attributes.name,"slug":data.product?.main.data.id},
											{"name": data.product?.category.data.attributes.name,"slug":data.product?.category.data.id})}"
				currentProductName="{data.product?.name}"
			/>

			<!-- Social Share -->

			<SocialSharingButtons product="{data.product}" />
		</div>

		<div class="mb-5 grid grid-cols-1 items-start gap-5 sm:mb-10 sm:gap-10 lg:grid-cols-3">
			<!-- Images -->

			<div class="col-span-1 h-auto lg:col-span-1">
					<div
						class="flex w-full grid-cols-2 flex-row gap-2 overflow-x-scroll scrollbar-none md:grid"
					>
						{#if data?.product?.img}
						<button 
							class="flex h-auto w-full flex-shrink-0 cursor-zoom-in items-center justify-center overflow-hidden rounded md:flex-shrink"
									on:click="{() => handleGallery(0)}"							
							>
						<!----	{#each data.product?.images as img, index}
								<button
									type="button"
									class="flex h-auto w-full flex-shrink-0 cursor-zoom-in items-center justify-center overflow-hidden rounded md:flex-shrink"
									on:click="{() => handleGallery(index)}"
								>-->
									<LazyImg
										src="{data?.product?.img}"
										alt="{data.product?.name}"
										width="250"
										height="148"
										class="h-[148px] w-[250px] object-contain object-center text-xs"
									/>
							<!--	</button>
							{/each}-->
							</button>
						{/if}
					</div>

			</div>

			<div class="col-span-1 px-4 sm:px-10 md:px-0 lg:col-span-2">
			
				<!-- Name -->

				{#if data.product?.name}
					<div class="flex justify-between gap-2">
						<h2 class="flex-1 text-gray-500 sm:text-lg">
							{data.product?.name}
						</h2>
					</div>
				{/if}

				<!-- prices mobile -->

				<div class="mt-2 block sm:hidden">
					<div class="mb-2 flex flex-wrap items-center gap-2">
						<span class="whitespace-nowrap">
							<b>
								{currency(data.product.price, $page.data?.store?.currencySymbol)}
							</b>
						</span>

						{#if data.product?.mrp > data.product?.price}
							<span class="whitespace-nowrap text-gray-600 line-through">
								{currency(data.product.mrp, $page.data?.store?.currencySymbol)}
							</span>

							{#if data.product?.discount > 0}
								<span class="whitespace-nowrap text-green-600">
									({data.product?.discount}% off)
								</span>
							{/if}
						{/if}
					</div>

					<p class="text-sm font-semibold text-green-700">Inclusive of all taxes</p>
				</div>

				
				<!-- Delivery Options Mobile -->
				{#if data.product.main.data.attributes.name != "ESIM"}
				<div class="mb-5 block sm:hidden">
					<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
						<span> Delivery Options </span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1"
							stroke="currentColor"
							class="h-5 w-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
							></path>
						</svg>
					</h6>

					<DeliveryOptions product="{data.product}" deliveryDetails="{data.deliveryDetails}" />
				</div>
				{/if}
				<!-- prices desktop -->

				<div class="hidden sm:block">
					<div class="mb-2 flex flex-wrap items-center gap-4">
						<span class="whitespace-nowrap text-xl sm:text-2xl">
							<b>{currency(data.product.price, $page.data?.store?.currencySymbol)}</b>
						</span>

						{#if data.product?.mrp > data.product?.price}
							<span class="whitespace-nowrap text-lg text-gray-600 line-through sm:text-xl">
								{currency(data.product.mrp, $page.data?.store?.currencySymbol)}
							</span>

							{#if data.product?.discount > 0}
								<span class="whitespace-nowrap text-lg font-semibold text-primary-700 sm:text-xl">
									({data.product?.discount}% off)
								</span>
							{/if}
						{/if}
					</div>

					<p class="mb-5 text-sm font-semibold text-green-700">Inclusive of all taxes</p>
				</div>

				<!-- New and Tags -->

				{#if data.product?.tags?.length || data.product?.new}
					<div class="mb-5 flex flex-wrap gap-1">
						{#if data.product?.new}
							<div class="bg-red-500 py-1 px-2 text-xs font-semibold uppercase text-white">New</div>
						{/if}

						{#if data.product?.tags?.length}
							{#each data.product?.tags as tag}
								{#if tag?.name && tag?.type === 'Ribbon'}
									<div
										class="py-1 px-2 text-xs font-semibold uppercase text-white"
										style="background-color: {tag.colorCode || '#000000'};"
									>
										{tag.name}
									</div>
								{/if}
							{/each}
						{/if}
					</div>
				{/if}

				<!-- Size -->

				{#if data.product?.size}
					<div class="mb-5">
						<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
							<span> Select Size </span>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
								></path>
							</svg>
						</h6>

						<div class="flex flex-wrap gap-2">
							<button
								type="button"
								class="overflow-hidden rounded border py-1 px-3 text-sm font-medium uppercase transition duration-500 focus:outline-none
              				{data.product?.size?.name === selectedSize
									? 'border-primary-500 bg-primary-500 text-white'
									: 'border-gray-300 bg-transparent text-gray-500 hover:border-primary-500 hover:text-primary-500'}"
								on:click="{() => selectSize(data.product?.size)}"
							>
								{data.product?.size?.name}
							</button>
						</div>
					</div>
				{/if}

				<!-- Group Products -->

				{#if data.product?.groupProduct?.length}
					<div class="mb-5">
						<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
							<span> Similar Products </span>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-5 w-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
								></path>
							</svg>
						</h6>

						<ul class="flex flex-wrap gap-2">
							{#each data.product?.groupProduct as gp}
								<li>
									<a
										href="/product/{gp.slug}"
										aria-label="/product/{gp.slug || '##'}"
										class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border transition duration-300 hover:border-primary-500"
									>
										<LazyImg
											src="{gp.img}"
											alt="{gp.img}"
											height="56"
											class="h-14 w-auto object-contain object-center"
										/>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- {#if moreOptions?.length > 0}
					<div class="mb-5 flex flex-col gap-2">
						{#each moreOptions as option}
							<label for="{option.title}" class="flex items-center gap-2 text-sm font-medium">
								{#if option.type === 'checkbox'}
									<input
										type="checkbox"
										name="{option.title}"
										id="{option.title}"
										class="h-4 w-4" />
								{/if}

								<span>
									{option.title}
								</span>
							</label>
						{/each}
					</div>
				{/if} -->

				<!-- select options  -->

				{#if data.product?.options?.length > 0}
					<div
						class="sizeSelector mb-5 flex flex-col gap-3 text-sm"
						class:shake-animation="{shake}"
					>
						{#each data.product?.options as o}
							<div class="flex flex-col items-start sm:flex-row">
								<h6 class="mb-1 w-full flex-shrink-0 font-medium sm:mb-0 sm:w-52">
									{o.name}
								</h6>

								<!-- dropdown -->
								{#if o.inputType == 'dropdown'}
									<select
										bind:value="{selectedOptions[o._id]}"
										class="w-full max-w-xs flex-1 rounded-md border border-gray-300 py-1.5 text-sm font-light placeholder-gray-400 transition duration-300 focus:outline-none hover:bg-white"
									>
										{#each o.values as i}
											<option value="{i._id}">
												{i.name}
											</option>
										{/each}
									</select>

									<!-- textbox -->
								{:else if o.inputType == 'textbox'}
									<Textbox bind:value="{selectedOptions[o._id]}" type="text" />

									<!-- date -->
								{:else if o.inputType == 'date'}
									<Textbox id="start" bind:value="{selectedOptions[o._id]}" type="date" />

									<!-- daterange -->
									<!-- {:else if o.inputType == 'daterange'}
									<span>Date range picker is not found</span> -->

									<!-- <date-picker
									bind:value="{selectedOptions[o.id]}"
									class="max-w-xs flex-1"
									type="date"
									:disabled-date="disabledBeforeTodayAndAfterAWeek"
									range
									@change="$emit('optionChanged', selectedOptions)"></date-picker> -->

									<!-- textarea -->
								{:else if o.inputType == 'textarea'}
									<Textarea bind:value="{selectedOptions[o._id]}" />

									<!-- size -->
								{:else if o.inputType == 'size'}
									<div class="flex flex-wrap">
										{#each o.values as v}
											<RadioSize value="{v._id}" bind:modelValue="{selectedOptions[o._id]}">
												<span class="text-gray-500">{v.name}</span>
											</RadioSize>
										{/each}
									</div>

									<!-- color -->
								{:else if o.inputType == 'color'}
									<div class="flex flex-wrap gap-4">
										{#each o.values as v}
											<RadioColor value="{v._id}" bind:modelValue="{selectedOptions[o._id]}">
												<span class="text-gray-500">{v.name}</span>
											</RadioColor>
										{/each}
									</div>
									<!-- radio -->
								{:else if o.inputType == 'radio'}
									<div class="flex flex-wrap gap-4">
										{#each o.values as v}
											<Radio value="{v._id}" bind:modelValue="{selectedOptions[o._id]}">
												<span class="text-gray-500">{v.name}</span>
											</Radio>
										{/each}
									</div>

									<!-- checkbox -->
								{:else if o.inputType == 'checkbox'}
									<div class="flex flex-wrap gap-4">
										{#each o.values as v, i}
											<Checkbox value="{v._id}" bind:modelValue="{selectedOptions[o._id]}">
												<span class="text-gray-500">{v.name}</span>
											</Checkbox>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}

				<!-- Add to Cart -->

				<div
					use:viewport
					on:enterViewport="{cartButtonEnterViewport}"
					on:exitViewport="{cartButtonExitViewport}"
				></div>

				{#if !data.product?.isCustomized}
					<div
						class="box-shadow itmes-center fixed inset-x-0 bottom-0 z-10 grid w-full grid-cols-5 gap-2 border-t bg-white p-2 uppercase md:static md:mb-5 md:grid-cols-2 md:border-t-0 md:bg-transparent md:p-0 lg:max-w-sm"
					>
					<!---
						<div class="col-span-2 md:col-span-1">
							<WhiteButton
								type="button"
								loadingringsize="sm"
								loading="{loadingForWishlist}"
								class="w-full text-sm"
								on:click="{() => toggleWishlisted(data.product?._id)}"
							>
								{#if isWislisted}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 flex-shrink-0 text-red-500"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
											clip-rule="evenodd"></path>
									</svg>

									<span>Wishlisted</span>
								{:else}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 flex-shrink-0"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										></path>
									</svg>

									<span>Wishlist</span>
								{/if}
							</WhiteButton>
						</div>
						data.product?.active &&
					-->
						<div class="col-span-3 md:col-span-1">
							{#if  data.product?.hasStock}
								{#if cartButtonText === 'Go to cart'}
									<a
										href="/cart"
										aria-label="Click to route cart page"
										class="relative flex w-full transform items-center justify-center overflow-hidden rounded-md border border-primary-500 bg-primary-500 px-4 py-2 text-center text-sm font-semibold tracking-wider text-white shadow-md transition duration-700 focus:outline-none focus:ring-0 focus:ring-offset-0 hover:border-primary-700 hover:bg-primary-700"
										data-sveltekit-preload-data
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 flex-shrink-0"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
											>
											</path>
										</svg>

										<span>
											{cartButtonText}
										</span>
									</a>
								{:else}
									<form
										action="/cart?/add"
										method="POST"
										use:enhance="{() => {
											return async ({ result }) => {
												result?.data?.qty < 0
													? fireGTagEvent('remove_from_cart', result?.data)
													: fireGTagEvent('add_to_cart', result?.data)

												 cartButtonText = 'Added To Cart'
												bounceItemFromTop = true
												setTimeout(() => {
													bounceItemFromTop = false
												}, 3000)
												 cartButtonText = 'Go to cart'
												if (customizedImg) {
													goto(`/checkout/address`)
												}
												invalidateAll()

												await applyAction(result)
											}
										}}"
									>
										<input type="hidden" name="pid" value="{data?.product?.id}" />
										<input type="hidden" name="vid" value="{data?.product?.id}" />

										<input
											type="hidden"
											name="linkedItems"
											value="{JSON.stringify(selectedLinkiedProducts)}"
										/>

										<input type="hidden" name="qty" value="{1}" />

										<input
											type="hidden"
											name="options"
											value="{JSON.stringify(selectedOptions1)}"
										/>

										<input type="hidden" name="customizedImg" value="{customizedImg || data.product?.img}" />
										<input type="hidden" name="prod" value="{JSON.stringify(data.product)}" />

										<PrimaryButton
											type="submit"
											loading="{loading}"
											loadingringsize="sm"
											class="w-full text-sm"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5 flex-shrink-0"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												stroke-width="2"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
												>
												</path>
											</svg>

											<span>
												{cartButtonText}
											</span>
										</PrimaryButton>
									</form>
								{/if}
							{:else}
								<PrimaryButton type="button" hideLoading class="w-full text-sm" disabled>
									Item Unavailable
								</PrimaryButton>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Specifications -->

				{#if data.product?.specifications?.length}
					<div class="mb-5">
						<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
							<span> Specification </span>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1"
								stroke="currentColor"
								class="h-5 w-5 flex-shrink-0"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
								></path>
							</svg>
						</h6>

						<ul class="grid grid-cols-1 border-8 lg:grid-cols-2">
							{#each data.product?.specifications as s}
								<li class="flex items-center  border p-3">
									<h6 class=" font-medium sm:w-44">
										{s.name} : {s.value}
									</h6>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Product Details -->

				{#if data.product?.descrip}
					<div class="mb-5">
						<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
							<span> Details </span>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
								></path>
							</svg>
						</h6>

						<div class="prose max-w-none text-justify text-sm">
							{@html data.product?.descrip}
						</div>
					</div>
				{/if}

				<!-- terms -->

				{#if data.product?.terms}
					<p class="prose mb-5 text-gray-700">{@html data.product?.terms}</p>
				{/if}

				<!-- Linked Products -->

				{#if data.product?.linkedProducts?.length}
					<div class="mb-5">
						<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
							<span> Linked Products </span>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1"
								stroke="currentColor"
								class="h-5 w-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
								></path>
							</svg>
						</h6>

						<div class="flex flex-col gap-4">
							<CheckboxOfMultiProducts
								items="{data.product?.linkedProducts}"
								selectedItems="{selectedLinkiedProducts || []}"
								on:change="{handleSelectedLinkiedProducts}"
							/>
						</div>
					</div>
				{/if}

				<!-- Description -->

				{#if data.product?.longDescription}
					<div class="prose mb-5">
						<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
							<span> Description </span>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1"
								stroke="currentColor"
								class="h-5 w-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
								></path>
							</svg>
						</h6>

						<div class="prose overflow-hidden text-sm">
							{@html data.product?.longDescription}
						</div>
					</div>
				{/if}

				<hr class="mb-5 hidden w-full border-t border-gray-300 sm:block" />

				<!-- Delivery Options Desktop -->
				{#if data.product.main.data.attributes.name != "ESIM"}
				<div class="mb-5 hidden sm:block">
					<h6 class="mb-2 flex items-center gap-2 font-semibold uppercase">
						<span> Delivery Options </span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1"
							stroke="currentColor"
							class="h-5 w-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
							></path>
						</svg>
					</h6>

					<DeliveryOptions product="{data.product}" deliveryDetails="{data.deliveryDetails}" />
				</div>

				<hr class="mb-5 w-full border-t border-gray-300" />
				{/if}
				</div>
		</div>		

		<!-- Frequently bought together -->

		<div class="px-4 sm:px-10 md:px-0">
			{#if data.product?.crossSells?.length}
				<hr class="mb-5 w-full sm:mb-10" />

				<div class="mb-5 sm:mb-10">
					<h2 class="mb-5 text-lg font-bold capitalize sm:text-xl md:text-2xl">
						Frequently bought together
					</h2>

					<div
						class="mb-5 grid w-full grid-cols-2 items-start gap-3 sm:mb-10 sm:flex sm:flex-wrap sm:justify-between lg:mb-20 lg:gap-6"
					>
						{#each data.product?.crossSells as csp}
							<FrequentlyBoughtProduct product="{csp}" />
						{/each}

						{#each { length: 7 } as _}
							<div class="hidden sm:block">
								<DummyProductCard />
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if relatedProducts?.length}
				<hr class="mb-5 w-full sm:mb-10" />

				<SimilarProducts similarProducts="{relatedProducts}" />
			{/if}
		</div>
	</div>
</div>

<Gallery
	bind:selectedImgIndex="{selectedImgIndex}"
	bind:showPhotosModal="{showPhotosModal}"
	product="{data.product}"
/>

{#if bounceItemFromTop}
	<AnimatedCartItem img="{customizedImg || data.product?.img}" />
{/if}

<!-- <UserForm showUserInputForm="{showUserInputForm}" /> -->
