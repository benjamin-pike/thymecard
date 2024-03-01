import { FC, useCallback } from 'react';
import { DateTime } from 'luxon';

import DatePicker from './DatePicker';
import PopoverWrapper from '@/components/wrappers/popover/PopoverWrapper';

import { usePopover } from '@/hooks/common/usePopover';

type IDatePickerPopoverProps = Omit<PropsOf<typeof PopoverWrapper>, 'children' | 'bindCloseFunction'> & PropsOf<typeof DatePicker>;

const DatePickerPopover: FC<IDatePickerPopoverProps> = ({
    // PopoverWrapper props
    id,
    position,
    offset,
    tooltip,
    // DatePicker props
    selectedDay,
    blockPast,
    blockFuture,
    blockToday,
    handleSelectDay
}) => {
    const { bindCloseFunction, closePopover } = usePopover();

    const handleSelectDateAndClose = useCallback(
        (date: DateTime) => {
            handleSelectDay(date);
            closePopover();
        },
        [handleSelectDay, closePopover]
    );

    return (
        <PopoverWrapper id={id} position={position} offset={offset} tooltip={tooltip} bindCloseFunction={bindCloseFunction}>
            <DatePicker
                selectedDay={selectedDay}
                blockPast={blockPast}
                blockFuture={blockFuture}
                blockToday={blockToday}
                handleSelectDay={handleSelectDateAndClose}
            />
        </PopoverWrapper>
    );
};

export default DatePickerPopover;
