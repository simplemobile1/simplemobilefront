<script>
    import country from '$lib/country.json'
    function contrey (uu){
        console.log(uu)
    }
</script>
<div class="w-full  p-4 bg-white   sm:p-6">
        <ul class="my-4  flex flex-wrap justify-center ">
    {#each country as state}
     <li >
                <button on:click={()=>contrey(state.code)} class="m-1 flex items-center p-3 w-fit text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow">
                    <img src="{state.flag_1x1}" aria-hidden="true" class="h-4"/>
                    <span class="flex-1 ml-3 whitespace-nowrap">{state.name}</span>
                    <span class="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded ">Popular</span>
                </button>
            </li>
    {/each}
        </ul>
        </div>
  