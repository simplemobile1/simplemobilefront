<script lang="ts">
    import type { Product } from '$lib/types'

import ProductCard from '$lib/ProductCard.svelte'
export let code: String = "";
let filtrprod: Array<Product> = []
</script>
{#each filtrprod as product}
    <ProductCard {product}/>
{/each}
