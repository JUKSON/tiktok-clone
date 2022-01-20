import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "util/firebase";

interface UserProviderContextState {
  user: IUser | null;
  isLoading: boolean;
}

export interface IUser {
  id: string;
  ref: DocumentReference<DocumentData>;
  uid: string;
  username: string;
  displayName: string;
  photoURL: string;
}

const UserContext = createContext({} as UserProviderContextState);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser] = useAuthState(auth);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const usersRef = doc(db, `users/${authUser?.uid}`);
    const usersSnap = getDoc(usersRef);
    usersSnap
      .then((doc) => {
        if (doc.exists()) {
          setUser({
            id: doc.id,
            ref: doc.ref,
            uid: doc.data().uid,
            username: doc.data().username,
            displayName: doc.data().displayName,
            photoURL: doc.data().photoURL,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching user", error);
      })
      .finally(() => setLoading(false));
  }, [authUser]);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  return useContext(UserContext);
};

export default useUser;
