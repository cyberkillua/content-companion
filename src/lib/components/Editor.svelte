<script>
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Placeholder from "@tiptap/extension-placeholder";
  import TextStyle from "@tiptap/extension-text-style";
  import { Color } from "@tiptap/extension-color";
  import { TextAlign } from "@tiptap/extension-text-align";
  import Underline from "@tiptap/extension-underline";
  import { writable } from "svelte/store";
  import Toolbar from "./Toolbar.svelte";

  let element;
  let editor;
  const isGenerating = writable(false);
  let hasSelection = false;
  let selectedText = "";
  let showFloatingMenu = false;
  let floatingMenuPosition = { x: 0, y: 0 };
  let selectedPrompt = "";

  const promptOptions = [
    { value: "creative", label: "Be more creative" },
    { value: "funny", label: "Be funny" },
    { value: "official", label: "Be more official" },
  ];

  // Initialize the editor with the necessary extensions and configurations
  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: "Start typing here...",
        }),
        TextStyle,
        Color,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Underline,
      ],
      content: "<p>Highlight text and click for AI-generated suggestions.</p>",
      onSelectionUpdate: ({ editor }) => {
        const selection = editor.state.selection;
        hasSelection = !selection.empty;
        if (hasSelection) {
          selectedText = editor.state.doc.textBetween(
            selection.from,
            selection.to
          );
        }
      },
    });

    return () => editor.destroy();
  });

  // Clean up the editor when the component is destroyed
  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  const handleAIReplace = async () => {
    if (!editor || !hasSelection) return;

    const selection = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(
      selection.from,
      selection.to
    );
    const paragraph = editor.state.doc.textBetween(
      editor.state.doc.resolve(selection.from).start(),
      editor.state.doc.resolve(selection.to).end()
    );

    isGenerating.set(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: selectedText,
          context: paragraph,
          promptType: selectedPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Get the marks from the selected text
      const selection = editor.state.selection;
      const selectedNode = editor.state.doc.nodeAt(selection.from);
      const marks = selectedNode ? selectedNode.marks : [];

      // Create new text node with the same marks
      const newTextNode = editor.schema.text(data.result, marks);

      // Replace the selected text with the formatted generated content
      const transaction = editor.state.tr.replaceWith(
        selection.from,
        selection.to,
        newTextNode
      );

      editor.view.dispatch(transaction);
    } catch (error) {
      console.error("Error with AI generation:", error);
      alert("An error occurred while generating text. Please try again.");
    } finally {
      isGenerating.set(false);
      showFloatingMenu = false;
    }
  };

  const toggleFloatingMenu = (event) => {
    if (!hasSelection) return;

    showFloatingMenu = !showFloatingMenu;
    if (showFloatingMenu) {
      const rect = event.target.getBoundingClientRect();
      floatingMenuPosition = {
        x: rect.left,
        y: rect.bottom + window.scrollY,
      };
    }
  };

  const handlePromptSelect = () => {
    showFloatingMenu = false;
    handleAIReplace();
  };
</script>

<div class="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
  <Toolbar {editor} />

  <button
    on:click={toggleFloatingMenu}
    class="mb-6 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 ease-in-out
        {!hasSelection || $isGenerating
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-md hover:shadow-lg'}"
    disabled={!hasSelection || $isGenerating}
  >
    <span class="flex items-center justify-center gap-2">
      {#if $isGenerating}
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
            fill="none"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Generating...
      {:else}
        Regenerate with AI
      {/if}
    </span>
  </button>

  {#if showFloatingMenu}
    <div
      class="absolute z-10 bg-white shadow-lg rounded-lg p-2 border border-gray-200"
      style="left: {floatingMenuPosition.x}px; top: {floatingMenuPosition.y}px;"
    >
      <select
        bind:value={selectedPrompt}
        on:change={handlePromptSelect}
        class="w-full p-2 border rounded"
      >
        <option value="" disabled selected>Select a prompt</option>
        {#each promptOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>
  {/if}

  <div
    bind:this={element}
    class="border border-gray-200 rounded-lg p-6 min-h-[300px] focus-within:border-indigo-400 transition-colors duration-200
        prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none shadow-inner bg-gray-50"
  />
</div>

<style>
  :global(.ProseMirror) {
    @apply outline-none;
  }

  :global(.ProseMirror p.is-editor-empty:first-child::before) {
    @apply text-gray-400 float-left h-0 pointer-events-none;
    content: attr(data-placeholder);
  }

  :global(.prose) {
    @apply text-gray-800;
  }

  :global(.prose p) {
    @apply mb-4;
  }

  :global(.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6) {
    @apply text-indigo-900 font-bold;
  }

  :global(.prose a) {
    @apply text-indigo-600 hover:text-indigo-800 transition-colors duration-200;
  }
</style>
