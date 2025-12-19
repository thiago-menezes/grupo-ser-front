import { Loader } from 'reshaped';

const LoadingPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
        height: '80vh',
      }}
    >
      <Loader size="large" ariaLabel="Carregando" />
    </div>
  );
};

export default LoadingPage;
