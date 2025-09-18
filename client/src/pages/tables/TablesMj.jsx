import { useEffect, useState } from "react";
import plus from "../../assets/image/plus.svg";
import toast from "react-hot-toast";

import "../../styles/_pagesTables.scss"
import CardCreationTable from "../../component/card/CardCreationTable";
import CardTable from "../../component/card/CardTable";
import { formatDateTime } from "../../../utils/formatDate";
import { useAuth } from "../../../utils/useAuth";

export default function TablesMj() {
  const { isAuthenticated } = useAuth();
  // --- États du formulaire ---
  const [nom, setNom] = useState("");
  const [nbr_places, setNbr_places] = useState(1);
  const [start_at, setStart_at] = useState("");
  const [end_at, setEnd_at] = useState("");
  const [description, setDescription] = useState("");
  const [id_utilisateur, setId_utilisateur] = useState(null);
  const [difficulte, setDifficulte] = useState("");
  const [categorie, setCategorie] = useState("");

  // --- États annexes ---
  const [mjs, setMjs] = useState([]); // Liste des MJs
  const [addingTable, setAddingTable] = useState(false); // Affichage du formulaire
  const [tables, setTables] = useState([]); // Liste des tables
  const [showModifyBox, setShowModifyBox] = useState(false); // Affichage de la boîte de modification
  const [selectedTable, setSelectedTable] = useState(null); // Table sélectionnée pour modification
  const [closeTable, setCloseTable] = useState(false); // État pour fermer la table
  const statut = 'Ouvert'

  // --- Constantes fixes ---
  const id_evenement = 1; // Évènement unique pour le moment

  // --- Réinitialisation du formulaire ---
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

  // --- Récupération des MJs depuis l’API ---
  async function fetchMjs() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/users/mj`,
        { method: "GET", credentials: "include" }
      );
      const data = await response.json();
      if (response.ok) setMjs(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des MJs :", error);
    }
  }
  async function fetchTables() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/tables/mj`,
        { method: "GET", credentials: "include" }
      );
      const data = await response.json();
      console.log(data.tables);
      if (response.ok) setTables(data.tables);
    } catch (error) {
      console.error("Erreur lors de la récupération des tables :", error);
    }
  }
  useEffect(() => {
    fetchTables();
    fetchMjs();
  }, []);
  // --- Soumission du formulaire ---
  const handleSubmitCreate = (e) => {
    e.preventDefault();

    // Vérification rapide des champs
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

    // Mise en forme de la catégorie
    const categorieFormatted =
      categorie.charAt(0).toUpperCase() + categorie.slice(1).toLowerCase();

    // Création de la table via API
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
            console.log (nom, nbr_places, start_at, end_at, description, id_utilisateur, statut, difficulte, categorieFormatted, id_evenement)

        const data = await response.json();
        if (response.ok) {
          toast.success(data.message, { id: toastId, duration: 2000 });
          resetForm();
        } else {
          toast.error(data.message, { id: toastId, duration: 2000 });
        }
      } catch (error) {
        console.error(data.error, error);
      }
    };

    createTable();
    fetchTables();
  };
  function toDatetimeLocal(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  function getMjIdFromName(mjName) {
    const mj = mjs.find((mj) => mj.username === mjName);
    return mj ? mj.id_utilisateur : "";
  }

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
    setSelectedTable(table); // Enregistrer la table sélectionnée
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitModify = async (e, table) => {
    e.preventDefault();
    // Vérification rapide des champs
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
      // Fermer la table via API
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
      return; // On ne fait pas la modification si on ferme
    }
    const toastId = toast.loading("Modification de la table en cours...");
    // Mise en forme de la catégorie
    const categorieFormatted =
      categorie.charAt(0).toUpperCase() + categorie.slice(1).toLowerCase();
    // Modification de la table via API
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
        console.error("Erreur lors de la modification de la table :", error);
      }
    
    fetchTables();
    resetForm();


  }
  // --- Rendu ---
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
