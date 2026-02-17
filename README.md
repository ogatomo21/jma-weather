# jmaWeather

## 概要

気象庁の(非公式)APIを扱いやすくラップしたAPIです。

## エンドポイント

### 天気予報取得

`/weather?code=270000`

codeにはエリアコードを指定します。270000は大阪のコードです。

レスポンス例:

```json
{
  "status": "ok",
  "publishingOffice": "大阪管区気象台",
  "reportDatetime": "2026-02-17T17:00:00+09:00",
  "areaCode": 270000,
  "areaName": "大阪府",
  "weatherCode": 100,
  "weatherText": "晴れ",
  "imgCode": 100,
  "imgUrl": "https://www.jma.go.jp/bosai/forecast/img/100.svg"
}
```

### エリアコード一覧

`/areacodes`

エリアコードとエリア名の一覧を取得します。

レスポンス例:

```json
{
  "011000": "宗谷地方",
  "012000": "上川・留萌地方",
  "013000": "網走・北見・紋別地方",
  ...
}
```

## ライセンス

MIT License

## Special Thanks

- [気象庁](https://www.jma.go.jp/bosai/) - 天気予報API **(非公式)** の提供

---

```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
