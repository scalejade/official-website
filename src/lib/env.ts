// Reads a server setting, forgiving the usual copy-paste damage: surrounding
// whitespace or line breaks, and a value wrapped in quotes. Returns undefined
// for a missing or empty setting.
export function env(name: string): string | undefined {
    const raw = process.env[name];
    if (raw === undefined) return undefined;
    const value = raw.trim().replace(/^(['"`])([\s\S]*)\1$/, '$2').trim();
    return value === '' ? undefined : value;
}
