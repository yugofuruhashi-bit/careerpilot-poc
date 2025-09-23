// components/ChatUI.js
import { useState, useEffect, useRef } from "react";
import { questions } from "../data/questions";
import { colors } from "../data/colors";

export default function ChatUI() {
  const [chatLog, setChatLog] = useState([{ role: "bot", text: questions[0].text }]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [multiSelect, setMultiSelect] = useState([]);
  const [singleSelect, setSingleSelect] = useState(null);
  const [loading, setLoading] = useState(false); // AI出力中の状態

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, loading]);

  // --- バリデーション ---
  const validatePhone = (value) => /^\d{10,11}$/.test(value.replace(/-/g, ""));
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // --- テキスト送信 ---
  const handleSendText = () => {
    if (!input.trim()) return;

    const current = questions[step];

    if (current.key === "phone" && !validatePhone(input)) {
      alert("電話番号が正しくありません。10桁または11桁の数字を入力してください。");
      return;
    }

    if (current.key === "email" && !validateEmail(input)) {
      alert("メールアドレスが正しくありません。形式を確認してください。");
      return;
    }

    saveAnswer(input);
    setInput("");
  };

  // --- 複数選択 ---
  const handleMultiToggle = (value) => {
    let next = [...multiSelect];
    if (next.includes(value)) next = next.filter((v) => v !== value);
    else next.push(value);
    setMultiSelect(next);
  };

  const handleMultiConfirm = () => {
    if (multiSelect.length === 0) return;
    saveAnswer(multiSelect.join("、"));
    setMultiSelect([]);
  };

  // --- シングル選択 ---
  const handleSingleToggle = (value) => {
    setSingleSelect((prev) => (prev === value ? null : value));
  };

  const handleSingleConfirm = () => {
    if (!singleSelect) return;
    saveAnswer(singleSelect);
    setSingleSelect(null);
  };

  // --- 回答保存処理 ---
  const saveAnswer = async (answer) => {
    const current = questions[step];
    const newAnswers = { ...answers, [current.key]: answer };
    setAnswers(newAnswers);

    const newLog = [...chatLog, { role: "user", text: answer }];
    const nextStep = step + 1;

    if (nextStep < questions.length) {
      newLog.push({ role: "bot", text: questions[nextStep].text });
      setStep(nextStep);
      setChatLog(newLog);
    } else {
      // ここでAIに投げる
      setLoading(true);
      const pendingLog = [
        ...newLog,
        { role: "bot", text: "AIが経歴書を出力中のためお待ちください" }, // 仮メッセージ
      ];
      setChatLog(pendingLog);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "あなたは優秀なキャリアコンサルタントです。ユーザーの回答を元に職務経歴書を整形してください。",
              },
              {
                role: "user",
                content:
                  `以下の情報を基に職務経歴書を作成してください:\n${JSON.stringify(newAnswers)}`,
              },
            ],
          }),
        });

        const data = await response.json();
        const aiText =
          data.reply ??
          data.content ??
          data.choices?.[0]?.message?.content ??
          "生成に失敗しました。時間を置いて再度お試しください。";

        setChatLog([
          ...newLog,
          {
            role: "bot",
            text: `入力ありがとうございました。以下がAIによる職務経歴書です。\n\n${aiText}`,
          },
        ]);
      } catch (e) {
        setChatLog([
          ...newLog,
          { role: "bot", text: "エラーが発生しました。もう一度お試しください。" },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  const current = questions[step];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        background: colors.background,
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          background: colors.primary,
          color: colors.white,
          padding: 12,
          fontWeight: "bold",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        CareerPilot（仮）
      </div>

      {/* チャットログ */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 12,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {chatLog.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "bot" ? "flex-start" : "flex-end",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 16,
                maxWidth: "75%",
                whiteSpace: "pre-line",
                background: m.role === "bot" ? colors.secondary : colors.primary,
                color: m.role === "bot" ? colors.text : colors.white,
                fontSize: "14px",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 入力欄 */}
      <div
        style={{
          padding: 8,
          borderTop: "1px solid #ccc",
          background: colors.white,
          flexShrink: 0,
        }}
      >
        {/* テキスト入力 */}
        {current?.type === "text" && (
          <div style={{ display: "flex", gap: 8 }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="入力してください..."
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  handleSendText();
                }
              }}
              rows={2}
              style={{
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: 8,
                resize: "none",
              }}
            />
            <button className="send-button" onClick={handleSendText}>
              送信
            </button>
          </div>
        )}

        {/* 複数選択（3×3グリッド） */}
        {current?.type === "multi" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
                marginBottom: 8,
              }}
            >
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleMultiToggle(opt)}
                  style={{
                    padding: 12,
                    border: multiSelect.includes(opt)
                      ? `2px solid ${colors.primary}`
                      : "1px solid #ccc",
                    borderRadius: 6,
                    background: multiSelect.includes(opt)
                      ? colors.primaryLight
                      : colors.white,
                    textAlign: "center",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              className="send-button"
              onClick={handleMultiConfirm}
              disabled={multiSelect.length === 0}
              style={{
                opacity: multiSelect.length === 0 ? 0.6 : 1,
                cursor: multiSelect.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              決定
            </button>
          </div>
        )}

        {/* シングル選択（3×3グリッド） */}
        {current?.type === "single" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
                marginBottom: 8,
              }}
            >
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSingleToggle(opt)}
                  style={{
                    padding: 12,
                    border:
                      singleSelect === opt
                        ? `2px solid ${colors.primary}`
                        : "1px solid #ccc",
                    borderRadius: 6,
                    background:
                      singleSelect === opt ? colors.primaryLight : colors.white,
                    textAlign: "center",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              className="send-button"
              onClick={handleSingleConfirm}
              disabled={!singleSelect}
              style={{
                opacity: !singleSelect ? 0.6 : 1,
                cursor: !singleSelect ? "not-allowed" : "pointer",
              }}
            >
              送信
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
