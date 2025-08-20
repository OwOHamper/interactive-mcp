import { z, ZodRawShape } from 'zod';
import {
  ToolDefinition,
  ToolCapabilityInfo,
  ToolRegistrationDescription,
} from './types.js'; // Import the types

// Define capability conforming to ToolCapabilityInfo
const capabilityInfo: ToolCapabilityInfo = {
  description:
    'Send a loud alert notification when a tool requires user approval or intervention.',
  parameters: {
    type: 'object',
    properties: {
      projectName: {
        type: 'string',
        description:
          'Identifies the context/project making the notification (appears in notification title)',
      },
      message: {
        type: 'string',
        description:
          'Description of what action is pending approval (appears in the body)',
      },
    },
    required: ['projectName', 'message'],
  },
};

// Define description conforming to ToolRegistrationDescription
const registrationDescription: ToolRegistrationDescription = `<description>
Send a loud alert notification when a tool requires user approval or intervention. This is specifically for actions that need user permission, like running commands, not for automatic operations like file edits.
</description>

<importantNotes>
- (!important!) **ONLY use for pending approvals:** Use this when tools are waiting for user permission/intervention
- (!important!) **NOT for automatic operations:** Don't use for file edits, builds, or other automatic actions
- (!important!) **Loud alert sound:** Plays attention-grabbing sound to ensure user notices
</importantNotes>

<whenToUseThisTool>
- When a command execution is pending user approval
- When a potentially dangerous operation needs confirmation
- When user intervention is required to proceed
- When a tool is blocked waiting for user permission
</whenToUseThisTool>

<features>
- Loud alert sound (Sosumi + Ping on macOS)
- Cross-platform OS notifications
- Designed to grab attention for pending approvals
- Visual notification with sound alert
</features>

<bestPractices>
- Use clear, specific messages about what needs approval
- Include the specific action that's pending
- Use consistently for approval-required operations
</bestPractices>

<parameters>
- projectName: Context/project name (appears in notification title)
- message: Description of what action is pending approval
</parameters>

<examples>
- { "projectName": "Terminal", "message": "Command execution pending approval: npm install" }
- { "projectName": "FileSystem", "message": "File deletion pending approval: important-file.txt" }
</examples>`;

// Define the Zod schema (as a raw shape object)
const rawSchema: ZodRawShape = {
  projectName: z.string().describe('Notification title'),
  message: z.string().describe('Notification body'),
};

// Combine into a single ToolDefinition object
export const messageCompleteNotificationTool: ToolDefinition = {
  capability: capabilityInfo,
  description: registrationDescription,
  schema: rawSchema, // Use the raw shape here
};
