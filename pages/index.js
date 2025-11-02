import { useEffect } from "react";
import { useRouter } from "next/router";
// import jwtDecode from "jwt-decode";
import { Loader } from "rsuite";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Run only on client
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const isExpired = decodedToken?.exp < currentTime;
      // router.push(isExpired ? "/auth/login" : "/home");
      router.push(isExpired ? "/auth/login" : "/home");
    } catch (error) {
      console.error("Error decoding token:", error);
      router.push("/home");
    }
  }, [router]);

  return (
    <>
      <Loader content="Please Wait ..." size="lg" backdrop vertical center />
    </>
  );
}
