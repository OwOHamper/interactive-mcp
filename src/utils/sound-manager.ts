import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import logger from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Get the path to the alert.mp3 file
 */
function getAlertSoundPath(): string {
  // Go up from utils to project root, then to alert.mp3
  return path.join(__dirname, '..', '..', 'alert.mp3');
}

/**
 * Play the custom alert.mp3 sound
 * Used for all notifications and alerts
 */
async function playCustomAlert(): Promise<void> {
  try {
    const alertPath = getAlertSoundPath();

    // Check if alert.mp3 exists
    if (!fs.existsSync(alertPath)) {
      logger.warn(`Custom alert sound not found at: ${alertPath}`);
      logger.info('Place alert.mp3 in the project root for custom sound');
      return;
    }

    const { spawn } = await import('child_process');

    if (process.platform === 'darwin') {
      // Play custom alert.mp3 on macOS
      spawn('afplay', [alertPath], {
        stdio: 'ignore',
        detached: true,
      }).unref();
    } else if (process.platform === 'win32') {
      // Play on Windows using built-in player
      spawn(
        'powershell',
        ['-c', `(New-Object Media.SoundPlayer '${alertPath}').PlaySync()`],
        {
          stdio: 'ignore',
          detached: true,
        },
      ).unref();
    } else {
      // Linux - try common audio players
      const players = ['aplay', 'paplay', 'ffplay'];
      for (const player of players) {
        try {
          spawn(player, [alertPath], {
            stdio: 'ignore',
            detached: true,
          }).unref();
          break;
        } catch {
          // Try next player
          continue;
        }
      }
    }
  } catch (error) {
    logger.error('Error playing custom alert:', error);
    // Don't throw, sound is not critical functionality
  }
}

/**
 * Play notification sound - now uses custom alert.mp3
 */
export async function playNotificationSound(): Promise<void> {
  await playCustomAlert();
}

/**
 * Play pending approval alert - now uses custom alert.mp3
 */
export async function playPendingApprovalAlert(): Promise<void> {
  await playCustomAlert();
}
