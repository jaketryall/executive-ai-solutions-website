import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity'

const builder = imageUrlBuilder(client)

type ImageSource = {
  asset?: {
    _ref?: string;
    _type?: string;
  };
  _type?: string;
}

export function urlForImage(source: ImageSource | undefined) {
  if (!source) return ''
  
  return builder.image(source).auto('format').fit('max').url()
}

export function urlForImageWithDimensions(source: ImageSource | undefined, width: number, height: number) {
  if (!source) return ''
  
  return builder.image(source).width(width).height(height).auto('format').fit('max').url()
}