import { FC } from 'react';
import { formatClasses } from '@/lib/common.utils';
import styles from './week-graph.module.scss';

type IWeekGraphProps = {
    positiveData: number[];
    positiveTarget: number;
    negativeData: number[];
    negativeTarget: number;
    xLabels: string[];
    yInterval: number;
    strokeWidth: number;
    aspectRatio: number;
    hoveredDay: number | null;
    setHoveredDay: (day: number | null) => void;
};

const WeekGraph: FC<IWeekGraphProps> = ({
    positiveData,
    positiveTarget,
    negativeData,
    negativeTarget,
    xLabels,
    yInterval,
    strokeWidth,
    aspectRatio,
    hoveredDay,
    setHoveredDay
}) => {
    if (positiveData.length !== negativeData.length) {
        throw new Error('positiveData and negativeData must be the same length');
    }

    negativeData = negativeData.map((d) => -d);
    negativeTarget = -negativeTarget;

    const dataLength = positiveData.length;

    const basePadding = 10;
    const leftPadding = 60;
    const xAxisChartPadding = 20;
    const bottomPadding = 100;
    const xPadding = basePadding + xAxisChartPadding + leftPadding;
    const yPadding = bottomPadding;

    const padding: IPadding = {
        base: basePadding,
        left: leftPadding,
        xAxisChart: xAxisChartPadding,
        bottom: bottomPadding,
        x: xPadding,
        y: yPadding
    };

    const width = Math.max(dataLength * 10, 500) + xPadding;
    const height = width * aspectRatio;

    const maxValue = Math.max(...positiveData, positiveTarget);
    const minValue = Math.min(...negativeData, negativeTarget);

    const scaleX = (i: number) =>
        xPadding + (i / (dataLength - 1)) * (width - (xPadding + basePadding));
    const scaleY = (d: number) => height - yPadding - ((d - minValue) / (maxValue - minValue)) * (height - yPadding) + basePadding;

    const zeroY = scaleY(0);

    let deltaData = [];
    for (let i = 0; i < dataLength; i++) {
        const delta = (positiveData[i] || 0) + (negativeData[i] || 0);
        deltaData.push(delta);
    }
    const deltaTarget = positiveTarget + negativeTarget;

    const numPositiveGridLines = Math.floor(maxValue / yInterval);
    const numNegativeGridLines = Math.abs(Math.floor(minValue / yInterval));

    const onMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const svg = e.currentTarget as SVGSVGElement;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
        const x = svgP.x;
        const newhoveredDay = Math.round(((x - xPadding) / (width - xPadding - basePadding)) * (dataLength - 1));
        setHoveredDay(newhoveredDay >= 0 ? newhoveredDay : null);
    };

    const onMouseLeave = () => setHoveredDay(null);
    
    return (
        <svg className={styles.svg} viewBox={`0 0 ${width} ${height}`} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
            <Gridlines {...{ numPositiveGridLines, numNegativeGridLines, scaleY, width, padding, yInterval }} />
            <YAxisLabels {...{ numPositiveGridLines, numNegativeGridLines, scaleY, padding, yInterval }} />
            <XAxisLabels {...{ xLabels, scaleX, height, padding }} />
            <TargetLines {...{ positiveTarget, negativeTarget, deltaTarget, scaleY, width, padding }} />
            <Graph {...{ positiveData, negativeData, deltaData, scaleX, scaleY, width, height, padding, zeroY, strokeWidth }} />
            {hoveredDay !== null && <HoverLine {...{ hoveredDay, positiveData, negativeData, deltaData, scaleX, scaleY, height, padding, strokeWidth }} />}
        </svg>
    );
};

interface IPadding {
    base: number;
    left: number;
    xAxisChart: number;
    bottom: number;
    x: number;
    y: number;
}

interface IGraphProps {
    positiveData: number[];
    negativeData: number[];
    deltaData: number[];
    scaleX: (x: number) => number;
    scaleY: (y: number) => number;
    width: number;
    height: number;
    padding: IPadding;
    zeroY: number;
    strokeWidth: number;
}

