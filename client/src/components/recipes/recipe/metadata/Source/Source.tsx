import { FC } from 'react';
import { useRecipe } from '../../RecipeProvider';
import styles from './source.module.scss';

const Source: FC = () => {
    const { isEditing } = useRecipe();

    return isEditing ? <EditView /> : <DisplayView />;
};

export default Source;

const EditView: FC = () => {
    const { source } = useRecipe();

    return <input className={styles.edit} value={source.edit} placeholder="Recipe source URL" onChange={source.handleChange} />;
};

const DisplayView: FC = () => {
    const { recipe } = useRecipe();

    if (!recipe) {
        return null;
    }

    const baseDomain = recipe.source?.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];

    return (
        <a className={styles.display} href={recipe.source} target="_blank" data-has-author={!!recipe.authors}>
            {baseDomain}
        </a>
    );
};
