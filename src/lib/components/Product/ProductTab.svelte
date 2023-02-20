<script lang="ts">
	import type { Product } from '$lib/types'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import ProductCard from '$lib/ProductCard.svelte'
import DummyProductCard from '$lib/DummyProductCard.svelte'
import { fetchProducts } from '$lib/services/ProductService'
import pr from '$lib/data/prod.json'
export let kind = ""

export let code = 'IL'
let loading = false
let products = []

onMount(async () => {
		 console.log('products', products)

	try {
		loading = true
		products = pr
	} catch (e) {
	} finally {
		loading = false
	}

	filterProducts(code)
})

function filterProducts(selectedCategory:string) {
	products = products.data?.filter((p) => {
		if(kind != "geo"){
		 return p.attributes?.country === selectedCategory.toUpperCase()
		}else{
		 return p.attributes?.category?.data.attributes?.name === selectedCategory
		}

	})

	 console.log('products', products)
}
</script>

<div>


	<ul
		class="grid w-full grid-cols-2 items-start border-t sm:flex sm:flex-wrap sm:justify-between sm:gap-3 sm:border-t-0 sm:px-10 lg:gap-6"
	>
		{#each products as p}
			<li>
				<ProductCard product="{p.attributes}" iid={p.id} />
			</li>
		{/each}

		{#each { length: 8 } as _}
			<li class="hidden sm:block">
				<DummyProductCard />
			</li>
		{/each}
	</ul>
</div>
