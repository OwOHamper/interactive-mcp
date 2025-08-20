# Interactive MCP

A local MCP server for interactive communication between AI assistants and users. Features popup prompts, intensive chat sessions, and loud notification alerts for pending approvals.

## Demo

|                      Normal Question                       |                       Pending Approval Alert                        |
| :--------------------------------------------------------: | :-----------------------------------------------------------------: |
| ![Normal Question Demo](./docs/assets/normal-question.gif) | ![Completion Notification Demo](./docs/assets/end-notification.gif) |

|                         Intensive Chat Start                         |                        Intensive Chat End                        |
| :------------------------------------------------------------------: | :--------------------------------------------------------------: |
| ![Start Intensive Chat Demo](./docs/assets/start-intensive-chat.gif) | ![End Intensive Chat Demo](./docs/assets/end-intensive-chat.gif) |

## Features

- **🗨️ Interactive Prompts**: Ask questions with popup command-line interfaces
- **💬 Intensive Chat**: Multi-question sessions with persistent chat windows
- **🚨 Loud Alerts**: Attention-grabbing notifications for pending approvals
- **⏱️ Configurable Timeouts**: Custom timeout settings (default: 60 seconds)
- **🎵 Sound Notifications**: Audio alerts on macOS with system sounds

## Tools

- `request_user_input`: Single questions with predefined options
- `pending_approval_notification`: Loud alerts for actions needing approval
- `start_intensive_chat`: Begin multi-question chat session
- `ask_intensive_chat`: Ask questions within active session
- `stop_intensive_chat`: End chat session

## Quick Setup

### 1. Build the Project

```bash
git clone <your-repo-url>
cd interactive-mcp
pnpm install
pnpm build
```

### 2. Configure Cursor

Add to your `~/.cursor/mcp.json` (replace `/path/to/interactive-mcp` with your actual project path):

```json
{
  "mcpServers": {
    "interactive": {
      "command": "node",
      "args": ["/path/to/interactive-mcp/dist/index.js", "--timeout", "300"]
    }
  }
}
```

### 3. Add Cursor Rules (Optional)

Add these rules to your Cursor settings for automatic interactive behavior:

```markdown
# Interactive MCP Rules

- Never ask questions in chat - always use `mcp_interactive_request_user_input` or intensive chat tools
- For commands needing approval, call `mcp_interactive_pending_approval_notification` and the actual command tool in PARALLEL (same tool call batch) for faster execution
- Keep conversations flowing - don't wait for manual user responses
- Use predefined options when possible for faster selection
```

### 4. Restart Cursor

Restart Cursor to load the MCP server and start using interactive tools!

## Command Line Options

| Option                  | Description                              | Default |
| ----------------------- | ---------------------------------------- | ------- |
| `--timeout`, `-t`       | Timeout in seconds for user input        | 60      |
| `--disable-tools`, `-d` | Disable specific tools (comma-separated) | none    |

Example with 5-minute timeout:

```bash
node dist/index.js --timeout 300
```

## Usage Examples

### Single Question

```javascript
// AI will call this instead of asking in chat
mcp_interactive_request_user_input({
  projectName: 'Setup',
  message: 'Which framework do you prefer?',
  predefinedOptions: ['React', 'Vue', 'Angular'],
});
```

### Multiple Questions

```javascript
// For complex workflows with multiple questions
mcp_interactive_start_intensive_chat({ sessionTitle: 'Project Setup' });
mcp_interactive_ask_intensive_chat({ sessionId, question: 'Choose database:' });
mcp_interactive_ask_intensive_chat({ sessionId, question: 'Choose styling:' });
mcp_interactive_stop_intensive_chat({ sessionId });
```

### Pending Approval Alert

```javascript
// Call notification and command in PARALLEL for faster execution
// Both tools execute simultaneously in the same batch
mcp_interactive_pending_approval_notification({
  projectName: 'Terminal',
  message: 'Command execution pending: npm install',
});
run_terminal_cmd({ command: 'npm install' });
```

## Development

```bash
# Build
pnpm build

# Run locally
pnpm start

# Lint
pnpm lint
```

## Platform Support

- **macOS**: Full support with Terminal windows and system sounds
- **Windows/Linux**: Basic support with command prompts

## License

MIT
