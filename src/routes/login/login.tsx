import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  AtSymbolIcon,
  KeyIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import ActionButton from "../../ui/buttons/ActionButton";
import TextInput from "../../ui/inputs/TextInput";

export default function Login() {
  return (
    <div className="flex grow">
      <div className="flex w-full items-center justify-center">
        <div className="flex h-max w-1/3 flex-col gap-6">
          <div className="flex h-max w-full flex-col rounded-xl border-2 border-neutral-600 bg-neutral-800/50 p-4">
            <h1 className="m-0 mb-1 font-serif text-2xl font-bold tracking-wider">
              Welcome Back!
            </h1>
            <p className="m-0 font-sans text-sm text-neutral-500">
              Enter your email and password to sign into the system and start
              working!
            </p>
            <div className="mt-4 flex h-max w-full flex-wrap gap-4">
              <TextInput
                icon={<AtSymbolIcon className="m-0 w-5 p-0"></AtSymbolIcon>}
                placeholder="Email.."
              ></TextInput>
              <TextInput
                icon={<KeyIcon className="m-0 w-4 p-0"></KeyIcon>}
                placeholder="Password.."
              ></TextInput>
            </div>
          </div>
          <div className="w-full">
            <ActionButton
              content={"SIGN IN"}
              icon={
                <ArrowLeftOnRectangleIcon className="w-6 text-indigo-600"></ArrowLeftOnRectangleIcon>
              }
            ></ActionButton>
          </div>
          <div className="flex w-full justify-center">
            <p className="text-neutral-500">
              Don't have an account yet?
              <Link to={"../register"}>
                <span className="ml-1 text-neutral-200/80 underline">
                  Register
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
