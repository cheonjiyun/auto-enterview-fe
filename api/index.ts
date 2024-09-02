import jsonServer from "json-server";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// json-server 인스턴스 생성
const server = jsonServer.create();
const router = jsonServer.router("db.json"); // 목데이터 파일 경로
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

export default (req: VercelRequest, res: VercelResponse) => {
  server(req, res);
};