const Graph: FC<IGraphProps> = ({ positiveData, negativeData, deltaData, scaleX, scaleY, width, height, padding, zeroY, strokeWidth }) => {
    let positiveAreaPoints = `M${padding.x},${zeroY} `;
    let negativeAreaPoints = `M${padding.x},${zeroY} `;
    let deltaAreaPoints = `M${padding.x},${zeroY} `;

    let positiveLinePoints = '';
    let negativeLinePoints = '';
    let deltaLinePoints = '';

    positiveData.forEach((d, i) => {
        const point = `L${scaleX(i)},${scaleY(d)} `;
        positiveAreaPoints += point;
        positiveLinePoints += i === 0 ? `M${scaleX(i)},${scaleY(d)} ` : point;
    });

    negativeData.forEach((d, i) => {
        const point = `L${scaleX(i)},${scaleY(d)} `;
        negativeAreaPoints += point;
        negativeLinePoints += i === 0 ? `M${scaleX(i)},${scaleY(d)} ` : point;
    });

    deltaData.forEach((d, i) => {
        const point = `L${scaleX(i)},${scaleY(d)} `;
        deltaAreaPoints += point;
        deltaLinePoints += i === 0 ? `M${scaleX(i)},${scaleY(d)} ` : point;
    });

    positiveAreaPoints = `${positiveAreaPoints} L${scaleX(positiveData.length - 1)},${zeroY} Z`;
    negativeAreaPoints = `${negativeAreaPoints} L${scaleX(negativeData.length - 1)},${zeroY} Z`;
    deltaAreaPoints = `${deltaAreaPoints} L${scaleX(deltaData.length - 1)},${zeroY} Z`;

    const positiveDeltaMaskPoints = `${deltaAreaPoints} M${padding.left},${height - padding.base} L${width - padding.base},${
        height - padding.base
    } L${width - padding.base},${padding.base} L${padding.left},${padding.base} Z`;

    const negativeDeltaMaskPoints = `${deltaAreaPoints} M0,0 L${width},0 L${width},${height} L0,${height} Z`;

    return (
        <>
            <>
                <defs>
                    <mask id="positiveDeltaMask">
                        <path d={positiveDeltaMaskPoints} fill="white" />
                    </mask>
                    <mask id="negativeDeltaMask">
                        <path d={negativeDeltaMaskPoints} fill="white" />
                    </mask>
                </defs>
            </>
            <>
                <path d={positiveAreaPoints} className={`${styles.positiveArea}`} mask="url(#positiveDeltaMask)" />
                <path d={negativeAreaPoints} className={`${styles.negativeArea}`} mask="url(#negativeDeltaMask)" />
                <path d={deltaAreaPoints} className={`${styles.deltaArea}`} />
            </>
            <>
                <path d={positiveLinePoints} className={`${styles.positiveLine}`} strokeWidth={strokeWidth} />
                <path d={negativeLinePoints} className={`${styles.negativeLine}`} strokeWidth={strokeWidth} />
                <path d={deltaLinePoints} className={`${styles.deltaLine}`} strokeWidth={strokeWidth} />
            </>
            <>
                {positiveData.map((d, i) => (
                    <circle
                        key={i}
                        cx={scaleX(i)}
                        cy={scaleY(d)}
                        r={strokeWidth * 2}
                        className={`${styles.circle} ${styles.circlePositive}`}
                    />
                ))}
                {negativeData.map((d, i) => (
                    <circle
                        key={i}
                        cx={scaleX(i)}
                        cy={scaleY(d)}
                        r={strokeWidth * 2}
                        className={`${styles.circle} ${styles.circleNegative}`}
                    />
                ))}
                {deltaData.map((d, i) => (
                    <circle
                        key={i}
                        cx={scaleX(i)}
                        cy={scaleY(d)}
                        r={strokeWidth * 2}
                        className={`${styles.circle} ${styles.circleDelta}`}
                    />
                ))}
            </>
        </>
    );
};

interface ITargetLinesProps {
    positiveTarget: number;
    negativeTarget: number;
    deltaTarget: number;
    scaleY: (x: number) => number;
    padding: IPadding;
    width: number;
}

const TargetLines: FC<ITargetLinesProps> = ({ positiveTarget, negativeTarget, deltaTarget, scaleY, padding, width }) => {
    return (
        <>
            <line
                className={formatClasses(styles, ['targetLine', 'targetLinePositive'])}
                x1={padding.x}
                x2={width}
                y1={scaleY(positiveTarget)}
                y2={scaleY(positiveTarget)}
            />
            <line
                className={formatClasses(styles, ['targetLine', 'targetLineNegative'])}
                x1={padding.x}
                x2={width}
                y1={scaleY(negativeTarget)}
                y2={scaleY(negativeTarget)}
            />
            <line
                className={formatClasses(styles, ['targetLine', 'targetLineDelta'])}
                x1={padding.x}
                x2={width}
                y1={scaleY(deltaTarget)}
                y2={scaleY(deltaTarget)}
            />
        </>
    );
};

