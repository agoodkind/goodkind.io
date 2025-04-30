import "@styles/main.css";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "bg-gray-100 min-h-screen w-full antialiased dark:bg-neutral-900"
      }
    >
      <main
        className={"container mx-auto w-full max-w-xl p-4 sm:max-w-3xl sm:p-5"}
      >
        <div className={"grid gap-5"}>
          <div className={"space-y-5"}>{children}</div>
        </div>
      </main>
    </div>
  );
}
