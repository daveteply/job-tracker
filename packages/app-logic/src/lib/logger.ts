import posthog from 'posthog-js';

type LogLevel = 'info' | 'warn' | 'error';

interface LogOptions {
  tags?: string[];
  extra?: Record<string, unknown>;
  error?: Error | unknown;
}

/**
 * A clean, isomorphic logger facade for the job-tracker application.
 * In development, it logs primarily to the console.
 * In production, it logs to the console and captures events in PostHog.
 * PostHog handles offline queuing automatically.
 */
class Logger {
  private isProd = process.env.NODE_ENV === 'production';

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString();
    const tags = options?.tags ? `[${options.tags.join(', ')}] ` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${tags}${message}`;
  }

  info(message: string, options?: LogOptions) {
    const formatted = this.formatMessage('info', message, options);
    console.info(formatted);

    if (this.isProd && typeof posthog !== 'undefined' && posthog.__loaded) {
      posthog.capture('app_info', {
        message,
        environment: process.env.NODE_ENV,
        vercel_env: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
        ...options?.extra,
        tags: options?.tags,
      });
    }
  }

  warn(message: string, options?: LogOptions) {
    const formatted = this.formatMessage('warn', message, options);
    console.warn(formatted);

    if (this.isProd && typeof posthog !== 'undefined' && posthog.__loaded) {
      posthog.capture('app_warning', {
        message,
        environment: process.env.NODE_ENV,
        vercel_env: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
        ...options?.extra,
        tags: options?.tags,
      });
    }
  }

  error(message: string | Error | unknown, options?: LogOptions) {
    const isErrorObject = message instanceof Error;
    const errorMessage = isErrorObject ? message.message : String(message);
    const actualError = isErrorObject ? message : options?.error;

    const formatted = this.formatMessage('error', errorMessage, options);
    console.error(formatted);
    if (actualError) {
      console.error(actualError);
    }

    if (this.isProd && typeof posthog !== 'undefined' && posthog.__loaded) {
      posthog.capture('app_error', {
        message: errorMessage,
        stack: actualError instanceof Error ? actualError.stack : undefined,
        digest: (actualError as { digest?: string })?.digest,
        environment: process.env.NODE_ENV,
        vercel_env: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
        ...options?.extra,
        tags: options?.tags,
      });

      // Also use posthog's specific exception capture if available/configured
      if (actualError instanceof Error) {
        posthog.capture('$exception', {
          message: actualError.message,
          stack: actualError.stack,
          environment: process.env.NODE_ENV,
          vercel_env: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
        });
      }
    }

  }
}

export const logger = new Logger();
