import TeamCrest from "@/components/ui/TeamCrest";

export default function MatchCard({
  homeTeam,
  awayTeam,
  homeLogoUrl,
  awayLogoUrl,
  center,
  footer,
}: {
  homeTeam: string;
  awayTeam: string;
  homeLogoUrl?: string | null;
  awayLogoUrl?: string | null;
  center: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-xl">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <TeamCrest team={homeTeam} logoUrl={homeLogoUrl} />
          <p className="hidden truncate font-black lg:block">{homeTeam}</p>
        </div>

        <div>{center}</div>

        <div className="flex min-w-0 items-center justify-end gap-3">
          <p className="hidden truncate text-right font-black lg:block">
            {awayTeam}
          </p>
          <TeamCrest team={awayTeam} logoUrl={awayLogoUrl} />
        </div>
      </div>

      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}