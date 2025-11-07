// Server-side redirect based on HttpOnly cookie for proper SSR
export default function Index() { return null; }

export async function getServerSideProps(ctx) {
  const token = ctx?.req?.cookies?.token;
  const next = ctx?.query?.next || "/home";
  const destination = token ? "/home" : `/auth/login?next=${encodeURIComponent(next)}`;
  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
}
