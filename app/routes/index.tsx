import {
  MetaFunction,
  useLoaderData,
  LoaderFunction,
  useTransition,
  Form,
} from "remix";

type MovieSearchResult = {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
};

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParam = url.searchParams.get("search");
  const result = await fetch(
    `http://www.omdbapi.com/?s=${searchParam}&apikey=${process.env.OMDB_API_KEY}`
  );
  const data = await result.json();
  return data.Search || [];
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Remix Movie",
    description: "Welcome to Remix Movies!",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let movies = useLoaderData<MovieSearchResult[]>();
  const transition = useTransition();

  return (
    <>
      <Form method="get" action="/">
        <input
          autoComplete="off"
          name="search"
          type="text"
          placeholder="Enter a movie"
        />
      </Form>
      <div className="results">
        {transition.state === "submitting"
          ? "Submitting..."
          : movies.map((movie) => (
              <img key={movie.imdbID} src={movie.Poster} />
            ))}
      </div>
    </>
  );
}
