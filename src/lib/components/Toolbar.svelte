<script>
  export let editor;
</script>

<div class="flex items-center space-x-2">
  <button
    on:click={() => editor.chain().focus().toggleBold().run()}
    class:active={editor.isActive("bold")}
    class="toolbar-button"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="w-5 h-5"
    >
      <path
        d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5Zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5ZM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8Z"
      />
    </svg>
  </button>
  <button
    on:click={() => editor.chain().focus().toggleItalic().run()}
    class:active={editor.isActive("italic")}
    class="toolbar-button"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="w-5 h-5"
    >
      <path d="M15 8h-2.21l-3.58 8H11v2H7v-2h2.21l3.58-8H11V6h4v2Z" />
    </svg>
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="w-5 h-5"
    >
      <path
        fill-rule="evenodd"
        d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 10.5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75Z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
</div>

<style>
  .toolbar-button {
    @apply p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500;
  }
  .active {
    @apply bg-gray-100 text-gray-900;
  }
</style>
