const gql = require('graphql-tag');

exports.listImpressionsQuery = gql(`
query listImpressionQuery($pk: ID!) {
  listImpressions(pk: $pk) {
    items {
      pk
      sk
      count
    }
  }
}
`);
