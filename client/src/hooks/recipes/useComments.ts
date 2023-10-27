import { Client, IRecipeComment } from '@sirona/types';
import { compare } from '@sirona/utils';
import { useState } from 'react';
import useUser from '../user/useUser';

const useComments = () => {
    const { user } = useUser();

    const [initial, setInitial] = useState<Client<IRecipeComment>[] | undefined>();
    const [edit, setEdit] = useState<Client<IRecipeComment>[] | undefined>();

    const init = (comments: Client<IRecipeComment>[] | undefined) => {
        setInitial(
            comments ?? [
                {
                    userId: user.id,
                    comment: '',
                    createdAt: new Date().toISOString()
                }
            ]
        );
        setEdit(
            comments ?? [
                {
                    userId: user.id,
                    comment: '',
                    createdAt: new Date().toISOString()
                }
            ]
        );
    };

    const validate = (): { update: Client<IRecipeComment>[] | undefined; isModified: boolean } => {
        const isModified = !compare(initial, edit);

        const update = edit?.length ? edit : undefined;

        return {
            update,
            isModified
        };
    };

    const add = () => {
        const newComment: Client<IRecipeComment> = {
            userId: user.id,
            comment: '',
            createdAt: new Date().toISOString()
        };

        setEdit([...(edit || []), newComment]);
    };

    const update = (update: string, index: number) => {
        const newComments = [...(edit || [])];
        newComments[index].comment = update;

        setEdit(newComments);
    };

    const remove = (index: number) => () => {
        const newComments = [...(edit || [])];
        newComments.splice(index, 1);

        setEdit(newComments);
    };

    return {
        initial,
        edit,
        init,
        validate,
        add,
        update,
        remove
    };
};

export default useComments;
