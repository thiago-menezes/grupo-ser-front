import { Loader } from 'reshaped';
import styles from './styles.module.scss';

export const Loading = () => {
  return (
    <div className={styles.container}>
      <Loader size="large" ariaLabel="Carregando" />
    </div>
  );
};
