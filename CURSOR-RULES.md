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
