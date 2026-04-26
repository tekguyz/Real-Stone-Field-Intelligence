import { use } from "react";

export default function AdminJobPlaceholder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <div className="p-10 text-foreground">
      <h2>Job detail page placeholder for {id}</h2>
    </div>
  );
}
