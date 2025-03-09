import { getUser } from "@/actions/authActions/authActions";
import { HomePage } from "@/components/home";
import Image from "next/image";

export default async function Home() {

  const user = await getUser()

  return (
    <>
      <Image
        src={'/images/HOME_BG.jpg'}
        fill
        alt="home-background"
      />
      <HomePage user={user}/>
    </>
  );
}
