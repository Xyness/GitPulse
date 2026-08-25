import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LanguageBreakdownProps {
  languages: Array<{ name: string; color: string; percentage: number; bytes: number }>;
}

export function LanguageBreakdown({ languages }: LanguageBreakdownProps) {
  if (languages.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Languages</CardTitle>
        <p className="text-sm text-muted-foreground">
          Share of bytes across every public repo
        </p>
      </CardHeader>
      <CardContent>
        <div
          className="mb-4 flex h-3 overflow-hidden rounded-full"
          role="img"
          aria-label={`Language split, led by ${languages[0].name} at ${languages[0].percentage} percent`}
        >
          {languages.map((lang) => (
            <div
              key={lang.name}
              style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
              title={`${lang.name}: ${lang.percentage}%`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {languages.slice(0, 9).map((lang) => (
            <div key={lang.name} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <span className="truncate">{lang.name}</span>
              <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                {lang.percentage}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
