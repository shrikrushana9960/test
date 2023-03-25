import { list,graphql } from "@keystone-6/core";
import { allowAll, denyAll, allOperations } from "@keystone-6/core/access";
import {
  text,
  password,
  timestamp,
  relationship,
  decimal,
  virtual,
  select,
  checkbox,
  integer,
} from "@keystone-6/core/fields";
import type { Lists,Context } from ".keystone/types";
import Account from './lists/account'
const permissions = {
  authenticatedUser: ({ session }: any) => !!session?.data,
  public: () => true,
  readOnly: {
    operation: {
      // deny create/read/update/delete
      ...allOperations(denyAll),
      // override the deny and allow only query
      query: allowAll,
    },
  },
};

export const lists: Lists = {

  User: list({
    access: allowAll,
    fields: {
      name:text(),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
        access: {
          // email only visible to authenticated users
          read: permissions.authenticatedUser,
        },
      }),
      emailVerified: checkbox({ defaultValue: false }),
      emailVerificationToken: text(),
      emailVerificationTokenExpiry: timestamp(),
      provider: select({
        options: [
          { label: 'Credentials', value: 'credentials' },
          { label: 'Google', value: 'google' },
          { label: 'Apple', value: 'apple' },
        ],
      
      }),
      password: password(),
     
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
     
      role: text({ defaultValue: 'ACCOUNT' }),
    },
  }),
  Product: list({
    access: allowAll,
    fields: {
      title: text(),
      description: text(),
      price: decimal(),
      meta: text(),
      hsnCode: text(),
      vendor: relationship({ ref: "User" }),
    },
  }),
  ProductImage: list({
    access: allowAll,
    fields: {
      image: text(),
      order: integer(),
      product: relationship({ ref: "Product" }),
    },
  }),
  OrderItem: list({
    access: allowAll,
    fields: {
      product: relationship({ ref: "Product" }),
      title: text(),
      quantity: integer(),
      price: decimal(),
      tax: decimal(),
    },
  }),
  Order: list({
    access: allowAll,
    fields: {
      customer: relationship({ ref: "User" }),
      items: relationship({ ref: "OrderItem", many: true }),
      payments: relationship({ ref: "Payment", many: true }),
    },
  }),
  Payment: list({
    access: allowAll,
    fields: {
      order: relationship({ ref: "Order" }),
      amount: decimal(),
      date: timestamp(),
      vendor: relationship({ ref: "User" }),
    },
  }),
};
