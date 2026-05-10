"use client";

interface Choice {
  value: string;
  label: string;
}

interface Props {
  index: number;
  question: string;
  choices: Choice[];
  selected: string | null;
  onSelect: (value: string) => void;
}

export default function QuestionCard({ index, question, choices, selected, onSelect }: Props) {
  return (
    <div className="bg-white rounded-xl p-3 border border-gray-100">
      <div className="text-xs text-gray-400 mb-2">
        问题 {index + 1}/5
      </div>
      <p className="text-sm font-medium text-gray-800 mb-3">{question}</p>
      <div className="space-y-2">
        {choices.map((c) => (
          <button
            key={c.value}
            onClick={() => onSelect(c.value)}
            className={`w-full text-left text-sm rounded-lg px-3 py-2.5 border transition-colors ${
              selected === c.value
                ? "border-primary bg-primary/5 text-primary font-medium"
                : "border-gray-100 text-gray-600 hover:border-gray-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
