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
         additionalImages: metafield(namespace: "custom", key: "additional_images") {
  type
  reference {
    ... on MediaImage {
      image {
        url
        altText
      }
    }
  }
}

        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export const getGemStoneKnowledge = `
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
            hardness: metafield(namespace: "custom", key: "hardness") {
            value
            type
          }
            toughness: metafield(namespace: "custom", key: "toughness") {
            value
            type
          }birthstone: metafield(namespace: "custom", key: "birthstone") {
            value
            type
          }anniversary: metafield(namespace: "custom", key: "anniversary") {
            value
            type
          }zodiac: metafield(namespace: "custom", key: "zodiac") {
            value
            type
          }enhancements: metafield(namespace: "custom", key: "enhancements") {
            value
            type
          }
            descriptionMetafield: metafield(namespace: "custom", key: "description") {
  value
  type
}

            metalPairing: metafield(namespace: "custom", key: "metal_pariring") {
            value
            type
          }careNotes: metafield(namespace: "custom", key: "care") {
            value
            type
          }
             additionalImages: metafield(namespace: "custom", key: "additional_images") {
  type
  reference {
    ... on MediaImage {
      image {
        url
        altText
      }
    }
  }
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

export const getToleranceByHandle = `
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
      toleranceTable: metafield(namespace: "custom", key: "tolerance_table") {
        value
        type
      }
    }
  }
`;

export const getStorePolicyPage = `
  query GetStorePolicyPage {
    page(handle: "store-policy") {
      metafield(namespace: "custom", key: "store_policy") {
        value
        type
      }
    }
  }
`;
