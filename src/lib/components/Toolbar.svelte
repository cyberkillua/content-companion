<script>
  export let editor;
</script>

<div class="toolbar">
  <button
    on:click={() => editor.chain().focus().toggleBold().run()}
    class:active={editor.isActive("bold")}
  >
    Bold
  </button>
  <button
    on:click={() => editor.chain().focus().toggleItalic().run()}
    class:active={editor.isActive("italic")}
  >
    Italic
  </button>
  <button
    on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
    class:active={editor.isActive("heading", { level: 1 })}
  >
    H1
  </button>
  <button
    on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    class:active={editor.isActive("heading", { level: 2 })}
  >
    H2
  </button>
  <button
    on:click={() => editor.chain().focus().toggleBulletList().run()}
    class:active={editor.isActive("bulletList")}
  >
    List
  </button>
  <button
    on:click={() => editor.chain().focus().setTextAlign("left").run()}
    class:active={editor.isActive({ textAlign: "left" })}
  >
    Left
  </button>
  <button
    on:click={() => editor.chain().focus().setTextAlign("center").run()}
    class:active={editor.isActive({ textAlign: "center" })}
  >
    Center
  </button>
</div>

<style>
  .toolbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button {
    padding: 0.375rem 0.75rem;
    color: #4b5563;
    border-radius: 0.375rem;
    border: 1px solid transparent;
    font-size: 0.875rem;
    transition:
      background-color 150ms,
      color 150ms;
  }

  button:hover {
    background-color: #f0f9ff;
    color: #0ea5e9;
  }

  .active {
    background-color: #e0f2fe;
    color: #0ea5e9;
    border-color: #bae6fd;
  }
</style>
