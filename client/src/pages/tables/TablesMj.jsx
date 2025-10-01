import { useEffect, useState } from "react";
import plus from "../../assets/image/plus.svg";
import toast from "react-hot-toast";

// Import des styles globaux et spécifiques
import "../../styles/_pagesTables.scss";

// Import des composants locaux
import CardCreationTable from "../../component/card/CardCreationTable";
import CardTable from "../../component/card/CardTable";

// Import des utilitaires
import { formatDateTime } from "../../../utils/formatDate";
import { useAuth } from "../../../utils/useAuth";

export default function TablesMj() {
  const { isAuthenticated } = useAuth();

  // États du formulaire de création/modification de table
  const [nom, setNom] = useState("");
  const [nbr_places, setNbr_places] = useState(1);
  const [start_at, setStart_at] = useState("");
  const [end_at, setEnd_at] = useState("");
  const [description, setDescription] = useState("");
  const [id_utilisateur, setId_utilisateur] = useState(null);
  const [difficulte, setDifficulte] = useState("");
  const [categorie, setCategorie] = useState("");

  // États annexes
  const [mjs, setMjs] = useState([]); // Liste des MJs
  const [addingTable, setAddingTable] = useState(false); // Affichage du formulaire
  const [tables, setTables] = useState([]); // Liste des tables
  const [showModifyBox, setShowModifyBox] = useState(false); // Affichage de la boîte de modification
  const [selectedTable, setSelectedTable] = useState(null); // Table sélectionnée pour modification
  const [closeTable, setCloseTable] = useState(false); // État pour fermer la table
  const statut = "Ouvert";

  // Constantes fixes
  const id_evenement = 1; // Évènement unique pour le moment

  // Réinitialisation du formulaire après création ou modification
  function resetForm() {
    setNom("");
    setNbr_places(1);
    setStart_at("");
    setEnd_at("");
    setDescription("");
    setId_utilisateur(1);
    setDifficulte("");
    setCategorie("");
    setAddingTable(false);
    setShowModifyBox(false);
    setSelectedTable(null);
    setCloseTable(false);
  }

  // Appel API : récupération des MJs
  async function fetchMjs() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/users/mj`,
        { method: "GET", credentials: "include" }
      );
      const data = await response.json();
      if (response.ok) setMjs(data);
    } catch (error) {
      // Erreur lors de la récupération des MJs
    }
  }

  // Appel API : récupération des tables MJ
  async function fetchTables() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/tables/mj`,
        { method: "GET", credentials: "include" }
      );
      const data = await response.json();
      if (response.ok) setTables(data.tables);
    } catch (error) {
      // Erreur lors de la récupération des tables
    }
  }

  //Récupération des données MJ/tables au montage
  useEffect(() => {
    fetchTables();
    fetchMjs();
  }, []);

  // Soumission du formulaire de création de table
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    if (
      !nom ||
      !start_at ||
      !end_at ||
      !description ||
      !id_utilisateur ||
      !difficulte ||
      !categorie
    ) {
      toast.error("Veuillez remplir tous les champs", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    const categorieFormatted =
      categorie.charAt(0).toUpperCase() + categorie.slice(1).toLowerCase();

    // Appel API : création de la table
    const createTable = async () => {
      const toastId = toast.loading("Création de la table en cours...");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/v1/tables/create`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nom,
              nbr_places,
              start_at,
              end_at,
              description,
              id_utilisateur,
              statut,
              difficulte,
              categorie: categorieFormatted,
              id_evenement,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message, { id: toastId, duration: 2000 });
          resetForm();
          fetchTables();
        } else {
          toast.error(data.message, { id: toastId, duration: 2000 });
        }
      } catch (error) {
        toast.error("Erreur lors de la création de la table", {
          id: toastId,
          duration: 2000,
        });
      }
    };

    createTable();
    fetchTables();
  };

  // Conversion date ISO en format local pour input
  function toDatetimeLocal(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  // Récupère l'id du MJ à partir de son nom
  function getMjIdFromName(mjName) {
    const mj = mjs.find((mj) => mj.username === mjName);
    return mj ? mj.id_utilisateur : "";
  }

  // Préremplit le formulaire de modification avec les données de la table sélectionnée
  const handleModifyButton = (table) => {
    setNom(table.nom);
    setNbr_places(table.nbr_places);
    setStart_at(toDatetimeLocal(table.start_at));
    setEnd_at(toDatetimeLocal(table.end_at));
    setDescription(table.description);
    setId_utilisateur(getMjIdFromName(table.mj));
    setDifficulte(table.difficulty);
    setCategorie(table.category);
    setAddingTable(false);
    setShowModifyBox(true);
    setSelectedTable(table);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Soumission du formulaire de modification de table
  const handleSubmitModify = async (e, table) => {
    e.preventDefault();
    if (
      !nom ||
      !start_at ||
      !end_at ||
      !description ||
      !id_utilisateur ||
      !difficulte ||
      !categorie
    ) {
      toast.error("Veuillez remplir tous les champs", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    if (closeTable) {
      // Appel API : fermeture de la table
      const toastId = toast.loading("Fermeture de la table en cours...");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/v1/tables/close/${table.id_partie}`,
          {
            method: "PUT",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message, { id: toastId, duration: 2000 });
          resetForm();
        } else {
          toast.error(data.message, { id: toastId, duration: 2000 });
        }
      } catch (error) {
        toast.error("Erreur lors de la fermeture de la table");
      }
      fetchTables();
      resetForm();
      return;
    }
    const toastId = toast.loading("Modification de la table en cours...");
    const categorieFormatted =
      categorie.charAt(0).toUpperCase() + categorie.slice(1).toLowerCase();
    // Appel API : modification de la table
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/tables/update/${table.id_partie}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom,
            nbr_places,
            start_at,
            end_at,
            description,
            id_utilisateur,
            statut,
            difficulte,
            categorie: categorieFormatted,
            id_evenement,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message, { id: toastId, duration: 2000 });
        resetForm();
      } else {
        toast.error(data.message, { id: toastId, duration: 2000 });
      }
    } catch (error) {
      toast.error("Erreur lors de la modification de la table", {
        id: toastId,
        duration: 2000,
      });
    }
    fetchTables();
    resetForm();
  };

  // Rendu principal de la page
  return (
    <section>
      <h1>Tables MJ</h1>
      {/* En-tête avec bouton d’ajout */}
      <div className="tablesHeader">
        <h2>Mes tables</h2>
        <button onClick={() => setAddingTable(!addingTable)}>
          <img src={plus} alt="icone pour ajouter" />
        </button>
      </div>
      {/* Formulaire de création */}
      {addingTable && (
        <CardCreationTable
          nom={nom}
          setNom={setNom}
          description={description}
          setDescription={setDescription}
          start_at={start_at}
          setStart_at={setStart_at}
          end_at={end_at}
          setEnd_at={setEnd_at}
          categorie={categorie}
          setCategorie={setCategorie}
          nbr_places={nbr_places}
          setNbr_places={setNbr_places}
          difficulte={difficulte}
          setDifficulte={setDifficulte}
          id_utilisateur={id_utilisateur}
          setId_utilisateur={setId_utilisateur}
          mjs={mjs}
          handleSubmit={handleSubmitCreate}
          resetForm={resetForm}
        />
      )}
      {/* Boîte de modification */}
      {showModifyBox && (
        <CardCreationTable
          nom={nom}
          setNom={setNom}
          description={description}
          setDescription={setDescription}
          start_at={start_at}
          setStart_at={setStart_at}
          end_at={end_at}
          setEnd_at={setEnd_at}
          categorie={categorie}
          setCategorie={setCategorie}
          nbr_places={nbr_places}
          setNbr_places={setNbr_places}
          difficulte={difficulte}
          setDifficulte={setDifficulte}
          id_utilisateur={id_utilisateur}
          setId_utilisateur={setId_utilisateur}
          mjs={mjs}
          handleSubmit={(e) => handleSubmitModify(e, selectedTable)}
          resetForm={resetForm}
          isMjPage={true}
          closeTable={closeTable}
          setCloseTable={setCloseTable}
        />
      )}
      {/* Affichage des tables MJ */}
      {tables.map((table) => (
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
          onClick={() => handleInscriptionClick(table)}
          nbrInscriptionsValides={table.inscriptions.length + table.invitations.length}
          isAuthenticated={isAuthenticated}
          mjPage={true}
          handleModify={() => handleModifyButton(table)}
        />
      ))}
    </section>
  );
}
