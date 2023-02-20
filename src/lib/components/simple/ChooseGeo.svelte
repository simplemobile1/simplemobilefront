<script>
    import country from '$lib/area.json'
    import {countries} from '$lib/components/Autocomplete/countriesData.js'
     import MultiSelect from 'svelte-multiselect';
    // import Prodgl from './prodgl.svelte'
    import Prodtab from '$lib/components/Product/ProductTab.svelte'
let list = country
  const ops = countries
let matchingOptions = []
  let selected = []
  let open = false
  let code = ""
  let placeholder = "search for country"
  let searchText = ``
  let choosed = false
    function contrey (uu){
        console.log(uu)
        code = uu
        choosed = true
    }
    $:if (searchText.length > 0){
        open = false
        console.log(searchText, matchingOptions)
   list = country.filter(function (el)
    {
      return el.name.toLowerCase().includes(searchText.toLowerCase()) ;
    }
    )
    }
</script>
{#if choosed == false}
<div class="w-full  p-4 bg-white   sm:p-6">
    <MultiSelect 
    bind:selected 
    {placeholder}
    options={ops} 
    bind:matchingOptions 
    maxSelect={1}
    bind:searchText
    bind:open
    />
        <ul class="my-4  flex flex-wrap justify-center ">
    {#each list as state}
     <li >
                <button on:click={()=>contrey(state.name)} class="m-1 flex items-center p-3 w-fit text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow">
                    <img alt="{state.name}" src="{state.flag_1x1}" aria-hidden="true" class="h-4"/>
                    <span class="flex-1 ml-3 whitespace-nowrap">{state.name}</span>
                    <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded ">Popular</span>
                </button>
            </li>
    {/each}
        </ul>
        </div>
{:else}
<button>close</button>
<Prodtab kind="geo" {code}/>        
{/if}
  