import { FC, useCallback } from 'react';
import { CredentialProvider, OAuthProvider } from '@thymecard/types';
import { sendRequest } from '@/lib/api/sendRequest';
import { ICONS } from '@/assets/icons';
import { capitalize } from '@/lib/string.utils';
import styles from './oauth-button.module.scss';

const OAUTH_ICONS = {
    [CredentialProvider.GOOGLE]: ICONS.auth.google,
    [CredentialProvider.FACEBOOK]: ICONS.auth.facebook
} as const;

interface IOAuthButtonProps {
    provider: OAuthProvider;
}

const OAuthButton: FC<IOAuthButtonProps> = ({ provider }) => {
    const Icon = OAUTH_ICONS[provider];

    const handleOAuth = useCallback(async () => {
        try {
            const { data } = await sendRequest(`/auth/oauth/${provider.toLocaleLowerCase()}`, 'GET');

            window.location.href = data.url;
        } catch (err) {
            console.error(err);
        }
    }, [provider]);

    return (
        <button className={styles.button} data-provider={provider} onClick={handleOAuth}>
            <Icon /> <p>Continue with {capitalize(provider)}</p>
        </button>
    );
};

export default OAuthButton;
