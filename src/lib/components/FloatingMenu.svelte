<script>
  import { createEventDispatcher } from "svelte";

  export let position = { x: 0, y: 0 };
  export let editor;
  export let promptOptions;

  const dispatch = createEventDispatcher();
  let selectedPrompt = "";

  const handlePromptSelect = () => {
    if (selectedPrompt) {
      dispatch("promptSelect", selectedPrompt);
      selectedPrompt = "";
    }
  };

  function handleFormatting(format) {
    const commands = {
      bold: () => editor.chain().focus().toggleBold().run(),
      italic: () => editor.chain().focus().toggleItalic().run(),
      underline: () => editor.chain().focus().toggleUnderline().run(),
    };
    commands[format]?.();
  }
</script>

<div class="floating-menu" style="left: {position.x}px; top: {position.y}px;">
  <div class="flex items-center space-x-4">
    <button
      on:click={() => handleFormatting("bold")}
      aria-label="Toggle bold"
      class:active={editor.isActive("bold")}
      class="formatting-button"
    >
      B
    </button>

    <button
      on:click={() => handleFormatting("italic")}
      aria-label="Toggle italic"
      class:active={editor.isActive("italic")}
      class="formatting-button"
    >
      I
    </button>

    <div class="w-px h-8 bg-indigo-200"></div>

    <select
      bind:value={selectedPrompt}
      on:change={handlePromptSelect}
      class="ai-select"
    >
      <option value="" disabled selected>AI Actions</option>
      {#each promptOptions as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>
</div>

<style>
  .floating-menu {
    @apply absolute z-50 bg-white shadow-lg rounded-md p-2 border-2 border-indigo-200;
  }

  .formatting-button {
    @apply p-1 rounded-md text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500  text-2xl;
  }

  .active {
    @apply bg-indigo-100 text-indigo-800;
  }

  .ai-select {
    @apply block w-full pl-3 pr-10 py-2 text-lg border-2 border-indigo-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md;
  }
</style>
