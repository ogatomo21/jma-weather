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

### アメダス取得

`/amedas?code=62051`

codeにはアメダスコードを指定します。62051は豊中（大阪国際空港）のコードです。

レスポンス例:

```json
{
  "temp": [11.3, 0],
  "precipitation10m": [0, 0],
  "precipitation1h": [0, 0],
  "precipitation3h": [0, 0],
  "precipitation24h": [0, 0],
  "windDirection": [5, 0],
  "wind": [2.5, 0],
  "updateAt": "2026-03-17 10:30",
  "amedasName": "豊中（トヨナカ：大阪国際空港）",
  "status": "ok"
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

### アメダスコード一覧

`/amedascodes`

アメダスコードとエリア名の一覧を取得します。

レスポンス例:

```json
{
  "11001": "宗谷岬（ソウヤミサキ）",
  "11016": "稚内（ワッカナイ）",
  "11046": "礼文（レブン）",
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
