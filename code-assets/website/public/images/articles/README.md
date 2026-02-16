# Article Images

This directory contains images for articles. 

## Image Requirements

- **Recommended size**: 800x400 pixels (2:1 aspect ratio)
- **Format**: JPG, PNG, or WebP
- **File size**: Keep under 500KB for optimal loading
- **Naming**: Use the article slug as the filename (e.g., `future-ai-journalism.jpg`)

## How to Add Images

1. **Place your image file** in this directory (`public/images/articles/`)
2. **Name the file** using the article's slug (e.g., `future-ai-journalism.jpg`)
3. **Update the article data** in `lib/data.ts`:
   ```typescript
   image: "/images/articles/future-ai-journalism.jpg"
   ```

## Naming Convention

Images should be named to match the article slug for consistency:

| Article Slug | Image Filename |
|--------------|----------------|
| `future-ai-journalism` | `future-ai-journalism.jpg` |
| `tech-companies-climate-initiative` | `tech-companies-climate-initiative.jpg` |
| `independent-media-platforms` | `independent-media-platforms.jpg` |

## Current Article Images

- `future-ai-journalism.jpg` - The Future of Artificial Intelligence in Journalism
- `tech-companies-climate-initiative.jpg` - Major Tech Companies Climate Initiative  
- `independent-media-platforms.jpg` - The Rise of Independent Media Platforms

## Fallback

If an image is not found, the system will fall back to `/placeholder.svg` which displays a generic placeholder.

## Image Optimization

Next.js automatically optimizes images served from the `public` directory. For better performance, consider:

- Using WebP format for smaller file sizes
- Compressing images before uploading
- Using appropriate image dimensions for your use case

## Benefits of Slug-Based Naming

- **Consistency**: Easy to match images to articles
- **Maintainability**: Clear relationship between slug and image
- **Scalability**: Simple to add new articles and images
- **Debugging**: Easy to identify missing images 