<script>
    import country from '$lib/country.json'
    function contrey (uu){
        console.log(uu)
    }
</script>
<div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <ul class="my-4 space-y-3">
    {#each country as state}
     <li>
                <button on:click={()=>contrey(state.code)} class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                    <img src="{state.flag_1x1}" aria-hidden="true" class="h-4"/>
                    <span class="flex-1 ml-3 whitespace-nowrap">{state.name}</span>
                    <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">Popular</span>
                </button>
            </li>
    {/each}
        </ul>
        </div>
  