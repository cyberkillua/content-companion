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

  let element;
  let editor;
  let selectedText = "";
  let showFloatingMenu = false;
  let floatingMenuPosition = { x: 0, y: 0 };

  const promptOptions = [
    { value: "tweet", label: "Make into Tweet" },
    { value: "linkedin", label: "Make into LinkedIn Post" },
    { value: "grammar", label: "Fix Grammar" },
  ];

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: "Start writing here...",
        }),
        TextStyle,
        Color,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Underline,
      ],
      content:
        "<p>Select text and choose an AI action from the floating menu.</p>",
      onSelectionUpdate: ({ editor }) => {
        const selection = editor.state.selection;
        hasSelection.set(!selection.empty);
        if (selection.empty) {
          showFloatingMenu = false;
          return;
        }

        selectedText = editor.state.doc.textBetween(
          selection.from,
          selection.to
        );
        updateFloatingMenuPosition(selection);
      },
    });

    return () => editor.destroy();
  });

  onDestroy(() => {
    if (editor) editor.destroy();
  });

  function updateFloatingMenuPosition(selection) {
    const { from, to } = selection;
    const start = editor.view.coordsAtPos(from);
    const end = editor.view.coordsAtPos(to);
    const editorRect = editor.view.dom.getBoundingClientRect();

    console.log(editorRect, "editorRect");
    console.log(start, "start");
    console.log(end, "end");
    floatingMenuPosition = {
      x: Math.min(start.left, end.left) - editorRect.left,
      y: Math.min(start.top, end.top) - editorRect.top + 100,
    };

    // Ensure the menu doesn't go off-screen to the left or right
    const floatingMenuWidth = 200; // Approximate width of the floating menu
    if (floatingMenuPosition.x < 0) {
      floatingMenuPosition.x = 0;
    } else if (floatingMenuPosition.x + floatingMenuWidth > editorRect.width) {
      floatingMenuPosition.x = editorRect.width - floatingMenuWidth;
    }

    // Ensure the menu doesn't go above the editor
    if (floatingMenuPosition.y < 0) {
      floatingMenuPosition.y =
        Math.min(start.bottom, end.bottom) - editorRect.top + 10;
    }

    showFloatingMenu = true;
  }

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
      const selectedNode = editor.state.doc.nodeAt(selection.from);
      const marks = selectedNode ? selectedNode.marks : [];
      const newTextNode = editor.schema.text(data.result, marks);

      editor.view.dispatch(
        editor.state.tr.replaceWith(selection.from, selection.to, newTextNode)
      );
    } catch (error) {
      console.error("AI generation error:", error);
      alert("Generation failed. Please try again.");
    } finally {
      isGenerating.set(false);
      showFloatingMenu = false;
    }
  };

  function handlePromptSelect(event) {
    handleAIReplace(event.detail);
  }
</script>

<div class="editor-container">
  <div class="toolbar-wrapper border-b border-gray-200 p-3">
    <div class="flex items-center justify-between">
      {#if editor}
        <Toolbar {editor} />
      {/if}
      <button
        on:click={() => handleAIReplace()}
        disabled={$isGenerating || !$hasSelection}
        class="ai-enhance-btn"
      >
        {$isGenerating ? "Generating..." : "AI Enhance"}
      </button>
    </div>
  </div>

  <div class="relative">
    <div bind:this={element} class="prose-editor"></div>
    {#if showFloatingMenu}
      <FloatingMenu
        position={floatingMenuPosition}
        {editor}
        {promptOptions}
        on:promptSelect={handlePromptSelect}
      />
    {/if}
  </div>
</div>

<style>
  .editor-container {
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    overflow: hidden;
    background-color: white;
    padding: 5px;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  .ai-enhance-btn {
    padding: 0.5rem 1rem;
    background-color: #0ea5e9;
    color: white;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition-property: background-color;
    transition-duration: 150ms;
  }

  .ai-enhance-btn:hover {
    background-color: #0284c7;
  }

  .ai-enhance-btn:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.5);
  }

  .prose-editor {
    padding: 1.5rem;
    min-height: 500px;
    color: #1f2937;
    max-width: none;
  }
</style>
