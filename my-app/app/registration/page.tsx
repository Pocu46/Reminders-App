import Button from "../components/button";
import Input from "../components/input";

const RegistrationPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        action="/api/registration"
        method="POST"
        className="w-full max-w-[60vw] min-w-[580px] flex flex-col justify-center items-center gap-6 border border-[#b7b8bd] rounded-3xl p-8"
      >
        <Input 
            type="email"
            placeholder="Email" 
            className="w-full h-12 border border-[#b7b8bd] rounded-2xl p-2" 
        />

        <Input
          type="password"
          placeholder="Password"
          className="w-full h-12 border border-[#b7b8bd] rounded-2xl p-2"
        />

        <Input
          type="confirm password"
          placeholder="Confirm Password"
          className="w-full h-12 border border-[#b7b8bd] rounded-2xl p-2"
        />

        <Button 
            type="submit" 
            text="Register"
            className="px-4 py-2 w-[146px] border border-white text-black text-xl font-medium hover:bg-blue-900 hover:text-white">
        </Button>

        <p className="text-lg text-gray-300 mt-2 text-center flex flex-col items-center">
          Already have an account? <br />

          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegistrationPage;