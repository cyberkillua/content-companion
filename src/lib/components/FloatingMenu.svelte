<script>
  export let position;
  export let editor;
  export let selectedText;
  export let onReplace;

  let customPrompt = "";

  function handleCustomPrompt() {
    onReplace(customPrompt);
    customPrompt = "";
  }
</script>

<div
  class="absolute z-10 bg-white shadow-lg rounded-lg p-2 border border-gray-200"
  style="left: {position.x}px; top: {position.y}px;"
>
  <div class="flex space-x-2 mb-2">
    <button
      on:click={() => editor.chain().focus().toggleBold().run()}
      class="p-1 rounded hover:bg-gray-100"
      class:active={editor.isActive("bold")}
    >
      B
    </button>
    <button
      on:click={() => editor.chain().focus().toggleItalic().run()}
      class="p-1 rounded hover:bg-gray-100"
      class:active={editor.isActive("italic")}
    >
      I
    </button>
    <button
      on:click={() => editor.chain().focus().toggleUnderline().run()}
      class="p-1 rounded hover:bg-gray-100"
      class:active={editor.isActive("underline")}
    >
      U
    </button>
  </div>
  <div class="flex space-x-2">
    <input
      type="text"
      bind:value={customPrompt}
      placeholder="Custom prompt..."
      class="border rounded px-2 py-1 text-sm"
    />
    <button
      on:click={handleCustomPrompt}
      class="bg-blue-500 text-white px-2 py-1 rounded text-sm"
    >
      Generate
    </button>
  </div>
</div>

<style>
  .active {
    background-color: #e5e7eb;
  }
</style>
