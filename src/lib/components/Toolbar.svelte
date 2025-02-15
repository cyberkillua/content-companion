<script>
  export let editor;
</script>

<div class="flex items-center space-x-4">
  <button
    on:click={() => editor.chain().focus().toggleBold().run()}
    class:active={editor.isActive("bold")}
    class="toolbar-button"
  >
    B
  </button>
  <button
    on:click={() => editor.chain().focus().toggleItalic().run()}
    class:active={editor.isActive("italic")}
    class="toolbar-button"
  >
    I
  </button>
  <button
    on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
    class:active={editor.isActive("heading", { level: 1 })}
    class="toolbar-button"
  >
    H1
  </button>
  <button
    on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    class:active={editor.isActive("heading", { level: 2 })}
    class="toolbar-button"
  >
    H2
  </button>
  <button
    on:click={() => editor.chain().focus().toggleBulletList().run()}
    class:active={editor.isActive("bulletList")}
    class="toolbar-button"
  >
    •
  </button>
</div>

<style>
  .toolbar-button {
    @apply p-2 rounded-md text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500  text-2xl;
  }
  .active {
    @apply bg-indigo-100 text-indigo-800;
  }
</style>
