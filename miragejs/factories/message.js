import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

export default {
  message: Factory.extend({
    content() {
      return faker.helpers.fake('{{lorem.paragraph}}');
    },
    date() {
      const date = new Date(faker.helpers.fake('{{date.past}}'));
      return date.toLocaleDateString();
    },
  }),
};
