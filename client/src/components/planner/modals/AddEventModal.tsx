import { FC, useCallback, useState } from 'react';
import { DateTime } from 'luxon';

import EventMetadataField, { EEventMetadataFieldType } from './MetadataField';
import EventItems from './EventItems';
import ModalCard from '@/components/common/modal-card/ModalCard';
import DropdownWrapper from '@/components/wrappers/dropdown/DropdownWrapper';

import { useDay } from '@/hooks/plan/useDay';
import { usePlan } from '../../providers/PlanProvider';
import { useDropdown } from '@/hooks/common/useDropdown';
import { ModalState } from '@/hooks/common/useModal';

import { Client, EEventType, IMealEventItem } from '@thymecard/types';
import { ICONS } from '@/assets/icons';
import { capitalize } from '@/lib/string.utils';
import { createToast } from '@/lib/toast/toast.utils';
import { minsToHoursAndMins } from '@thymecard/utils';

import styles from './add-event-modal.module.scss';

const DropdownIcon = ICONS.common.dropdown;
const CalendarIcon = ICONS.common.planner;
const TimeIcon = ICONS.common.time;
const DurationIcon = ICONS.common.duration;

interface IAddEventModalProps {
    state: ModalState;
    date: DateTime;
    type?: EEventType;
    time?: number;
    duration?: number;
    items?: Client<IMealEventItem>[];
    handleCloseModal: () => void;
}

const MEAL_TYPES = Object.values(EEventType).filter((type) => type !== EEventType.ACTIVITY);

const AddEventModal: FC<IAddEventModalProps> = ({ state, date, type, time, duration, items, handleCloseModal }) => {
    const { handleCreateEvent: createEvent } = usePlan();
    const {
        selectedType,
        selectedDate,
        selectedTime,
        selectedDuration,
        selectedItems,
        handleSelectEventType,
        handleSelectEventDate,
        handleUpdateEventTime,
        handleUpdateEventDuration,
        handleAddItem,
        handleRemoveItem,
        handleNameChange,
        handleCaloriesChange,
        handleServingsChange,
        handleLinkRecipe
    } = useDay({
        date,
        type: type,
        time: time ?? time ? minsToHoursAndMins(time) : undefined,
        duration: duration ? minsToHoursAndMins(duration) : undefined,
        items: items
    });

    const [isCreateLoading, setIsCreateLoading] = useState(false);

    const { bindCloseFunction, closeDropdown: closeEventTypeDropdown } = useDropdown();

    const handleSelectEventAndCloseDropdown = useCallback(
        (type: EEventType) => () => {
            handleSelectEventType(type);
            closeEventTypeDropdown();
        },
        [handleSelectEventType, closeEventTypeDropdown]
    );

    const handleCreateEvent = useCallback(async () => {
        if (!selectedType || !selectedDate || !selectedTime || !selectedDuration || !selectedItems.length) {
            return;
        }

        setIsCreateLoading(true);

        try {
            await createEvent({
                type: selectedType,
                date: selectedDate,
                time: selectedTime,
                duration: selectedDuration,
                items: selectedItems
            });

            createToast('success', 'Event created successfully');

            handleCloseModal();
        } catch (err: any) {
            createToast('error', err.message);
        }

        setIsCreateLoading(false);
    }, [createEvent, selectedType, selectedDate, selectedTime, selectedDuration, selectedItems, handleCloseModal]);

    const isComplete = selectedType && selectedDate && selectedTime && selectedDuration && selectedItems.length;

    return (
        <ModalCard
            state={state}
            blurBackground={true}
            title="Create Event"
            buttons={[
                {
                    text: 'Create',
                    type: 'primary',
                    loadingText: 'Creating…',
                    disabled: !isComplete,
                    isLoading: isCreateLoading,
                    onClick: handleCreateEvent
                },
                { text: 'Cancel', type: 'secondary', onClick: handleCloseModal }
            ]}
            handleCloseModal={handleCloseModal}
        >
            <section className={styles.body}>
                <ul className={styles.metadata}>
                    <EventMetadataField
                        type={EEventMetadataFieldType.DROPDOWN}
                        icon={<DropdownIcon className={styles.typeIcon} />}
                        label="Type"
                        labelWidth={5.75}
                        selectedOption={selectedType}
                        dropdownId="dropdown-event-type"
                    />
                    <EventMetadataField
                        type={EEventMetadataFieldType.DATE}
                        icon={<CalendarIcon className={styles.dateIcon} />}
                        label="Date"
                        labelWidth={5.75}
                        selectedDate={selectedDate}
                        popoverId="popover-event-date"
                        handleSelectDate={handleSelectEventDate}
                    />
                    <EventMetadataField
                        type={EEventMetadataFieldType.TIME}
                        icon={<TimeIcon className={styles.timeIcon} />}
                        label="Time"
                        labelWidth={5.75}
                        selectedTime={selectedTime}
                        handleUpdateTime={handleUpdateEventTime}
                    />
                    <EventMetadataField
                        type={EEventMetadataFieldType.TIME}
                        icon={<DurationIcon className={styles.durationIcon} />}
                        label="Duration"
                        labelWidth={5.75}
                        selectedTime={selectedDuration}
                        handleUpdateTime={handleUpdateEventDuration}
                    />
                </ul>
                <DropdownWrapper id="dropdown-event-type" position="right" offset={5} bindCloseFunction={bindCloseFunction}>
                    <ul className={styles.dropdown} data-dropdown-type={'event'}>
                        {MEAL_TYPES.map((type) => (
                            <li key={type} data-type={type} data-selected={type === selectedType}>
                                <button onClick={handleSelectEventAndCloseDropdown(type)}>
                                    <p>{capitalize(type)}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </DropdownWrapper>
                <div className={styles.divider} />
                <EventItems
                    items={selectedItems}
                    handleNameChange={handleNameChange}
                    handleCaloriesChange={handleCaloriesChange}
                    handleServingsChange={handleServingsChange}
                    handleLinkRecipe={handleLinkRecipe}
                    handleAddItem={handleAddItem}
                    handleRemoveItem={handleRemoveItem}
                />
                <div className={styles.divider} />
                <section className={styles.notes}>
                    <h3>Notes</h3>
                    <ul></ul>
                    <input className={styles.notes} placeholder="Add notes related to this event…" />
                </section>
            </section>
        </ModalCard>
    );
};

export default AddEventModal;
