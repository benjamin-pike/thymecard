import { FC, useState, useRef, useEffect } from 'react';
import { DateTime } from 'luxon';
import styles from './long-term-bars.module.scss';

interface ILongTermBarsProps {
    dailyInTarget: number;
    dailyOutTarget: number;
    monthInValues: number[];
    monthOutValues: number[];
    yearInValues: number[];
    yearOutValues: number[];
}

const LongTermBars: FC<ILongTermBarsProps> = ({
    dailyInTarget,
    dailyOutTarget,
    monthInValues,
    monthOutValues,
    yearInValues,
    yearOutValues
}) => {
    const height = 3;
    const gap = 3;
    const groupGap = 12.5;

    const topPadding = 6;
    const bottomPadding = 2.5;
    const textPadding = (topPadding - bottomPadding) / 2;

    const svgHeight = 4 * height + 2 * gap + groupGap + topPadding + bottomPadding;

    const isMonthInOnTarget = monthInValues.reduce((a, b) => a + b, 0) >= dailyInTarget * DateTime.local().day;
    const isMonthOutOnTarget = monthOutValues.reduce((a, b) => a + b, 0) >= dailyOutTarget * DateTime.local().day;
    const isYearInOnTarget = yearInValues.reduce((a, b) => a + b, 0) >= dailyInTarget * DateTime.local().ordinal;
    const isYearOutOnTarget = yearOutValues.reduce((a, b) => a + b, 0) >= dailyOutTarget * DateTime.local().ordinal;

    return (
        <svg className={styles.container} viewBox={`0 0 100 ${svgHeight}`}>
            <ProgressBar type="in" timespan="month" values={monthInValues} dailyTarget={dailyInTarget} translateY={topPadding} />
            <ProgressBar
                type="out"
                timespan="month"
                values={monthOutValues}
                dailyTarget={dailyOutTarget}
                translateY={height + gap + topPadding}
            />
            <ProgressBar
                type="in"
                timespan="year"
                values={yearInValues}
                dailyTarget={dailyInTarget}
                translateY={2 * height + gap + groupGap + topPadding}
            />
            <ProgressBar
                type="out"
                timespan="year"
                values={yearOutValues}
                dailyTarget={dailyOutTarget}
                translateY={3 * height + 2 * gap + groupGap + topPadding}
            />
            <TodayLine
                svgHeight={svgHeight}
                verticalOffset={textPadding}
                barHeight={height}
                barGap={gap}
                groupGap={groupGap}
                isMonthInOnTarget={isMonthInOnTarget}
                isMonthOutOnTarget={isMonthOutOnTarget}
                isYearInOnTarget={isYearInOnTarget}
                isYearOutOnTarget={isYearOutOnTarget}
            />
            <BarTitles svgHeight={svgHeight} barHeight={height} barGap={gap} groupGap={groupGap} />
        </svg>
    );
};

export default LongTermBars;

interface IProgressBarProps {
    type: 'in' | 'out';
    timespan: 'month' | 'year';
    values: number[];
    dailyTarget: number;
    translateY: number;
}

const ProgressBar: FC<IProgressBarProps> = ({ type, timespan, values, dailyTarget, translateY }) => {
    const height = 3;
    const daysInTotal = timespan === 'month' ? DateTime.local().daysInMonth ?? 30 : DateTime.local().daysInYear ?? 365;

    const totalTarget = dailyTarget * daysInTotal;
    const valueSum = values.reduce((a, b) => a + b, 0);
    const barWidth = (valueSum / totalTarget) * 100;

    const barClipPathName = `bar-clip-${type}-${timespan}`;

    let offset = 0;

    return (
        <g transform={`translate(0, ${translateY})`}>
            <defs>
                <clipPath id="container-clip">
                    <rect x="0" y="0" width="100" rx={height / 2} ry={height / 2} height={height} />
                </clipPath>
                <clipPath id={barClipPathName}>
                    <rect x="0" y="0" width={barWidth} rx={height / 2} ry={height / 2} height={height} />
                </clipPath>
            </defs>
            <rect className={styles.background} x="0" y="0" width="100" height={height} clipPath="url(#container-clip)" />
            <g clipPath="url(#container-clip)">
                <g clipPath={`url(#${barClipPathName})`}>
                    {values.map((value, index) => {
                        const segmentWidth = (value / valueSum) * barWidth;
                        const currentOffset = offset;
                        
                        offset += segmentWidth;

                        return (
                            <rect
                                key={index + value + type}
                                className={styles.segment}
                                data-type={type}
                                x={currentOffset}
                                y="0"
                                width={segmentWidth}
                                height={height}
                            />
                        );
                    })}
                </g>
            </g>
        </g>
    );
};

