export const getAllCollectionsQuery = `
  query getAllCollections($cursor: String) {
    collections(first: 100, after: $cursor) {
      edges {
        cursor
        node {
          id
          title
          handle
          description
          image {
            src
            altText
          }
          shapes: metafield(namespace: "custom", key: "shapes") {
            value
            type
          }
          shapeSizes: metafield(namespace: "custom", key: "shape_sizes") {
            value
            type
          }
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export const getGemstoneByHandle = `
  query GetCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        src
        altText
      }
      shapes: metafield(namespace: "custom", key: "shapes") {
        value
        type
      }
      shapeSizes: metafield(namespace: "custom", key: "shape_sizes") {
        value
        type
      }
    }
  }
`;
