import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";

export default function LinkButton({
  url,
  text,
}: {
  url: string;
  text: string;
}) {
  return (
    <a href={url} download={url} className={"group flex"}>
      <button
        className={
          "btn text-white bg-violet-500 w-full rounded-s-lg px-5 py-3 text-center font-semibold hover:bg-violet-100 dark:text-violet-200 dark:bg-violet-700 dark:hover:bg-violet-800 hover:cursor-pointer"
        }
      >
        {text}
      </button>
      <button
        className={
          "btn text-white bg-violet-600 rounded-e-lg px-5 py-3 text-center dark:text-violet-200 dark:bg-violet-800 hover:cursor-pointer"
        }
      >
        <ArrowTopRightOnSquareIcon className={"h-5 w-5"} />
      </button>
    </a>
  );
}
