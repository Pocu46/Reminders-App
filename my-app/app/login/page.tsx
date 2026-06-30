import Input from "../components/input";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        action="/api/login"
        method="POST"
        className="w-full max-w-[60vw] min-w-[580px] flex flex-col justify-center items-center gap-6 border border-[#b7b8bd] rounded-md p-8"
      >
        <Input 
            email="email" 
            placeholder="Email" 
            className="w-full border border-[#b7b8bd] rounded-md p-2" 
        />

        <Input
          email="password"
          placeholder="Password"
          className="w-full border border-[#b7b8bd] rounded-md p-2"
        />

        <button type="submit" className="px-4 py-2 rounded-md border border-white">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;