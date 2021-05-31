import bugsnagClient from './bugsnag';
import {Event} from "@bugsnag/core/types";

const togglUrlRegex = /^(\w+\.)?toggl\.(space|com)$/

export function secToHHMM(sum: number) {
  const hours = Math.floor(sum / 3600);
  const minutes = Math.floor((sum % 3600) / 60);

  return hours + 'h ' + minutes + 'm';
}

export function report(e: Error) {
  if (process.env.DEBUG) {
    console.error(e);
  } else {
    bugsnagClient.notify(e);
  }
}

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};

export function escapeHtml(string: string) {
  return String(string).replace(/[&<>"'/]/g, function (s) {
    return entityMap[s];
  });
}

export function getUrlParam(location: string, key: string) {
  const url = new URL(location);
  return url.searchParams.get(key);
}

export function isTogglURL(url: string) {
  try {
    return togglUrlRegex.test(new URL(url).hostname);
  } catch (err) {
    bugsnagClient.notify(err, (evt: Event) => {
      evt.addMetadata('general', {url})
    });
    return false;
  }
}

export function getStoreLink(isFirefox = false) {
  if (isFirefox) {
    return 'https://addons.mozilla.org/en-US/firefox/addon/toggl-button-time-tracker/';
  }
  return 'https://chrome.google.com/webstore/detail/toggl-button-productivity/oejgccbfbmkkpaidnkphaiaecficdnfn';
}

/**
 * Number of life-time entries the user must have tracked
 * with Toggl Button to be considered an active user
 */
const ACTIVE_USER_TRESHOLD = 30;

export async function isActiveUser(db: TogglDB) {
  const timeEntriesTracked = await db.get<number>('timeEntriesTracked') || 0;
  return (timeEntriesTracked >= ACTIVE_USER_TRESHOLD);
}

export function findArrayDuplicates(arr, unique = false) {
  let sortedArray = arr.slice().sort();
  let duplicates: string[] = [];
  for (let i = 0; i < sortedArray.length - 1; i++) {
    if (sortedArray[i + 1] == sortedArray[i]) {
      duplicates.push(sortedArray[i]);
    }
  }
  if (unique) {
    return [...new Set(duplicates)]
  } else {
    return duplicates;
  }
}

export function findArrayIntersection(array1, array2) {
  return array1.filter((n) => {
    return array2.includes(n);
  });
}

export function isValidUrl(str) {
  const pattern = new RegExp('^(https?:\\/\\/)' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$', 'i');
  return pattern.test(str);
}
