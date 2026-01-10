import { SearchParamsProvider } from "@/components/SearchParamsProvider";
import LoginForm from "@/components/LoginForm";

const LoginPage = () => {
  return (
    <SearchParamsProvider>
      <LoginForm />
    </SearchParamsProvider>
  );
};

export default LoginPage;
