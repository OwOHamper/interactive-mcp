# Interactive MCP Enhanced

[![npm version](https://img.shields.io/npm/v/interactive-mcp-enhanced)](https://www.npmjs.com/package/interactive-mcp-enhanced) [![npm downloads](https://img.shields.io/npm/dm/interactive-mcp-enhanced)](https://www.npmjs.com/package/interactive-mcp-enhanced) [![GitHub license](https://img.shields.io/github/license/OwOHamper/interactive-mcp)](https://github.com/OwOHamper/interactive-mcp/blob/main/LICENSE) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Platforms](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)](https://github.com/OwOHamper/interactive-mcp) [![GitHub last commit](https://img.shields.io/github/last-commit/OwOHamper/interactive-mcp)](https://github.com/OwOHamper/interactive-mcp/commits/main)

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=interactive&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImludGVyYWN0aXZlLW1jcC1lbmhhbmNlZEBsYXRlc3QiXX0=)

A MCP Server implemented in Node.js/TypeScript, facilitating interactive communication between LLMs and users. **Note:** This server is designed to run locally alongside the MCP client (e.g., Cursor, Claude Desktop), as it needs direct access to the user's operating system to display notifications and command-line prompts.

_Enhanced version based on the original [interactive-mcp](https://github.com/ttommyth/interactive-mcp) by [@ttommyth](https://github.com/ttommyth), with custom sound notifications, improved approval workflows, bug fixes, Terminal window management, parallel execution support, and enhanced user experience._

## Tools

This server exposes the following tools via the Model Context Protocol (MCP):

- `request_user_input`: Asks the user a question and returns their answer. Can display predefined options.
- `pending_approval_notification`: Sends loud alert notifications for actions requiring user approval.
- `start_intensive_chat`: Initiates a persistent command-line chat session.
- `ask_intensive_chat`: Asks a question within an active intensive chat session.
- `stop_intensive_chat`: Closes an active intensive chat session.

## Demo

Here are demonstrations of the interactive features:

|                      Normal Question                       |                       Pending Approval Alert                        |
| :--------------------------------------------------------: | :-----------------------------------------------------------------: |
| ![Normal Question Demo](./docs/assets/normal-question.gif) | ![Completion Notification Demo](./docs/assets/end-notification.gif) |

|                         Intensive Chat Start                         |                        Intensive Chat End                        |
| :------------------------------------------------------------------: | :--------------------------------------------------------------: |
| ![Start Intensive Chat Demo](./docs/assets/start-intensive-chat.gif) | ![End Intensive Chat Demo](./docs/assets/end-intensive-chat.gif) |

## Usage Scenarios

This server is ideal for scenarios where an LLM needs to interact directly with the user on their local machine, such as:

- Interactive setup or configuration processes.
- Gathering feedback during code generation or modification.
- Clarifying instructions or confirming actions in pair programming.
- **Alerting users before command execution** with loud notifications.
- Any workflow requiring user input or confirmation during LLM operation.

## Installation & Configuration

This section explains how to configure MCP clients to use the `interactive-mcp-enhanced` server.

By default, user prompts will time out after 5 minutes (300 seconds). You can customize server options like timeout or disabled tools by adding command-line flags directly to the `args` array when configuring your client.

Please make sure you have the `npx` command available.

### Usage with Cursor

Add the following configuration to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "interactive": {
      "command": "npx",
      "args": ["-y", "interactive-mcp-enhanced@latest"]
    }
  }
}
```

**With Custom Timeout (10 minutes):**

```json
{
  "mcpServers": {
    "interactive": {
      "command": "npx",
      "args": ["-y", "interactive-mcp-enhanced@latest", "--timeout", "600"]
    }
  }
}
```

### Usage with Claude Desktop

Add the following configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "interactive": {
      "command": "npx",
      "args": ["-y", "interactive-mcp-enhanced@latest"]
    }
  }
}
```

