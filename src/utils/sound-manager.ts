import logger from './logger.js';

/**
 * Play a simple notification sound
 * Uses system sound on macOS, logs on other platforms
 */
export async function playNotificationSound(): Promise<void> {
  try {
    const { spawn } = await import('child_process');

    if (process.platform === 'darwin') {
      // Play one consistent system sound on macOS
      spawn('afplay', ['/System/Library/Sounds/Ping.aiff'], {
        stdio: 'ignore',
        detached: true,
      }).unref();
    } else {
      // For other platforms, just log
      logger.info('Playing system notification sound');
    }
  } catch (error) {
    logger.error('Error in playNotificationSound:', error);
    // Don't throw, sound is not critical functionality
  }
}

/**
 * Play a loud alert sound for pending approvals
 * More attention-grabbing than regular notifications
 */
export async function playPendingApprovalAlert(): Promise<void> {
  try {
    const { spawn } = await import('child_process');

    if (process.platform === 'darwin') {
      // Play a more attention-grabbing system sound with volume boost
      spawn('afplay', ['/System/Library/Sounds/Sosumi.aiff', '-v', '2'], {
        stdio: 'ignore',
        detached: true,
      }).unref();

      // Add a second alert sound for extra attention
      setTimeout(() => {
        spawn('afplay', ['/System/Library/Sounds/Ping.aiff'], {
          stdio: 'ignore',
          detached: true,
        }).unref();
      }, 500);
    } else {
      // For other platforms, just log
      logger.info('Playing pending approval alert sound');
    }
  } catch (error) {
    logger.error('Error in playPendingApprovalAlert:', error);
    // Don't throw, sound is not critical functionality
  }
}
