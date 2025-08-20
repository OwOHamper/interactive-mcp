import React, { FC, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { TextInput } from '@inkjs/ui';

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
  const [mode, setMode] = useState<'option' | 'input'>(
    predefinedOptions.length > 0 ? 'option' : 'input',
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [isMultiline, setIsMultiline] = useState<boolean>(false);

  useInput((input, key) => {
    if (predefinedOptions.length > 0) {
      if (key.upArrow) {
        setMode('option');
        setSelectedIndex(
          (prev) =>
            (prev - 1 + predefinedOptions.length) % predefinedOptions.length,
        );
        return;
      }

      if (key.downArrow) {
        setMode('option');
        setSelectedIndex((prev) => (prev + 1) % predefinedOptions.length);
        return;
      }
    }

    if (key.return) {
      if (key.shift) {
        // Shift+Enter adds a newline for multiline input
        setInputValue((prev) => prev + '\n');
        setIsMultiline(true);
        return;
      }

      // Regular Enter submits
      if (mode === 'option' && predefinedOptions.length > 0) {
        onSubmit(questionId, predefinedOptions[selectedIndex]);
      } else {
        onSubmit(questionId, inputValue);
      }
      return;
    }

    // Any other key press switches to input mode
    if (
      !key.ctrl &&
      !key.meta &&
      !key.escape &&
      !key.tab &&
      !key.shift &&
      !key.leftArrow &&
      !key.rightArrow &&
      input
    ) {
      setMode('input');
      // Update inputValue only if switching to input mode via typing
      // TextInput's onChange will handle subsequent typing
      if (mode === 'option') {
        setInputValue(input); // Start input with the typed character
      }
    }
  });

  const handleInputChange = (value: string) => {
    if (value !== inputValue) {
      setInputValue(value);

      // Check if the input contains newlines (from paste or other sources)
      if (value.includes('\n')) {
        setIsMultiline(true);
      }

      // If user starts typing, switch to input mode
      if (value.length > 0 && mode === 'option') {
        setMode('input');
      } else if (value.length === 0 && predefinedOptions.length > 0) {
        // Optionally switch back to option mode if input is cleared
        // setMode('option');
      }
    }
  };

  const handleSubmit = (value: string) => {
    // The primary submit logic is now handled in useInput via Enter key
    // This might still be called by TextInput's internal onSubmit, ensure consistency
    if (mode === 'option' && predefinedOptions.length > 0) {
      onSubmit(questionId, predefinedOptions[selectedIndex]);
    } else {
      onSubmit(questionId, value); // Use the value from TextInput in case it triggered submit
    }
  };

  return (
    <>
      <Box flexDirection="column" marginBottom={1}>
        <Text bold color="cyan" wrap="wrap">
          {question}
        </Text>
      </Box>

      {predefinedOptions.length > 0 && (
        <Box flexDirection="column" marginBottom={1}>
          <Text dimColor={true}>
            Use ↑/↓ to select options, type for custom input, Shift+Enter for
            multiline, Enter to submit
          </Text>
          {predefinedOptions.map((opt, i) => (
            <Text
              key={i}
              color={
                i === selectedIndex && mode === 'option'
                  ? 'greenBright'
                  : undefined
              }
            >
              {i === selectedIndex && mode === 'option' ? '› ' : '  '}
              {opt}
            </Text>
          ))}
        </Box>
      )}

      <Box flexDirection="column">
        {isMultiline && inputValue.includes('\n') ? (
          // Multiline display
          <>
            <Text color={mode === 'input' ? 'greenBright' : 'gray'} dimColor>
              {predefinedOptions.length > 0
                ? 'Multiline input (Shift+Enter for new line, Enter to submit):'
                : 'Multiline input (Shift+Enter for new line, Enter to submit):'}
            </Text>
            <Box
              borderStyle="round"
              borderColor="cyan"
              paddingX={1}
              paddingY={0}
            >
              <Text color={mode === 'input' ? 'greenBright' : undefined}>
                {inputValue || ' '}
              </Text>
            </Box>
          </>
        ) : (
          // Single line display
          <Box>
            <Text color={mode === 'input' ? 'greenBright' : undefined}>
              {mode === 'input' ? '✎ ' : '› '}
              <TextInput
                placeholder={
                  predefinedOptions.length > 0
                    ? 'Type or select an option... (Shift+Enter for multiline)'
                    : 'Type your answer... (Shift+Enter for multiline)'
                }
                onChange={handleInputChange}
                onSubmit={handleSubmit}
              />
            </Text>
          </Box>
        )}
      </Box>
    </>
  );
};
