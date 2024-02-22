import { Link, redirect, useLoaderData } from "react-router-dom";

type HomeProps = {
  name: string;
  last: string;
  age: number;
};

export function Home({ name, last, age }: HomeProps) {
  const data: any = useLoaderData();
  return (
    <>
      <h1>
        Hello {name} {last}
      </h1>
      <p>age: {age}</p>
      <Link to="/search">Search new characters to follow</Link>
      {JSON.stringify(data)}
    </>
  );
}

export const loader = async () => {
  const characterResponse = await fetch(
    "http://localhost:3000/character/achievement",
    {
      credentials: "include",
    }
  );
  if (!characterResponse.ok) {
    return redirect("/login");
  }
  return characterResponse;
};
