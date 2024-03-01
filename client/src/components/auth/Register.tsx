import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import useUser from '@/hooks/user/useUser';

import AuthSection from './common/AuthSection';
import Welcome from './stages/register/Welcome';
import Password from './stages/register/Password';
import PersonalDetails from './stages/register/PersonalDetails';
import Confirmation from './stages/register/Confirmation';

import { UserGender, isNumber, parseIntOrUndefined } from '@thymecard/types';
import { sendRequest } from '@/lib/api/sendRequest';
import { createToast } from '@/lib/toast/toast.utils';

const Register = () => {
    const navigate = useNavigate();
    const { loginUser } = useUser();

    // Credential fields
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>('');
    const [credentialId, setCredentialId] = useState<string | undefined>();
    const [verificationCode, setVerificationCode] = useState<string | undefined>();

    // User fields
    const [image, setImage] = useState<Blob | undefined>();
    const [firstName, setFirstName] = useState<string | undefined>();
    const [lastName, setLastName] = useState<string | undefined>();
    const [dateOfBirth, setDateOfBirth] = useState<DateTime | undefined>(undefined);
    const [gender, setGender] = useState<UserGender | undefined>();
    const [height, setHeight] = useState<number | undefined>();
    const [weight, setWeight] = useState<number | undefined>();

    const [stage, setStage] = useState<number>(1);
    const [currentTransition, setCurrentTransition] = useState<[number, number] | undefined>();

    const handleEmailChange = useCallback((value: string) => {
        setEmail(value);
    }, []);

    const handlePasswordChange = useCallback((value: string) => {
        setPassword(value);
    }, []);

    const handleVerificationCodeChange = useCallback((value: string) => {
        setVerificationCode(value);
    }, []);

    const handleImageSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const file = e.target.files[0];

        if (!file) {
            return;
        }

        const blob = new Blob([file], { type: file.type });

        setImage(blob);
    }, []);

    const handleFirstNameChange = useCallback((value: string) => {
        setFirstName(value);
    }, []);

    const handleLastNameChange = useCallback((value: string) => {
        setLastName(value);
    }, []);

    const handleDateOfBirthChange = useCallback((value: string) => {
        if (!value) {
            setDateOfBirth(undefined);
            return;
        }

        const date = DateTime.fromFormat(value, 'yyyy-MM-dd');
        setDateOfBirth(date);
    }, []);

    const handleSelectDateOfBirth = useCallback((date: DateTime) => {
        setDateOfBirth(date);
    }, []);

    const handleGenderChange = useCallback(
        (gender: UserGender) => () => {
            setGender(gender);
        },
        []
    );

    const handleNumberFieldBlur = useCallback((value: string, min?: number, max?: number) => {
        const parsedValue = parseIntOrUndefined(value);

        if (!isNumber(parsedValue)) {
            return undefined;
        }

        if (max && parsedValue > max) {
            return max;
        }

        if (min && parsedValue < min) {
            return min;
        }

        return parsedValue;
    }, []);

    const handleHeightBlur = useCallback(
        (value: string, min?: number, max?: number) => {
            setHeight(handleNumberFieldBlur(value, min, max));
        },
        [handleNumberFieldBlur]
    );

    const handleWeightBlur = useCallback(
        (value: string, min?: number, max?: number) => {
            setWeight(handleNumberFieldBlur(value, min, max));
        },
        [handleNumberFieldBlur]
    );

    const handleContinue = useCallback(() => {
        setCurrentTransition([stage, stage + 1]);

        setTimeout(() => {
            setStage(stage + 1);
        }, 300);

        setTimeout(() => {
            setCurrentTransition(undefined);
        }, 600);
    }, [stage]);

    const handleReverse = useCallback(() => {
        setPassword(undefined);
        setCurrentTransition([stage, stage - 1]);

        setTimeout(() => {
            setStage(stage - 1);
        }, 300);

        setTimeout(() => {
            setCurrentTransition(undefined);
        }, 600);
    }, [stage]);

    // API calls
    const { mutateAsync: callCreateCredential } = useMutation(
        async () => {
            const url = '/auth/credential';
            const method = 'POST';

            const { status, data } = await sendRequest(url, method, {
                body: {
                    email,
                    password
                }
            });

            if (status === 409) {
                throw new Error('This email is already registered');
            }

            if (status !== 201) {
                throw new Error('Failed to create credential');
            }

            return data;
        },
        {
            onSuccess: (data) => {
                setCredentialId(data.id);
            },
            onError: (err: any) => {
                createToast('error', err.message);
            }
        }
    );

    const handleCreateCredential = useCallback(async () => {
        await callCreateCredential();
        handleContinue();
    }, [callCreateCredential, handleContinue]);

    const { mutateAsync: callVerifyCredential } = useMutation(
        async () => {
            const url = `/auth/credential/${credentialId}/verify`;
            const method = 'PUT';

            const { status, data } = await sendRequest(url, method, {
                body: {
                    email,
                    password,
                    verificationCode
                }
            });

            if (status !== 204) {
                throw new Error('Failed to verify credential');
            }

            return data;
        },
        {
            onError: (err: any) => {
                createToast('error', err.message);
            }
        }
    );

    const handleVerifyCredential = useCallback(async () => {
        await callVerifyCredential();

        handleContinue();
    }, [callVerifyCredential, handleContinue]);

    const { mutateAsync: callCreateUser } = useMutation(
        async (payload: FormData) => {
            const url = '/users';
            const method = 'POST';

            const { status, data } = await sendRequest(url, method, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                query: {
                    credentialId
                },
                body: payload
            });

            if (status === 409) {
                throw new Error('This email is already registered');
            }

            if (status !== 201) {
                throw new Error('Failed to create user');
            }

            return data;
        },
        {
            onSuccess: (data) => {
                const { user, session } = data;

                loginUser({
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        email: user.email,
                        image: user.image
                    },
                    sessionId: session.id
                });

                navigate('/dashboard');
            },
            onError: (err: any) => {
                createToast('error', err.message);
            }
        }
    );

    const handleCreateUser = useCallback(async () => {
        const formData = new FormData();

        const data = {
            firstName,
            lastName,
            dob: dateOfBirth,
            gender,
            height,
            weight
        };

        formData.append('data', JSON.stringify(data));

        if (image) {
            formData.append('image', image);
        }

        await callCreateUser(formData);
    }, [callCreateUser, dateOfBirth, firstName, gender, height, image, lastName, weight]);

    return (
        <>
            {stage === 1 && (
                <AuthSection stage={stage} currentTransition={currentTransition}>
                    <Welcome email={email} handleContinue={handleContinue} handleEmailChange={handleEmailChange} />
                </AuthSection>
            )}
            {stage === 2 && (
                <AuthSection stage={stage} currentTransition={currentTransition}>
                    <Password
                        email={email}
                        password={password}
                        handleReverse={handleReverse}
                        handlePasswordChange={handlePasswordChange}
                        handleContinue={handleCreateCredential}
                    />
                </AuthSection>
            )}
            {stage === 3 && (
                <AuthSection stage={stage} currentTransition={currentTransition}>
                    <Confirmation
                        email={email ?? ''}
                        verificationCode={verificationCode}
                        handleVerificationCodeChange={handleVerificationCodeChange}
                        handleSubmit={handleVerifyCredential}
                    />
                </AuthSection>
            )}
            {stage === 4 && (
                <AuthSection stage={stage} currentTransition={currentTransition}>
                    <PersonalDetails
                        image={image}
                        firstName={firstName}
                        lastName={lastName}
                        dateOfBirth={dateOfBirth}
                        gender={gender}
                        height={height}
                        weight={weight}
                        handleImageSelect={handleImageSelect}
                        handleFirstNameChange={handleFirstNameChange}
                        handleLastNameChange={handleLastNameChange}
                        handleDateOfBirthChange={handleDateOfBirthChange}
                        handleSelectDateOfBirth={handleSelectDateOfBirth}
                        handleGenderChange={handleGenderChange}
                        handleHeightBlur={handleHeightBlur}
                        handleWeightBlur={handleWeightBlur}
                        handleSubmit={handleCreateUser}
                    />
                </AuthSection>
            )}
        </>
    );
};

export default Register;
