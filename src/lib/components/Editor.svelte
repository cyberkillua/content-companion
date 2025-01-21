<!--
  Editor.svelte
  This component handles the text editor functionality, including text selection, AI text replacement, and floating menu positioning.
  It integrates with the toolbar component and manages the editor's state and interactions.
-->
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
  import FloatingMenu from "./FloatingMenu.svelte";

  // Editor state variables
  let element;
  let editor;
  const isGenerating = writable(false);
  let hasSelection = false;
  let selectedText = "";
  let showFloatingMenu = false;
  let floatingMenuPosition = { x: 0, y: 0 };

  // AI prompt options
  const promptOptions = [
    { value: "creative", label: "Creative" },
    { value: "funny", label: "Funny" },
    { value: "official", label: "Official" },
  ];

  // Initialize the editor
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
          updateFloatingMenuPosition(selection);
        } else {
          showFloatingMenu = false;
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

  // Update floating menu position based on text selection
  function updateFloatingMenuPosition(selection) {
    const { ranges } = selection;
    if (ranges.length > 0) {
      const { $from } = ranges[0];
      const start = $from.pos;
      const dom = editor.view.domAtPos(start);
      const rect = dom.node.getBoundingClientRect();
      floatingMenuPosition = {
        x: rect.left,
        y: rect.top - 40, // Position the menu above the selected text
      };
    }
    showFloatingMenu = true;
  }

  // Handle AI text replacement
  const handleAIReplace = async (promptType) => {
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
          promptType: promptType,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Get the marks from the selected text
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

  // Handle prompt selection from floating menu
  function handlePromptSelect(event) {
    const selectedPrompt = event.detail;
    handleAIReplace(selectedPrompt);
  }
</script>

<div class="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
  <!-- Toolbar component -->
  <Toolbar {editor} />

  <!-- Editor content area -->
  <div
    bind:this={element}
    class="border border-gray-200 rounded-lg p-6 min-h-[300px] focus-within:border-indigo-400 transition-colors duration-200
        prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none shadow-inner bg-gray-50"
  />

  <!-- Floating menu for text formatting and AI generation -->
  {#if showFloatingMenu}
    <FloatingMenu
      position={floatingMenuPosition}
      {editor}
      {promptOptions}
      on:promptSelect={handlePromptSelect}
    />
  {/if}
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
