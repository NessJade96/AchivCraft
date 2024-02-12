type HomeProps = {
  name: string;
  last: string;
  age: number
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
