import { useEffect, useState } from "react";
import CardTable from "../../component/card/CardTable";
import { useAuth } from "../../../utils/useAuth";
import ConfirmationBox from "../../component/card/ConfirmationBox";
import toast from "react-hot-toast";


export default function MyTables() {
  const {isAuthenticated} = useAuth();
  const [myTables, setMyTables] = useState([]);
  const [previousScrollY, setPreviousScrollY] = useState(0);

  const [showConfirmationBox, setShowConfirmationBox] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleUnsubscribeButton = (table) => {
    setSelectedTable(table);
    setShowConfirmationBox(true);
    setPreviousScrollY(window.scrollY);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleCloseForm = () => {
    setShowConfirmationBox(false);
    setSelectedTable(null);
    window.scrollTo({ top: previousScrollY, behavior: "smooth" });
  };

  const handleUnsubscribe = async () => {
    const toastId = toast.loading("Désinscription en cours...");
    console.log("Désinscription de la table :", selectedTable);
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
        fetchMyTables();
        fetchInscriptions();
        handleCloseForm();
      } else {
        toast.error(`Erreur lors de la désinscription : ${data.error}`, { id: toastId, duration: 2000 });
      }
    } catch (error) {
      toast.error("Erreur lors de la désinscription", { id: toastId, duration: 2000 });
      console.error("Erreur lors de la désinscription :", error);
    }
  }
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
      console.log("Mes tables :", data.tables);
    } catch (error) {
      console.error("Erreur lors de la récupération des tables :", error);
    }
  };
  useEffect(() => {
    fetchMyTables();
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
    <section>
      <h1>Mes parties</h1>
      {showConfirmationBox && <ConfirmationBox
        titre={selectedTable?.nom}
        onClickAccept={handleUnsubscribe}
        onClickCancel={handleCloseForm}
        date={formatDateTime(selectedTable?.start_at)}
      />}

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
