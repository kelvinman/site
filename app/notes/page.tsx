import { redirect } from "next/navigation";

// Notes are listed on the home page until there are enough to need their own index.
export default function Notes() {
  redirect("/");
}
