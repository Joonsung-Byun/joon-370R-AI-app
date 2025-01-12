<script lang='ts'>
    import { AppBar } from '@skeletonlabs/skeleton-svelte';
    import ArrowLeft from 'lucide-svelte/icons/arrow-left';
    import Paperclip from 'lucide-svelte/icons/paperclip';
    import Calendar from 'lucide-svelte/icons/calendar';
    import CircleUser from 'lucide-svelte/icons/circle-user';
</script>

<div>
  <AppBar>
    {#snippet lead()}
      <ArrowLeft size={24} />
    {/snippet}
    {#snippet trail()}
      <Paperclip size={20} />
      <Calendar size={20} />
      <CircleUser size={20} />
    {/snippet}

    {#snippet children()}
      <h2 class="h2">AI APP</h2>
    {/snippet}
    
    <!-- {#snippet headline()}
      <h2 class="h2">Headline</h2>
    {/snippet} -->
  </AppBar>
<h1 class="text-white h-screen bg-black text-center pt-20 text-2xl font-semibold">Welcome to my AI Application!</h1>
</div>


