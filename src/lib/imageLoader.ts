// Used only by the GitHub Pages export (GH_PAGES=1): serve /public images from under the base path.
export default function loader({ src }: { src: string; width: number; quality?: number }) {
  return src.startsWith("/") ? `/fortress-group${src}` : src;
}
