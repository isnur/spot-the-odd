'use-strict';

const petUrlSearchParams = new URLSearchParams(top.window.location.search);
const petParams = Object.fromEntries(petUrlSearchParams.entries());

// default value
window.__COUNTRY = 'ID';
window.__ENV = 'test';
window.__TID = '.co.id';
window.__ACTIVITY_CODE = '';
window.__USE_WEBP = '{USE_WEBP}' === 'true';

window.location.search
  .slice(1)
  .split('&')
  .forEach((search) => {
    const eq = search.indexOf('=');
    const key = search.slice(0, eq);
    const value = search.slice(eq + 1);

    if (key === 'activity') {
      found = true;
      window.__ACTIVITY_CODE = value;
    }
  });

const origin = (window || globalThis).location.origin;
const path = origin.split('/')[2];

const countryTldMapping = new Map([
  ['SG', '.sg'],
  ['MY', '.com.my'],
  ['TH', '.co.th'],
  ['TW', '.tw'],
  ['ID', '.co.id'],
  ['VN', '.vn'],
  ['PH', '.ph'],
  ['BR', '.com.br'],
]);
const supportedEnvironments = ['dev', 'test', 'uat', 'staging', 'live'];

const delimiter = path.indexOf('shopee');

if (delimiter !== -1) {
  const tID = path.slice(delimiter + 'shopee'.length);
  const env = path.slice(path.indexOf('.') + 1, delimiter - 1);

  if (supportedEnvironments.indexOf(env) === -1) {
    console.warn('No ENV detected');
  } else {
    window.__ENV = env;
  }

  if (path.startsWith('play.shopee') || path.startsWith('games.shopee')) {
    window.__ENV = 'live';
  }

  countryTldMapping.forEach((tenant, country) => {
    if (tenant === tID) {
      window.__COUNTRY = country;
      window.__TID = tID;
    }
  });
}

(function () {
  let isSupportWebP = false;
  try {
    isSupportWebP =
      document
        .createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0;
  } catch (error) {
    // do nothing
  }

  window.__SUPPORT_WEBP = isSupportWebP;
})();
