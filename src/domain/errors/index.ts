import { HttpErrors } from './http-errors';
import { AuthErrors } from './auth-errors';

export const ErrorDefinitions = {
  ...HttpErrors,
  ...AuthErrors,
} as const;

export type ErrorDefinition =
  (typeof ErrorDefinitions)[keyof typeof ErrorDefinitions];
