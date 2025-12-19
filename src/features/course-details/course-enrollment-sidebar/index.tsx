import { Turnstile } from '@marsidev/react-turnstile';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Text, TextField, View } from 'reshaped';
import { withMask } from 'use-mask-input';
import { formatPrice } from '@/packages/utils';
import { CourseLocationSelector } from '../course-location-selector';
import type { CourseDetails } from '../types';
import styles from './styles.module.scss';

export type CourseEnrollmentSidebarProps = {
  course: CourseDetails;
  selectedModalityId: number | null;
  selectedUnitId?: number;
  selectedPeriodId?: number | null;
  selectedAdmissionFormCode?: string | null;
};

export function CourseEnrollmentSidebar({
  course,
  selectedModalityId,
  selectedUnitId,
  selectedPeriodId,
  selectedAdmissionFormCode,
}: CourseEnrollmentSidebarProps) {
  // Get offerings for selected modality
  const modalityOfferings = course.offerings.filter(
    (o) => !selectedModalityId || o.modalityId === selectedModalityId,
  );

  // Find the best matching offering based on selections
  const selectedOffering =
    course.offerings.find((o) => {
      const matchesModality =
        !selectedModalityId || o.modalityId === selectedModalityId;
      const matchesUnit = !selectedUnitId || o.unitId === selectedUnitId;
      const matchesPeriod =
        !selectedPeriodId || o.periodId === selectedPeriodId;
      return matchesModality && matchesUnit && matchesPeriod;
    }) || modalityOfferings[0];

  // Get minimum price from available offerings
  const prices = modalityOfferings
    .map((o) => o.price)
    .filter((p): p is number => p !== null && p !== undefined);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  // Get price from Client API if available
  const getClientApiPrice = () => {
    const firstShift = course.enrollment?.shifts?.[0];
    const firstForm = firstShift?.admissionForms?.[0];
    const firstPaymentType = firstForm?.paymentTypes?.[0];
    const firstPaymentOption = firstPaymentType?.paymentOptions?.[0];

    if (firstPaymentOption?.parsed.monthlyPrice) {
      return {
        price: firstPaymentOption.parsed.monthlyPrice,
        priceFrom: firstPaymentOption.parsed.basePrice ?? undefined,
      };
    }
    return null;
  };

  // Get checkout URL based on selected shift and admission form
  const getCheckoutUrl = () => {
    if (!course.enrollment?.shifts) {
      return selectedOffering?.checkoutUrl || '';
    }

    // Find selected shift
    const selectedShift = course.enrollment.shifts.find(
      (shift) => shift.id === selectedPeriodId,
    );

    if (!selectedShift) {
      // Fallback to first shift
      const firstShift = course.enrollment.shifts[0];
      const firstForm = firstShift?.admissionForms?.[0];
      const firstPaymentType = firstForm?.paymentTypes?.[0];
      return (
        firstPaymentType?.checkoutUrl || selectedOffering?.checkoutUrl || ''
      );
    }

    // Find selected admission form
    const selectedForm = selectedShift.admissionForms?.find(
      (form) => form.code === selectedAdmissionFormCode,
    );

    if (!selectedForm) {
      // Fallback to first form in selected shift
      const firstForm = selectedShift.admissionForms?.[0];
      const firstPaymentType = firstForm?.paymentTypes?.[0];
      return (
        firstPaymentType?.checkoutUrl || selectedOffering?.checkoutUrl || ''
      );
    }

    // Get first payment type (usually "Parcela")
    const paymentType = selectedForm.paymentTypes?.[0];
    return paymentType?.checkoutUrl || selectedOffering?.checkoutUrl || '';
  };

  const checkoutUrl = getCheckoutUrl();

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [firstClick, setFirstClick] = useState(false);
  const [turnstileSuccess, setTurnstileSuccess] = useState(false);
  const [formHasTouched, setFormHasTouched] = useState(false);

  const clientApiPrice = getClientApiPrice();
  const isFullNameValid = formData.name.trim().split(/\s+/).length >= 2;
  const nameError = !formData.name.trim()
    ? 'Nome é obrigatório'
    : !isFullNameValid
      ? 'Informe nome e sobrenome'
      : null;
  const isFormValid =
    !nameError && !!formData.email.trim() && !!formData.phone.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!isFormValid) {
          setFormHasTouched(true);
          return;
        }
        if (!turnstileSuccess) {
          setFirstClick(true);
        } else {
          router.push(`https://${checkoutUrl}`);
        }
      }}
    >
      <View className={styles.sidebar}>
        <View className={styles.card}>
          <View className={styles.header}>
            <Text
              as="h3"
              variant="body-3"
              weight="medium"
              className={styles.title}
            >
              Processo seletivo - Inscreva-se agora
            </Text>
          </View>

          <View className={styles.form}>
            <TextField
              name="name"
              placeholder="Nome completo"
              className={styles.field}
              value={formData.name}
              onChange={({ value }) =>
                setFormData({ ...formData, name: value })
              }
              hasError={formHasTouched && !!nameError}
              inputAttributes={{
                required: true,
                pattern: '^\\s*\\S+\\s+\\S+.*$',
                title: 'Informe nome e sobrenome',
                'aria-invalid':
                  formHasTouched && !isFormValid && !formData.name,
              }}
            />

            <Text variant="caption-2" color="critical">
              {formHasTouched && nameError}
            </Text>

            <TextField
              name="email"
              placeholder="E-mail"
              className={styles.field}
              value={formData.email}
              onChange={({ value }) =>
                setFormData({ ...formData, email: value })
              }
              hasError={formHasTouched && !isFormValid && !formData.email}
              inputAttributes={{
                type: 'email',
              }}
            />

            <Text variant="caption-2" color="critical">
              {formHasTouched &&
                !isFormValid &&
                !formData.email &&
                'E-mail é obrigatório'}
            </Text>

            <TextField
              name="phone"
              placeholder="Celular"
              className={styles.field}
              value={formData.phone}
              hasError={formHasTouched && !isFormValid && !formData.phone}
              onChange={({ value }) =>
                setFormData({ ...formData, phone: value })
              }
              inputAttributes={{
                ref: withMask('(99) 99999-9999'),
                placeholder: 'Celular',
              }}
            />

            <Text variant="caption-2" color="critical">
              {formHasTouched &&
                !isFormValid &&
                !formData.phone &&
                'Celular é obrigatório'}
            </Text>
          </View>

          {(clientApiPrice || minPrice) && (
            <View className={styles.priceSection}>
              <Text variant="caption-1" className={styles.priceLabel}>
                A partir de:
              </Text>
              <View className={styles.priceRow}>
                <Text
                  variant="featured-2"
                  weight="bold"
                  className={styles.price}
                >
                  {formatPrice(clientApiPrice?.price || minPrice || 0)}
                </Text>
                <Text
                  variant="body-3"
                  color="neutral-faded"
                  className={styles.priceNote}
                >
                  | Mensais
                </Text>
              </View>
              {clientApiPrice?.priceFrom &&
                clientApiPrice.priceFrom !== clientApiPrice.price && (
                  <Text
                    variant="caption-2"
                    color="neutral-faded"
                    className={styles.originalPrice}
                  >
                    De: {formatPrice(clientApiPrice.priceFrom)}
                  </Text>
                )}
            </View>
          )}

          {firstClick && (
            <Turnstile
              siteKey="1x00000000000000000000AA"
              onSuccess={() => setTurnstileSuccess(true)}
            />
          )}

          <Button
            color="primary"
            fullWidth
            type="submit"
            className={styles.submitButton}
            disabled={!turnstileSuccess && firstClick}
          >
            Inscrever-se
          </Button>
        </View>

        {selectedOffering && (
          <CourseLocationSelector unit={selectedOffering.unit} />
        )}
      </View>
    </form>
  );
}
