import { useEffect, useState } from "react";
import "./tables.scss";
import CardTable from "../../component/card/CardTable";
import toast from "react-hot-toast";
import { useAuth } from "../../../utils/useAuth";
import CardInscription from "../../component/card/CardInscription";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const { isAuthenticated } = useAuth();

  // État pour gérer les nouvelles invitations du formulaire
  const [newInvitations, setNewInvitations] = useState([]);

  // Fonction pour mettre à jour une invitation spécifique
  const handleInvitationChange = (index, field, value) => {
    setNewInvitations((prev) =>
      prev.map((invitation, i) =>
        i === index ? { ...invitation, [field]: value } : invitation
      )
    );
  };

  // Fonction pour ajouter une nouvelle invitation
  const addNewInvitation = () => {
    setNewInvitations((prev) => [...prev, { nom: "", email: "" }]);
  };
  // fonction pour retirer une invitation
  const removeInvitation = (index) => {
    setNewInvitations((prev) => prev.filter((_, i) => i !== index));
  };
  // Fonction pour valider et envoyer les invitations
  const handleSubmitInvitations = () => {
    console.log("Invitations à envoyer:", newInvitations);
    // Ici vous pouvez traiter l'envoi des invitations
    toast.success("Invitations envoyées !");
  };

  useEffect(() => {
    toast.loading("Chargement des tables...", {
      id: "loadingTables",
    });
    const fetchTables = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/tables`);
      const data = await response.json();
      setTables(data);
      toast.dismiss("loadingTables");
    };

    const fetchInscriptions = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/inscriptions/valide`
      );
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

  return (
    <>
      <section>
        <h1>Tables</h1>
        <CardInscription
          invitations={newInvitations}
          onInvitationChange={handleInvitationChange}
          onAddInvitation={addNewInvitation}
          onSubmit={handleSubmitInvitations}
          removeInvitation={removeInvitation}
        />
        {tables.map((table) => (
          <CardTable
            backgroundHeader={"var(--color-accent-3)"}
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
            nbrInscriptionsValides={
              inscriptions.filter(
                (inscription) => inscription.id_partie === table.id_partie
              ).length +
              invitations.filter(
                (invitation) => invitation.id_partie === table.id_partie
              ).length
            }
            onClick={() => {
              console.log(`Inscription à la table ${table.id_partie}`);
            }}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </section>
    </>
  );
}
