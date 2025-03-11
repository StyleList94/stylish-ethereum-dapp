declare module '*.png';
declare module '*.jpeg';
declare module '*.jpg';

declare module '*.svg' {
  import React from 'react';

  export const ReactComponent: React.FC<React.SVGProps<SVGElement>>;

  export default ReactComponent;
}
