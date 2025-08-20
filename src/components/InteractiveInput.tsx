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

  useInput((input, key) => {
    // Handle predefined options navigation
    if (predefinedOptions.length > 0 && mode === 'option') {
      if (key.upArrow) {
        setSelectedIndex(
          (prev) =>
            (prev - 1 + predefinedOptions.length) % predefinedOptions.length,
        );
        return;
      }

      if (key.downArrow) {
        setSelectedIndex((prev) => (prev + 1) % predefinedOptions.length);
        return;
      }
    }

    // Handle Enter key
    if (key.return) {
      // Submit based on current mode
      if (mode === 'option' && predefinedOptions.length > 0) {
        onSubmit(questionId, predefinedOptions[selectedIndex]);
        return;
      }
      // For input mode, let TextInput handle submission
      return;
    }

    // Switch to input mode when typing (but not for arrow keys, etc.)
    if (
      input &&
      !key.ctrl &&
      !key.meta &&
      !key.escape &&
      !key.tab &&
      !key.upArrow &&
      !key.downArrow &&
      !key.leftArrow &&
      !key.rightArrow
    ) {
      if (mode === 'option') {
        setMode('input');
      }
    }
  });

  const handleInputChange = (value: string) => {
    setInputValue(value);

    // Switch to input mode when typing
    if (value.length > 0 && mode === 'option') {
      setMode('input');
    }
  };

  const handleSubmit = (value: string) => {
    // Handle submission from TextInput
    if (mode === 'option' && predefinedOptions.length > 0) {
      onSubmit(questionId, predefinedOptions[selectedIndex]);
    } else {
      onSubmit(questionId, value);
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
          <Text dimColor>
            Use ↑/↓ to select options, type for custom input, Enter to submit
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
        <Box>
          <Text color={mode === 'input' ? 'greenBright' : undefined}>
            {mode === 'input' ? '✎ ' : '› '}
            <TextInput
              placeholder={
                predefinedOptions.length > 0
                  ? 'Type or select an option...'
                  : 'Type your answer...'
              }
              onChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </Text>
        </Box>
      </Box>
    </>
  );
};
