/* eslint-disable @typescript-eslint/no-explicit-any */
import { createProject, getProject } from "./projectService";

describe("test getProject function", () => {
  it("positive test", async () => {
    const res = await getProject(
      {
        getProject: async () => {
          return {
            valid: true,
          };
        },
      } as any,
      "test"
    );
    expect(res).toBeDefined();
  });
  it("negative test", async () => {
    const res = await getProject(
      {
        getProject: async () => {
          return null;
        },
      } as any,
      "test"
    );
    expect(res).toBeNull();
  });
  it("negative test: Authorization issue", async () => {
    await expect(
      getProject(
        {
          getProject: () => {
            throw {
              message: "Authentication Failed",
              statusCode: 401,
            };
          },
        } as any,
        "test"
      )
    ).rejects.toThrow();
  });
  it("negative test: other error", async () => {
    await expect(
      getProject(
        {
          getProject: () => {
            throw new Error("fake");
          },
        } as any,
        "test"
      )
    ).rejects.toThrow();
  });
});

describe("test createProject function", () => {
  it("positive test", async () => {
    await createProject(
      {
        getProject: () => {
          return {
            state: "wellFormed",
          };
        },
        queueCreateProject: async () => {
          return;
        },
      } as any,
      "test"
    );
  });
  it("negative test: creation failed", async () => {
    await expect(
      createProject(
        {
          getProject: () => {
            return undefined;
          },
          queueCreateProject: async () => {
            return;
          },
        } as any,
        "test",
        1,
        500
      )
    ).rejects.toThrow();
  });
  it("negative test: Authorization issue", async () => {
    await expect(
      createProject(
        {
          queueCreateProject: () => {
            throw {
              message: "Authentication Failed",
              statusCode: 401,
            };
          },
        } as any,
        "test"
      )
    ).rejects.toThrow();
  });
  it("negative test: other error", async () => {
    await expect(
      createProject(
        {
          queueCreateProject: () => {
            throw new Error("fake");
          },
        } as any,
        "test"
      )
    ).rejects.toThrow();
  });
});
