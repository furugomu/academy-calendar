export const Root = () => {
  const items = [
    {
      name: "姫乃みえる",
      google: "9ugmnglk1g6tshb03700vln9pb8en6ah",
      ics: "mieru",
    },
    {
      name: "真未夢メエ",
      google: "5sj1or0s7ch60oi765qkorsdcvfj6ld9",
      ics: "meh",
    },
    {
      name: "和央パリン",
      google: "su4mv4em68iihd999pv2dc64j29tds1t",
      ics: "parin",
    },
    {
      name: "凛堂たいむ",
      google: "0nd4k5uab9jl61ouusm6buenv3tgertl",
      ics: "taimu",
    },
  ] as const;
  return (
    <html lang="ja">
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>アイカツアカデミーのカレンダー （非公式）</title>
      <body style="max-width: 640px; margin: 1em auto">
        <h1>
          <nobr>
            アイカツアカデミーの
            <wbr />
            カレンダー <small>（非公式）</small>
          </nobr>
        </h1>
        <ul>
          <li>
            <a href="#google">Googleカレンダー</a>
          </li>
          <li>
            <a href="#ics">iCalendarファイル (.ics)</a>
          </li>
        </ul>
        <section id="google">
          <h2>Googleカレンダー</h2>
          <p>
            右下のプラスボタンを押すと、自分のGoogleカレンダーに追加できます。
          </p>
          {items.map((item) => {
            const calendarUrl = `${item.google}@import.calendar.google.com`;
            const iframeUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
              calendarUrl
            )}&ctz=Asia%2FTokyo`;
            return (
              <div key={item.name}>
                <h3>{item.name}</h3>
                <iframe
                  src={iframeUrl}
                  style={{ border: 0 }}
                  width="100%"
                  height="200"
                  frameborder="0"
                  scrolling="no"
                ></iframe>
              </div>
            );
          })}
        </section>

        <section id="ics">
          <h2>iCalendarファイル (.ics)</h2>
          <p>任意のカレンダーアプリに追加できます。</p>
          <p>
            <a href="https://www.google.com/search?q=iOS+ics">iOS ics で検索</a>
            などして、うまいことやってください。
          </p>
          <ul>
            {items.map((item) => {
              const icsUrl = `https://academy-calendar.furugomu.workers.dev/${item.ics}`;
              return (
                <li key={item.name}>
                  <output>{icsUrl}</output>{" "}
                  <button
                    onclick={`navigator.clipboard.writeText('${icsUrl}')`}
                    type="button"
                  >
                    コピー
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <address>
          <a href="https://github.com/furugomu/academy-calendar">GitHub</a>,
          <a href="https://x.com/furugomu">Twitter</a>
        </address>
      </body>
    </html>
  );
};
