import { FC, useCallback, useState } from 'react';

import ModalCard from '@/components/common/modal-card/ModalCard';

import { usePlan } from '../../providers/PlanProvider';
import { ModalState } from '@/hooks/common/useModal';

import { ICONS } from '@/assets/icons';
import { capitalize } from '@/lib/string.utils';
import { createToast } from '@/lib/toast/toast.utils';

import styles from './clear-events-modal.module.scss';

const WarningIcon = ICONS.common.warning;

interface IClearEventsModalProps {
    state: ModalState;
    handleCloseModal: () => void;
}

const ClearEventsModal: FC<IClearEventsModalProps> = ({ state, handleCloseModal }) => {
    const { selectedDay, handleClearEvents } = usePlan();

    const [excludedEvents, setExcludedEvents] = useState<string[]>(selectedDay?.events.map((e) => e._id) ?? []);

    const [isClearLoading, setIsClearLoading] = useState(false);

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

    const handleClearClick = useCallback(async () => {
        setIsClearLoading(true);

        try {
            await handleClearEvents(excludedEvents);
            handleCloseModal();
        } catch (err: any) {
            createToast('error', err.message);
        }

        setIsClearLoading(false);
    }, [handleClearEvents, excludedEvents, handleCloseModal]);

    if (!selectedDay?.date) return null;

    return (
        <ModalCard
            title="Clear Events"
            state={state}
            blurBackground={true}
            buttons={[
                {
                    text: 'Clear',
                    type: 'primary',
                    loadingText: 'Clearing…',
                    disabled: excludedEvents.length === selectedDay.events.length,
                    isLoading: isClearLoading,
                    onClick: handleClearClick
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
                    <WarningIcon /> Any events selected below will be <span className={styles.strong}>irreversibly removed</span>.
                </p>
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

export default ClearEventsModal;
