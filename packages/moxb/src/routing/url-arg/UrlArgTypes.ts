import { UrlArgTypeDef } from './UrlArg';

/**
 * String URL arguments
 */
export const URLARG_TYPE_STRING: UrlArgTypeDef<string> = {
    getParser: () => v => v,
    isEqual: (v1, v2) => v1 === v2,
    format: v => v,
};

/**
 * Boolean URL arguments
 */
export const URLARG_TYPE_BOOLEAN: UrlArgTypeDef<boolean> = {
    getParser: () => v => v === 'true',
    isEqual: (v1, v2) => !!v1 === !!v2,
    format: v => v.toString(),
};

/**
 * Ordered string list URL arguments
 */
export const URLARG_TYPE_ORDERED_STRING_ARRAY: UrlArgTypeDef<string[]> = {
    getParser: () => (v, defaultValue) => (v.length ? v.split(',') : defaultValue.slice()),
    isEqual: (v1, v2) => v1.join(',') === v2.join(','),
    format: v => v.join(','),
};

const formatOrderedArray = (v: string[]) =>
    v
        .slice()
        .sort()
        .join(',');

/**
 * Unordered string array URL arguments
 */
export const URLARG_TYPE_UNORDERED_STRING_ARRAY: UrlArgTypeDef<string[]> = {
    getParser: () => (v, defaultValue) => (v.length ? v.split(',') : defaultValue.slice()).sort(),
    isEqual: (v1, v2) => formatOrderedArray(v1) === formatOrderedArray(v2),
    format: formatOrderedArray,
};

/**
 * Object URL argument
 */
export function URLARG_TYPE_OBJECT<T>(): UrlArgTypeDef<T> {
    const parser = (v: string, defaultValue: T): T => {
        if (!v.length) {
            return (null as any) as T;
        }
        try {
            return JSON.parse(atob(v));
        } catch (e) {
            console.log("Warning: Can't decode base64 encoded structure.");
            return defaultValue;
        }
    };

    return {
        getParser: () => parser,
        isEqual: (v1, v2) => JSON.stringify(v1) === JSON.stringify(v2),
        format: v => btoa(JSON.stringify(v)),
    };
}

/**
 * URL encoded URL argument
 */
export const URLARG_TYPE_URLENCODED: UrlArgTypeDef<string> = {
    format: encodeURIComponent,
    getParser: () => decodeURIComponent,
    isEqual: (v1, v2) => v1 === v2,
};
