import { Button, Divider, View } from 'reshaped';

export type FilterActionsProps = {
  onSubmit: () => void;
  onCancel?: () => void;
};

export function FilterActions({ onSubmit, onCancel }: FilterActionsProps) {
  return (
    <>
      <Divider />

      <View gap={2} direction="row" justify="end">
        {onCancel && (
          <Button variant="outline" color="neutral" onClick={onCancel}>
            Cancelar
          </Button>
        )}

        <Button variant="solid" color="primary" onClick={onSubmit}>
          Aplicar filtros
        </Button>
      </View>
    </>
  );
}