#### macOS Recommendations

For a smoother experience on macOS using the default `Terminal.app`, consider this profile setting:

- **(Shell Tab):** Under **"When the shell exits"** (**Terminal > Settings > Profiles > _[Your Profile]_ > Shell**), select **"Close if the shell exited cleanly"** or **"Close the window"**. This helps manage windows when the MCP server starts and stops.

## Development Setup

This section is primarily for developers looking to modify or contribute to the server. If you just want to _use_ the server with an MCP client, see the "Client Configuration" section above.

### Prerequisites

- **Node.js:** Check `package.json` for version compatibility.
- **pnpm:** Used for package management. Install via `npm install -g pnpm` after installing Node.js.

### Installation (Developers)

1. Clone the repository:

   ```bash
   git clone https://github.com/OwOHamper/interactive-mcp.git
   cd interactive-mcp
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build the project:

   ```bash
   pnpm build
   ```

### Running the Application (Developers)

```bash
pnpm start
```

### Custom Sound Notifications (Optional)

For custom notification sounds, you can:

1. **Local Development**: Place your own `alert.mp3` file in the project root directory
2. **Global Installation**: The server will use system sounds by default when installed via npx

The server will automatically detect and use your custom sound file if available.

#### Command-Line Options

The `interactive-mcp` server accepts the following command-line options. These should typically be configured in your MCP client's JSON settings by adding them directly to the `args` array (see "Client Configuration" examples).

| Option            | Alias | Description                              | Default |
| ----------------- | ----- | ---------------------------------------- | ------- |
| `--timeout`       | `-t`  | Timeout in seconds for user input        | 300     |
| `--disable-tools` | `-d`  | Disable specific tools (comma-separated) | none    |

**Example:** Setting multiple options in the client config `args` array:

```jsonc
// Example combining options in client config's "args":
"args": [
  "-y", "interactive-mcp-enhanced@latest",
  "-t", "300", // Set timeout to 5 minutes
  "--disable-tools", "pending_approval_notification" // Disable approval notifications
]
```

## Development Commands

- **Build:** `pnpm build`
- **Lint:** `pnpm lint`
- **Format:** `pnpm format`

## 🚨 CRITICAL CURSOR INTEGRATION RULES 🚨

**IMPORTANT**: For optimal experience with this MCP server, these rules are **MANDATORY** and must be followed automatically by Cursor's AI.

### 🔥 Quick Setup (Recommended)

Copy the `CURSOR-RULES.md` file from this repository to your project root for automatic enforcement.

### 📋 Manual Setup - Enhanced Rules

Add these **CRITICAL RULES** to your Cursor user rules or project settings:

````markdown
# 🚨 CRITICAL INTERACTIVE MCP RULES 🚨

## ⚡ MANDATORY INTERACTIVE COMMUNICATION RULES ⚡

### 🔥 ABSOLUTE REQUIREMENTS - NEVER BREAK THESE 🔥

1. **NEVER ASK QUESTIONS IN CHAT**

   - ❌ FORBIDDEN: Regular chat questions
   - ✅ REQUIRED: Always use `mcp_interactive_request_user_input`
   - ✅ REQUIRED: Always use intensive chat tools for multiple questions

2. **KEEP CONVERSATIONS FLOWING**

   - ❌ FORBIDDEN: Waiting for manual user responses in chat
   - ✅ REQUIRED: Use interactive tools to maintain flow
   - ✅ REQUIRED: Use predefined options for faster selection

3. **INTERACTIVE TOOLS ARE NOT OPTIONAL**
   - These tools MUST be used for ANY user input needs
   - No exceptions - even for simple yes/no questions
   - This is a core feature requirement, not a suggestion

## 🚨 MANDATORY PENDING APPROVAL NOTIFICATIONS 🚨

### 🔥 CRITICAL RULE: PARALLEL EXECUTION REQUIRED 🔥

**ALWAYS call `mcp_interactive_pending_approval_notification` in PARALLEL with commands requiring approval**

### Commands REQUIRING Approval Notifications:

- ✅ `run_terminal_cmd` (ALL command executions - NO EXCEPTIONS)
- ✅ File operations (delete, move, create in sensitive locations)
- ✅ Git operations (push, pull, merge, reset)
- ✅ Package installations (npm, pip, yarn, pnpm, etc.)
- ✅ Database operations
- ✅ System modifications
- ✅ Network requests to external APIs
- ✅ Any potentially destructive action
- ✅ Configuration changes
- ✅ Environment modifications

### Operations NOT Requiring Notifications:

- ❌ File edits (`search_replace`, `write`, `MultiEdit`)
- ❌ Reading files (`read_file`)
- ❌ Searching (`grep`, `codebase_search`)
- ❌ Building/compiling code (unless it modifies system)

## 🎯 EXECUTION PATTERN - FOLLOW EXACTLY 🎯

```javascript
// ✅ CORRECT: Parallel execution for speed
mcp_interactive_pending_approval_notification({
  projectName: 'ProjectName',
  message: 'About to execute: [specific command]',
});
run_terminal_cmd({ command: '[actual command]' });

