import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

export function LinkButton({ url, text }: { url: string; text: string }) {
  return (
    <a href={url} download={url} className={"group flex"}>
      <button
        className={
          "btn text-white bg-violet-500 w-full rounded-s-lg px-5 py-3 text-center font-semibold hover:bg-violet-600 dark:text-violet-700 dark:bg-violet-50 dark:hover:bg-violet-200 hover:cursor-pointer"
        }
      >
        {text}
      </button>
      <button
        className={
          "btn text-white bg-violet-600 rounded-e-lg px-5 py-3 text-center dark:text-violet-700 dark:bg-violet-200 hover:cursor-pointer"
        }
      >
        <ArrowTopRightOnSquareIcon className={"h-5 w-5"} />
      </button>
    </a>
  );
}