interface IBarTitlesProps {
    svgHeight: number;
    barHeight: number;
    barGap: number;
    groupGap: number;
}

const BarTitles: FC<IBarTitlesProps> = ({ svgHeight, barHeight, barGap, groupGap }) => {
    const isMonthLabelOnLeft = DateTime.local().day / (DateTime.local().daysInMonth ?? 30) > 0.5;
    const isYearLabelOnLeft = DateTime.local().ordinal / DateTime.local().daysInYear > 0.5;
    return (
        <>
            <text
                className={styles.barTitle}
                x={isMonthLabelOnLeft ? 0 : 100}
                y={svgHeight / 2 - groupGap / 2 - 2 * barHeight - barGap}
                textAnchor={isMonthLabelOnLeft ? 'start' : 'end'}
            >
                <tspan className={styles.this}>This</tspan>
                <tspan className={styles.timespan}> Month</tspan>
            </text>
            <text
                className={styles.barTitle}
                x={isYearLabelOnLeft ? 0 : 100}
                y={svgHeight / 2 + groupGap / 2}
                textAnchor={isYearLabelOnLeft ? 'start' : 'end'}
            >
                <tspan className={styles.this}>This</tspan>
                <tspan className={styles.timespan}> Year</tspan>
            </text>
        </>
    );
};

interface ITodayLineProps {
    svgHeight: number;
    verticalOffset: number;
    barHeight: number;
    barGap: number;
    groupGap: number;
    isMonthInOnTarget: boolean;
    isMonthOutOnTarget: boolean;
    isYearInOnTarget: boolean;
    isYearOutOnTarget: boolean;
}

const TodayLine: FC<ITodayLineProps> = ({
    svgHeight,
    verticalOffset,
    barHeight,
    barGap,
    groupGap,
    isMonthInOnTarget,
    isMonthOutOnTarget,
    isYearInOnTarget,
    isYearOutOnTarget
}) => {
    const daysInMonth = DateTime.local().daysInMonth ?? 30;
    const dayOfMonth = DateTime.local().day;
    const dayOfMonthPosition = (dayOfMonth / daysInMonth) * 100;

    const daysInYear = DateTime.local().daysInYear;
    const dayOfYear = DateTime.local().ordinal;
    const dayOfYearPosition = (dayOfYear / daysInYear) * 100;

    const lineWidth = 0.3;

    return (
        <>
            <MonthLine
                dayOfMonthPosition={dayOfMonthPosition}
                svgHeight={svgHeight}
                verticalOffset={verticalOffset}
                lineWidth={lineWidth}
                barHeight={barHeight}
                barGap={barGap}
                groupGap={groupGap}
                isInOnTarget={isMonthInOnTarget}
                isOutOnTarget={isMonthOutOnTarget}
            />
            <YearLine
                dayOfYearPosition={dayOfYearPosition}
                svgHeight={svgHeight}
                verticalOffset={verticalOffset}
                lineWidth={lineWidth}
                barHeight={barHeight}
                barGap={barGap}
                groupGap={groupGap}
                isInOnTarget={isYearInOnTarget}
                isOutOnTarget={isYearOutOnTarget}
            />
            <line
                className={styles.todayLine}
                x1={dayOfMonthPosition}
                x2={dayOfYearPosition}
                y1={verticalOffset + svgHeight / 2}
                y2={verticalOffset + svgHeight / 2}
                strokeWidth={lineWidth}
                strokeLinecap="round"
            />
            <TodayText
                dayOfMonthPosition={dayOfMonthPosition}
                dayOfYearPosition={dayOfYearPosition}
                svgHeight={svgHeight}
                verticalOffset={verticalOffset}
            />
        </>
    );
};

interface ILineProps {
    svgHeight: number;
    verticalOffset: number;
    lineWidth: number;
    barHeight: number;
    barGap: number;
    groupGap: number;
    isInOnTarget: boolean;
    isOutOnTarget: boolean;
}

interface IMonthLineProps extends ILineProps {
    dayOfMonthPosition: number;
}

