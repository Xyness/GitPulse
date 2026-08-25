import Link from "next/link";

export function LookupError({ message }: { message: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-lg">{message}</p>
      <Link
        href="/"
        className="text-sm text-primary underline underline-offset-4"
      >
        Back to search
      </Link>
    </div>
  );
}
