import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";

import { Button } from "./ui/button";

export const PageHeader = ({
  children,
  backPath = "/",
}: {
  children: React.ReactNode;
  backPath?: string;
}) => {
  return (
    <div className="flex items-center gap-9 w-fit">
      <Button
        asChild
        variant="secondary"
        className="rounded-full w-10 h-10 bg-black text-yellow-500"
      >
        <Link href={backPath}>
          <FaChevronLeft />
        </Link>
      </Button>
      <div className="text-white text-xl font-bold">{children}</div>
    </div>
  );
};
