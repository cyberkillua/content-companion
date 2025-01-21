<script>
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Placeholder from "@tiptap/extension-placeholder";
  import TextStyle from "@tiptap/extension-text-style";
  import { Color } from "@tiptap/extension-color";
  import { TextAlign } from "@tiptap/extension-text-align";
  import Underline from "@tiptap/extension-underline";
  import { isGenerating, hasSelection } from "../../stores/editor.js";
  import { generateTextWithLLM } from "../../utils/llmApi.js";
  import Toolbar from "./Toolbar.svelte";
  import FloatingMenu from "./FloatingMenu.svelte";

  // Editor state variables
  let element;
  let editor;
  let selectedText = "";
  let showFloatingMenu = false;
  let floatingMenuPosition = { x: 0, y: 0 };

  // AI prompt options for floating menu
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
        hasSelection.set(!selection.empty);
        if ($hasSelection) {
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
      const domResult = editor.view.domAtPos(start);

      // Check if domResult.node is an actual DOM node
      if (
        domResult &&
        domResult.node &&
        domResult.node.nodeType === Node.ELEMENT_NODE
      ) {
        const rect = domResult.node.getBoundingClientRect();
        floatingMenuPosition = {
          x: rect.left,
          y: rect.top - 40, // Position the menu above the selected text
        };
        showFloatingMenu = true;
      } else {
        // If we can't get a valid DOM node, use the editor's root DOM node
        const editorRect = editor.view.dom.getBoundingClientRect();
        floatingMenuPosition = {
          x: editorRect.left,
          y: editorRect.top,
        };
        showFloatingMenu = true;
      }
    } else {
      showFloatingMenu = false;
    }
  }

  // Handle AI text replacement
  const handleAIReplace = async (promptType) => {
    if (!editor || !$hasSelection) return;

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
      const data = await generateTextWithLLM(
        selectedText,
        paragraph,
        promptType
      );

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
    let selectedPrompt;
    if (!event.detail) {
      selectedPrompt = "default";
    }
    selectedPrompt = event.detail;
    handleAIReplace(selectedPrompt);
  }
</script>

<div class="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
  <!-- Generate Text button -->
  <div class="mb-4">
    <div class="mb-4">
      <button
        on:click={handleAIReplace}
        disabled={$isGenerating || !$hasSelection}
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {$isGenerating ? "Generating..." : "Generate Text"}
      </button>
    </div>
  </div>

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
