import { FC, useCallback, useState } from 'react';
import { useToggle } from '@mantine/hooks';
import Title from '../../common/Title';
import TextInput from '../../common/TextInput';
import ContinueButton from '../../common/ContinueButton';
import styles from './password.module.scss';
import { isDefined } from '@thymecard/types';

interface IPasswordProps {
    email: string | undefined;
    password: string | undefined;
    handleReverse: () => void;
    handlePasswordChange: (value: string) => void;
    handleContinue: () => void;
}

const Password: FC<IPasswordProps> = ({ email, password, handleReverse, handlePasswordChange, handleContinue }) => {
    const [isPasswordVisible, toggleIsPasswordVisible] = useToggle([false, true]);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [hasTouchedConfirmPassword, setHasTouchedConfirmPassword] = useState(false);

    const isMatching = confirmPassword !== password;

    const hasLength = isDefined(password) && password.length >= 8;
    const hasNumber = isDefined(password) && /[0-9]/.test(password);
    const hasUppercase = isDefined(password) && /[A-Z]/.test(password);
    const hasSpecialCharacter = isDefined(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const canContinue = hasLength && hasNumber && hasUppercase && hasSpecialCharacter && !isMatching;

    const handleConfirmPasswordChange = useCallback((value: string) => {
        setConfirmPassword(value);
    }, []);

    const handleConfirmPasswordBlur = useCallback(() => {
        setHasTouchedConfirmPassword(true);
    }, []);

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
            <Title text="Choose a password" />
            <TextInput value={email} disabled={true} placeholder="Your email address" buttonText="Edit" buttonAction={handleReverse} />
            <TextInput
                value={password}
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Your password"
                autoComplete={false}
                buttonText={isPasswordVisible ? 'Hide' : 'Show'}
                buttonAction={toggleIsPasswordVisible}
                handleChange={handlePasswordChange}
                handleKeyDown={handleKeyDown}
            />
            <TextInput
                value={confirmPassword}
                error={hasTouchedConfirmPassword && isMatching}
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Confirm your password"
                autoComplete={false}
                buttonText={isPasswordVisible ? 'Hide' : 'Show'}
                buttonAction={toggleIsPasswordVisible}
                handleChange={handleConfirmPasswordChange}
                handleBlur={handleConfirmPasswordBlur}
                handleKeyDown={handleKeyDown}
            />
            <ContinueButton disabled={!canContinue} handleContinue={handleContinue} />
            <div className={styles.requirements}>
                <p>Your password must contain:</p>
                <ul>
                    <li data-met={hasLength}>•{'   '}At least 8 characters</li>
                    <li data-met={hasNumber}>•{'   '}At least 1 number</li>
                    <li data-met={hasUppercase}>•{'   '}At least 1 uppercase letter</li>
                    <li data-met={hasSpecialCharacter}>•{'   '}At least 1 special character</li>
                </ul>
            </div>
        </>
    );
};

export default Password;
