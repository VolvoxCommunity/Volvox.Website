"use client";

import Script from "next/script";
import { META_PIXEL_ID } from "@/lib/constants";

/**
 * Loads the Meta (Facebook) Pixel base code and tracks the initial PageView.
 *
 * This component must only be rendered after the user has granted advertising
 * cookie consent — it is mounted conditionally by `ConditionalAnalytics`.
 * Custom events (e.g. `Lead`) are tracked with `trackMetaPixelEvent` from
 * `@/lib/meta-pixel`.
 *
 * @returns The Meta Pixel bootstrap script and its noscript fallback
 */
export function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* biome-ignore lint/performance/noImgElement: Meta Pixel's official noscript fallback is a plain 1x1 tracking img; next/image is not applicable. */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
