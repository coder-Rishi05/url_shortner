import validator from "validator";

export const validationSignUpData = (req) => {
  const { firstname, email, password } = req.body;

  if (!firstname) {
    throw new Error("First name is required");
  }

  if (!email || !validator.isEmail(email)) {
    throw new Error("Please enter a valid email address");
  }

  if (
    !password ||
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error(
      "Password must be strong (8+ chars, uppercase, lowercase, number, symbol)",
    );
  }
};

export const validationLoginData = (req) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    throw new Error("Please enter a valid email address");
  }

  if (!password) {
    throw new Error("Password is required");
  }
};


export const validateCustomAlias = (customAlias) => {
  // trim + lowercase
  const alias = validator.trim(customAlias).toLowerCase();

  // empty check
  if (validator.isEmpty(alias)) {
    return {
      isValid: false,
      message: "Custom alias cannot be empty",
    };
  }

  // regex: only a-z, 0-9, hyphen | length 3–30
  const aliasRegex = /^[a-z0-9-]{3,30}$/;

  if (!aliasRegex.test(alias)) {
    return {
      isValid: false,
      message:
        "Alias must be 3-30 characters long and contain only letters, numbers, and hyphens",
    };
  }

  return {
    isValid: true,
    alias,
  };  
};
