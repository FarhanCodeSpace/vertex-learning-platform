import React from "react";
import {
  OutcomeLayersIcon,
  OutcomeDatabaseIcon,
  OutcomeGaugeIcon,
  OutcomeCloudIcon,
  OutcomeShieldIcon,
  OutcomeWorkflowIcon,
  OutcomeRocketIcon,
  OutcomeCodeIcon,
  OutcomeSparklesIcon,
  OutcomePuzzleIcon,
} from "@/components/ui/icons";
import type { LearningOutcome } from "@/sanity/types";

interface CourseLearningOutcomesProps {
  outcomes?: LearningOutcome[] | null;
}

function renderOutcomeIcon(iconName?: string, index: number = 0) {
  const normalized = iconName?.toLowerCase() || "";

  if (normalized.includes("layer") || normalized.includes("route") || normalized.includes("layout")) {
    return <OutcomeLayersIcon className="text-[#EA580C] shrink-0" size={32} />;
  }
  if (normalized.includes("data") || normalized.includes("db") || normalized.includes("sql") || normalized.includes("cache")) {
    return <OutcomeDatabaseIcon className="text-[#EA580C] shrink-0" size={32} />;
  }
  if (normalized.includes("gauge") || normalized.includes("perf") || normalized.includes("speed") || normalized.includes("meter")) {
    return <OutcomeGaugeIcon className="text-[#EA580C] shrink-0" size={32} />;
  }
  if (normalized.includes("cloud") || normalized.includes("deploy") || normalized.includes("scale") || normalized.includes("infra")) {
    return <OutcomeCloudIcon className="text-[#EA580C] shrink-0" size={32} />;
  }
  if (normalized.includes("shield") || normalized.includes("security") || normalized.includes("lock") || normalized.includes("auth")) {
    return <OutcomeShieldIcon className="text-[#EA580C] shrink-0" size={32} />;
  }
  if (normalized.includes("workflow") || normalized.includes("node") || normalized.includes("action") || normalized.includes("boundary")) {
    return <OutcomeWorkflowIcon className="text-[#EA580C] shrink-0" size={32} />;
  }
  if (normalized.includes("rocket") || normalized.includes("ship") || normalized.includes("launch")) {
    return <OutcomeRocketIcon className="text-[#EA580C] shrink-0" size={32} />;
  }
  if (normalized.includes("code") || normalized.includes("program") || normalized.includes("syntax")) {
    return <OutcomeCodeIcon className="text-[#EA580C] shrink-0" size={32} />;
  }
  if (normalized.includes("sparkle") || normalized.includes("ai") || normalized.includes("magic") || normalized.includes("model")) {
    return <OutcomeSparklesIcon className="text-[#EA580C] shrink-0" size={32} />;
  }
  if (normalized.includes("puzzle") || normalized.includes("component") || normalized.includes("embed")) {
    return <OutcomePuzzleIcon className="text-[#EA580C] shrink-0" size={32} />;
  }

  // Fallback cycled icons matching the 4 corners of design
  const defaultIcons = [
    <OutcomeLayersIcon key="0" className="text-[#EA580C] shrink-0" size={32} />,
    <OutcomeDatabaseIcon key="1" className="text-[#EA580C] shrink-0" size={32} />,
    <OutcomeGaugeIcon key="2" className="text-[#EA580C] shrink-0" size={32} />,
    <OutcomeCloudIcon key="3" className="text-[#EA580C] shrink-0" size={32} />,
  ];

  return defaultIcons[index % defaultIcons.length];
}

export function CourseLearningOutcomes({ outcomes }: CourseLearningOutcomesProps) {
  if (!outcomes || outcomes.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="rounded-3xl border border-neutral-200/90 bg-white/70 backdrop-blur-xs p-6 sm:p-10 shadow-xs">
        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900 mb-6 sm:mb-8">
          What you&apos;ll learn
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {outcomes.map((outcome, index) => (
            <div
              key={outcome._key || index}
              className="group relative flex items-start gap-4 sm:gap-5 p-6 bg-white border border-neutral-200/90 rounded-2xl shadow-2xs hover:border-neutral-300 hover:shadow-xs transition-all duration-200"
            >
              <div className="pt-0.5">{renderOutcomeIcon(outcome.icon, index)}</div>
              <div className="flex-1">
                <h3 className="font-serif font-bold text-lg text-neutral-900 leading-snug group-hover:text-[#F97316] transition-colors">
                  {outcome.title}
                </h3>
                {outcome.description && (
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                    {outcome.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
