/**
 * Concatène des classes CSS en filtrant les valeurs falsy.
 * Alternative légère à clsx / tailwind-merge.
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatPrice(amount: number, currency = 'EUR', locale = 'fr-FR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
