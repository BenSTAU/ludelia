import { useEffect, useState, useSyncExternalStore } from "react";
import CardForm from "../../component/card/CardForm";
import plus from "../../assets/image/plus.svg";
import Card from "../../component/card/Card";
import "./tablesMj.scss";
import "../../component/card/card.scss";
import toast from "react-hot-toast";

export default function TablesMj() {
  const [mjs, setMjs] = useState([]);
  const [nom, setNom] = useState("");
  const [nbr_places, setNbr_places] = useState(1);
  const [start_at, setStart_at] = useState("");
  const [end_at, setEnd_at] = useState("");
  const [description, setDescription] = useState("");
  const [id_utilisateur, setId_utilisateur] = useState(1);
  const statut = "Ouvert";
  const [difficulte, setDifficulte] = useState("");
  const [categorie, setCategorie] = useState("");
  // L'évènement étant unique pour l'instant on met une valeur par défaut
  const id_evenement = 1;

  function cancelTableOrClear() {
    setAddingTable(false);
    setNom("");
    setNbr_places(1);
    setStart_at("");
    setEnd_at("");
    setDescription("");
    setId_utilisateur(1);
    setDifficulte("");
    setCategorie("");
  }

  useEffect(() => {
    async function fetchMjs() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/users/mj`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setMjs(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des MJs :", error);
      }
    }
    fetchMjs();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nom || !start_at || !end_at || !description || !id_utilisateur || !difficulte || !categorie) {
      toast.error("Veuillez remplir tous les champs", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    const categorieFormatted = categorie.charAt(0).toUpperCase() + categorie.slice(1).toLowerCase();
    
    const createTable = async () => {
      const toastId = toast.loading("Création de la table en cours...");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/tables/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json", // <-- Ajoute cette ligne !
          },
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
        });
        const data = await response.json();
        console.log(nom, nbr_places, start_at, end_at, description, id_utilisateur, statut, difficulte, categorieFormatted, id_evenement);
        if (response.ok) {
          toast.success(data.message, {
            id: toastId,
            duration: 2000,
          });
          cancelTableOrClear();
        } else {
          toast.error(data.message, {
            id: toastId,
            duration: 2000,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la création de la table :", error);
      }
    };

    createTable();
  };

  const [addingTable, setAddingTable] = useState(false);
  return (
    <section>
      <h1>Tables MJ</h1>
      <div className="tablesHeader">
        <h2>Mes tables</h2>
        <button onClick={() => setAddingTable(!addingTable)}>
          <img src={plus} alt="icone pour ajouter" />
        </button>
      </div>
      {addingTable && (
        <CardForm height="auto" cardStyle="mjTable">
          <div className="mjHeader">
            <div>
              <h2>titre</h2>
              <input
                onChange={(e) =>
                  setNom(e.target.value)
                }
                className="titleInput"
                type="text"
                placeholder="Titre de la table"
              />
            </div>
            <h3>Maître du jeu</h3>
            <select name="mj" id="" onChange={(e) => setId_utilisateur(e.target.value)}>
              <option value="">Sélectionner un MJ</option>
              {mjs.map((mj) => (
                <option key={mj.id_utilisateur} value={mj.id_utilisateur}>
                  {mj.username}
                </option>
              ))}
            </select>
          </div>
          <div className="mjBody">
            <div>
              <h2>Description</h2>
              <textarea
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="descriptionInput"
                placeholder="Description de la table"
              />
            </div>
            <div>
              <h2>date et heure de début</h2>
              <input
                type="datetime-local"
                onChange={(e) => setStart_at(e.target.value)}
              />
            </div>
            <div>
              <h2>date et heure de fin</h2>
              <input
                type="datetime-local"
                onChange={(e) => setEnd_at(e.target.value)}
              />
            </div>
            <div>
              <h2>Catégorie</h2>
              <input
                type="text"
                placeholder="Catégorie de la table"
                onChange={(e) => setCategorie(e.target.value)}
              />
            </div>
            <div>
              <h2>Nombre de joueurs</h2>
              <input
                onChange={(e) => setNbr_places(e.target.value)}
                type="number"
                min="1"
                max="20"
                placeholder="Nombre de joueurs"
              />
            </div>
            <div>
              <h2>Difficulté</h2>
              <select name="difficulte" id="" onChange={(e) => setDifficulte(e.target.value)}>
                <option value="">Sélectionner une difficulté</option>
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>
          <div className="mjButtons">
            <Card cardStyle="cta" onClick={handleSubmit}>Créer la table</Card>
            <Card onClick={cancelTableOrClear}>Annuler</Card>
          </div>
        </CardForm>
      )}
    </section>
  );
}
