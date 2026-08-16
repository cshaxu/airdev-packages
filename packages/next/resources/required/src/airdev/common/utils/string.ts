/* "@airdev/next": "managed" */

import { isNil } from 'lodash-es';

function pluralize(word: string): string {
  if (typeof word !== 'string') {
    throw new Error('invalid word: string type is expected');
  }

  // Define some common rules for pluralization
  const pluralRules = [
    [/(ax|test|Ax|Test)is$/, '$1es'],
    [/(alias|status|Alias|Status)$/, '$1es'],
    [/(bu|Bu)s$/, '$1ses'],
    [/(buffal|tomat|Buffal|Tomat)o$/, '$1oes'],
    [/(hive|Hive)$/, '$1s'],
    [/(matr|vert|ind|Matr|Vert|Ind)ix|ex$/, '$1ices'],
    [/(octop|vir|Octoo|Vir)us$/, '$1i'],
    [/(quiz|Quiz)$/, '$1zes'],
    [/(x|ch|ss|sh)$/, '$1es'],
    [/([mlML])ouse$/, '$1ice'],
    [/([ti])um$/, '$1a'],
    [/([^aeiouy]|qu)y$/, '$1ies'],
    [/(?:([^f])fe|([lr])f)$/, '$1$2ves'],
    [/sis$/, 'ses'],
    [/s$/, 'es'],
    [/$/, 's'],
  ];

  // Check if the word matches any of the rules and apply the first matching rule
  for (const [pattern, replacement] of pluralRules) {
    if ((pattern as RegExp).test(word)) {
      return word.replace(pattern, replacement as string);
    }
  }

  return word + 's'; // If no rule matched, add 's' as a default pluralization
}

export function quantify(
  count: number,
  singular: string,
  asDenominator = false,
  plural?: string
): string {
  if (asDenominator && count === 1) {
    return `${singular}`;
  }
  const word = count === 1 ? singular : (plural ?? pluralize(singular));
  return `${count} ${word}`;
}

type QuantifyParams = { count: number; singular: string; plural?: string };

export function quantifyMany(array: QuantifyParams[]): string {
  if (array.length === 0) {
    return 'none';
  }
  const phrases = array
    .filter((v) => v.count !== 0)
    .map(({ count, singular, plural }) =>
      quantify(count, singular, false, plural)
    );
  if (phrases.length < 1) {
    const plurals = array.map(
      ({ singular, plural }) => plural ?? pluralize(singular)
    );
    const last = plurals.pop();
    return `no ${plurals.join(', ')} or ${last}`;
  } else if (phrases.length === 1) {
    return phrases[0];
  } else {
    const last = phrases.pop();
    return `${phrases.join(', ')} and ${last}`;
  }
}

export function shorten(text: string, maxLength: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return trimmed.slice(0, maxLength - 3) + '...';
}

export function formatString(
  template: string,
  defaultNameVars: Record<string, string>,
  data: Record<string, any>
): string {
  return template.replace(/\{([^}]+)\}/g, (match, path) => {
    const defaultValue = defaultNameVars[path];
    const keys = path.split('.');

    let value = data;
    for (const key of keys) {
      if (isNil(value)) {
        return defaultValue;
      }
      value = value[key];
    }

    if (isNil(value)) {
      return defaultValue;
    } else {
      return String(value);
    }
  });
}

export function buildAddress(
  ...addressParts: (string | undefined | null)[]
): string {
  return addressParts.filter((part) => part?.length).join(', ');
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^A-Za-z0-9]/g, '')
    .trim();
}

export function toTitleCase(value: string): string {
  return value.trim().replace(/\b\w/g, (char) => char.toUpperCase());
}
