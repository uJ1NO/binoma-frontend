import { useState, useCallback } from 'react';

interface RetryOptions {
    maxAttempts?: number;
    delayMs?: number;
    onError?: (error: Error, attempt: number) => void;
}

export function useRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
) {
    const {
        maxAttempts = 3,
        delayMs = 1000,
        onError
    } = options;

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [attempt, setAttempt] = useState(0);

    const execute = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setAttempt(0);

        let currentAttempt = 0;
        let lastError: Error | null = null;

        while (currentAttempt < maxAttempts) {
            try {
                const result = await fn();
                setIsLoading(false);
                return result;
            } catch (err) {
                lastError = err as Error;
                currentAttempt++;
                setAttempt(currentAttempt);

                if (onError) {
                    onError(lastError, currentAttempt);
                }

                if (currentAttempt < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, delayMs * currentAttempt));
                }
            }
        }

        setError(lastError);
        setIsLoading(false);
        throw lastError;
    }, [fn, maxAttempts, delayMs, onError]);

    const reset = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setAttempt(0);
    }, []);

    return {
        execute,
        reset,
        isLoading,
        error,
        attempt
    };
} 