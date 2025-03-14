/**
 * Get user friendly message from Firebase error code
 */
export function getErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/wrong-password': {
      return 'The password is incorrect'
    }
    case 'auth/invalid-email': {
      return 'The email does not exist'
    }
    case 'auth/email-already-in-use': {
      return 'Email is already registered. Please Sign In'
    }
    case 'auth/weak-password': {
      return 'Please use stronger password'
    }
    case 'auth/user-not-found': {
      return 'There is no user record of this email'
    }
    default:
      return errorCode
  }
}