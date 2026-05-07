import { LearnContentType } from './learn-content';

export class ContentButton {
  constructor(
    public title: string,
    public tooltip: string | null,
    public icon: string | null,
    public type: LearnContentType,
    public selected: boolean,
    public svgIcon?: string,
    public hiddenOnMobile?: boolean,
    public disabled?: boolean,
  ) {}
}
