/**
 * Ensures a loading state stays visible for at least `MIN_MS` milliseconds,
 * measured from `start`. Prevents the UI from flickering on fast responses.
 *
 * Usage:
 *   const start = Date.now()
 *   ... await request ...
 *   await wait(start)
 */
export const wait = (start: number = Date.now(), MIN_MS: number = 800): Promise<void> => {
    const elapsed = Date.now() - start
    return new Promise<void>(
        (r) => setTimeout(r, Math.max(0, MIN_MS - elapsed))
    )
}

