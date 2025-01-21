<!--
  Toolbar.svelte
  This component represents a toolbar that appears above the editor when the user clicks on the toolbar icon.
  It provides options for text formatting and AI prompt selection.
-->
<script>
  export let editor;
</script>

<div class="toolbar mb-4 flex flex-wrap gap-2">
  <button
    on:click={() => editor.chain().focus().toggleBold().run()}
    class="toolbar-btn">Bold</button
  >
  <button
    on:click={() => editor.chain().focus().toggleItalic().run()}
    class="toolbar-btn">Italic</button
  >
  <button
    on:click={() => editor.chain().focus().toggleUnderline().run()}
    class="toolbar-btn">Underline</button
  >
  <button
    on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
    class="toolbar-btn">H1</button
  >
  <button
    on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
    class="toolbar-btn">H2</button
  >
  <button
    on:click={() => editor.chain().focus().toggleBulletList().run()}
    class="toolbar-btn">Bullet List</button
  >
  <button
    on:click={() => editor.chain().focus().toggleOrderedList().run()}
    class="toolbar-btn">Numbered List</button
  >
  <button
    on:click={() => editor.chain().focus().setTextAlign("left").run()}
    class="toolbar-btn">Left</button
  >
  <button
    on:click={() => editor.chain().focus().setTextAlign("center").run()}
    class="toolbar-btn">Center</button
  >
  <button
    on:click={() => editor.chain().focus().setTextAlign("right").run()}
    class="toolbar-btn">Right</button
  >
</div>

<style>
  .toolbar-btn {
    @apply px-3 py-1 bg-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors duration-200;
  }
</style>
