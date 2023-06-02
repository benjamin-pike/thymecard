import { FC } from 'react';
import { MdOutlineFastfood } from 'react-icons/md';
import { FiActivity } from 'react-icons/fi';
import { TbDelta } from 'react-icons/tb';
import styles from './day-circle.module.css';

interface IDayCircleProps {
    type: 'in' | 'out' | 'delta';
    values: number[];
    target: number;
}

const icon = {
    in: <MdOutlineFastfood />,
    out: <FiActivity />,
    delta: <TbDelta />
};

const colors = {
    in: 'pink',
    out: 'blue',
    delta: 'purple'
};

const DayCircle: FC<IDayCircleProps> = ({ type, values, target }) => {
    const color = colors[type];

    const strokeWidth = 7.5;
    const radius = 70;
    const diameter = radius * 2;
    const dashArray = (radius - strokeWidth / 2) * Math.PI * 2;

    const absTarget = Math.abs(target);
    const total = values.reduce((a, b) => a + b, 0);
    const quotient = Math.floor(total / absTarget);
    const remainder = total % target;

    const segmentGap = remainder / target > 0.05 ? 2.5 : 0;

    let cumulativeValue = 0;

    const segments = [];
    let sum = 0;
    
    for (let i = values.length - 1; i >= 0; i--) {
        const value = values[i];
    
        if (sum + value <= remainder) {
            sum += value;
            segments.push(value);
        } else if (remainder - sum > 0) {
            segments.push(remainder - sum);
            sum = remainder;
        }
    
        if (sum === remainder) break;
    }
    
    segments.reverse();

    return (
        <div className={styles.progressCircle}>
            <svg viewBox={`0 0 ${diameter} ${diameter}`}>
                <circle
                    className={styles.circleTrack}
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    style={{
                        stroke: `var(--${color}-10)`,
                        strokeWidth: strokeWidth
                    }}
                />
                {segments.map((value, i) => {
                    const dashOffsetEnd = dashArray - (dashArray * value) / absTarget;
                    const segment = (
                        <circle
                            key={i}
                            className={styles.circleBar}
                            cx={radius}
                            cy={radius}
                            r={radius - strokeWidth / 2}
                            style={{
                                stroke: `var(--${color}-${i % 2 === 0 ? 'light' : 'dark'})`,
                                strokeWidth: strokeWidth,
                                strokeDasharray: dashArray,
                                strokeDashoffset: dashOffsetEnd + segmentGap,
                                rotate: `${-90 + (360 * cumulativeValue) / absTarget}deg`
                            }}
                        />
                    );

                    cumulativeValue += value;

                    return segment;
                })}
                <circle
                    className={styles.circleBar}
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth * 1.75}
                    style={{
                        stroke: `var(--${color})`,
                        strokeWidth: strokeWidth / 3,
                        opacity: quotient > 0 ? 1 : 0.15
                    }}
                />
            </svg>
            <div className={styles.content}>
                {icon[type]}
                <div className={styles.values}>
                    <p className={styles.total}>{total}</p>
                    <p className={styles.target}>{target}</p>
                </div>
            </div>
        </div>
    );
};

export default DayCircle;
