import React, { useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { getIsVendor } from "../api/firestoreApi";

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [isVendor, setIsVendor] = useState(false);

  function signUp(email, pwd, name) {
    return createUserWithEmailAndPassword(auth, email, pwd).then(() => {
      return updateProfile(auth.currentUser, {
        displayName: name
      })
    })
    
    // Remove verification
    // .then(() => {
    //   return sendEmailVerification(auth.currentUser)
    // })
  }

  function signIn(email, pwd) {
    return setPersistence(auth, browserLocalPersistence).then(() => {
      return signInWithEmailAndPassword(auth, email, pwd);
    })
  }

  function resetPassword(email) {
    return setPersistence(auth, browserLocalPersistence).then(() => {
      return sendPasswordResetEmail(auth, email);
    })
  }

  function logout() {
    return (signOut(auth))
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      if (user) {
        getIsVendor(user.email).then(res => {
          setIsVendor(res);
        })
      }
    });
    return unsubscribe;
  }, [])

  const value = {
    auth,
    currentUser,
    signUp,
    signIn,
    logout,
    resetPassword,
    isVendor,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}