# Interactive MCP

Simple [MCP Server](https://modelcontextprotocol.io/) that enables interactive communication between AI assistants and users through popup prompts, chat sessions, and loud notification alerts. Perfect for [Cursor](https://www.cursor.com), [Claude Desktop](https://claude.ai/desktop), and other MCP-compatible tools.

## Demo

|                      Normal Question                       |                       Pending Approval Alert                        |
| :--------------------------------------------------------: | :-----------------------------------------------------------------: |
| ![Normal Question Demo](./docs/assets/normal-question.gif) | ![Completion Notification Demo](./docs/assets/end-notification.gif) |

|                         Intensive Chat Start                         |                        Intensive Chat End                        |
| :------------------------------------------------------------------: | :--------------------------------------------------------------: |
| ![Start Intensive Chat Demo](./docs/assets/start-intensive-chat.gif) | ![End Intensive Chat Demo](./docs/assets/end-intensive-chat.gif) |

## 💡 Why Use This?

Stop your AI from guessing! Instead of making assumptions, your AI assistant will:

- **Ask clarifying questions** through interactive popup prompts
- **Gather multiple inputs** via persistent chat sessions
- **Alert you loudly** when commands need approval (with sound!)
- **Keep conversations flowing** without dead-end "let me know..." responses

This dramatically improves AI interactions by ensuring clear communication and reducing costly guesswork.

## Cursor Integration

For the best results, add these rules to your Cursor settings:

```markdown
# Interactive MCP Rules

- Never ask questions in chat - always use `mcp_interactive_request_user_input` or intensive chat tools
- For commands needing approval, call `mcp_interactive_pending_approval_notification` and the actual command tool in PARALLEL (same tool call batch) for faster execution
- Keep conversations flowing - don't wait for manual user responses
- Use predefined options when possible for faster selection
```

This ensures your AI assistant uses interactive tools instead of ending conversations and waiting.

## Features

- **🗨️ Interactive Prompts**: Ask questions with popup command-line interfaces
- **💬 Intensive Chat**: Multi-question sessions with persistent chat windows
- **🚨 Loud Alerts**: Attention-grabbing notifications for pending approvals (Sosumi + Ping sounds on macOS)
- **⏱️ Configurable Timeouts**: Custom timeout settings (default: 60 seconds)
- **🎵 Sound Notifications**: Audio alerts to grab your attention
- **⚡ Parallel Execution**: Notifications and commands run simultaneously for speed

## Installation

### Prerequisites

- Node.js and pnpm
- macOS recommended for full sound support

### Setup

1. **Clone and build:**

   ```bash
   git clone https://github.com/OwOHamper/interactive-mcp.git
   cd interactive-mcp
   pnpm install
   pnpm build
   ```

2. **Configure Cursor** - Add to your `~/.cursor/mcp.json`:

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

3. **Restart Cursor** and start using interactive tools!

## Available Tools

- `request_user_input` - Single questions with predefined options
- `pending_approval_notification` - Loud alerts for actions needing approval
- `start_intensive_chat` - Begin multi-question chat session
- `ask_intensive_chat` - Ask questions within active session
- `stop_intensive_chat` - End chat session

## Configuration Options

| Option                  | Description                              | Default |
| ----------------------- | ---------------------------------------- | ------- |
| `--timeout`, `-t`       | Timeout in seconds for user input        | 60      |
| `--disable-tools`, `-d` | Disable specific tools (comma-separated) | none    |

Example with 5-minute timeout:

```bash
node dist/index.js --timeout 300
```

## How It Works

### Single Questions

Instead of: _"Which framework do you prefer?"_ (conversation ends)  
AI calls: `mcp_interactive_request_user_input` with options → gets answer → continues

### Multiple Questions

Instead of: _"I need several details..."_ (conversation ends)  
AI calls: intensive chat workflow → asks all questions → gets all answers → continues

### Pending Approvals

Instead of: Silent command execution  
AI calls: notification + command in parallel → you get loud alert → command runs

## Platform Support

- **macOS**: Full support with Terminal windows and system sounds (Sosumi, Ping)
- **Windows/Linux**: Basic support with command prompts

## License

MIT

---

_Stop your AI from guessing - start communicating interactively!_ 🎯
