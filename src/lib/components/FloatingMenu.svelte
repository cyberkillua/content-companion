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
  <div class="formatting-tools">
    <button
      on:click={() => handleFormatting("bold")}
      aria-label="Toggle bold"
      class:active={editor.isActive("bold")}
    >
      <svg class="icon" viewBox="0 0 24 24">
        <path
          d="M8 11h4.5a2.5 2.5 0 000-5H8v5zm0 7h5.5a2.5 2.5 0 000-5H8v5zM6 4h6.5a4.5 4.5 0 013.5 7.5 4.5 4.5 0 01-3.5 7.5H6V4z"
        />
      </svg>
    </button>

    <button
      on:click={() => handleFormatting("italic")}
      aria-label="Toggle italic"
      class:active={editor.isActive("italic")}
    >
      <svg class="icon" viewBox="0 0 24 24">
        <path d="M10 5v4h2.5l-3 10H6v4h8v-4h-2.5l3-10H18V5h-8z" />
      </svg>
    </button>

    <div class="divider"></div>

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
    position: absolute;
    z-index: 50;
    background-color: white;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
    border-radius: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    font-size: 0.875rem;
  }

  .formatting-tools {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button {
    padding: 0.5rem;
    border-radius: 0.375rem;
    color: #4b5563;
    transition-property: color, background-color;
    transition-duration: 150ms;
  }

  button:hover {
    background-color: #f0f9ff;
    color: #0ea5e9;
  }

  .active {
    background-color: #e0f2fe;
    color: #0ea5e9;
  }

  .divider {
    width: 1px;
    height: 1.5rem;
    background-color: #e5e7eb;
    margin: 0 0.25rem;
  }

  .ai-select {
    padding: 0.5rem;
    color: #374151;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }

  .ai-select:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.5);
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
    fill: currentColor;
  }
</style>
