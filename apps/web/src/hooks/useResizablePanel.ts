import { useCallback, useEffect, useRef, useState } from "react";

interface Options {
  defaultWidth?: number; // initial chat panel width in px
  minWidth?: number;     // minimum width in px
  maxRatio?: number;     // maximum as fraction of window width (0–1)
}

/**
 * Returns chat panel width + a ref to attach to the drag handle div.
 * Drag the handle to resize. Clamped between minWidth and maxRatio * window.innerWidth.
 */
export function useResizablePanel({
  defaultWidth = 400,
  minWidth = 400,
  maxRatio = 0.5,
}: Options = {}) {
  const [chatWidth, setChatWidth] = useState(defaultWidth);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startWidth.current = chatWidth;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [chatWidth]
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      // Moving left = increasing chat width
      const delta = startX.current - e.clientX;
      const max = Math.floor(window.innerWidth * maxRatio);
      const next = Math.min(max, Math.max(minWidth, startWidth.current + delta));
      setChatWidth(next);
    };

    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [minWidth, maxRatio]);

  return { chatWidth, onMouseDown };
}
