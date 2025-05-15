import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
    headers: {
      "X-Shopify-Storefront-Access-Token": "<your-access-token>",
      "Content-Type": "application/json",
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
