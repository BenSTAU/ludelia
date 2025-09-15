import { useEffect, useState } from "react";
import "./tables.scss";
import CardTable from "../../component/card/CardTable";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/tables`);
      const data = await response.json();
      setTables(data);
    };

    const fetchInscriptions = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/inscriptions/valide`);
      const data = await response.json();
      setInscriptions(data.inscriptions);
      setInvitations(data.invitations);
    };

    fetchTables();
    fetchInscriptions();
  }, []);

 function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
  console.log(tables);
  console.log('inscriptions', inscriptions);

  return (
    <section>
      <h1>Tables</h1>
      {tables.map((table) => (
        <CardTable
          backgroundHeader={"var(--color-accent-1)"}
          key={table.id_partie}
          height="510px"
          title={table.nom}
          subtitle={`MJ: ${table.mj}`}
          description={table.description}
          date={formatDateTime(table.start_at)}
          difficulty={table.difficulty}
          category={table.category}
          nbr_places={table.nbr_places}
          duration={table.duration}
          nbrInscriptionsValides={ inscriptions.filter(inscription => inscription.id_partie === table.id_partie).length + invitations.filter(invitation => invitation.id_partie === table.id_partie).length }
        />
      ))}
    </section>
  );
}
