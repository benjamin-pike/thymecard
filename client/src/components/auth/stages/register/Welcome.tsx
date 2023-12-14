import { FC, useCallback } from 'react';
import Title from '../../common/Title';
import TextInput from '../../common/TextInput';
import ContinueButton from '../../common/ContinueButton';
import OAuthButton from '../../common/OAuthButton';
import { CredentialProvider, isValidEmail } from '@thymecard/types';
import styles from './welcome.module.scss';
import { Link } from 'react-router-dom';

interface IWelcomeProps {
    email: string | undefined;
    handleContinue: () => void;
    handleEmailChange: (value: string) => void;
}

const Welcome: FC<IWelcomeProps> = ({ email, handleContinue, handleEmailChange }) => {
    const canContinue = isValidEmail(email);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && canContinue) {
                handleContinue();
            }
        },
        [canContinue, handleContinue]
    );

    return (
        <>
            <Title text="Create your account" />
            <TextInput
                value={email}
                type="email"
                placeholder="Please enter you email address"
                handleChange={handleEmailChange}
                handleKeyDown={handleKeyDown}
            />
            <ContinueButton disabled={!canContinue} handleContinue={handleContinue} />
            <p className={styles.orText}>or</p>
            <OAuthButton provider={CredentialProvider.GOOGLE} />
            <OAuthButton provider={CredentialProvider.FACEBOOK} />
            <p className={styles.alternative}>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </>
    );
};

export default Welcome;
