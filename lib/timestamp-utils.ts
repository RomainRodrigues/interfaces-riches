/**
 * Utilitaires pour la gestion uniforme des timestamps dans l'application
 * Format standard: "HH:MM:SS"
 */

/**
 * Convertit des secondes en format timestamp string "HH:MM:SS"
 */
export function secondsToTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Convertit un timestamp string "HH:MM:SS" en secondes
 */
export function timestampToSeconds(timestamp: string): number {
  const parts = timestamp.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);

  return hours * 3600 + minutes * 60 + seconds;
}
