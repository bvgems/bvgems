export const GetAllBeads = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
           images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          metafield(namespace: "custom", key: "productType") {
            value
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

export const getAllProductsQuery = `
  query getAllProducts($cursor: String) {
    products(first: 100, after: $cursor) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          handle
          description
          productType

          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
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
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
          hardness: metafield(namespace: "custom", key: "hardness") {
        value
        type
      }
         toughness: metafield(namespace: "custom", key: "toughness") {
        value
        type
      }
         birthstone: metafield(namespace: "custom", key: "birthstone") {
        value
        type
      }
         zodiac: metafield(namespace: "custom", key: "zodiac") {
        value
        type
      }
         hardness: metafield(namespace: "custom", key: "hardness") {
        value
        type
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
      category: metafield(namespace: "custom", key: "category") {
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

export const getFAQs = `
  query GetFAQs {
    page(handle: "faq") {
      metafield(namespace: "custom", key: "faqs") {
        value
        type
      }
    }
  }
`;

export const getAllProducts = `
  query GetAllProducts {
    products(first: 100) {
      edges {
        node {
          id
          title
          handle
          images(first: 1) {
            edges {
              node {
                src
              }
            }
          }
          metafield(namespace: "custom", key: "in_hand") {
            value
            type
          }
        }
      }
    }
  }
`;

export const shopifyQuery = `
      query getProductsByCategory($category: String!) {
        products(first: 50, query: $category) {
          edges {
            node {
              id
              title
              handle
              description
              productType
              createdAt
              tags
              images(first: 2) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                      currencyCode
                    }
                    title
                    sku
                  }
                }
              }
            }
          }
        }
      }
    `;

export const getProductsByCategory = `
    query GetProductsByCategory($first: Int = 100) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
              createdAt
            metafield(namespace: "custom", key: "category") {
              value
            }
              images(first: 2) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
          }
        }
      }
    }
  `;
export const GetProductByHandle = `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      productType
      createdAt
      tags
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            price {
              amount
              currencyCode
            }
            title
            sku
            availableForSale
          }
        }
      }
    }
  }
`;

export const GetLayoutsByHandle = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      layouts: metafield(namespace: "custom", key: "layout_map") {
        value
        type
      }
    }
  }
`;
