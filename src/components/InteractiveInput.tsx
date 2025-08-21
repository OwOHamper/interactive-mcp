import React, { FC, useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { readClipboard } from '../utils/clipboard.js';

interface InteractiveInputProps {
  question: string;
  questionId: string;
  predefinedOptions?: string[];
  onSubmit: (questionId: string, value: string) => void;
}

export const InteractiveInput: FC<InteractiveInputProps> = ({
  question,
  questionId,
  predefinedOptions = [],
  onSubmit,
}) => {
  const [mode, setMode] = useState<'option' | 'custom'>(
    predefinedOptions.length > 0 ? 'option' : 'custom',
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [customValue, setCustomValue] = useState<string>('');

  // If there are no predefined options, default to custom input mode
  useEffect(() => {
    if (!predefinedOptions || predefinedOptions.length === 0) {
      setMode('custom');
    } else {
      // Ensure mode is 'option' if options become available
      setMode('option');
      setSelectedIndex(0); // Reset selection
    }
  }, [predefinedOptions]);

  // Capture key presses
  useInput((input, key) => {
    // Handle clipboard paste (Cmd+V on macOS, Ctrl+V on Windows/Linux)
    if ((key.meta && input === 'v') || (key.ctrl && input === 'v')) {
      // Switch to custom mode for paste
      setMode('custom');

      // Try to read clipboard content
      readClipboard()
        .then((clipboardText) => {
          if (clipboardText) {
            setCustomValue((prev) => prev + clipboardText);
          }
        })
        .catch(() => {
          // Clipboard access failed, continue normally
        });
      return;
    }

    if ((key.upArrow || key.downArrow) && predefinedOptions?.length) {
      // cycle selection among predefined options
      setSelectedIndex((prev) => {
        if (key.upArrow) {
          return prev > 0 ? prev - 1 : predefinedOptions.length - 1;
        } else {
          return prev < predefinedOptions.length - 1 ? prev + 1 : 0;
        }
      });
      setMode('option');
    } else if (key.leftArrow || key.rightArrow) {
      // Left/right arrows just switch to custom mode
      setMode('custom');
    } else if (key.return) {
      const value =
        mode === 'custom'
          ? customValue
          : (predefinedOptions && predefinedOptions[selectedIndex]) || '';
      onSubmit(questionId, value);
    } else if (key.backspace || key.delete) {
      // Switch to custom mode if not already
      setMode('custom');

      // Simple backspace - remove last character
      if (customValue.length > 0) {
        setCustomValue((prev) => prev.slice(0, -1));
      }
    } else if (input && input.length >= 1 && !key.meta && !key.ctrl) {
      // Allow any input including multi-character input (supports voice apps like Wispr Flow)
      setMode('custom');
      // Simply append to the end
      setCustomValue((prev) => prev + input);
    } else if (key.ctrl || key.meta) {
      // Allow other system shortcuts to pass through
      return;
    }
  });

  return (
    <>
      {/* Display the question */}
      <Box flexDirection="column" marginBottom={1}>
        <Text bold color="cyan" wrap="wrap">
          {question}
        </Text>
      </Box>

      {/* Display predefined options if available */}
      {predefinedOptions && predefinedOptions.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text>
            Use ↑/↓ to select options, type any key for custom input, Enter to
            submit
          </Text>
          {predefinedOptions.map((opt, i) => (
            <Text
              key={i}
              color={
                i === selectedIndex
                  ? mode === 'option'
                    ? 'greenBright'
                    : 'green'
                  : undefined
              }
            >
              {i === selectedIndex ? (mode === 'option' ? '› ' : '  ') : '  '}
              {opt}
            </Text>
          ))}
        </Box>
      )}

      {/* Custom input line */}
      <Box marginBottom={1}>
        <Box>
          <Text
            color={
              customValue.length > 0 || mode === 'custom'
                ? 'greenBright'
                : undefined
            }
          >
            {mode === 'custom' ? '✎ ' : '  '}
            {/* Only show "Custom: " label when there are predefined options */}
            {predefinedOptions && predefinedOptions.length > 0
              ? 'Custom: '
              : ''}
            {customValue}
            {mode === 'custom' && customValue.length === 0 && '_'}
          </Text>
        </Box>
      </Box>

      {/* Help text */}
      <Box marginBottom={1}>
        <Text color="gray" dimColor>
          {predefinedOptions && predefinedOptions.length > 0
            ? 'Tip: ↑/↓ for options, type for custom input, Cmd+V/Ctrl+V to paste, Enter to submit'
            : 'Tip: Type your answer, Cmd+V/Ctrl+V to paste, Enter to submit'}
        </Text>
      </Box>
    </>
  );
};
