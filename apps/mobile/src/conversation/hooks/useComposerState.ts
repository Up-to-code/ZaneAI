import { useEffect, useMemo, useState } from "react";
import type { NativeSyntheticEvent, TextInputContentSizeChangeEventData } from "react-native";

const INPUT_MIN_HEIGHT = 24;
const INPUT_MAX_HEIGHT = 108;
const APPROX_CHARS_PER_LINE = 34;
const APPROX_LINE_HEIGHT = 22;
const EXPAND_THRESHOLD_HEIGHT = 74;
const EXPAND_THRESHOLD_LINES = 3;
const COMPACT_TEXT_THRESHOLD = 52;

function estimateVisualLineCount(text: string) {
  if (!text.trim()) {
    return 1;
  }

  return text.split("\n").reduce((total, segment) => {
    const segmentLength = segment.length === 0 ? 1 : segment.length;
    return total + Math.max(1, Math.ceil(segmentLength / APPROX_CHARS_PER_LINE));
  }, 0);
}

function clampHeight(height: number) {
  return Math.min(Math.max(height, INPUT_MIN_HEIGHT), INPUT_MAX_HEIGHT);
}

export function useComposerState(draftText: string) {
  const [measuredContentHeight, setMeasuredContentHeight] = useState(INPUT_MIN_HEIGHT);

  const estimatedLineCount = useMemo(() => estimateVisualLineCount(draftText), [draftText]);
  const estimatedContentHeight = useMemo(
    () => clampHeight(estimatedLineCount * APPROX_LINE_HEIGHT),
    [estimatedLineCount],
  );

  useEffect(() => {
    setMeasuredContentHeight((currentHeight) => {
      if (!draftText.trim()) {
        return INPUT_MIN_HEIGHT;
      }

      if (currentHeight > estimatedContentHeight) {
        return estimatedContentHeight;
      }

      return currentHeight;
    });
  }, [draftText, estimatedContentHeight]);

  const inputHeight = clampHeight(Math.max(measuredContentHeight, estimatedContentHeight));
  const inputExpanded = draftText.includes("\n") || draftText.trim().length > COMPACT_TEXT_THRESHOLD;
  const showExpandComposer = estimatedLineCount > EXPAND_THRESHOLD_LINES || inputHeight >= EXPAND_THRESHOLD_HEIGHT;

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    const contentHeight = Math.round(event.nativeEvent.contentSize.height);
    setMeasuredContentHeight(clampHeight(contentHeight));
  };

  const resetComposerState = () => {
    setMeasuredContentHeight(INPUT_MIN_HEIGHT);
  };

  return {
    inputHeight,
    inputExpanded,
    estimatedLineCount,
    showExpandComposer,
    handleContentSizeChange,
    resetComposerState,
  };
}

export const composerStateConstants = {
  INPUT_MIN_HEIGHT,
  INPUT_MAX_HEIGHT,
};
