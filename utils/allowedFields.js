const userSignUpAllowedFields = (req) => {
  const allowed_fields = [
    "firstName",
    "lastName",
    "email",
    "password",
    "photoUrl",
    "gender",
    "about",
    "skills",
    "photo",
  ];

  if (!req.body) {
    throw new Error("Not valid fields...");
  }

  const isAllowed = Object.keys(req.body).every((field) =>
    allowed_fields.includes(field)
  );

  return isAllowed ? true : false;
};

const userProfileEditAllowedFields = (req) => {
  const allowed_fields = [
    "firstName",
    "lastName",
    "photoUrl",
    "gender",
    "about",
    "skills",
    "photo",
  ];

  if (!req.body) {
    throw new Error("Not valid fields to Update...");
  }

  const isAllowed = Object.keys(req.body).every((field) =>
    allowed_fields.includes(field)
  );

  return isAllowed ? true : false;
};

module.exports = { userSignUpAllowedFields, userProfileEditAllowedFields };
