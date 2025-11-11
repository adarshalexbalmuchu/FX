declare module 'react-plotly.js' {
  import { Component } from 'react';
  import { PlotParams } from 'plotly.js';

  export interface Figure {
    data: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    frames?: Plotly.Frame[];
  }

  export interface PlotProps extends Partial<PlotParams> {
    data: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    frames?: Plotly.Frame[];
    config?: Partial<Plotly.Config>;
    onInitialized?: (figure: Readonly<Figure>, graphDiv: Readonly<HTMLElement>) => void;
    onUpdate?: (figure: Readonly<Figure>, graphDiv: Readonly<HTMLElement>) => void;
    onPurge?: (figure: Readonly<Figure>, graphDiv: Readonly<HTMLElement>) => void;
    onError?: (err: Readonly<Error>) => void;
    onBeforePlot?: () => boolean | void;
    onAfterPlot?: () => void;
    onAfterExport?: () => void;
    onBeforeHover?: () => boolean | void;
    onHover?: (event: Readonly<Plotly.PlotHoverEvent>) => void;
    onUnhover?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
    onSelected?: (event: Readonly<Plotly.PlotSelectionEvent>) => void;
    onClick?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
    onBeforeExport?: () => void;
    useResizeHandler?: boolean;
    style?: React.CSSProperties;
    className?: string;
    divId?: string;
  }

  export default class Plot extends Component<PlotProps> {}
}
