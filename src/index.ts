import { Hono } from 'hono'
import { weatherMap, imageMap, areaCodes, amedasCodes } from './weatherCode'

const app = new Hono()
const outputError = (c: any) => c.json({ status: 'error' }, 400)


app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>天気コードAPI</title>
<style>body{font-family:sans-serif;padding:2rem;}</style>
</head>
<body>
<h1>jmaWeather</h1>
<hr>
<h2>概要</h2>
<p>気象庁の(非公式)APIを扱いやすくラップしたAPIです。</p>
<hr>
<h2>エンドポイント</h2>
<h3>天気予報取得</h3>
<code>/weather?code=270000</code><br>
<p>例: <code>code</code>にはエリアコードを指定します。<code>270000</code>は大阪のコードです。</p>
<p>レスポンス例:</p>
<pre>
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
</pre>
<hr>
<h3>エリアコード一覧</h3>
<code>/areacodes</code><br>
<p>エリアコードとエリア名の一覧を取得します。</p>
<p>レスポンス例:</p>
<pre>
{
  "011000": "宗谷地方",
  "012000": "上川・留萌地方",
  "013000": "網走・北見・紋別地方",
  ...
}
</pre>
<hr>
<h3>アメダスコード一覧</h3>
<code>/amedascodes</code><br>
<p>アメダスコードとエリア名の一覧を取得します。</p>
<p>レスポンス例:</p>
<pre>
{
  "11001": "宗谷岬（ソウヤミサキ）",
  "11016": "稚内（ワッカナイ）",
  "11046": "礼文（レブン）",
  ...
}
</pre>
<hr>
<h2>エリアコード一覧</h2>
<p>エリアコードとエリア名の対応表です。<code><a href="/areacodes">/areacodes</a></code> エンドポイントからも取得できます。</p>
<ul>
${Object.entries(areaCodes)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([code, name]) => `<li><code>${code}</code>: <a href="/weather?code=${code}">${name}</a></li>`)
    .join('')}
</ul>
<hr>
<h2>アメダスコード一覧</h2>
<p>アメダスコードとエリア名の対応表です。表示数が非常に多いため、<code><a href="/amedascodes">/amedascodes</a></code>　エンドポイントから取得してください。</p>
<hr>
<p>このAPIは<a href="https://www.jma.go.jp/bosai/">気象庁の天気予報API</a>を利用しています。非公式のAPIであるため、予告なく仕様が変更される可能性があります。</p>
</body>
</html>`)
})

app.get('/weather', async (c) => {
  const areaCode = c.req.query('code')
  if (!areaCode) {
    return outputError(c)
  }
  const weatherImageBaseURL = "https://www.jma.go.jp/bosai/forecast/img/";
  const url = "https://www.jma.go.jp/bosai/forecast/data/forecast/" + areaCode + ".json";

  const res = await fetch(url);
  if (!res.ok) {
    return outputError(c)
  }

  try {
    const json = JSON.parse(await res.text());
    const weatherCode = json[0].timeSeries[0].areas[0].weatherCodes[0];
    const imgCode = imageMap[weatherCode] || weatherCode;

    const result = {
      status: "ok",
      publishingOffice: json[0].publishingOffice || null,
      reportDatetime: json[0].reportDatetime || null,
      areaCode: Number(areaCode),
      areaName: areaCodes[areaCode] || null,
      weatherCode: Number(weatherCode),
      weatherText: weatherMap[weatherCode] || null,
      imgCode: Number(imgCode),
      imgUrl: weatherImageBaseURL + imgCode + ".svg"
    };

    return c.json(result)
  } catch (error) {
    const result = { status: "error"}
    return c.json(result, 500)
  }
})

app.get('/amedas', async (c) => {
  const amedasCode = c.req.query('code')
  if (!amedasCode) {
    return outputError(c)
  }

  const now = new Date();
  now.setMinutes(Math.floor(now.getMinutes() / 10) * 10, 0, 0);

  const buildDateURL = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}00`;
  };

  let targetTime = new Date(now);
  let dateURL = buildDateURL(targetTime);
  let url = `https://www.jma.go.jp/bosai/amedas/data/map/${dateURL}.json`;

  let res = await fetch(url);
  if (!res.ok) {
    targetTime = new Date(targetTime.getTime() - 10 * 60 * 1000);
    dateURL = buildDateURL(targetTime);
    url = `https://www.jma.go.jp/bosai/amedas/data/map/${dateURL}.json`;
    res = await fetch(url);
    if (!res.ok) {
      return outputError(c)
    }
  }

  try {
    const json = JSON.parse(await res.text());
    const result = json[amedasCode];
    const updateYear = targetTime.getFullYear();
    const updateMonth = String(targetTime.getMonth() + 1).padStart(2, '0');
    const updateDay = String(targetTime.getDate()).padStart(2, '0');
    const updateHour = String(targetTime.getHours()).padStart(2, '0');
    const updateMinute = String(targetTime.getMinutes()).padStart(2, '0');
    result.updateAt = `${updateYear}-${updateMonth}-${updateDay} ${updateHour}:${updateMinute}`;
    result.amedasName = amedasCodes[amedasCode] || null;
    result.status = "ok";
    return c.json(result)
  } catch (error) {
    const result = { status: "error"}
    return c.json(result, 500)
  }
})

app.get('/areacodes', async (c) => {
  return c.json(areaCodes)
})

app.get('/amedascodes', async (c) => {
  return c.json(amedasCodes)
})

export default app
