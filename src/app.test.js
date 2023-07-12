// https://dev.to/lukekyl/testing-your-express-js-backend-server-3ae6
const app = require("./app.js");
const supertest = require("supertest");
const request = supertest(app);

describe("User Endpoints", () => {
  test("GET /user/:uid", async () => {
    const res = await request.get("/user/0x71C7656EC7ab88b098defB751B7401B5f6d8976E");
    expect(res.statusCode).toBe(404);
  });
  test("POST /user/:uid", async () => {
    const res1 = await request.post("/user/0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
    expect(res1.statusCode).toBe(200);
    const res2 = await request.get("/user/0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
    expect(res2.statusCode).toBe(200);
  });
});

describe("Lottery Endpoints create / query", () => {
  test("POST /lottery", async () => {
    const res1 = await request.post("/lottery")
      .send({ title: "First campaign", bannerURL: "http://tinyurl.com/3jy9ww3w" });
    expect(res1.statusCode).toBe(200);
    const res2 = await request.get(`/lottery/${res1.text}`);
    expect(res2.statusCode).toBe(200);
    const value = '{["id":"","title:"gold","description":"something good"]}';
    const res3 = await request.get(`/lottery/${res1.text}/prizes`);
    expect(res3.text).toBe("null");
    const res4 = await request.post(`/lottery/${res1.text}/prizes`)
      .send({value});
    expect(res4.statusCode).toBe(200);
    const res5 = await request.get(`/lottery/${res1.text}/prizes`);
    expect(res5.text).toBe(value);
    const res6 = await request.get(`/lottery/${res1.text}/missions`);
    expect(res6.text).toBe("null");
    const res7 = await request.post(`/lottery/${res1.text}/missions`)
      .send({value});
    expect(res7.statusCode).toBe(200);
    const res8 = await request.get(`/lottery/${res1.text}/missions`);
    expect(res8.text).toBe(value);
  })
  test("GET /lotteries", async () => {
    const res = await request.get(`/lottery/abc`);
    expect(res.statusCode).toBe(404);
  })
});