import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {
        "model-viewer": React.DetailedHTMLProps<
          React.AllHTMLAttributes<
            Partial<globalThis.HTMLElementTagNameMap['model-viewer']>
          >,
          Partial<globalThis.HTMLElementTagNameMap['model-viewer']>
        >;
      }
    }
  }
}
