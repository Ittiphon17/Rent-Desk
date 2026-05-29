import { prisma } from "../config/prisma";

export interface CreateTenantInput {
  full_name: string;
  email: string;
  phone?: string;
  status?: string;
}

export const listTenants = async () => {
  return prisma.tenants.findMany({
    orderBy: {
      created_at: "desc",
    },
  });
};

export const registerTenant = async (data: CreateTenantInput) => {
  return prisma.tenants.create({
    data: {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      status: data.status || "",
    },
  });
};
