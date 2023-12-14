import { FC } from 'react';
import { useToggle } from '@mantine/hooks';
import Title from '../../common/Title';
import TextInput from '../../common/TextInput';
import ContinueButton from '../../common/ContinueButton';
import styles from './password.module.scss';

interface IPasswordProps {
    email: string | undefined;
    password: string | undefined;
    handleReverse: () => void;
    handlePasswordChange: (value: string) => void;
    handleLogin: () => void;
}

const Password: FC<IPasswordProps> = ({ email, password, handleReverse, handlePasswordChange, handleLogin }) => {
    const [isPasswordVisible, toggleIsPasswordVisible] = useToggle([false, true]);

    return (
        <>
            <Title text="Enter your password" />
            <TextInput value={email} disabled={true} placeholder="Your email address" buttonText="Edit" buttonAction={handleReverse} />
            <TextInput
                value={password}
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Your password"
                buttonText={isPasswordVisible ? 'Hide' : 'Show'}
                buttonAction={toggleIsPasswordVisible}
                handleChange={handlePasswordChange}
            />
            <ContinueButton handleContinue={handleLogin} />
            <p className={styles.forgottenPassword}>
                <a>I have forgotten my password</a>
            </p>
        </>
    );
};

export default Password;
