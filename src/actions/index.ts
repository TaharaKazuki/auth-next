import { SignUpSchema, SignUpSchemaType } from '@/config/schema';

export const signUpAction = async (formValues: SignUpSchemaType) => {
  const validateFields = SignUpSchema.safeParse(formValues);
};
