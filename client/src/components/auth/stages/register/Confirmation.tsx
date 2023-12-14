import { FC } from 'react';
import Title from '../../common/Title';
import styles from './confirmation.module.scss';
import TextInput from '../../common/TextInput';
import ContinueButton from '../../common/ContinueButton';

interface IConfirmationProps {
    email: string;
    verificationCode: string | undefined;
    handleVerificationCodeChange: (value: string) => void;
    handleSubmit: () => void;
}

const Confirmation: FC<IConfirmationProps> = ({ email, verificationCode, handleVerificationCodeChange, handleSubmit }) => {
    return (
        <>
            <Title text="Confirm your email address" />
            <p className={styles.text}>
                We have sent an confirmation code to <span className={styles.email}>{email}</span>
            </p>
            <p className={styles.text}>Please enter the code below to continue.</p>
            <TextInput value={verificationCode} placeholder="Confirmation code" handleChange={handleVerificationCodeChange} />
            <ContinueButton handleContinue={handleSubmit} />
        </>
    );
};

export default Confirmation;
