export interface IGlobalState {
  svgMapPaths: Array<svgPath>,
  headerBoxShadow: boolean,
}

interface svgPath {
  id: string,
  class: string,
  title: string,
  draw: string,
}