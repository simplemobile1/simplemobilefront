<script lang="ts">
    import Esim from "./esim.svelte"
    import Phis from "./phy.svelte"
let checked:Boolean = false
function isChange (){
    if(checked == true){
        console.log("Esim")
    }
}
</script>
<div class="flex items-center justify-center">
<label for="Toggle3" class="inline-flex items-center  p-2 rounded-md cursor-pointer text-gray-800">
	<input id="Toggle3" type="checkbox" class="hidden peer" bind:checked on:change="{isChange}">
	<span class="px-4 py-2 rounded-l-md text-simpl peer-checked:text-gray-900 bg-sec peer-checked:bg-third">ESIM</span>
	<span class="px-4 py-2 rounded-r-md  peer-checked:text-simpl  bg-third peer-checked:bg-sec">Physical SIM Card</span>
</label>
</div>

<Esim esim={!checked}/>

