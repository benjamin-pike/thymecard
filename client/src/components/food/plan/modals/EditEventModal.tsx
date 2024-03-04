import { FC, useCallback, useMemo, useState } from 'react';

import EventMetadataField, { EEventMetadataFieldType } from './MetadataField';
import EventItems from './EventItems';
import ModalCard from '@/components/common/modal-card/ModalCard';
import DropdownWrapper from '@/components/wrappers/dropdown/DropdownWrapper';

import { useDay } from '@/hooks/plan/useDay';
import { usePlan } from '../PlanProvider';
import { useDropdown } from '@/hooks/common/useDropdown';
import { ModalState } from '@/hooks/common/useModal';

import { EEventType, isMealEvent } from '@thymecard/types';
import { ICONS } from '@/assets/icons';
import { capitalize } from '@/lib/string.utils';
import { createToast } from '@/lib/toast/toast.utils';
import { compare, hoursAndMinsToMins, minsToHoursAndMins } from '@thymecard/utils';

import styles from './edit-event-modal.module.scss';

const DropdownIcon = ICONS.common.dropdown;
const TimeIcon = ICONS.common.time;
const DurationIcon = ICONS.common.duration;

interface IEditEventModalProps {
    state: ModalState;
    handleCloseModal: () => void;
}

const MEAL_TYPES = Object.values(EEventType).filter((type) => type !== EEventType.ACTIVITY);

const EditEventModal: FC<IEditEventModalProps> = ({ state, handleCloseModal }) => {
    const { selectedDay, selectedEvent, handleUpdateEvent: updateEvent } = usePlan();

    if (!selectedEvent) {
        throw new Error('No event selected');
    }

    const { date } = selectedDay;
    const { _id: eventId, type, time: timeM, duration: durationM } = selectedEvent ?? {};

    const time = minsToHoursAndMins(timeM);
    const duration = minsToHoursAndMins(durationM);

    // FIXME: This is a temporary fix – meal and activity events need to be more appropriately segregated
    const items = useMemo(() => (isMealEvent(selectedEvent) ? selectedEvent.items : []), [selectedEvent]);

    const {
        selectedType,
        selectedTime,
        selectedDuration,
        selectedItems,
        handleSelectEventType,
        handleUpdateEventTime,
        handleUpdateEventDuration,
        handleAddItem,
        handleRemoveItem,
        handleNameChange,
        handleCaloriesChange,
        handleServingsChange,
        handleLinkRecipe
    } = useDay({ type, time, duration, items });

    const [isUpdateLoading, setIsUpdateLoading] = useState(false);

    const { bindCloseFunction, closeDropdown: closeEventTypeDropdown } = useDropdown();

    const handleSelectEventAndCloseDropdown = useCallback(
        (type: EEventType) => () => {
            handleSelectEventType(type);
            closeEventTypeDropdown();
        },
        [handleSelectEventType, closeEventTypeDropdown]
    );

    const handleUpdateEvent = useCallback(async () => {
        if (!selectedType || !selectedTime || !selectedDuration || !selectedItems.length) {
            return;
        }

        setIsUpdateLoading(true);

        const selectedTimeM = hoursAndMinsToMins(selectedTime);
        const selectedDurationM = hoursAndMinsToMins(selectedDuration);

        const isTypeChanged = type !== selectedType;
        const isTimeChanged = timeM !== selectedTimeM;
        const isDurationChanged = durationM !== selectedDurationM;
        const isItemsChanged = !compare(items, selectedItems);

        if (!isTypeChanged && !isTimeChanged && !isDurationChanged && !isItemsChanged) {
            createToast('info', 'No changes detected');

            setIsUpdateLoading(false);

            handleCloseModal();
            return;
        }

        try {
            await updateEvent(date, eventId, {
                type: isTypeChanged ? selectedType : undefined,
                time: isTimeChanged ? selectedTimeM : undefined,
                duration: isDurationChanged ? selectedDurationM : undefined,
                items: isItemsChanged ? selectedItems : undefined
            });

            setIsUpdateLoading(false);

            createToast('success', 'Event updated successfully');

            handleCloseModal();
        } catch (err: any) {
            createToast('error', err.message);
        }
    }, [
        selectedType,
        selectedTime,
        selectedDuration,
        selectedItems,
        type,
        timeM,
        durationM,
        items,
        handleCloseModal,
        updateEvent,
        date,
        eventId
    ]);

    const isComplete = selectedType && selectedTime && selectedDuration && selectedItems.length;

    return (
        <ModalCard
            state={state}
            blurBackground={true}
            title="Edit Event"
            buttons={[
                {
                    text: 'Save Changes',
                    type: 'primary',
                    loadingText: 'Saving…',
                    disabled: !isComplete,
                    isLoading: isUpdateLoading,
                    onClick: handleUpdateEvent
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
                                <button onClick={handleSelectEventAndCloseDropdown(type)}>{capitalize(type)}</button>
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

export default EditEventModal;