// ❌ WRONG: Sequential execution (slower)
// Never wait between notification and command
```
````

## 🔥 ENFORCEMENT RULES 🔥

1. **These rules apply to EVERY interaction**
2. **No exceptions without explicit user override**
3. **Assistant must follow these patterns automatically**
4. **Violation of these rules breaks the interactive experience**
5. **When in doubt, use interactive tools - they're always preferred**

## 📋 QUICK CHECKLIST FOR EVERY RESPONSE

Before responding, verify:

- [ ] Am I asking a question? → Use interactive tools
- [ ] Am I running a command? → Use approval notification in parallel
- [ ] Am I gathering multiple inputs? → Use intensive chat
- [ ] Am I making assumptions? → Ask using interactive tools instead

**REMEMBER: These are not suggestions - they are mandatory requirements for proper system operation.**

```

### 🎯 What These Rules Ensure:

- **🔔 No Silent Commands**: Every command execution gets a loud notification
- **💬 No Chat Questions**: All user input happens through interactive prompts
- **⚡ Faster Execution**: Parallel notifications prevent delays
- **🎵 Better UX**: Sound alerts ensure you never miss important actions
- **🔄 Consistent Flow**: Standardized interaction patterns across all AI responses

### 🚨 Critical Success Factors:

These rules are **essential for proper operation** - they ensure the interactive MCP tools work as designed and provide the best user experience. Without following these patterns, the interactive features may not function correctly.

## Features

- **🗨️ Interactive Prompts**: Ask questions with popup command-line interfaces
- **💬 Intensive Chat**: Multi-question sessions with persistent chat windows
- **🚨 Loud Alerts**: Attention-grabbing notifications for pending approvals
- **⏱️ Configurable Timeouts**: Custom timeout settings (default: 5 minutes)
- **🎵 Custom Sound**: Place `alert.mp3` in project root for your own notification sound
- **⚡ Parallel Execution**: Notifications and commands run simultaneously for speed
- **🪟 Single Window**: Fixed Terminal window management on macOS

## Platform Support

- **macOS**: Full support with Terminal windows and custom sound notifications
- **Windows/Linux**: Basic support with command prompts

## Contributing

Contributions are welcome! Please follow standard development practices and maintain compatibility with the original interactive-mcp design principles.

## Acknowledgments

This project is based on the original [interactive-mcp](https://github.com/ttommyth/interactive-mcp) by [@ttommyth](https://github.com/ttommyth). Enhanced with custom sound notifications, improved approval workflows, bug fixes, Terminal window management, parallel execution support, and enhanced user experience.

## License

MIT (See `LICENSE` file for details).
```
