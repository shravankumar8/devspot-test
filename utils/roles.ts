/**
 * This function converts a role number to its corresponding string representation.
 * @param role - The role number to be converted to a string.
 * @returns The string representation of the role.
 * @note Not the best implementation, in case of a new role being added, the function needs to be updated.
 */
export const getRoleName = (role: number): string => {
  switch (role) {
    case 1:
      return "Developer";
    case 2:
      return "Designer";
    case 3:
      return "Product Manager";
    case 4:
      return "Builder";
    default:
      return "Developer";
  }
};
