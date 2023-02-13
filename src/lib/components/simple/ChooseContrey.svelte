<script>
    import country from '$lib/country.json'
</script>
{#each country as state}
<div class="border m-1">
    <h3>{state.name}</h3>
    <img src="{state.flag_1x1}"/>
</div>
    {/each}