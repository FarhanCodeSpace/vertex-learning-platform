/**
 * Formatting utilities for course, module, and lesson display
 */

export function formatDuration(duration?: number | string | null): string {
  if (duration === undefined || duration === null) {
    return "";
  }

  if (typeof duration === "string") {
    // If it's already a formatted string like "18h 24m" or "45m"
    if (/[a-zA-Z]/.test(duration)) {
      return duration;
    }
    const parsed = parseInt(duration, 10);
    if (isNaN(parsed)) return duration;
    duration = parsed;
  }

  if (typeof duration === "number") {
    const totalSeconds = duration;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${Math.max(1, minutes)}m`;
  }

  return "";
}

export function formatStudentCount(count?: number | null): string {
  if (count === undefined || count === null || count === 0) {
    return "0 students";
  }

  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M students`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k students`;
  }

  return `${count} students`;
}

export function calculateModuleDuration(lessons?: Array<{ duration?: number | string | null }>): string {
  if (!lessons || lessons.length === 0) return "0m";

  let totalSeconds = 0;
  for (const lesson of lessons) {
    if (typeof lesson.duration === "number") {
      totalSeconds += lesson.duration;
    } else if (typeof lesson.duration === "string") {
      const parsed = parseInt(lesson.duration, 10);
      if (!isNaN(parsed)) {
        totalSeconds += parsed;
      }
    }
  }

  if (totalSeconds === 0) {
    // Default fallback based on count
    return `${lessons.length * 15}m`;
  }

  return formatDuration(totalSeconds);
}

export function calculateCourseDuration(
  storedDuration?: string | null,
  modules?: Array<{ lessons?: Array<{ duration?: number | string | null }> }>
): string {
  if (storedDuration && storedDuration.trim() !== "") {
    return storedDuration;
  }

  if (!modules || modules.length === 0) return "18h 24m";

  let totalSeconds = 0;
  for (const mod of modules) {
    if (Array.isArray(mod.lessons)) {
      for (const lesson of mod.lessons) {
        if (typeof lesson.duration === "number") {
          totalSeconds += lesson.duration;
        } else if (typeof lesson.duration === "string") {
          const parsed = parseInt(lesson.duration, 10);
          if (!isNaN(parsed)) {
            totalSeconds += parsed;
          }
        }
      }
    }
  }

  if (totalSeconds === 0) {
    return "18h 24m";
  }

  return formatDuration(totalSeconds);
}

export function capitalize(str?: string | null): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
