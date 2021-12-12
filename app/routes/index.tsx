import {
  MetaFunction,
  useLoaderData,
  LoaderFunction,
  useTransition,
  Form,
  useLocation,
} from "remix";

type MovieSearchResult = {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
};

type Movie = {
  id: string;
  poster: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParam = url.searchParams.get("search");
  const result = await fetch(
    `http://www.omdbapi.com/?s=${searchParam}&apikey=${process.env.OMDB_API_KEY}`
  );
  const data = await result.json();
  return (
    // Map Pascal-cased API response to leaner, camelCased response that only includes the fields used on the client.
    data.Search.map((result: MovieSearchResult) => {
      const movie: Movie = {
        id: result.imdbID,
        poster: result.Poster,
      };
      return movie;
    }) || []
  );
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
  const { state } = useTransition();
  const searchTerm = search.split("=")[1];

  return (
    <>
      <Form method="get" style={{ display: "flex" }}>
        <input name="search" type="search" defaultValue={searchTerm} />
        <input type="submit" value="Search" />
      </Form>
      <section>
        {state === "submitting"
          ? "Searching..."
          : movies.map(({ id, poster }) => <img key={id} src={poster} />)}
        {state === "idle" && movies.length === 0 && (
          <p>No movies matching "{searchTerm}" found.</p>
        )}
      </section>
    </>
  );
}
