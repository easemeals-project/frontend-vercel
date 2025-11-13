import { generateClient } from "aws-amplify/api";

// --- AppSync Service ---
export class AppSyncService {
  private client = generateClient();

  //   public async query<T>(query: any, variables?: any): Promise<T> {
  //     const response = await this.client.graphql({
  //       query,
  //       variables,
  //     });
  //     return response.data;
  //   }

  //   // --- GraphQL Mutation ---
  //   public async mutate<T>(mutation: any, variables?: any): Promise<T> {
  //     const response = await this.client.graphql({
  //       mutation,
  //       variables,
  //     });
  //     return response.data;
  //   }
}

// --- Export a singleton instance ---
export const appSyncService = new AppSyncService();
