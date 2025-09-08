import { useAuth } from "../../../utils/useAuth";
export default function Landing() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <div>TESTOUILLE</div>
    </>
  );
}
