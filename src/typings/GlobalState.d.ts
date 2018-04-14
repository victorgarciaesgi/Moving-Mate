
export interface IGlobalState {
  svgMapPaths: Array<svgPath>,
  headerBoxShadow: boolean,
  previousModalRoute: string
}

interface svgPath {
  id: string,
  class: string,
  title: string,
  draw: string,
}