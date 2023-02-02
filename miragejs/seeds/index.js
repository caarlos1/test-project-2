/*
 * Mirage JS guide on Seeds: https://miragejs.com/docs/data-layer/factories#in-development
 */

const productsSeeder = server => {
  server.createList('product', 25);
};

export default function seeds(server) {
  productsSeeder(server);
}
