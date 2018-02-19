export interface IGlobalState {
  svgMapPaths: Array<svgPath>
}

interface svgPath {
  id: string,
  class: string,
  title: string,
  draw: string,
}