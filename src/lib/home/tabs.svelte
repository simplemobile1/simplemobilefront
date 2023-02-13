<script >
let tab = 0
import ChooseContrey from "$lib/components/simple/ChooseContrey.svelte";
import ChooseGeo from "$lib/components/simple/ChooseGeo.svelte";
import ChooseGlob from "$lib/components/simple/ChooseGlob.svelte";
</script>


<ul class="
  nav nav-tabs nav-justified
  flex 
  flex-row
  flex-wrap
  list-none
  border-b-0
  pl-0
  mb-4
" id="tabs-tabJustify" role="tablist">
  <li class="nav-item flex-grow text-center" role="presentation">
    <button
    on:click={()=>tab = 1}
    class:bg-simpl={tab == 1}
    class:text-white={tab == 1}
    class="
      nav-link
      w-full
      block
      text-xs
      md:text-xl
      font-bold
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2 border-transparent
      px-6
      py-3
      my-2
      hover:text-simpl
      hover:border-transparent hover:bg-gray-100
      focus:border-transparent
      active
    " id="tabs-home-tabJustify" data-bs-toggle="pill" data-bs-target="#tabs-homeJustify" role="tab"
      aria-controls="tabs-homeJustify" aria-selected="true">local esim</button>
  </li>
  <li class="nav-item flex-grow text-center" role="presentation">
    <button 
        on:click={()=>tab = 2}
        class:bg-simpl={tab == 2}
        class:text-white={tab == 2}
    class="
      nav-link
      w-full
      md:text-xl
            hover:text-simpl
      block
      font-bold
      text-xs
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2 border-transparent
      px-6
      py-3
      my-2
      hover:border-transparent hover:bg-gray-100
      focus:border-transparent
    " id="tabs-profile-tabJustify" data-bs-toggle="pill" data-bs-target="#tabs-profileJustify" role="tab"
      aria-controls="tabs-profileJustify" aria-selected="false">Ragional esim</button>
  </li>
  <li class="nav-item flex-grow text-center" role="presentation">
    <button 
    on:click={()=>tab = 3}
    class:bg-simpl={tab == 3}
    class:text-white={tab == 3}
    class="
      nav-link
      w-full
            hover:text-simpl

      block
      text-xs
      md:text-xl
      font-bold
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2 border-transparent
      px-6
      py-3
      my-2
      hover:border-transparent hover:bg-gray-100
      focus:border-transparent
    " id="tabs-messages-tabJustify" 
      aria-controls="tabs-messagesJustify" aria-selected="false">Global esim</button>
  </li>
</ul>

<div class="tab-content" id="tabs-tabContentJustify">
{#if tab == 1}
  <div class="tab-pane fade show active" id="tabs-homeJustify" role="tabpanel"
    aria-labelledby="tabs-home-tabJustify">
    <ChooseContrey/>
  </div>
{:else if tab == 2}  
  <div class="tab-pane fade" id="tabs-profileJustify" role="tabpanel" aria-labelledby="tabs-profile-tabJustify">
<ChooseGeo/>    
</div>
{:else if tab == 3}  
  <div class="tab-pane fade" id="tabs-messagesJustify" role="tabpanel" aria-labelledby="tabs-profile-tabJustify">
    <ChooseGlob/>
  </div>
{/if}  
</div>