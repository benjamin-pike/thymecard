import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import AuthSection from './common/AuthSection';
import PersonalDetails from './stages/register/PersonalDetails';

import { UserGender, isNumber, parseIntOrUndefined } from '@thymecard/types';
import { sendRequest } from '@/lib/api/sendRequest';
import { createToast } from '@/lib/toast/toast.utils';
import useUser from '@/hooks/user/useUser';

const PartialRegister = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const { loginUser } = useUser();

    const [credentialId] = useState<string | undefined>(queryParams.get('credentialId') ?? undefined);

    // User fields
    const [image, setImage] = useState<Blob | undefined>();
    const [firstName, setFirstName] = useState<string | undefined>(queryParams.get('firstName') ?? undefined);
    const [lastName, setLastName] = useState<string | undefined>(queryParams.get('lastName') ?? undefined);
    const [dateOfBirth, setDateOfBirth] = useState<DateTime | undefined>(undefined);
    const [gender, setGender] = useState<UserGender | undefined>();
    const [height, setHeight] = useState<number | undefined>();
    const [weight, setWeight] = useState<number | undefined>();

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
            <AuthSection stage={1}>
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
        </>
    );
};

export default PartialRegister;
