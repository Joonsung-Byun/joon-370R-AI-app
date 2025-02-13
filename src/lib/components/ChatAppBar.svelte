<script lang="ts">
  import { fade } from 'svelte/transition';

  let systemPrompts = ['Helpful Assistant', 'Sensitive Assistant', 'Dad Assistant'];
  let { selectedSystemPrompt = $bindable(systemPrompts[0]) } = $props<{ selectedSystemPrompt?: string }>();
  let visible = $state(false);

  function handleChange() {
    visible = true;
    
    setTimeout(() => {
      visible = false;
    }, 1500);
  }
</script>

<nav class="w-full bg-primary-800 p-4">
  <div class="container mx-auto flex items-center justify-between">
    <div class="text-xl font-bold text-white">AI Chat Experiments</div>

    <div class="flex items-center space-x-4">
      <!-- System Prompt Dropdown -->
      <div class="relative">
        <select
          class="rounded-md bg-secondary-900 px-4 py-2 text-white"
          bind:value={selectedSystemPrompt}
          onchange={handleChange}
        >
          {#each systemPrompts as prompt}
            <option value={prompt}>{prompt}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
</nav>

{#if visible}
  <div
    transition:fade={{ duration: 300 }}
    class="bg-primary-600 text-white absolute top-20 px-8 py-3 rounded-lg"
  >
    Prompt changed to <strong>{selectedSystemPrompt}</strong>
  </div>
{/if}
