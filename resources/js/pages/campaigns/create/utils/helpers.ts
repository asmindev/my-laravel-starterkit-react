export function toStringId(v: string | number) {
    return typeof v === 'number' ? String(v) : v;
}
