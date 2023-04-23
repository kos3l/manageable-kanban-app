import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/solid";

export default function Login() {
  return (
    <div className="flex grow">
      <div className="flex w-full items-center justify-center">
        <div className="flex h-2/3 w-1/3 flex-wrap rounded-xl border-2 border-neutral-600 bg-neutral-800/50 p-4">
          <h1 className="font-serif text-2xl font-bold tracking-wider">
            Sign in!
          </h1>
          <div className="flex h-12 w-full items-center rounded-xl border-2 border-neutral-600 bg-neutral-900 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700">
              <AtSymbolIcon className="m-0 w-5 p-0"></AtSymbolIcon>
            </div>
            <input
              type="text"
              placeholder="Email.."
              className="text-md h-full grow bg-transparent px-3 pt-0.5 font-sans font-thin tracking-normal text-neutral-400 placeholder:font-thin placeholder:tracking-wide placeholder:text-neutral-600 focus:outline-none"
            />
          </div>
          <div className="flex h-12 w-full items-center rounded-xl border-2 border-neutral-600 bg-neutral-900 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-700">
              <KeyIcon className="m-0 w-4 p-0"></KeyIcon>
            </div>
            <input
              type="text"
              placeholder="Password.."
              className="text-md h-full grow bg-transparent px-3 pt-0.5 font-sans font-thin tracking-normal text-neutral-400 placeholder:font-thin placeholder:tracking-wide placeholder:text-neutral-600 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
