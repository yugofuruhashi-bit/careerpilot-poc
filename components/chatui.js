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
  const [selectedSalary, setSelectedSalary] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    // 常に最新メッセージまでスクロール
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  // --- テキスト送信 ---
  const handleSendText = () => {
    if (!input.trim()) return;
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
  const saveAnswer = (answer) => {
    const current = questions[step];
    const newAnswers = { ...answers, [current.key]: answer };
    setAnswers(newAnswers);

    const newLog = [...chatLog, { role: "user", text: answer }];
    const nextStep = step + 1;

    if (nextStep < questions.length) {
      newLog.push({ role: "bot", text: questions[nextStep].text });
      setStep(nextStep);
    } else {
      newLog.push({
        role: "bot",
        text: `入力ありがとうございました。以下が職務経歴書です。

▼基本情報
・氏名：${newAnswers.name || ""}
・電話：${newAnswers.phone || ""}
・メール：${newAnswers.email || ""}

▼希望条件
・職種：${newAnswers.jobType || ""}
・業界：${newAnswers.industry || ""}
・希望年収：${newAnswers.salary || ""}

▼自己PR
（AIが生成予定）
        `,
      });
    }
    setChatLog(newLog);
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

      {/* 入力欄（常に下に固定） */}
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

        {/* 複数選択 */}
        {current?.type === "multi" && (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginBottom: 8,
              }}
            >
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleMultiToggle(opt)}
                  style={{
                    padding: 8,
                    border: multiSelect.includes(opt)
                      ? `2px solid ${colors.primary}`
                      : "1px solid #ccc",
                    borderRadius: 4,
                    background: multiSelect.includes(opt)
                      ? colors.primaryLight
                      : colors.white,
                    textAlign: "left",
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

        {/* シングル選択 */}
        {current?.type === "single" && (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginBottom: 8,
              }}
            >
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSingleToggle(opt)}
                  style={{
                    padding: 8,
                    border:
                      singleSelect === opt
                        ? `2px solid ${colors.primary}`
                        : "1px solid #ccc",
                    borderRadius: 4,
                    background:
                      singleSelect === opt
                        ? colors.primaryLight
                        : colors.white,
                    textAlign: "left",
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

        {/* 年収プルダウン */}
        {current?.type === "salary" && (
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              希望年収
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={selectedSalary}
              onChange={(e) => setSelectedSalary(e.target.value)}
            >
              <option value="">選択してください</option>
              <option value="300">300万円以上</option>
              <option value="400">400万円以上</option>
              <option value="500">500万円以上</option>
              <option value="600">600万円以上</option>
              <option value="700">700万円以上</option>
              <option value="800">800万円以上</option>
              <option value="900">900万円以上</option>
              <option value="1000">1000万円以上</option>
            </select>
            <button
              className="send-button"
              onClick={() => {
                if (!selectedSalary) return;
                saveAnswer(selectedSalary);
                setSelectedSalary("");
              }}
              disabled={!selectedSalary}
              style={{
                marginTop: 8,
                opacity: !selectedSalary ? 0.6 : 1,
                cursor: !selectedSalary ? "not-allowed" : "pointer",
              }}
            >
              決定
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
