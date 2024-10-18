import { getUser } from "@/actions/authActions/authActions";
import { HomePage } from "@/components/home";

export default async function Home() {

  const user = await getUser()

  return (
    <HomePage user={user}/>
  );
}
