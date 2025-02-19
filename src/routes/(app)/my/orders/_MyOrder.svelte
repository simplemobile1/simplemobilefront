<style>
.track {
	border-radius: 25px;
	font-size: 11px;
}
</style>

<script>
import { currency, date } from '$lib/utils'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import OrderListSkeleton from './_OrderListSkeleton.svelte'
import Pagination from '$lib/components/Pagination.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'

export let orders

let clazz = ''
export { clazz as class }
</script>

<div class="w-full {clazz}">
	{#if orders.data?.length}
		<div>
			<div class="mb-4 flex w-full flex-row items-center justify-between">
				<h1 class="font-serif text-2xl font-medium md:text-3xl lg:text-4xl">
					Orders

					{#if orders.count}
						({orders.count})
					{/if}
				</h1>

				<a
					href="/"
					aria-label="Click to route home"
					class="text-sm text-blue-400 underline lg:hidden"
				>
					Shop More
				</a>
			</div>

			{#if orders?.data?.length > 0}
				<ul>
					{#each orders.data as order}
						<li class="mb-4 hidden sm:mb-10 xl:block">
							<div class="mb-3 flex items-center justify-between text-sm text-gray-500 sm:mb-4">
								<h6>Order No : #{order.orderNo}</h6>

								<h6>Order Date : {date(order.createdAt)}</h6>
							</div>

							<table
								class="group min-w-full divide-y divide-gray-200 rounded-md border border-gray-200 text-gray-500 shadow-md"
								on:click="{() => goto(`/my/orders/${order._id}`)}"
							>
								<thead class="whitespace-nowrap rounded-t-md bg-gray-100 text-xs uppercase">
									<tr>
										<!-- <th class="px-5 py-3 font-medium tracking-wider text-gray-500"> # </th> -->

										<th class="p-3 font-medium tracking-wider text-gray-500"> Image </th>

										<th class="p-3 font-medium tracking-wider text-gray-500"> Vendor </th>

										<th class="p-3 font-medium tracking-wider text-gray-500"> Name </th>

										<th class="p-3 font-medium tracking-wider text-gray-500"> Qty </th>

										<th class="p-3 font-medium tracking-wider text-gray-500"> Price </th>

										<th class="p-3 font-medium tracking-wider text-gray-500"> Shipping </th>

										<th class="p-3 font-medium tracking-wider text-gray-500"> Total </th>

										<th class="p-3 font-medium tracking-wider text-gray-500"> Status </th>
									</tr>
								</thead>

								<tbody
									class="cursor-pointer divide-y divide-gray-200 rounded-b-md bg-white bg-white text-sm transition duration-300 group-hover:bg-primary-50"
								>
									{#each order.orderItems as item}
										<tr>
											<td class="p-3">
												<div class="flex-shrink-0">
													{#if item.isCustomized}
														<LazyImg
															src="{item.customizedImg}"
															alt=" "
															width="80"
															class="h-auto w-20 object-contain object-top"
														/>
													{:else}
														<LazyImg
															src="{item.img}"
															alt=" "
															width="80"
															class="h-auto w-20 object-contain object-top"
														/>
													{/if}
												</div>
											</td>

											<td class="p-3">
												{item.vendorBusinessName}
											</td>

											<td class="p-3">
												<div class="flex w-60 justify-center gap-2">
													<span>{item.name}</span>

													{#if $page?.data?.store?.isFnb && item.foodType}
														<div class="flex-shrink-0">
															{#if item.foodType === 'veg'}
																<img src="/product/veg.png" alt="veg" class="h-5 w-5" />
															{:else if item.foodType === 'nonveg'}
																<img src="/product/non-veg.png" alt="non veg" class="h-5 w-5" />
															{/if}
														</div>
													{/if}
												</div>
											</td>

											<td class="whitespace-nowrap p-3">
												{item.qty}
											</td>

											<td class="whitespace-nowrap p-3">
												{currency(item.price)}
											</td>

											<td class="whitespace-nowrap p-3">
												{currency(item.shippingCharge)}
											</td>

											<td class="whitespace-nowrap p-3">
												{currency(item.total)}
											</td>

											<td class="p-3">
												<span class="whitespace-nowrap font-semibold uppercase text-primary-500">
													{item.status}
												</span>
											</td></tr
										>
									{/each}
								</tbody>
							</table>
						</li>

						<li class="xl:hidden">
							<div class="mb-3 flex items-center justify-between text-sm text-gray-500 sm:mb-4">
								<h6>
									<span class="hidden sm:block">Order No :</span>

									{order.orderNo}
								</h6>

								<h6>
									<span class="hidden sm:block">Order Date :</span>

									{date(order.createdAt)}
								</h6>
							</div>

							<a
								href="/my/orders/{order._id}"
								aria-label="orders"
								class="mb-4 block w-full divide-y divide-gray-200 rounded-md border bg-white text-sm text-gray-600 shadow-md transition duration-300 hover:bg-primary-50 sm:mb-10"
							>
								{#each order.orderItems as item}
									<div class="flex items-start gap-2 p-4 sm:gap-5">
										<div class="flex-shrink-0">
											{#if item.isCustomized}
												<LazyImg
													src="{item.customizedImg}"
													alt=" "
													width="56"
													class="h-auto w-14 object-contain object-top"
												/>
											{:else}
												<LazyImg
													src="{item.img}"
													alt=" "
													width="56"
													class="h-auto w-14 object-contain object-top"
												/>
											{/if}
										</div>

										<div class="w-full flex-1">
											<!-- {#if item.vendor}
													<a href="/vendor/${item.vendor?.slug}?id=${item.vendor?.id}" aria-label="Click to route vendor's profile">
														 {#if store.isFnb && item.vendorBusinessName}
															 <b class="mb-2">
																 {item.vendorBusinessName}
															</b>
														{/if}
													</a>
												{/if} -->

											<div class="mb-2 flex items-start justify-between">
												<span class="flex-1">{item.name}</span>

												{#if $page?.data?.store?.isFnb && item.foodType}
													<div>
														{#if item.foodType === 'veg'}
															<img src="/product/veg.png" alt="veg" class="h-5 w-5" />
														{:else if item.foodType === 'nonveg'}
															<img src="/product/non-veg.png" alt="non veg" class="h-5 w-5" />
														{/if}
													</div>
												{/if}
											</div>

											<div class="flex flex-wrap gap-2 text-sm">
												<div class="flex items-center gap-2">
													<h6>Price :</h6>

													<b class="text-gray-500">
														{currency(item.price)}
														*
														{item.qty}
													</b>
												</div>

												<div class="flex items-center gap-2">
													<h6>Delivery :</h6>

													<b class="text-gray-500">
														{currency(item.shippingCharge)}
													</b>
												</div>

												<div class="flex items-center gap-2">
													<h6>Total :</h6>

													<b class="text-gray-500">
														{currency(item.total)}
													</b>
												</div>

												<div class="flex items-center gap-2">
													<h6>Status :</h6>

													<b class="uppercase text-primary-500">
														{item.status}
													</b>
												</div>
											</div>
										</div>
									</div>
								{/each}
							</a>
						</li>
					{/each}
				</ul>
			{:else}
				<div class="my-10 flex w-full flex-col items-center justify-center">
					<img src="/no/empty-order.svg" alt="" class="mb-10 h-80 md:h-96" />

					<h4 class="text-xl font-semibold sm:mb-10 sm:text-2xl">Oops!, There's no Orders Yet</h4>
				</div>
			{/if}
		</div>

		<Pagination
			count="{Math.ceil(orders.count / orders.pageSize)}"
			current="{+orders.currentPage}"
		/>
	{:else if orders.count === 0}
		<div class="flex flex-col items-center justify-center text-center">
			<img src="/no/add-to-cart-animate.svg" alt="empty cart" class="mb-5 h-60 object-contain" />

			<span class="mb-3 text-xl font-medium md:text-3xl"> Your have't ordered yet !!</span>

			<span class="mb-4 text-xs">Add items to it now</span>

			<a href="/" aria-label="Click to route home" data-sveltekit-preload-data>
				<PrimaryButton class="w-40 py-2 text-sm">Shop Now</PrimaryButton>
			</a>
		</div>
	{/if}
</div>
