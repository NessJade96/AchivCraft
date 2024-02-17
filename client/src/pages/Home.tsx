import { redirect } from "react-router-dom";

type HomeProps = {
  name: string;
  last: string;
  age: number;
};

export function Home({ name, last, age }: HomeProps) {
  return (
    <>
      <h1>
        Hello {name} {last}
      </h1>
      <p>age: {age}</p>
    </>
  );
}

export const loader = async () => {
  const characterResponse = await fetch(
    "http://localhost:3000/profile/wow/character",
    {
      credentials: "include",
    }
  );

  if (!characterResponse.ok) {
    return redirect("/login");
  }
  return characterResponse;
};
