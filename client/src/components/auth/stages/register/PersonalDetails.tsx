import { FC, useCallback, useRef, useState } from 'react';
import Title from '../../common/Title';
import TextInput from '../../common/TextInput';
import ContinueButton from '../../common/ContinueButton';
import styles from './personal-details.module.scss';
import { ICONS } from '@/assets/icons';
import DatePicker from '@/components/common/date-picker/DatePicker';
import { DateTime } from 'luxon';
import DropdownWrapper from '@/components/wrappers/dropdown/DropdownWrapper';
import NumberInput from '../../common/NumberInput';
import { UserGender, isDefined } from '@thymecard/types';
import Tooltip from '@/components/common/tooltip/Tooltip';
import Popover from '@/components/wrappers/popover/Popover';

const PersonIcon = ICONS.common.person;
const CalendarIcon = ICONS.common.calendar;
const ToggleIcon = ICONS.common.chevronLeft;
const MaleIcon = ICONS.common.genderMale;
const FemaleIcon = ICONS.common.genderFemale;
const OtherIcon = ICONS.common.genderOther;

interface IPersonalDetailsProps {
    image: Blob | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    dateOfBirth: DateTime | undefined;
    gender: UserGender | undefined;
    height: number | undefined;
    weight: number | undefined;
    handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFirstNameChange: (value: string) => void;
    handleLastNameChange: (value: string) => void;
    handleDateOfBirthChange: (value: string) => void;
    handleSelectDateOfBirth: (date: DateTime) => void;
    handleGenderChange: (gender: UserGender) => () => void;
    handleHeightBlur: (value: string, min?: number, max?: number) => void;
    handleWeightBlur: (value: string, min?: number, max?: number) => void;
    handleSubmit: () => void;
}

const genderMap: Record<UserGender, string> = {
    [UserGender.MALE]: 'Male',
    [UserGender.FEMALE]: 'Female',
    [UserGender.OTHER]: 'Other'
};

const PersonalDetails: FC<IPersonalDetailsProps> = ({
    image,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    height,
    weight,
    handleImageSelect,
    handleFirstNameChange,
    handleLastNameChange,
    handleDateOfBirthChange,
    handleSelectDateOfBirth,
    handleGenderChange,
    handleHeightBlur,
    handleWeightBlur,
    handleSubmit
}) => {
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [isDateOfBirthFocused, setIsDateOfBirthFocused] = useState(false);
    const [isTermsChecked, setIsTermsChecked] = useState(false);

    const handleAddImageClick = useCallback(() => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    }, []);

    const handleDateOfBirthFocus = useCallback(() => {
        setIsDateOfBirthFocused(true);
    }, []);

    const handleDateOfBirthBlur = useCallback(
        (value: string) => {
            handleDateOfBirthChange(value);
            setIsDateOfBirthFocused(false);
        },
        [handleDateOfBirthChange]
    );

    const handleCheckTerms = useCallback(() => {
        setIsTermsChecked(!isTermsChecked);
    }, [isTermsChecked]);

    const canSubmit =
        isDefined(firstName) &&
        isDefined(lastName) &&
        isDefined(dateOfBirth) &&
        isDefined(gender) &&
        isDefined(height) &&
        isDefined(weight) &&
        isTermsChecked;

    return (
        <>
            <button
                className={styles.image}
                data-tooltip-id="tooltip-register-profile-image"
                data-tooltip-content={`${image ? 'Edit' : 'Add a'} profile picture`}
                onClick={handleAddImageClick}
            >
                {image ? <img src={URL.createObjectURL(image)} /> : <PersonIcon />}
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} />
            </button>
            <Title text="Build your profile" />
            <div className={styles.grid}>
                <TextInput value={firstName} placeholder="First name" handleChange={handleFirstNameChange} />
                <TextInput value={lastName} placeholder="Last name" handleChange={handleLastNameChange} />
                <Popover content={<DatePicker selectedDay={dateOfBirth} handleSelectDay={handleSelectDateOfBirth} blockFuture={true} />}>
                    <TextInput
                        type={isDateOfBirthFocused || !!dateOfBirth ? 'date' : 'text'}
                        value={dateOfBirth?.toFormat('yyyy-MM-dd') ?? undefined}
                        placeholder="Date of birth"
                        buttonIcon={<CalendarIcon />}
                        buttonPopoverId="popover-register-dob"
                        handleChange={handleDateOfBirthChange}
                        handleFocus={handleDateOfBirthFocus}
                        handleBlur={handleDateOfBirthBlur}
                    />
                </Popover>
                <TextInput
                    value={gender ? genderMap[gender] : undefined}
                    disabled={true}
                    placeholder="Gender"
                    buttonIcon={<ToggleIcon className={styles.genderToggle} />}
                    buttonDropdownId="dropdown-register-gender"
                />
                <NumberInput value={height} min={30} max={300} step={1} placeholder="Height (cm)" handleBlur={handleHeightBlur} />
                <NumberInput value={weight} min={5} max={750} step={1} placeholder="Weight (kg)" handleBlur={handleWeightBlur} />
            </div>
            <div className={styles.terms}>
                <input type="checkbox" id="terms" checked={isTermsChecked} />
                <button className={styles.checkbox} onClick={handleCheckTerms}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <polyline points="4 12 9 17 20 6"></polyline>
                    </svg>
                </button>
                <label htmlFor="terms">
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </label>
            </div>
            <ContinueButton disabled={!canSubmit} handleContinue={handleSubmit} />
            <p className={styles.additional}>
                <a>Why do we ask for this?</a>
            </p>
            <div data-theme="dark">
                <Tooltip id="tooltip-register-profile-image" place="right" size="medium" offset={-20} />
                <DropdownWrapper id="dropdown-register-gender" position="left" offset={20}>
                    <ul className={styles.genderSelect}>
                        <li data-selected={gender === UserGender.MALE}>
                            <button onClick={handleGenderChange(UserGender.MALE)}>
                                Male <MaleIcon />
                            </button>
                        </li>
                        <li data-selected={gender === UserGender.FEMALE}>
                            <button onClick={handleGenderChange(UserGender.FEMALE)}>
                                Female <FemaleIcon />
                            </button>
                        </li>
                        <li data-selected={gender === UserGender.OTHER}>
                            <button onClick={handleGenderChange(UserGender.OTHER)}>
                                Other <OtherIcon />
                            </button>
                        </li>
                    </ul>
                </DropdownWrapper>
            </div>
        </>
    );
};

export default PersonalDetails;
