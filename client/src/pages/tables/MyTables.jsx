import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Import des composants locaux
import CardTable from "../../component/card/CardTable";
import ConfirmationBox from "../../component/card/ConfirmationBox";

// Import du hook d'authentification global
import { useAuth } from "../../../utils/useAuth";

export default function MyTables() {
  const { isAuthenticated } = useAuth();

  // --- États principaux ---
  const [myTables, setMyTables] = useState([]);
  const [previousScrollY, setPreviousScrollY] = useState(0);

  // --- États pour la confirmation de désinscription ---
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  // Ouvre la boîte de confirmation et mémorise la position de scroll
  const handleUnsubscribeButton = (table) => {
    setSelectedTable(table);
    setShowConfirmationBox(true);
    setPreviousScrollY(window.scrollY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Ferme la boîte de confirmation et restaure la position de scroll
  const handleCloseForm = () => {
    setShowConfirmationBox(false);
    setSelectedTable(null);
    window.scrollTo({ top: previousScrollY, behavior: "smooth" });
  };

  // Soumet la désinscription à l'API et met à jour la liste des tables
  const handleUnsubscribe = async () => {
    const toastId = toast.loading("Désinscription en cours...");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/inscriptions/delete/${selectedTable.id_partie}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Désinscription réussie !", { id: toastId, duration: 2000 });
        handleCloseForm();
        fetchMyTables();
      } else {
        toast.error(`Erreur lors de la désinscription : ${data.error}`, { id: toastId, duration: 2000 });
      }
    } catch (error) {
      toast.error("Erreur lors de la désinscription", { id: toastId, duration: 2000 });
    }
  };

  // Récupère la liste des tables de l'utilisateur depuis l'API
  const fetchMyTables = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/tables/mytables`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      setMyTables(data.tables);
    } catch (error) {
      // Erreur lors de la récupération des tables
    }
  };

  // Récupère les tables au montage du composant
  useEffect(() => {
    fetchMyTables();
  }, []);

  // Formate la date pour l'affichage
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

  // --- Rendu ---
  return (
    <section>
      <h1>Mes parties</h1>
      {showConfirmationBox && (
        <ConfirmationBox
          titre={selectedTable?.nom}
          onClickAccept={handleUnsubscribe}
          onClickCancel={handleCloseForm}
          date={formatDateTime(selectedTable?.start_at)}
        />
      )}

      {myTables.map((table) => (
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
          handleUnsubscribe={() => handleUnsubscribeButton(table)}
          isAuthenticated={isAuthenticated}
          subPage={true}
        />
      ))}
    </section>
  );
}
