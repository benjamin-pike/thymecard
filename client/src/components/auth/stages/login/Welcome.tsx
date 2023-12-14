import { FC } from 'react';
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
    return (
        <>
            <Title text="Welcome back" />
            <TextInput value={email} type="email" placeholder="Your email address" handleChange={handleEmailChange} />
            <ContinueButton disabled={!isValidEmail(email)} handleContinue={handleContinue} />
            <p className={styles.orText}>or</p>
            <OAuthButton provider={CredentialProvider.GOOGLE} />
            <OAuthButton provider={CredentialProvider.FACEBOOK} />
            <p className={styles.alternative}>
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </>
    );
};

export default Welcome;
