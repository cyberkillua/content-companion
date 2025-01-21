<!--
  FloatingMenu.svelte
  This component represents a floating menu that appears near the text selection in the editor.
  It provides options for text formatting and AI prompt selection.
-->
<script>
  import { createEventDispatcher } from "svelte";

  // Position of the floating menu
  export let position = { x: 0, y: 0 };
  // Reference to the editor instance
  export let editor;
  // List of AI prompt options
  export let promptOptions;

  // Event dispatcher for communicating with parent components
  const dispatch = createEventDispatcher();

  // Currently selected AI prompt
  let selectedPrompt = "";

  // Handle AI prompt selection and dispatch event
  function handlePromptSelect() {
    dispatch("promptSelect", selectedPrompt);
  }

  // Handle text formatting actions
  function handleFormatting(format) {
    switch (format) {
      case "bold":
        editor.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        break;
      case "underline":
        editor.chain().focus().toggleUnderline().run();
        break;
    }
  }
</script>

<!-- Floating menu container -->
<div
  class="absolute z-10 bg-white shadow-lg rounded-lg p-2 border border-gray-200 flex items-center space-x-2"
  style="left: {position.x}px; top: {position.y}px;"
>
  <!-- Text formatting options -->
  <button
    on:click={() => handleFormatting("bold")}
    class="p-1 rounded hover:bg-gray-100"
    class:active={editor.isActive("bold")}
  >
    B
  </button>
  <button
    on:click={() => handleFormatting("italic")}
    class="p-1 rounded hover:bg-gray-100"
    class:active={editor.isActive("italic")}
  >
    I
  </button>
  <button
    on:click={() => handleFormatting("underline")}
    class="p-1 rounded hover:bg-gray-100"
    class:active={editor.isActive("underline")}
  >
    U
  </button>

  <!-- AI prompt selection -->
  <select
    bind:value={selectedPrompt}
    on:change={handlePromptSelect}
    class="p-1 border rounded"
  >
    <option value="" disabled selected>AI Tone</option>
    {#each promptOptions as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
</div>

<style>
  .active {
    background-color: #e5e7eb;
  }
</style>
