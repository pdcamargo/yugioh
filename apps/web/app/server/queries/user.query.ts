"use server";

import { createSafeQueryWithAuth } from "../safe-query";

export const getSessionUser = createSafeQueryWithAuth().query(
  async ({ user }) => {
    return user;
  },
);
