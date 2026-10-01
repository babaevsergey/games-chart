# Reviewer Notes

## Efficiency improvements

The implementation includes several small changes aimed at keeping rendering and data processing predictable:

- Data fetching was moved into a `useEffect` with an empty dependency array, preventing a new request on every render.
- Redundant chart state and its synchronization effect were removed. Chart options are now derived directly from the current props.
- Date filtering is performed once in `App` and the same filtered data is passed to both the chart and the table.
- Downloads and revenue totals are calculated together in a single `reduce`. RPD is then calculated from those totals.
- Static Data Grid column definitions and `Intl.NumberFormat` instances live outside component render functions, so they are reused between renders.
- Highcharts option construction was moved next to the chart component in `Chart/utils/getChartOptions.ts`, keeping the component focused on rendering and loading behavior.

I intentionally did not add `useMemo`, `useCallback`, or `React.memo` throughout the application. The dataset and calculations are small, so the additional memoization would add complexity without providing a meaningful performance benefit.

## Styling approach

Styles are kept in small CSS files next to the components they belong to. This was sufficient for the scope of the assignment and did not require additional dependencies or configuration.

In a larger application, I would follow the existing product design system and use shared theme tokens and reusable styled components for spacing, colors, typography, and common controls. Depending on the conventions of the codebase, Sass modules or a utility-first approach such as Tailwind CSS could also provide clearer styling rules and better reuse.

## Loading states

The chart and table use the loading mechanisms provided by their respective libraries:

- Highcharts uses `showLoading` and `hideLoading`.
- MUI Data Grid uses its `loading` prop and built-in loading overlay.

This keeps the implementation small and consistent with the libraries already used by the project. The two-second delay in `useData` is intentional and only makes the loading behavior easy to review.

In a production application, the artificial delay would be removed. A shared branded loader or skeleton could replace the built-in indicators if required by the product design system, together with more detailed empty and error states.

## Verification

The project includes automated tests, coverage reporting, and Prettier formatting.

In a production workflow, these checks could be run automatically in CI/CD together with linting, a production build, and an agreed minimum coverage threshold.

```bash
npm test
npm run test:coverage
npm run format
```
