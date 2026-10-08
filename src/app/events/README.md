# Events

One folder per event. Everything about an event lives in its own folder:

```
src/app/events/
  backtrace/
    data.ts     <- ALL the details + look of the event (edit this)
    page.tsx    <- renders the shared layout with that data (usually no need to touch)
  kalakriti/
    data.ts
    page.tsx
  ...
  [slug]/       <- fallback for an event that is listed but has no folder yet
  page.tsx      <- the events list at /events
```

## Change something about an event
Open `src/app/events/<slug>/data.ts`. It holds, in order:

| Field | Shown as |
|---|---|
| `name`, `category`, `iconKey` | title, filter tag, small icon |
| `tagline`, `about` | line under the title, "About" paragraph |
| `date`, `time`, `venue`, `teamSize`, `fee`, `prize` | the fact cards |
| `rules` | numbered rules list |
| `contact` | event coordinator |
| `subEvents` | "The lineup" competitions |
| `theme` | page colours, background pattern, scrolling tape text |
| `media` | real `image` / `logo` (otherwise the cultural illustration is used) |

The shape is defined in `src/data/event-types.ts`, so the editor will tell you if a field is missing.

## Add a new event
1. Copy an existing folder, e.g. `kalakriti/` -> `my-event/`, and edit its `data.ts` (`slug` must equal the folder name).
2. Add it to the list in `src/data/all-events.ts` (the order there is the order on the site).
3. Optional: add its stamp illustration to `CULTURES` in `src/components/culture-art.tsx`.

## Custom layout for one event
Replace `<EventPage event={...} />` in that event's `page.tsx` with your own JSX. Other events are unaffected.
To change the layout for **all** events, edit `src/components/event-page.tsx`.

## Not here
- `src/data/event-subeventData.ts` holds the database IDs used by registration (`src/actions/event-actions.ts`).
  It is backend data; the competition names shown on the website come from `subEvents` in each `data.ts`.
- The stamp illustrations are code, in `src/components/culture-art.tsx`.
