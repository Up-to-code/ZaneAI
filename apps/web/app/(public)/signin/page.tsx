import SigninPageView from "./_components/SigninPageView";
import { loadSigninPageState, type SigninSearchParams } from "./loaders";

type SigninPageProps = {
  searchParams: Promise<SigninSearchParams>;
};

export default async function SigninPage({ searchParams }: SigninPageProps) {
  const state = await loadSigninPageState(searchParams);
  return (
    <SigninPageView
      redirectTo={state.redirectTo}
      initialMode={state.mode}
      inviteToken={state.inviteToken}
      resetToken={state.resetToken}
    />
  );
}