interface IYearLineProps extends ILineProps {
    dayOfYearPosition: number;
}

const MonthLine: FC<IMonthLineProps> = ({
    dayOfMonthPosition,
    svgHeight,
    verticalOffset,
    lineWidth,
    barHeight,
    barGap,
    groupGap,
    isInOnTarget,
    isOutOnTarget
}) => (
    <>
        <line
            className={styles.todayLine}
            x1={dayOfMonthPosition}
            x2={dayOfMonthPosition}
            y1={verticalOffset * 2 + lineWidth / 2}
            y2={verticalOffset + svgHeight / 2}
            strokeWidth={lineWidth}
            strokeLinecap="round"
        />
        <line
            className={styles.todayLineMask}
            x1={dayOfMonthPosition}
            x2={dayOfMonthPosition}
            y1={verticalOffset + svgHeight / 2 - groupGap / 2 - barHeight - 0.5}
            y2={verticalOffset + svgHeight / 2 - groupGap / 2 + 0.5}
            display={isOutOnTarget ? 'block' : 'none'}
            strokeWidth={lineWidth}
        />
        <line
            className={styles.todayLineMask}
            x1={dayOfMonthPosition}
            x2={dayOfMonthPosition}
            y1={verticalOffset + svgHeight / 2 - groupGap / 2 - barHeight - barGap + 0.5}
            y2={verticalOffset + svgHeight / 2 - groupGap / 2 - barHeight - barGap - barHeight - 0.5}
            display={isInOnTarget ? 'block' : 'none'}
            strokeWidth={lineWidth}
        />{' '}
    </>
);

const YearLine: FC<IYearLineProps> = ({
    dayOfYearPosition,
    svgHeight,
    verticalOffset,
    lineWidth,
    barHeight,
    barGap,
    groupGap,
    isInOnTarget,
    isOutOnTarget
}) => (
    <>
        <line
            className={styles.todayLine}
            x1={dayOfYearPosition}
            x2={dayOfYearPosition}
            y1={verticalOffset + svgHeight / 2}
            y2={verticalOffset + svgHeight - lineWidth / 2}
            strokeWidth={lineWidth}
            strokeLinecap="round"
        />
        <line
            className={styles.todayLineMask}
            x1={dayOfYearPosition}
            x2={dayOfYearPosition}
            y1={verticalOffset + svgHeight / 2 + groupGap / 2 - 0.5}
            y2={verticalOffset + svgHeight / 2 + groupGap / 2 + barHeight + 0.5}
            strokeWidth={lineWidth}
            display={isInOnTarget ? 'block' : 'none'}
        />
        <line
            className={styles.todayLineMask}
            x1={dayOfYearPosition}
            x2={dayOfYearPosition}
            y1={verticalOffset + svgHeight / 2 + groupGap / 2 + barHeight + barGap - 0.5}
            y2={verticalOffset + svgHeight / 2 + groupGap / 2 + barHeight + barGap + barHeight + 0.5}
            strokeWidth={lineWidth}
            display={isOutOnTarget ? 'block' : 'none'}
        />
    </>
);

interface ITodayTextProps {
    dayOfMonthPosition: number;
    dayOfYearPosition: number;
    svgHeight: number;
    verticalOffset: number;
}

const TodayText: FC<ITodayTextProps> = ({ dayOfMonthPosition, dayOfYearPosition, svgHeight, verticalOffset }) => {
    const [textWidth, setTextWidth] = useState(0);
    const [textHeight, setTextHeight] = useState(0);
    const textRef = useRef(null);
    const textPadding = 3;

    useEffect(() => {
        if (textRef.current) {
            const bbox = (textRef.current as SVGTextElement).getBBox();
            setTextWidth(bbox.width);
            setTextHeight(bbox.height);
        }
    }, []);

    return (
        <>
            <rect
                className={styles.todayTextBackground}
                x={(dayOfMonthPosition + dayOfYearPosition) / 2 - textWidth / 2 - textPadding / 2}
                y={verticalOffset + svgHeight / 2 - textHeight / 2 - textPadding / 2}
                width={textWidth + textPadding}
                height={textHeight + textPadding}
            />
            <text
                ref={textRef}
                className={styles.todayText}
                x={(dayOfMonthPosition + dayOfYearPosition) / 2}
                y={verticalOffset + svgHeight / 2}
                alignmentBaseline="middle"
            >
                Today
            </text>
        </>
    );
};
