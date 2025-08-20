# Cursor User Rules for Interactive MCP Integration

## Core Interactive Behavior Rules

### Always Use Interactive Tools Instead of Ending Conversations

- **Never end conversations** by asking the user to provide input or make decisions
- **Always call the appropriate interactive MCP tool** instead of waiting for user response
- When you need user input, clarification, or decisions, **immediately call** one of these tools:
  - `mcp_interactive_request_user_input` - For single questions or decisions
  - `mcp_interactive_start_intensive_chat` + `mcp_interactive_ask_intensive_chat` - For multiple related questions
- **Continue the conversation** after receiving user input from these tools

### Question and Decision Handling

- When facing **any uncertainty**, call `mcp_interactive_request_user_input`
- When you have **multiple questions** (3+), use intensive chat workflow
- **Always provide predefined options** when possible for faster user selection
- **Never** say phrases like "Let me know if...", "What would you prefer?", "Please tell me..." - instead **call the interactive tool**

### Examples of When to Use Interactive Tools:

- ✅ "Should I use TypeScript or JavaScript?" → Call `mcp_interactive_request_user_input`
- ✅ "I found 3 bugs, which should I fix first?" → Call interactive tool with options
- ✅ "Need to configure multiple settings" → Use intensive chat
- ❌ "Let me know which approach you prefer" → This violates the rule

## Notification Rules for Tool Approvals

### Always Alert for Pending Approvals

- **Before calling any tool that requires user intervention**, first call `mcp_interactive_pending_approval_notification`
- **User intervention tools** include:
  - `run_terminal_cmd` - Command execution
  - File operations that could be destructive
  - Any operation that shows "pending approval" or requires user confirmation

### Notification Workflow:

1. **First**: Call `mcp_interactive_pending_approval_notification` with clear message
2. **Then**: Call the actual tool that needs approval
3. **Message format**: Be specific about what needs approval

### Examples:

```
// Before running a command:
1. mcp_interactive_pending_approval_notification({
   projectName: "Terminal",
   message: "About to run: npm install --save react"
})
2. run_terminal_cmd({ command: "npm install --save react" })

// Before potentially destructive operation:
1. mcp_interactive_pending_approval_notification({
   projectName: "FileSystem",
   message: "About to delete file: old-config.json"
})
2. delete_file({ target_file: "old-config.json" })
```

## Intensive Chat Usage Rules

### When to Use Intensive Chat:

- **Project setup/configuration** with multiple options
- **Debugging workflows** requiring multiple questions
- **Feature planning** with sequential decisions
- **Code review** with multiple feedback points

### Intensive Chat Workflow:

1. `mcp_interactive_start_intensive_chat` with descriptive title
2. Multiple `mcp_interactive_ask_intensive_chat` calls for each question
3. `mcp_interactive_stop_intensive_chat` when complete
4. **All in the same response** - don't wait between calls

## Implementation Examples

### ❌ OLD WAY (Violates Rules):

```
I can help you set up the project. What framework would you like to use?
Please let me know your preferences and I'll continue.
```

### ✅ NEW WAY (Follows Rules):

```
I'll help you set up the project. Let me gather your preferences first.

[Calls mcp_interactive_start_intensive_chat]
[Calls mcp_interactive_ask_intensive_chat with framework options]
[Calls mcp_interactive_ask_intensive_chat with styling options]
[Calls mcp_interactive_stop_intensive_chat]

Based on your choices, I'll now implement the setup...
```

### ❌ OLD WAY (Command without notification):

```
[Calls run_terminal_cmd directly]
```

### ✅ NEW WAY (With notification):

```
[Calls mcp_interactive_pending_approval_notification first]
[Then calls run_terminal_cmd]
```

## Key Principles

1. **Proactive Communication**: Always ask questions through interactive tools, never wait
2. **Loud Alerts**: Always notify before operations needing approval
3. **Continuous Flow**: Keep conversations moving, don't pause for user input
4. **Clear Options**: Provide specific choices whenever possible
5. **Complete Workflows**: Finish intensive chats in single responses

## Tool Priority Order

When you need user input:

1. **Single question**: Use `mcp_interactive_request_user_input`
2. **Multiple questions**: Use intensive chat workflow
3. **Need approval**: Call notification tool first, then the actual tool
4. **Never**: End conversation and wait for user to respond manually
