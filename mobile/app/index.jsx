import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isSignedIn } = useAuth();

  // Route to tabs if signed in, otherwise to sign-in
  if (isSignedIn) {
    return <Redirect href="/tabs" />;
  }

  return <Redirect href="/auth/sign-in" />;
}
