## Why
Add an analytics dashboard with a genre vs. time heatmap visualization to help visualize viewing patterns over time. This completes the core feature set by transforming raw movie/series data into an insightful visual representation.

## What Changes
- Implement data transformation utility to convert movies/series into Nivo heatmap format
- Create AnalyticsDashboard component with Nivo Heatmap visualization
- Add navigation/tab to switch between grid view and analytics view
- Configure heatmap with monochromatic color scale (minimalist aesthetic)
- X-axis: Time (months in YYYY-MM format)
- Y-axis: Genres (unique genres from watched movies/series)
- Color intensity: Viewing frequency per genre/month

## Impact
- Affected specs: New capability `analytics` will be created
- Affected code:
  - `cinegrid/lib/heatmapUtils.ts` - data transformation functions
  - `cinegrid/components/AnalyticsDashboard.tsx` - heatmap visualization component
  - `cinegrid/app/page.tsx` - add tab/navigation for analytics view
- Dependencies: Already installed (@nivo/core, @nivo/heatmap)
