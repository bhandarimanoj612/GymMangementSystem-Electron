import { Typewriter } from "react-simple-typewriter";
import Form from "./components/signInForm";
import Lottie from "lottie-react";
import signIn from "../../assets/g1.json";

const SignIn = () => {
  return (
    <>
      <div className="flex items-center justify-center w-full h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-center w-full h-full">
          <div className="h-full w-[50%] hidden lg:block">
            <Lottie animationData={signIn} />

            {/* Typing Animation for Welcome Text */}
            <div className="text-center mt-4">
              <h1 className="text-4xl font-bold">
                <Typewriter
                  words={["Welcome Utam Khatri"]}
                  loop={false}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1000}
                />
              </h1>
              <p className="text-xl mt-2 animate-fadeIn">
                We are glad to have you here!
              </p>
            </div>
          </div>
          <div className="w-full lg:w-[50%] flex flex-col justify-center items-center">
            <Form />

            {/* Footer Text */}
            <div className="mt-10 text-center">
              <p className="text-[.8rem] font-semibold text-gray-400">
                Developed and managed by{" "}
                <span className="font-mono font-bold text-[1.1rem] uppercase">
                  Niroj
                </span>{" "}
                since 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
