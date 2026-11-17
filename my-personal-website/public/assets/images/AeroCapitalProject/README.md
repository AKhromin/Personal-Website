# AeroCapital screenshots

`Pic0.png` through `Pic9.png` are listed in AeroCapital's `media` array in `src/data/projectsData.js`. `Pic0.png` is the thumbnail and first slide; the remaining screenshots appear in numerical order in the carousel.

To add more screenshots, place the files here and add matching entries to that array:

```js
{ type: 'image', url: `${import.meta.env.BASE_URL}assets/images/AeroCapitalProject/Pic10.png` },
```

Only list files that exist, and match filename case exactly. PNG, JPG and WebP images work.

Run `npm run dev` from `my-personal-website/` to preview. Run `npm run deploy` from the same directory when ready to publish.
