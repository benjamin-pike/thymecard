import { FC } from 'react';
import { MdOutlineFastfood } from 'react-icons/md';
import { FiActivity } from 'react-icons/fi';
import { TbDelta } from 'react-icons/tb';
import styles from './day-circle.module.scss';

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

const DayCircle: FC<IDayCircleProps> = ({ type, values, target }) => {
    const total = values.reduce((a, b) => a + b, 0);

    const absTotal = target >= 0 || total <= 0 ? Math.abs(total) : 0;
    const absValues = values.map((value) => Math.abs(value));
    const absTarget = Math.abs(target);

    const strokeWidth = 7.5;
    const radius = 70;
    const diameter = radius * 2;
    const dashArray = (radius - strokeWidth / 2) * Math.PI * 2;

    const quotient = Math.floor(absTotal / absTarget);
    const remainder = absTotal % absTarget;

    const segmentGap = remainder / absTarget > 0.05 ? 2.5 : 0;

    let cumulativeValue = 0;

    const segments = [];
    let sum = 0;

    for (let i = absValues.length - 1; i >= 0; i--) {
        const value = absValues[i];

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
                    data-type={type}
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    strokeWidth={strokeWidth}
                />
                {segments.map((value, i) => {
                    const dashOffsetEnd = dashArray - (dashArray * value) / absTarget;
                    const segment = (
                        <circle
                            key={i}
                            className={styles.circleBar}
                            data-type={type}
                            cx={radius}
                            cy={radius}
                            r={radius - strokeWidth / 2}
                            strokeWidth={strokeWidth}
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffsetEnd + segmentGap}
                            style={{
                                rotate: `${-90 + (360 * cumulativeValue) / absTarget}deg`
                            }}
                        />
                    );

                    cumulativeValue += value;

                    return segment;
                })}
                <circle
                    className={styles.circleComplete}
                    data-type={type}
                    data-active={quotient > 0}
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth * 1.75}
                    strokeWidth={strokeWidth / 3}
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
