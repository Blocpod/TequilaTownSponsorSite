# Tequila Town Sponsorship Site

Standalone static sponsorship site, served from `dist` (see `vercel.json`).

Preview locally: `python3 -m http.server 8765 --directory dist`.

The hero grows with its content so wrapped headlines stay below the header. Desktop typography fits two lines and keeps both buttons visible on shorter laptop screens. With the preview open in Playwright CLI, run the viewport and fallback-font spacing check with `playwright-cli run-code "$(cat tests/hero-spacing.js)"`.

## Partnership questionnaire

The two partnership CTAs open a native dialog. Required contact and qualification answers are formatted into an email draft addressed to `hi@tequila.town`; optional website/social and idea fields can be left blank. The visitor reviews and sends the email from their own mail app. A copyable draft is available if the mail app does not open. Closing and reopening the form preserves answers until the page is refreshed; the site does not store or submit them to a server.

No service or dependencies are needed. With JavaScript disabled, the CTAs keep their original direct email behavior. Check email formatting with `node --test tests/partnership-email.test.mjs`.

## Coverage links

Coverage cards in `dist/index.html` link to the matched article or broadcast segment and open in a new tab. Their images, captions and action labels share one native link, including keyboard focus.

Source matching checked November 20, 2026. Exceptions are labeled on the page:

- AOL and MSN show the Miami Herald video “Take a tour of Tequila Town in Miami.” Their exact syndicated URLs could not be verified, so both link to the matching Miami Herald video on Yahoo! News. The AOL URL tested redirected to its homepage.
- Time Out's weekly guide is updated regularly. Its guide clipping links to the stable Tequila Town event listing that contains the same description and photograph.
- Online originals for the Aventura Magazine, Stroll Magazine and Doral Tribune print clippings could not be verified. “View print clipping” opens page 8 of the existing sponsorship deck, where all four print features appear. Replace those destinations if publisher originals become available.

Publisher subscriptions, consent prompts and video availability remain controlled by the publishers. Social screenshots remain recap evidence; no unverified post URLs were added.
