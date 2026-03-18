"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LanguageBreakdownProps {
  languages: Array<{ name: string; color: string; percentage: number; bytes: number }>;
}

export function LanguageBreakdown({ languages }: LanguageBreakdownProps) {
  if (languages.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Languages</CardTitle>
          <p className="text-sm text-muted-foreground">
            Code distribution across all repositories
          </p>
        </CardHeader>
        <CardContent>
          {/* Bar */}
          <div
            className="mb-4 flex h-3 overflow-hidden rounded-full"
            role="img"
            aria-label="Language distribution bar chart"
          >
            {languages.map((lang, i) => (
              <motion.div
                key={lang.name}
                initial={{ width: 0 }}
                animate={{ width: `${lang.percentage}%` }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                style={{ backgroundColor: lang.color }}
                className="h-full"
                title={`${lang.name}: ${lang.percentage}%`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {languages.slice(0, 9).map((lang) => (
              <div key={lang.name} className="flex items-center gap-2 text-sm">
                <span
                  className="inline-block h-3 w-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="truncate">{lang.name}</span>
                <span className="ml-auto text-muted-foreground text-xs">
                  {lang.percentage}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
