import { spawn } from 'child_process';
import os from 'os';

/**
 * Attempts to read the system clipboard content
 * @returns Promise that resolves to clipboard text or empty string if not accessible
 */
export async function readClipboard(): Promise<string> {
  return new Promise((resolve) => {
    const platform = os.platform();
    let command: string;
    let args: string[] = [];

    // Platform-specific clipboard reading commands
    if (platform === 'darwin') {
      // macOS
      command = 'pbpaste';
    } else if (platform === 'win32') {
      // Windows
      command = 'powershell';
      args = ['-command', 'Get-Clipboard'];
    } else {
      // Linux - try common clipboard utilities
      command = 'xclip';
      args = ['-selection', 'clipboard', '-o'];
    }

    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    let output = '';

    child.stdout?.on('data', (data) => {
      output += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        // If clipboard reading fails, return empty string
        resolve('');
      }
    });

    child.on('error', () => {
      // If command doesn't exist or fails, return empty string
      resolve('');
    });

    // Timeout after 1 second
    setTimeout(() => {
      child.kill();
      resolve('');
    }, 1000);
  });
}

/**
 * Writes text to the system clipboard
 * @param text Text to write to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function writeClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    const platform = os.platform();
    let command: string;
    let args: string[] = [];

    // Platform-specific clipboard writing commands
    if (platform === 'darwin') {
      // macOS
      command = 'pbcopy';
    } else if (platform === 'win32') {
      // Windows
      command = 'powershell';
      args = ['-command', `Set-Clipboard -Value "${text.replace(/"/g, '""')}"`];
    } else {
      // Linux
      command = 'xclip';
      args = ['-selection', 'clipboard'];
    }

    const child = spawn(command, args, {
      stdio: ['pipe', 'ignore', 'ignore'],
    });

    child.stdin?.write(text);
    child.stdin?.end();

    child.on('close', (code) => {
      resolve(code === 0);
    });

    child.on('error', () => {
      resolve(false);
    });

    // Timeout after 1 second
    setTimeout(() => {
      child.kill();
      resolve(false);
    }, 1000);
  });
}
