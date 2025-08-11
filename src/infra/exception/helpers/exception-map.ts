import { ValidationError } from 'class-validator';

export const exceptionsMap = (
  validationErrors: Array<ValidationError> = [],
): Record<string, any> => {
  return validationErrors.map(({ constraints, property, children }) => {
    const errorMessages = {};

    if (constraints)
      errorMessages[property] = Object.keys(constraints).map(
        (key) => constraints[key],
      );

    if (children)
      Object.assign(errorMessages, childrenExceptions(children, property));

    return errorMessages;
  });
};

const childrenExceptions = (
  children: Array<ValidationError> = [],
  fatherProperty: string,
): Record<string, any> => {
  const errorMessages = {};

  const childrenErrors = exceptionsMap(children);

  childrenErrors.forEach((childError) => {
    Object.keys(childError).forEach((childProperty) => {
      errorMessages[`${fatherProperty}.${childProperty}`] =
        childError[childProperty];
    });
  });

  return errorMessages;
};
