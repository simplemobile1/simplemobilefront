<style>
img.lazy {
	opacity: 0.95;
	transition: opacity 1200ms ease-out;
}
img:not(.initial) {
	transition: opacity 1s;
}
img.initial,
img.loaded,
img.error {
	opacity: 1;
}

img:not([src]) {
	visibility: hidden;
}
</style>

<script lang="ts">
import { onMount } from 'svelte'
import { IMAGE_CDN_URL } from '$lib/config'
import lazyload from 'vanilla-lazyload'
import { onDestroy } from 'svelte'
import { browser } from '$app/environment'
import { getCdnImageUrl } from '$lib/utils'

export let src:string
export let alt = ''
export let width = 'auto'
export let height = 'auto'
export let aspect_ratio = '3:4'
const w = width === 'auto' ? 'auto' : +width * 2
const h = height === 'auto' ? 'auto' : +height * 2

let clazz:string
export { clazz as class }
let lazyloadInstance:any
onMount(() => {
	if (browser) {
		lazyloadInstance = new lazyload({
			thresholds: '50px 10%'
		})
	}
})
onDestroy(() => {
	if (lazyloadInstance) lazyloadInstance.destroy()
})
</script>

<!-- <img
	alt="{alt}"
	class="lazy {clazz}"
	src="{`${getImageUrl(src)}?tr=h-2,w-1:w-${w},h-${h}`}"
	data-src="{`${getImageUrl(src)}?tr=w-${w},h-${h}:w-${w},h-${h}`}" /> -->

<img
	alt="{alt}"
	class="lazy {clazz}"
	src="{`${getCdnImageUrl(src)}`}"
	data-src="{`${getCdnImageUrl(src)}`}"
/>
