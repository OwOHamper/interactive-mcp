import React, { FC, useState, useEffect } from 'react';
import { Box, Text, useInput, useStdin } from 'ink';

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
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const { setRawMode } = useStdin();

  useEffect(() => {
    if (mode === 'input') {
      setRawMode?.(true);
      return () => setRawMode?.(false);
    }
  }, [mode, setRawMode]);

  const isMultiline = inputValue.includes('\n');
  const lines = inputValue.split('\n');
  const currentLineIndex =
    inputValue.slice(0, cursorPosition).split('\n').length - 1;
  const currentLinePosition =
    cursorPosition - inputValue.slice(0, cursorPosition).lastIndexOf('\n') - 1;

  useInput((input, key) => {
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

    if (key.return) {
      if (key.shift && mode === 'input') {
        // Shift+Enter adds a newline
        const newValue =
          inputValue.slice(0, cursorPosition) +
          '\n' +
          inputValue.slice(cursorPosition);
        setInputValue(newValue);
        setCursorPosition(cursorPosition + 1);
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

    if (mode === 'input') {
      // Handle cursor movement
      if (key.leftArrow) {
        setCursorPosition(Math.max(0, cursorPosition - 1));
        return;
      }
      if (key.rightArrow) {
        setCursorPosition(Math.min(inputValue.length, cursorPosition + 1));
        return;
      }
      if (key.upArrow && isMultiline) {
        if (currentLineIndex > 0) {
          const prevLineLength = lines[currentLineIndex - 1].length;
          const newPosition =
            inputValue
              .slice(0, cursorPosition)
              .lastIndexOf(
                '\n',
                inputValue.slice(0, cursorPosition).lastIndexOf('\n') - 1,
              ) +
            1 +
            Math.min(currentLinePosition, prevLineLength);
          setCursorPosition(newPosition);
        }
        return;
      }
      if (key.downArrow && isMultiline) {
        if (currentLineIndex < lines.length - 1) {
          const nextLineStart = inputValue.indexOf('\n', cursorPosition) + 1;
          const nextLineEnd = inputValue.indexOf('\n', nextLineStart);
          const nextLineLength =
            nextLineEnd === -1
              ? inputValue.length - nextLineStart
              : nextLineEnd - nextLineStart;
          const newPosition =
            nextLineStart + Math.min(currentLinePosition, nextLineLength);
          setCursorPosition(newPosition);
        }
        return;
      }

      // Handle backspace
      if (key.backspace) {
        if (cursorPosition > 0) {
          const newValue =
            inputValue.slice(0, cursorPosition - 1) +
            inputValue.slice(cursorPosition);
          setInputValue(newValue);
          setCursorPosition(cursorPosition - 1);
        }
        return;
      }

      // Handle delete
      if (key.delete) {
        if (cursorPosition < inputValue.length) {
          const newValue =
            inputValue.slice(0, cursorPosition) +
            inputValue.slice(cursorPosition + 1);
          setInputValue(newValue);
        }
        return;
      }

      // Handle Ctrl+V (paste) - basic implementation
      if (key.ctrl && input === 'v') {
        // We can't actually access clipboard in terminal, but we can handle pasted text
        // that comes through as regular input
        return;
      }
    }

    // Any printable character switches to input mode and adds to input
    if (input && input.length === 1 && !key.ctrl && !key.meta) {
      if (mode === 'option') {
        setMode('input');
        setInputValue(input);
        setCursorPosition(1);
      } else {
        const newValue =
          inputValue.slice(0, cursorPosition) +
          input +
          inputValue.slice(cursorPosition);
        setInputValue(newValue);
        setCursorPosition(cursorPosition + 1);
      }
      return;
    }

    // Handle pasted content (multiple characters at once)
    if (input && input.length > 1 && mode === 'input') {
      const newValue =
        inputValue.slice(0, cursorPosition) +
        input +
        inputValue.slice(cursorPosition);
      setInputValue(newValue);
      setCursorPosition(cursorPosition + input.length);
      return;
    }
  });

  const renderInput = () => {
    if (isMultiline) {
      const displayLines = lines.map((line, lineIndex) => {
        if (lineIndex === currentLineIndex) {
          // Show cursor in current line
          const beforeCursor = line.slice(0, currentLinePosition);
          const atCursor = line[currentLinePosition] || ' ';
          const afterCursor = line.slice(currentLinePosition + 1);
          return (
            <Text key={lineIndex} color="greenBright">
              {beforeCursor}
              <Text inverse>{atCursor}</Text>
              {afterCursor}
            </Text>
          );
        }
        return (
          <Text key={lineIndex} color="greenBright">
            {line || ' '}
          </Text>
        );
      });

      return (
        <>
          <Text color="gray" dimColor>
            Multiline input (Shift+Enter for new line, Enter to submit):
          </Text>
          <Box
            borderStyle="round"
            borderColor="cyan"
            paddingX={1}
            paddingY={0}
            flexDirection="column"
          >
            {displayLines}
          </Box>
        </>
      );
    } else {
      // Single line with cursor
      const beforeCursor = inputValue.slice(0, cursorPosition);
      const atCursor = inputValue[cursorPosition] || ' ';
      const afterCursor = inputValue.slice(cursorPosition + 1);

      return (
        <Box>
          <Text color="greenBright">
            {mode === 'input' ? '✎ ' : '› '}
            {beforeCursor}
            <Text inverse>{atCursor}</Text>
            {afterCursor}
          </Text>
          {inputValue === '' && (
            <Text color="gray" dimColor>
              {predefinedOptions.length > 0
                ? ' Type or select an option... (Shift+Enter for multiline)'
                : ' Type your answer... (Shift+Enter for multiline)'}
            </Text>
          )}
        </Box>
      );
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

      <Box flexDirection="column">{renderInput()}</Box>
    </>
  );
};
