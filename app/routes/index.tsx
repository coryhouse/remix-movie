import {
  MetaFunction,
  useLoaderData,
  LoaderFunction,
  useTransition,
  Form,
  useLocation,
} from "remix";

type Movie = {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParam = url.searchParams.get("search");
  const result = await fetch(
    `http://www.omdbapi.com/?s=${searchParam}&apikey=${process.env.OMDB_API_KEY}`
  );
  const data = await result.json();
  return (data.Search || []) as Movie[];
};

export const meta: MetaFunction = () => {
  return {
    title: "Remix Movie",
    description: "Welcome to Remix Movies!",
  };
};

export default function Index() {
  const movies = useLoaderData<Movie[]>();
  const { search } = useLocation();
  const transition = useTransition();
  const searchTerm = search.split("=")[1];

  return (
    <>
      <Form method="get" action="/">
        <input
          name="search"
          type="search"
          placeholder="Enter a movie"
          defaultValue={searchTerm}
        />
      </Form>
      <section>
        {transition.state === "submitting"
          ? "Searching..."
          : movies.map((movie) => (
              <img key={movie.imdbID} src={movie.Poster} />
            ))}
        {transition.state === "idle" && movies.length === 0 && (
          <p>No movies matching "{searchTerm}" found.</p>
        )}
      </section>
    </>
  );
}
