# H5P Content Directory

This directory contains H5P interactive content for the site.

## Setup Instructions

### 1. Adding H5P Content

1. Export your H5P content as a `.h5p` file (it's a ZIP archive)
2. Unzip the `.h5p` file into a subdirectory here, e.g., `static/h5p/my-content/`
3. Make sure the unzipped content has an `index.html` file at the root

Example structure:
```
static/h5p/
  ├── my-quiz/
  │   ├── index.html
  │   ├── h5p.json
  │   ├── content/
  │   └── ...other H5P files
  └── my-interactive-video/
      ├── index.html
      └── ...
```

### 2. Using H5P Content in Posts

In your markdown content files, use the `h5p` shortcode:

#### Basic usage:
```
{{</* h5p name="my-content" */>}}
```

#### With custom height:
```
{{</* h5p name="my-quiz" height="800px" */>}}
```

#### With custom width and height:
```
{{</* h5p name="my-interactive-video" width="800px" height="600px" */>}}
```

### Parameters

- **name** (required): The name of the subdirectory containing your H5P content
- **height** (optional): Height of the iframe (default: 600px)
- **width** (optional): Maximum width of the container (default: 100%)

## Tips

- H5P content works best when properly extracted from `.h5p` files
- Make sure all JavaScript and CSS files are included in the extracted directory
- Test your H5P content locally before deploying
- Some H5P content types may require additional libraries - ensure they're included in the extracted files

## Troubleshooting

If H5P content doesn't load:
1. Check browser console for errors
2. Verify the `index.html` file exists in the content directory
3. Ensure all relative paths in the H5P content are correct
4. Check that JavaScript is enabled in the browser

