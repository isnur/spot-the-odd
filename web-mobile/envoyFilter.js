'use strict';

// e.g: ['iframe', '/^\/qibla(\/)?$/']
const PATH_WHITELISTED = ['YOUR_WHITELISTED_PATH'];
const nav = top?.navigator || globalThis?.navigator || window?.navigator;
const searchParams = new URLSearchParams(window.location.search);
const isInApp = /shopee|beeshop/gi.test(nav.userAgent || nav.vendor);
const isGuardApp = searchParams.get('guardApp') === 'true';
const isLocalhost = /localhost|127\.0\.0\.1/g.test(window.location.origin);

const isWhitelistedPath = () => {
  const pathName = window.location.pathname;
  return PATH_WHITELISTED.some((path) => pathName.includes(path));
};

const getShopeeURL = () => {
  const { origin } = top.location || window.location;
  let loc = origin;
  if (isLocalhost) {
    loc = `https://shopee${window.__TID}`;
  }
  loc = loc.replace(/(special.|crm.|idgame.|games.)/i, '');
  return new URL(loc);
};

/**
 * get mkt share url from BE
 * @returns {string | undefined}
 */
const getShareURL = () => {
  const env = window.__ENV;
  const tid = window.__TID; //.co.id
  return fetch(`https://foo${tid}`, {
    headers: {
      'x-tenant': window.__COUNTRY?.toLowerCase() || '',
    },
    credentials: 'include',
  })
    .then((resp) => resp.json())
    .then((obj) => obj?.data?.config?.url_1);
};

(async () => {
  if (
    !isInApp &&
    !isWhitelistedPath() &&
    (window.__ENV === 'live' || isGuardApp)
  ) {
    let shareURL = null;
    try {
      shareURL = new URL(await getShareURL());
    } catch (error) {}

    const { origin, pathname, search } =
      shareURL || top.location || window.location;
    const newUrl = encodeURIComponent(
      `${origin}/universal-link${pathname}${search}`,
    )
      .replaceAll('.', '%2E')
      .replaceAll('_', '%5F')
      .replaceAll('-', '%2D');
    window.location.href = `${getShopeeURL()}generic-download/app?redirect_url=${newUrl}`;
  }
})();
