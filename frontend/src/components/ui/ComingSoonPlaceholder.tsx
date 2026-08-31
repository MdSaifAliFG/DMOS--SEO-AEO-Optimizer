import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Lock, Layers } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";

export interface ComingSoonPlaceholderProps {
  title: string;
  description: string;
  phase?: number | string;
  features?: string[];
}

export const ComingSoonPlaceholder: React.FC<ComingSoonPlaceholderProps> = ({
  title,
  description,
  phase = "Phase 2",
  features = [],
}) => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="p-8 md:p-12 relative overflow-hidden border-slate-800">
        {/* Background glow ambient */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="amber" size="md" dot>
              {typeof phase === "number" ? `Scheduled for Phase ${phase}` : phase}
            </Badge>
            <Badge variant="neutral" size="md">
              <Lock className="w-3 h-3 mr-1 inline" /> Architecture Ready
            </Badge>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600/20 to-purple-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 mb-5 shadow-xl">
            <Sparkles className="w-8 h-8" />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            {title}
          </h1>

          <p className="text-slate-400 max-w-xl mt-3 text-sm md:text-base leading-relaxed">
            {description}
          </p>

          {features.length > 0 && (
            <div className="w-full max-w-md my-8 p-5 rounded-xl bg-surface-950/60 border border-slate-800 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                <Layers className="w-3.5 h-3.5 text-primary-400" />
                Planned Capabilities
              </div>
              <ul className="space-y-2.5">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <Link href="/dashboard">
              <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Return to Dashboard
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="primary">
                View Active Projects
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
