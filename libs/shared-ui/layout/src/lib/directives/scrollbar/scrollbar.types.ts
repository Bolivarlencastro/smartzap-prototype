export class ScrollbarGeometry {
  public x: number;
  public y: number;

  public w: number;
  public h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

export class ScrollbarPosition {
  public x: ScrollPositionType;
  public y: ScrollPositionType;

  constructor(x: ScrollPositionType, y: ScrollPositionType) {
    this.x = x;
    this.y = y;
  }
}

type ScrollPositionType = number | 'start' | 'end';
