import { useEffect, useState } from "react";
import { useAuth } from "../../../utils/useAuth";
import toast from "react-hot-toast";

import CardTable from "../../component/card/CardTable";
import CardInscription from "../../component/card/CardInscription";
import { formatDateTime } from "../../../utils/formatDate";

export default function Tables() {
  // --- États principaux ---
  const [tables, setTables] = useState([]); // Liste des tables
  const [myTables, setMyTables] = useState([]); // Mes tables où je suis inscrit
  const { isAuthenticated, user } = useAuth();
  const myId = user && user.id_utilisateur ? user.id_utilisateur : null;
  const [previousScrollY, setPreviousScrollY] = useState(0);

  // --- État pour le formulaire d'inscription ---
  const [selectedTable, setSelectedTable] = useState(null); // Table sélectionnée pour inscription
  const [showInscriptionForm, setShowInscriptionForm] = useState(false); // Affichage du formulaire
  const [newInvitations, setNewInvitations] = useState([]); // Nouvelles invitations du formulaire
  const [message, setMessage] = useState(""); // Message optionnel pour l'inscription

  // --- Gestion de l'ouverture du formulaire d'inscription ---
  const handleInscriptionClick = (table) => {
    setSelectedTable(table);
    setShowInscriptionForm(true);
    setPreviousScrollY(window.scrollY);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  // --- Gestion de la fermeture du formulaire d'inscription ---
  const handleCloseInscriptionForm = () => {
    setShowInscriptionForm(false);
    setSelectedTable(null);
    setNewInvitations([]);
    window.scrollTo({ top: previousScrollY, behavior: "smooth" });
  };

  // --- Gestion des invitations ---
  const handleInvitationChange = (index, field, value) => {
    setNewInvitations((prev) =>
      prev.map((invitation, i) =>
        i === index ? { ...invitation, [field]: value } : invitation
      )
    );
  };

  const addNewInvitation = () => {
    setNewInvitations((prev) => [...prev, { nom: "", email: "" }]);
  };

  const removeInvitation = (index) => {
    setNewInvitations((prev) => prev.filter((_, i) => i !== index));
  };
  const fetchTables = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/tables/open/all`);
      const data = await response.json();
      setTables(data.tables);
      console.log(data.tables);
    } catch (error) {
      console.error("Erreur lors du chargement des tables :", error);
    } finally {
      toast.dismiss("loadingTables");
    }
  };

  const fetchInscriptions = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/inscriptions/valide`
      );
      const data = await response.json();
      const myInscriptions = data.inscriptions.filter(
        (inscription) => String(inscription.id_utilisateur) === String(myId)
      );
      setMyTables(myInscriptions.map(i => i.id_partie));
    } catch (error) {
      console.error("Erreur lors du chargement des inscriptions :", error);
    }
  };

  const handleSubmitInvitations = async () => {
    toast.loading("Envoi des inscriptions...", { id: "submitInscription" });
    if (!selectedTable) {
      toast.error("Aucune table sélectionnée");
      return;
    }
    newInvitations.forEach((invitation) => {
      if (!invitation.nom)
        return toast.error("Le nom est requis pour chaque invitation", {
          duration: 2000,
        });
    });

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/v1/inscriptions/create/${
        selectedTable.id_partie
      }`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitations: newInvitations,
          message: message,
        }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      toast.success("Inscriptions envoyées avec succès !", {
        id: "submitInscription",
        duration: 2000,
      });
    } else {
      toast.error(data.message, {
        id: "submitInscription",
        duration: 2000,
      });
    }

    handleCloseInscriptionForm();
    fetchTables();
    fetchInscriptions();
  };

  // --- Récupération des données depuis l'API ---
  useEffect(() => {
    toast.loading("Chargement des tables...", { id: "loadingTables" });

    fetchTables();
  }, []);

  useEffect(() => {
    if (!myId) return;
    fetchInscriptions();
  }, [myId]);

  const filteredTables = tables.filter(table => !myTables.includes(table.id_partie));

  // --- Rendu ---
  return (
    <section>
      <h1>Tables</h1>

      {/* Formulaire d'inscription */}
      {showInscriptionForm && selectedTable && (
        <CardInscription
          title={`Inscription à: ${selectedTable.nom}`}
          subtitle={`MJ: ${selectedTable.mj} - ${formatDateTime(
            selectedTable.start_at
          )}`}
          invitations={newInvitations}
          onInvitationChange={handleInvitationChange}
          onAddInvitation={addNewInvitation}
          onSubmit={handleSubmitInvitations}
          removeInvitation={removeInvitation}
          cancelInscription={handleCloseInscriptionForm}
          setMessage={setMessage}
        />
      )}

      {/* Liste des tables */}
      {filteredTables.map((table) => (
        <CardTable
          key={table.id_partie}
          backgroundHeader="var(--color-accent-3)"
          height="510px"
          title={table.nom}
          subtitle={`MJ: ${table.mj}`}
          description={table.description}
          date={formatDateTime(table.start_at)}
          difficulty={table.difficulty}
          category={table.category}
          nbr_places={table.nbr_places}
          duration={table.duration}
          nbrInscriptionsValides={String(table.nbrInscriptionsValides)}
            
          onClick={() => handleInscriptionClick(table)}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </section>
  );
}
