import * as Yup from "yup";

const createValidationSchema = (translations: any) => Yup.object({
  name: Yup.string().required(translations.storeUpdate.form.storeName.label),
  website: Yup.string().url(translations.storeUpdate.toast.invalidSubdomain).required(translations.storeUpdate.form.website.label),
  email: Yup.string().email(translations.storeUpdate.toast.invalidEmail).required(translations.storeUpdate.form.email.label),
  mobileWallet: Yup.string()
    .matches(/^(?:\+2)?(010|011|012|015)[0-9]{8}$/, translations.storeUpdate.toast.invalidPhone)
    .required(translations.storeUpdate.form.mobileWallet.label),
});

export default createValidationSchema;