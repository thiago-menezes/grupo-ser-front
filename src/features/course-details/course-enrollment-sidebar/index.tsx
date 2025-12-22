'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { Button, Text, TextField, View } from 'reshaped';
import { withMask } from 'use-mask-input';
import { formatPrice } from '@/utils';
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

const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
  '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

function CourseEnrollmentSidebarContent({
  course,
  selectedModalityId,
  selectedUnitId,
  selectedPeriodId,
  selectedAdmissionFormCode,
}: CourseEnrollmentSidebarProps) {
  const { executeRecaptcha } = useGoogleReCaptcha();

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formHasTouched, setFormHasTouched] = useState(false);

  const clientApiPrice = getClientApiPrice();

  // Name validation
  const isFullNameValid = formData.name.trim().split(/\s+/).length >= 2;
  const nameError = !formData.name.trim()
    ? 'Nome é obrigatório'
    : !isFullNameValid
      ? 'Informe nome e sobrenome'
      : null;

  // Phone validation - mask (99) 99999-9999 produces 15 characters when complete
  const isPhoneComplete = formData.phone.replace(/\D/g, '').length >= 11;
  const phoneError = !formData.phone.trim()
    ? 'Celular é obrigatório'
    : !isPhoneComplete
      ? 'Informe o telefone completo'
      : null;

  const isFormValid = !nameError && !phoneError && !!formData.email.trim();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isFormValid) {
        setFormHasTouched(true);
        return;
      }

      if (!executeRecaptcha) {
        console.error('reCAPTCHA not loaded');
        return;
      }

      setIsSubmitting(true);

      try {
        // Execute reCAPTCHA verification
        const token = await executeRecaptcha('enrollment_form');

        if (token) {
          // reCAPTCHA passed, redirect to checkout
          router.push(`https://${checkoutUrl}`);
        }
      } catch (error) {
        console.error('reCAPTCHA error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isFormValid, executeRecaptcha, checkoutUrl, router],
  );

  return (
    <form onSubmit={handleSubmit}>
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
              hasError={formHasTouched && !!phoneError}
              onChange={({ value }) =>
                setFormData({ ...formData, phone: value })
              }
              inputAttributes={{
                ref: withMask('(99) 99999-9999'),
                placeholder: 'Celular',
              }}
            />

            <Text variant="caption-2" color="critical">
              {formHasTouched && phoneError}
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

          <Button
            color="primary"
            fullWidth
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verificando...' : 'Inscrever-se'}
          </Button>
        </View>

        {selectedOffering && (
          <CourseLocationSelector unit={selectedOffering.unit} />
        )}
      </View>
    </form>
  );
}

export function CourseEnrollmentSidebar(props: CourseEnrollmentSidebarProps) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <CourseEnrollmentSidebarContent {...props} />
    </GoogleReCaptchaProvider>
  );
}
