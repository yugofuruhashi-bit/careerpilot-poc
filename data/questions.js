// data/questions.js
export const questions = [
  { key: "name", text: "氏名を教えてください", type: "text" },
  { key: "phone", text: "電話番号を教えてください", type: "text" },
  { key: "email", text: "メールアドレスを教えてください", type: "text" },
  {
    key: "jobType",
    text: "希望職種を選んでください（複数選択可）",
    type: "multi",
    options: [
      "法人営業",
      "個人営業",
      "インサイドセールス",
      "カスタマーサクセス",
      "代理店営業",
    ],
  },
  {
    key: "industry",
    text: "希望業界を選んでください（複数選択可）",
    type: "multi",
    options: ["IT／SaaS", "製造", "不動産", "金融", "医療・ヘルスケア"],
  },
  {
    key: "salary",
    text: "希望年収を選んでください（1つ選択）",
    type: "single",
    options: [
      "300万円未満",
      "300〜500万円",
      "500〜700万円",
      "700〜1000万円",
      "1000万円以上",
    ],
  },
];
