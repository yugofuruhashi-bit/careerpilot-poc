// data/questions.js
export const questions = [
  { key: "name", text: "氏名を教えてください", type: "text" },
  { key: "phone", text: "電話番号を教えてください", type: "text" },
  { key: "email", text: "メールアドレスを教えてください", type: "text" },
  { key: "education", text: "最終学歴を教えてください", type: "text" },
  {
    key: "method",
    text: "希望の顧客層を選んでください（複数選択可）",
    type: "multi",
    options: [
      "法人営業(BtoB)",
      "個人営業(BtoC)",
    ],
  },
  {
    key: "jobType",
    text: "希望職種を選んでください（複数選択可）",
    type: "multi",
    options: [
      "フィールドセールス",
      "インサイドセールス",
      "カスタマーサクセス",
    ],
  },
  {
    key: "position",
    text: "希望ポジションを選んでください（複数選択可）",
    type: "multi",
    options: [
      "メンバー/一般社員",
      "チームリーダー/係長・主任",
      "マネージャー/課長",
      "ディレクター/部長",
      "CxO/経営層・役員",
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
    text: "希望年収を選択してください",
    type: "single", 
    options: [
      "300万円以上", 
      "400万円以上", 
      "500万円以上", 
      "600万円以上",
      "700万円以上",
      "800万円以上",
      "900万円以上",
      "1,000万円以上",
      "1,500万円以上",
      "2,000万円以上",
    ],
  },
];
