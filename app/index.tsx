import { Redirect } from "expo-router";

export default function Index() {
  // Always route to the main app layout. 
  // Users can log in later via the Profile tab if needed.
  return <Redirect href="/(tabs)" />;
}
