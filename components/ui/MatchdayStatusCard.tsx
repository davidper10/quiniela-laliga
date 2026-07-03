import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function MatchdayStatusCard({
  number,
  status,
  firstKickoffAt,
}: {
  number: number;
  status: string;
  firstKickoffAt?: string | null;
}) {
  const isClosed =
    status === "closed" ||
    status === "finished" ||
    (firstKickoffAt ? new Date() >= new Date(firstKickoffAt) : false);

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-white-400">
            Jornada {number}
          </p>

          {/* 
          <h2 className="mt-1 text-2xl font-black">
            {isClosed ? "Pronósticos bloqueados" : "Jornada abierta"}
          </h2>
          

          {firstKickoffAt && (
            <p className="mt-2 text-sm text-zinc-400">
              Primer partido:{" "}
              {new Date(firstKickoffAt).toLocaleString("es-ES")}
            </p>
          )}*/}
        </div>

        <Badge variant={isClosed ? "danger" : "success"}>
          {isClosed ? "Cerrada" : "Abierta"}
        </Badge>
      </div>
    </Card>
  );
}