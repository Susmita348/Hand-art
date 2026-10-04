interface DrawingToolbarProps {
  onClear: () => void;
  onUndo: () => void;
  onDownload: () => void;
  onReset: () => void;
  onBrushSizeChange: () => void;
  brushSize: number;
}

function DrawingToolbar({
  onClear,
  onUndo,
  onDownload,
  onReset,
  onBrushSizeChange,
  brushSize,
}: DrawingToolbarProps) {
  return (
    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-2 rounded-xl bg-black/60 p-2">
      <button
        type="button"
        onClick={onUndo}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow transition hover:bg-gray-200"
      >
        Undo
      </button>

      <button
        type="button"
        onClick={onClear}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow transition hover:bg-gray-200"
      >
        Clear
      </button>

      <button
        type="button"
        onClick={onDownload}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow transition hover:bg-gray-200"
      >
        Download
      </button>

      <button
        type="button"
        onClick={onReset}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow transition hover:bg-gray-200"
      >
        Reset
      </button>

      <button
        type="button"
        onClick={onBrushSizeChange}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow transition hover:bg-gray-200"
      >
        Size: {brushSize}px
      </button>
    </div>
  );
}

export default DrawingToolbar;