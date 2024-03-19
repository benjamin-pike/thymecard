import { FC, ReactElement } from 'react';
import { DateTime } from 'luxon';

import TimeInput from '@/components/common/time-input/TimeInput';

import { ITime } from '@thymecard/types';
import { capitalize } from '@/lib/string.utils';

import styles from './metadata-field.module.scss';
import DatePicker from '@/components/common/date-picker/DatePicker';
import Popover from '@/components/wrappers/popover/Popover';

export enum EEventMetadataFieldType {
    DROPDOWN = 'dropdown',
    DATE = 'date',
    TIME = 'time',
    DURATION = 'duration'
}

interface EventFieldProps {
    type: EEventMetadataFieldType;
    icon: JSX.Element;
    label: string;
    labelWidth: number;
    selectedOption?: string;
    selectedDate?: DateTime;
    selectedTime?: ITime;
    dropdownId?: string;
    popoverId?: string;
    disabled?: boolean;
    handleSelectDate?: (date: DateTime) => void;
    handleUpdateTime?: (update: ITime) => void;
}

const EventMetadataField: FC<EventFieldProps> = ({
    type,
    icon,
    label,
    labelWidth,
    selectedOption,
    selectedDate,
    selectedTime,
    dropdownId,
    popoverId,
    disabled,
    handleSelectDate,
    handleUpdateTime
}) => {
    let field: ReactElement | null = null;

    switch (type) {
        case EEventMetadataFieldType.DROPDOWN:
            field = (
                <button
                    className={styles.input}
                    data-option={selectedOption}
                    data-dropdown-id={disabled ? undefined : dropdownId}
                    disabled={disabled}
                >
                    <p className={styles.selected} data-empty={!selectedOption}>
                        {selectedOption ? capitalize(selectedOption) : `Select ${label.toLowerCase()}`}
                    </p>
                </button>
            );
            break;
        case EEventMetadataFieldType.DATE:
            field = (
                <button className={styles.input} data-popover-id={disabled ? undefined : popoverId} disabled={disabled}>
                    <p data-empty={!selectedDate}>{selectedDate ? selectedDate.toFormat('ccc LLL d, yyyy') : 'Select a date'}</p>
                </button>
            );
            break;
        case EEventMetadataFieldType.TIME:
            field = (
                <div className={styles.input}>
                    <TimeInput initial={selectedTime} handleUpdate={handleUpdateTime as (time: ITime) => void} />
                </div>
            );
            break;
    }

    return (
        <li className={styles.field} data-type={type}>
            <div className={styles.label} style={{ width: `${labelWidth}rem` }}>
                {icon}
                <p>{label}</p>
            </div>
            {type === EEventMetadataFieldType.DATE && handleSelectDate ? (
                <Popover
                    className={styles.popover}
                    content={<DatePicker selectedDay={selectedDate} blockPast={true} handleSelectDay={handleSelectDate}></DatePicker>}
                    placement="bottom-start"
                >
                    <>{field}</>
                </Popover>
            ) : (
                field
            )}
        </li>
    );
};

export default EventMetadataField;
