import { FC, useCallback, useMemo, useState } from 'react';
import { DateTime } from 'luxon';

import ModalCard from '@/components/common/modal-card/ModalCard';
import EventMetadataField, { EEventMetadataFieldType } from './MetadataField';

import { usePlan } from '../PlanProvider';
import { ModalState } from '@/hooks/common/useModal';

import { ICONS } from '@/assets/icons';
import { capitalize } from '@/lib/string.utils';
import { createToast } from '@/lib/toast/toast.utils';

import styles from './copy-day-modal.module.scss';

const CalendarIcon = ICONS.common.planner;
const WarningIcon = ICONS.common.warning;

interface ICopyEventModalProps {
    state: ModalState;
    handleCloseModal: () => void;
}

const CopyEventModal: FC<ICopyEventModalProps> = ({ state, handleCloseModal }) => {
    const { selectedDay, handleCopyDay } = usePlan();

    const originDate = useMemo(() => DateTime.fromISO(selectedDay.date), [selectedDay.date]);
    const [targetDate, setTargetDate] = useState<DateTime>();
    const [excludedEvents, setExcludedEvents] = useState<string[]>([]);

    const [isCopyLoading, setIsCopyLoading] = useState(false);

    const handleSelectTargetDate = useCallback((date: DateTime) => {
        setTargetDate(date);
    }, []);

    const handleToggleEvent = useCallback(
        (eventId: string) => () => {
            setExcludedEvents((prev) => {
                if (prev.includes(eventId)) {
                    return prev.filter((e) => e !== eventId);
                }

                return [...prev, eventId];
            });
        },
        []
    );

    const handleCopyClick = useCallback(async () => {
        if (!targetDate) {
            return;
        }

        setIsCopyLoading(true);

        try {
            await handleCopyDay(targetDate, excludedEvents);
            handleCloseModal();
        } catch (err: any) {
            createToast('error', err.message);
        }

        setIsCopyLoading(false);
    }, [handleCopyDay, targetDate, excludedEvents, handleCloseModal]);

    if (!selectedDay?.date) return null;

    return (
        <ModalCard
            title="Copy Events"
            state={state}
            blurBackground={true}
            buttons={[
                {
                    text: 'Copy',
                    type: 'primary',
                    loadingText: 'Copying…',
                    disabled: !targetDate || excludedEvents.length === selectedDay.events.length,
                    isLoading: isCopyLoading,
                    onClick: handleCopyClick
                },
                {
                    text: 'Cancel',
                    type: 'secondary',
                    onClick: handleCloseModal
                }
            ]}
            handleCloseModal={handleCloseModal}
        >
            <section className={styles.body}>
                <p className={styles.warning}>
                    <WarningIcon /> This will <span className={styles.strong}>overwrite any coinciding events</span> on the target day.
                </p>
                <div className={styles.divider} />
                <ul className={styles.fields}>
                    <EventMetadataField
                        type={EEventMetadataFieldType.DATE}
                        icon={<CalendarIcon className={styles.originIcon} />}
                        label="Origin Day"
                        labelWidth={6.5}
                        selectedDate={originDate}
                        popoverId="popover-origin-date"
                        disabled={true}
                    />
                    <EventMetadataField
                        type={EEventMetadataFieldType.DATE}
                        icon={<CalendarIcon className={styles.targetIcon} />}
                        label="Target Day"
                        labelWidth={6.5}
                        selectedDate={targetDate}
                        popoverId="popover-target-date"
                        handleSelectDate={handleSelectTargetDate}
                    />
                </ul>
                <div className={styles.divider} />
                <ul className={styles.events}>
                    {selectedDay?.events.map((event, index) => (
                        <li key={index} className={styles.event} data-type={event.type}>
                            <div className={styles.checkbox}>
                                <input type="checkbox" id={event._id} checked={!excludedEvents.includes(event._id)} />
                                <button onClick={handleToggleEvent(event._id)}>
                                    <svg viewBox="0 0 24 24">
                                        <polyline points="4 12 9 17 20 6"></polyline>
                                    </svg>
                                </button>
                                <label htmlFor={event._id}>{capitalize(event.type)}</label>
                            </div>
                            <p className={styles.items}>
                                {event.items.map((item, index, arr) => (
                                    <>
                                        <span key={index}>{item.name}</span>
                                        {index < arr.length - 1 && <span className={styles.split}>|</span>}
                                    </>
                                ))}
                            </p>
                        </li>
                    ))}
                </ul>
            </section>
        </ModalCard>
    );
};

export default CopyEventModal;