interface IHoverLineProps {
    hoveredDay: number;
    positiveData: number[];
    negativeData: number[];
    deltaData: number[];
    scaleX: (x: number) => number;
    scaleY: (x: number) => number;
    height: number;
    padding: IPadding;
    strokeWidth: number;
}

const HoverLine: FC<IHoverLineProps> = ({
    hoveredDay,
    positiveData,
    negativeData,
    deltaData,
    scaleX,
    scaleY,
    height,
    padding,
    strokeWidth
}) => {
    return (
        <>
            <line
                className={formatClasses(styles, [
                    'hoverLine',
                    deltaData[hoveredDay] > 0 ? 'hoverLinePositive' : deltaData[hoveredDay] < 0 ? 'hoverLineNegative' : 'hoverLineDelta'
                ])}
                x1={scaleX(hoveredDay)}
                x2={scaleX(hoveredDay)}
                y1={padding.base}
                y2={height - padding.bottom + padding.base}
            />
            <circle
                className={formatClasses(styles, ['hoverCircle', 'hoverCirclePositive'])}
                cx={scaleX(hoveredDay)}
                cy={scaleY(positiveData[hoveredDay])}
                r={strokeWidth * 2.5}
            />
            <circle
                className={formatClasses(styles, ['hoverCircle', 'hoverCircleNegative'])}
                cx={scaleX(hoveredDay)}
                cy={scaleY(negativeData[hoveredDay])}
                r={strokeWidth * 2.5}
            />
            <circle
                className={formatClasses(styles, ['hoverCircle', 'hoverCircleDelta'])}
                cx={scaleX(hoveredDay)}
                cy={scaleY(deltaData[hoveredDay])}
                r={strokeWidth * 2.5}
            />
        </>
    );
};

interface IGridlinesProps {
    numPositiveGridLines: number;
    numNegativeGridLines: number;
    scaleY: (x: number) => number;
    width: number;
    padding: IPadding;
    yInterval: number;
}

const Gridlines: FC<IGridlinesProps> = ({ numPositiveGridLines, numNegativeGridLines, scaleY, width, padding, yInterval }) => {
    const gridLines = [];
    for (let i = -numNegativeGridLines; i <= numPositiveGridLines; i++) {
        const y = scaleY(i * yInterval);
        gridLines.push(<line key={i} className={styles.gridLine} x1={padding.x} x2={width} y1={y} y2={y} />);
    }
    return <>{gridLines}</>;
};

interface IAxisLabelsProps {
    xLabels: string[];
    scaleX: (x: number) => number;
    height: number;
    padding: IPadding;
}

const XAxisLabels: FC<IAxisLabelsProps> = ({ xLabels, scaleX, height, padding }) => {
    const xAxisLabels = [];

    for (let i = 0; i < xLabels.length; i++) {
        const x = scaleX(i);
        const y = height - padding.base;
        xAxisLabels.push(
            <text key={i} className={styles.text} x={x} y={y} dy=".35em">
                {xLabels[i]}
            </text>
        );
    }

    return <>{xAxisLabels}</>;
};

interface IYAxisLabelsProps {
    numPositiveGridLines: number;
    numNegativeGridLines: number;
    scaleY: (x: number) => number;
    padding: IPadding;
    yInterval: number;
}

const YAxisLabels: FC<IYAxisLabelsProps> = ({ numPositiveGridLines, numNegativeGridLines, scaleY, padding, yInterval }) => {
    const yAxisLabels = [];
    for (let i = -numNegativeGridLines; i <= numPositiveGridLines; i++) {
        const y = scaleY(i * yInterval);
        yAxisLabels.push(
            <text key={i} className={formatClasses(styles, ['text', 'textYAxis'])} x={padding.left} y={y} dy=".35em" textAnchor="end">
                {i * yInterval}
            </text>
        );
    }

    return <>{yAxisLabels}</>;
};

export default WeekGraph;
