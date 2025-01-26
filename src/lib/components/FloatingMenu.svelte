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
  <div class="flex items-center space-x-2">
    <button
      on:click={() => handleFormatting("bold")}
      aria-label="Toggle bold"
      class:active={editor.isActive("bold")}
      class="formatting-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-4 h-4"
      >
        <path
          d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5Zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5ZM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8Z"
        />
      </svg>
    </button>

    <button
      on:click={() => handleFormatting("italic")}
      aria-label="Toggle italic"
      class:active={editor.isActive("italic")}
      class="formatting-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="w-4 h-4"
      >
        <path d="M15 8h-2.21l-3.58 8H11v2H7v-2h2.21l3.58-8H11V6h4v2Z" />
      </svg>
    </button>

    <div class="w-px h-6 bg-gray-300"></div>

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
    @apply absolute z-50 bg-white shadow-lg rounded-md p-2 border border-gray-200;
  }

  .formatting-button {
    @apply p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500;
  }

  .active {
    @apply bg-gray-100 text-gray-900;
  }

  .ai-select {
    @apply block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md;
  }
</style>
