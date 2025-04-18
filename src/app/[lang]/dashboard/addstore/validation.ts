import * as Yup from "yup";

export const createValidationSchema = (translations: any = {}) => {
  const defaultMessages = {
    storeName: "Store name is required",
    website: {
      required: "Website is required",
      invalid: "Please enter a valid URL"
    },
    email: {
      required: "Email is required",
      invalid: "Please enter a valid email"
    },
    mobileWallet: {
      required: "Mobile wallet is required",
      invalid: "Please enter a valid Egyptian mobile number"
    }
  };

  return Yup.object({
    name: Yup.string().required(
      translations?.storeUpdate?.form?.storeName?.label || defaultMessages.storeName
    ),
    website: Yup.string()
      .url(translations?.storeUpdate?.toast?.invalidSubdomain || defaultMessages.website.invalid)
      .required(translations?.storeUpdate?.form?.website?.label || defaultMessages.website.required),
    email: Yup.string()
      .email(translations?.storeUpdate?.toast?.invalidEmail || defaultMessages.email.invalid)
      .required(translations?.storeUpdate?.form?.email?.label || defaultMessages.email.required),
    mobileWallet: Yup.string()
      .matches(
        /^(?:\+2)?(010|011|012|015)[0-9]{8}$/,
        translations?.storeUpdate?.toast?.invalidPhone || defaultMessages.mobileWallet.invalid
      )
      .required(translations?.storeUpdate?.form?.mobileWallet?.label || defaultMessages.mobileWallet.required),
  });
};